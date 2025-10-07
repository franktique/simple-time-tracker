import { query, transaction } from './connection';
import { Task } from '@/types';

export interface DbTask {
  id: string;
  name: string;
  parent_id: string | null;
  tracking_type: 'manual' | 'automatic';
  is_expanded: boolean;
  order: number;
  created_at: Date;
  updated_at: Date;
}

function dbTaskToTask(dbTask: DbTask, children: string[]): Task {
  return {
    id: dbTask.id,
    name: dbTask.name,
    parentId: dbTask.parent_id,
    children,
    trackingType: dbTask.tracking_type,
    isExpanded: dbTask.is_expanded,
    order: dbTask.order,
  };
}

export async function getAllTasks(): Promise<Record<string, Task>> {
  const dbTasks = await query<DbTask>('SELECT * FROM tasks ORDER BY "order" ASC');

  const tasksMap: Record<string, Task> = {};

  // Build children arrays
  const childrenMap: Record<string, string[]> = {};
  dbTasks.forEach(dbTask => {
    childrenMap[dbTask.id] = [];
  });

  dbTasks.forEach(dbTask => {
    if (dbTask.parent_id) {
      if (!childrenMap[dbTask.parent_id]) {
        childrenMap[dbTask.parent_id] = [];
      }
      childrenMap[dbTask.parent_id].push(dbTask.id);
    }
  });

  // Convert to Task format
  dbTasks.forEach(dbTask => {
    tasksMap[dbTask.id] = dbTaskToTask(dbTask, childrenMap[dbTask.id] || []);
  });

  return tasksMap;
}

export async function getTaskById(id: string): Promise<Task | null> {
  const results = await query<DbTask>('SELECT * FROM tasks WHERE id = $1', [id]);
  if (results.length === 0) return null;

  const children = await query<{ id: string }>('SELECT id FROM tasks WHERE parent_id = $1', [id]);
  const childIds = children.map(c => c.id);

  return dbTaskToTask(results[0], childIds);
}

export async function createTask(task: Task): Promise<Task> {
  await transaction(async (client) => {
    await client.query(
      `INSERT INTO tasks (id, name, parent_id, tracking_type, is_expanded, "order")
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [task.id, task.name, task.parentId, task.trackingType, task.isExpanded, task.order]
    );
  });

  return task;
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (updates.name !== undefined) {
    fields.push(`name = $${paramIndex++}`);
    values.push(updates.name);
  }
  if (updates.parentId !== undefined) {
    fields.push(`parent_id = $${paramIndex++}`);
    values.push(updates.parentId);
  }
  if (updates.trackingType !== undefined) {
    fields.push(`tracking_type = $${paramIndex++}`);
    values.push(updates.trackingType);
  }
  if (updates.isExpanded !== undefined) {
    fields.push(`is_expanded = $${paramIndex++}`);
    values.push(updates.isExpanded);
  }
  if (updates.order !== undefined) {
    fields.push(`"order" = $${paramIndex++}`);
    values.push(updates.order);
  }

  if (fields.length === 0) {
    return getTaskById(id);
  }

  values.push(id);

  await query(
    `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${paramIndex}`,
    values
  );

  return getTaskById(id);
}

export async function deleteTask(id: string): Promise<void> {
  // Delete task and all children (CASCADE will handle this)
  await query('DELETE FROM tasks WHERE id = $1', [id]);
}

export async function getChildTasks(parentId: string): Promise<Task[]> {
  const dbTasks = await query<DbTask>(
    'SELECT * FROM tasks WHERE parent_id = $1 ORDER BY "order" ASC',
    [parentId]
  );

  const tasks: Task[] = [];
  for (const dbTask of dbTasks) {
    const children = await query<{ id: string }>('SELECT id FROM tasks WHERE parent_id = $1', [dbTask.id]);
    tasks.push(dbTaskToTask(dbTask, children.map(c => c.id)));
  }

  return tasks;
}
