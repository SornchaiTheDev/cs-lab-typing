import { useState } from "react";
import * as Collapse from "~/components/Common/Collapse";
import Checkbox from "~/components/Forms/Checkbox";
import Counter from "./Counter";

function RuntimeConfigSection() {
  const [counter, setCounter] = useState(2);
  const [check, setCheck] = useState(false);
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
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-lg font-medium">CPU Time Limit</h5>
              <p className="text-sm">
                Default runtime limit for every program. Time in which the OS
                assigns the processor to different tasks is not counted.
              </p>
            </div>
            <Counter value={counter} onChange={setCounter} />
          </div>
          <hr className="my-4 border-sand-6" />
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-lg font-medium">CPU Extra Time Limit</h5>
              <p className="text-sm">
                When a time limit is exceeded, wait for extra time, before
                killing the program. This has the advantage that the real
                execution time is reported, even though it slightly exceeds the
                limit.
              </p>
            </div>
            <Counter value={counter} onChange={setCounter} />
          </div>
          <hr className="my-4 border-sand-6" />
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-lg font-medium">Wall Time Limit</h5>
              <p className="text-sm">
                Limit wall-clock time in seconds. Decimal numbers are allowed.
                This clock measures the time from the start of the program to
                its exit, so it does not stop when the program has lost the CPU
                or when it is waiting for an external event. We recommend to use
                cpu_time_limit as the main limit, but set wall_time_limit to a
                much higher value as a precaution against sleeping programs.
              </p>
            </div>
            <Counter value={counter} onChange={setCounter} />
          </div>
          <hr className="my-4 border-sand-6" />
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-lg font-medium">Memory Limit</h5>
              <p className="text-sm">Limit address space of the program.</p>
            </div>
            <Counter value={counter} onChange={setCounter} />
          </div>
          <hr className="my-4 border-sand-6" />
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-lg font-medium">Stack Limit</h5>
              <p className="text-sm">Limit process stack.</p>
            </div>
            <Counter value={counter} onChange={setCounter} />
          </div>
          <hr className="my-4 border-sand-6" />
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-lg font-medium">
                Max Processes and/or threads
              </h5>
              <p className="text-sm">Limit process stack.</p>
            </div>
            <Counter value={counter} onChange={setCounter} />
          </div>
          <hr className="my-4 border-sand-6" />
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-lg font-medium">
                Enable per process and thread time limit
              </h5>
              <p className="text-sm">
                If true then cpu_time_limit will be used as per process and
                thread.
              </p>
            </div>
            <Checkbox value={check} onChange={setCheck} />
          </div>
          <hr className="my-4 border-sand-6" />
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-lg font-medium">
                Enable per process and thread memory limit
              </h5>
              <p className="text-sm">
                If true then memory_limit will be used as per process and
                thread.
              </p>
            </div>
            <Checkbox value={check} onChange={setCheck} />
          </div>
          <hr className="my-4 border-sand-6" />
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-lg font-medium">Max file size</h5>
              <p className="text-sm">
                Limit file size created or modified by the program.
              </p>
            </div>
            <Counter value={counter} onChange={setCounter} />
          </div>
          <hr className="my-4 border-sand-6" />
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-lg font-medium">Number of runs</h5>
              <p className="text-sm">
                Run each program number_of_runs times and take average of time
                and memory.
              </p>
            </div>
            <Counter value={counter} onChange={setCounter} />
          </div>
          <hr className="my-4 border-sand-6" />
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-lg font-medium">Redirect stderr to stdout</h5>
              <p className="text-sm">
                If true standard error will be redirected to standard output.
              </p>
            </div>
            <Checkbox value={check} onChange={setCheck} />
          </div>
          <hr className="my-4 border-sand-6" />
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-lg font-medium">Enable Network</h5>
              <p className="text-sm">
                If true program will have network access.
              </p>
            </div>
            <Checkbox value={check} onChange={setCheck} />
          </div>
        </div>
      </Collapse.Body>
    </Collapse.Root>
  );
}

export default RuntimeConfigSection;
