import type { Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useCallback, useEffect } from "react";
import { trpc } from "~/utils";

export type TaskExtendedWithProblem = Prisma.tasksGetPayload<{
  include: {
    problem: {
      include: {
        runtime_config: {
          select: {
            cpu_time_limit: true;
            cpu_extra_time: true;
            wall_time_limit: true;
            memory_limit: true;
            stack_limit: true;
            max_processes_and_or_threads: true;
            enable_per_process_and_thread_time_limit: true;
            enable_per_process_and_thread_memory_limit: true;
            max_file_size: true;
            number_of_runs: true;
            redirect_stderr_to_stdout: true;
            enable_network: true;
          };
        };
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
