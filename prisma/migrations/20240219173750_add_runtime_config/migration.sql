-- CreateTable
CREATE TABLE "runtime_config" (
    "problem_id" INTEGER NOT NULL,
    "cpu_time_limit" DOUBLE PRECISION NOT NULL,
    "cpu_extra_time" DOUBLE PRECISION NOT NULL,
    "wall_time_limit" DOUBLE PRECISION NOT NULL,
    "memory_limit" INTEGER NOT NULL,
    "stack_limit" INTEGER NOT NULL,
    "max_processes_and_or_threads" INTEGER NOT NULL,
    "enable_per_process_and_thread_time_limit" BOOLEAN NOT NULL,
    "enable_per_process_and_thread_memory_limit" BOOLEAN NOT NULL,
    "max_file_size" INTEGER NOT NULL,
    "number_of_runs" INTEGER NOT NULL,
    "redirect_stderr_to_stdout" BOOLEAN NOT NULL,
    "enable_network" BOOLEAN NOT NULL,

    CONSTRAINT "runtime_config_pkey" PRIMARY KEY ("problem_id")
);

-- AddForeignKey
ALTER TABLE "runtime_config" ADD CONSTRAINT "runtime_config_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "problems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
