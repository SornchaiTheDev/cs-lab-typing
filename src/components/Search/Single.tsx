import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import Input from "../Common/Input";
import clsx from "clsx";

interface Props<T extends FieldValues> {
  title: string;
  label: Path<T>;
  isError?: boolean;
  error?: string;
  register: UseFormRegister<T>;
  className?: string;
  optional?: boolean;
}

const Single = <T extends FieldValues>(props: Props<T>) => {
  const { register, label, className, title, optional, isError, error } = props;
  return (
    <div className="relative">
      <div {...{ className }}>
        <div className="flex justify-between">
          <h4 className="block mb-2 font-semibold text-sand-12">
            {title}{" "}
            {optional && (
              <span className="text-sm text-sand-11">(optional)</span>
            )}
          </h4>
          {isError && (
            <h6 className="block mb-2 text-sm font-semibold text-tomato-9">
              {error}
            </h6>
          )}
        </div>
        <div
          className={clsx(
            "w-full p-2 border border-sand-6 min-h-[2.5rem] rounded-md outline-none bg-sand-1",
            isError && "border-tomato-7"
          )}
        >
          <input className="w-full outline-none" {...{ ...register(label) }} />
        </div>
      </div>
      <div className="absolute z-20 flex flex-col w-full max-h-[14rem] overflow-y-scroll shadow gap-2 p-4 break-words bg-white border rounded-lg top-20 border-sand-6">
        <h4>SornchaiTheDev</h4>
        <h4>SaacSOS</h4>
        <h4>SaacSOS</h4>
        <h4>SaacSOS</h4>
        <h4>SaacSOS</h4>
        <h4>SaacSOS</h4>
        <h4>SaacSOS</h4>
        <h4>SaacSOS</h4>
        <h4>SaacSOS</h4>
      </div>
    </div>
  );
};

export default Single;
