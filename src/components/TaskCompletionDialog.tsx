'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, RotateCcw } from 'lucide-react';
import { Task } from '@/types';

interface TaskCompletionDialogProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onConfirm: (taskId: string) => void;
}

export function TaskCompletionDialog({
  isOpen,
  task,
  onClose,
  onConfirm,
}: TaskCompletionDialogProps) {
  const handleConfirm = () => {
    if (task) {
      onConfirm(task.id);
    }
  };

  const isCompleting = task?.isCompleted === false;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isCompleting ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                Mark Task as Completed
              </>
            ) : (
              <>
                <RotateCcw className="w-5 h-5 text-orange-600" />
                Mark Task as Incomplete
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isCompleting ? (
              <>
                Are you sure you want to mark &quot;{task?.name}&quot; as completed?
                <br />
                This will help you track your progress and organize your tasks better.
              </>
            ) : (
              <>
                Are you sure you want to mark &quot;{task?.name}&quot; as incomplete?
                <br />
                This will remove the completion status and you can track time for this task again.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className={isCompleting ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"}
          >
            {isCompleting ? "Mark as Completed" : "Mark as Incomplete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}