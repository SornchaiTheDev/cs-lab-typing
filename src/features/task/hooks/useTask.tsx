import type { Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useCallback, useEffect } from "react";
import { trpc } from "~/utils";

export type TaskExtendedWithProblem = Prisma.tasksGetPayload<{
  include: {
    problem: {
      include: {
        testcases: {
          select: {
            input: true;
            output: true;
            number: true;
          };
        };
      };
    };
  };
}>;

interface Props {
  taskId: string;
  onTaskLoad?: (task: TaskExtendedWithProblem) => void;
}

function useTask({ taskId, onTaskLoad }: Props) {
  const { data } = useSession();

  const task = trpc.tasks.getTaskById.useQuery(
    { id: taskId as string },
    {
      enabled: !!taskId,
    }
  );

  const isOwner = task.data?.owner.full_name === data?.user?.full_name;

  const isLoading = task.isLoading;

  const memoizedTaskLoad = useCallback((task: TaskExtendedWithProblem) => {
    if (!onTaskLoad) return;
    return onTaskLoad(task);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoading && task.data) {
      memoizedTaskLoad(task.data);
    }
  }, [task.data, isLoading, memoizedTaskLoad]);

  return {
    isLoading,
    task: task.data,
    isOwner,
  };
}

export default useTask;
