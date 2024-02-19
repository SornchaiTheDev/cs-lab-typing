import type { RuntimeConfig } from "~/store/problemTask";

export const runtimeConfig: RuntimeConfig = {
  cpu_time_limit: 5,
  cpu_extra_time: 1,
  wall_time_limit: 10,
  memory_limit: 128000,
  stack_limit: 64000,
  max_processes_and_or_threads: 60,
  enable_per_process_and_thread_time_limit: false,
  enable_per_process_and_thread_memory_limit: false,
  max_file_size: 1024,
  number_of_runs: 1,
  redirect_stderr_to_stdout: false,
  enable_network: false,
};

interface ConfigDetails {
  key: keyof RuntimeConfig;
  name: string;
  description: string;
}

export const runtimeConfigDetails: ConfigDetails[] = [
  {
    name: "CPU Time Limit",
    key: "cpu_time_limit",
    description:
      "Default runtime limit for every program. Time in which the OS assigns the processor to different tasks is not counted.",
  },
  {
    name: "CPU Extra Time",
    key: "cpu_extra_time",
    description:
      "When a time limit is exceeded, wait for extra time, before killing the program. This has the advantage that the real execution time is reported, even though it slightly exceeds the limit.",
  },
  {
    name: "Wall Time Limit",
    key: "wall_time_limit",
    description:
      "Limit wall-clock time in seconds. Decimal numbers are allowed. This clock measures the time from the start of the program to its exit, so it does not stop when the program has lost the CPU or when it is waiting for an external event. We recommend to use cpu_time_limit as the main limit, but set wall_time_limit to a much higher value as a precaution against sleeping programs.",
  },
  {
    name: "Memory Limit",
    key: "memory_limit",
    description: "Limit address space of the program.",
  },
  {
    name: "Stack Limit",
    key: "stack_limit",
    description: "Limit process stack.",
  },
  {
    name: "Max Processes and/or threads",
    key: "max_processes_and_or_threads",
    description: "Limit process stack.",
  },
  {
    name: "Enable per process and thread time limit",
    key: "enable_per_process_and_thread_time_limit",
    description:
      "If true then cpu_time_limit will be used as per process and thread.",
  },
  {
    name: "Enable per process and thread memory limit",
    key: "enable_per_process_and_thread_memory_limit",
    description:
      "If true then memory_limit will be used as per process and thread.",
  },
  {
    name: "Max file size",
    key: "max_file_size",
    description: "Limit file size created or modified by the program.",
  },
  {
    name: "Number of runs",
    key: "number_of_runs",
    description:
      "Run each program number_of_runs times and take average of time and memory.",
  },
  {
    name: "Redirect stderr to stdout",
    key: "redirect_stderr_to_stdout",
    description:
      "If true standard error will be redirected to standard output.",
  },
  {
    name: "Enable Network",
    key: "enable_network",
    description: "If true program will have network access.",
  },
];
