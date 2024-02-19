import { Fragment } from "react";
import * as Collapse from "~/components/Common/Collapse";
import Checkbox from "~/components/Forms/Checkbox";
import Counter from "./Counter";
import type { UpdateRuntimeConfig, RuntimeConfig } from "~/store/problemTask";
import { RotateCcw } from "lucide-react";
import { runtimeConfigDetails } from "~/constants/runtime_config";

interface Props {
  config: RuntimeConfig;
  onUpdate: ({ key, value }: UpdateRuntimeConfig) => void;
  onReset: () => void;
  isAlreadyDefaultRuntimeConfig: boolean;
}

function RuntimeConfigSection({
  config,
  onUpdate,
  onReset,
  isAlreadyDefaultRuntimeConfig,
}: Props) {
  return (
    <Collapse.Root>
      <Collapse.Header>
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-1 items-center gap-2">
            <h6 className="text-xl font-bold text-sand-12">
              Runtime Configuration
            </h6>
            <span className="text-sm font-normal text-sand-10">(optional)</span>
          </div>
        </div>
      </Collapse.Header>
      <Collapse.Body>
        <button
          disabled={isAlreadyDefaultRuntimeConfig}
          onClick={onReset}
          className="mt-2 flex items-center gap-2 rounded-lg bg-red-9 px-4 py-2 text-sm text-red-2 hover:bg-red-10 disabled:bg-sand-8 disabled:text-sand-3"
        >
          <RotateCcw size="1rem" />
          Reset to Default
        </button>
        <div className="mt-4">
          {runtimeConfigDetails.map((detail) => {
            const { name, key, description, type } = detail;
            return (
              <Fragment key={key}>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-lg font-medium">{name}</h5>
                    <p className="text-sm">
                      {description}{" "}
                      {type === "counter" && (
                        <span className="text-xs text-sand-10">
                          (in {detail.unit})
                        </span>
                      )}
                    </p>
                  </div>
                  {type === "checkbox" ? (
                    <Checkbox
                      value={config[key] as boolean}
                      onChange={(value) =>
                        onUpdate({
                          key: key as keyof RuntimeConfig,
                          value,
                        })
                      }
                    />
                  ) : (
                    <Counter
                      value={config[key] as number}
                      onChange={(value) =>
                        onUpdate({
                          key: key as keyof RuntimeConfig,
                          value,
                        })
                      }
                    />
                  )}
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
