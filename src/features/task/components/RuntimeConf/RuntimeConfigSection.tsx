import { Fragment, useMemo } from "react";
import * as Collapse from "~/components/Common/Collapse";
import Checkbox from "~/components/Forms/Checkbox";
import Counter from "./Counter";
import { useAtom } from "jotai";
import { type RuntimeConfig, configAtom } from "~/store/problemTask";

interface ConfigDetails {
  name: string;
  key: keyof RuntimeConfig;
  description: string;
}

function RuntimeConfigSection() {
  const [config, updateConfigWhereKey] = useAtom(configAtom);

  const configDetails = useMemo<ConfigDetails[]>(
    () => [
      {
        name: "CPU Time Limit",
        key: "cpu_time_limit",
        description:
          "Default runtime limit for every program. Time in which the OS assigns the processor to different tasks is not counted.",
      },
      {
        name: "CPU Extra Time Limit",
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
    ],
    []
  );

  return (
    <Collapse.Root>
      <Collapse.Header>
        <div className="flex items-center gap-2">
          <h6 className="text-xl font-bold text-sand-12">
            Runtime Configuration
          </h6>
          <span className="text-sm font-normal text-sand-10">(optional)</span>
        </div>
      </Collapse.Header>
      <Collapse.Body>
        <div className="mt-4">
          {Object.entries(config).map(([key, value]) => {
            const config = configDetails.find((config) => config.key === key);
            const name = config?.name;
            const description = config?.description;

            if (typeof value === "boolean") {
              return (
                <Fragment key={key}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-lg font-medium">{name}</h5>
                      <p className="text-sm">{description}</p>
                    </div>
                    <Checkbox
                      value={value}
                      onChange={(value) =>
                        updateConfigWhereKey({
                          key: key as keyof RuntimeConfig,
                          value,
                        })
                      }
                    />
                  </div>
                  <hr className="my-4 border-sand-6" />
                </Fragment>
              );
            }

            return (
              <Fragment key={key}>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-lg font-medium">{name}</h5>
                    <p className="text-sm">
                      {description}{" "}
                      <span className="text-xs text-sand-10">(in seconds)</span>
                    </p>
                  </div>
                  <Counter
                    value={value}
                    onChange={(value) =>
                      updateConfigWhereKey({
                        key: key as keyof RuntimeConfig,
                        value,
                      })
                    }
                  />
                </div>
                <hr className="my-4 border-sand-6" />
              </Fragment>
            );
          })}
        </div>
      </Collapse.Body>
    </Collapse.Root>
  );
}

export default RuntimeConfigSection;
