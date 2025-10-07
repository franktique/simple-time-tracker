import { NextRequest, NextResponse } from 'next/server';
import { getAllTasks, createTask } from '@/lib/db/tasks';
import { Task } from '@/types';

export async function GET() {
  try {
    const tasks = await getAllTasks();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const task: Task = await request.json();

    // Validate required fields
    if (!task.id || !task.name) {
      return NextResponse.json(
        { error: 'Missing required fields: id, name' },
        { status: 400 }
      );
    }

    // Ensure isCompleted is set to false by default if not provided
    if (task.isCompleted === undefined) {
      task.isCompleted = false;
    }

    const createdTask = await createTask(task);
    return NextResponse.json(createdTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
