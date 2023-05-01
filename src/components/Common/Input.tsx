import clsx from "clsx";
import type { HTMLInputTypeAttribute } from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { z } from "zod";

interface Props<T extends FieldValues> {
  title: string;
  label: Path<T>;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  isError?: boolean;
  error?: string;
  register: UseFormRegister<T>;
  className?: string;
  optional?: boolean;
}

const Input = <T extends FieldValues>(props: Props<T>) => {
  const {
    title,
    label,
    type,
    placeholder,
    error,
    isError,
    register,
    className,
    optional,
  } = props;
  return (
    <div {...{ className }}>
      <div className="flex justify-between">
        <h4 className="block mb-2 font-semibold text-sand-12">
          {title}{" "}
          {optional && <span className="text-sm text-sand-11">(optional)</span>}
        </h4>
        {isError && (
          <h6 className="block mb-2 text-sm font-semibold text-tomato-9">
            {error}
          </h6>
        )}
      </div>
      <input
        className={clsx(
          "w-full p-2 border border-sand-6 rounded-md outline-none bg-sand-1",
          isError && "border-tomato-7"
        )}
        {...{ type, placeholder, ...register(label) }}
      />
    </div>
  );
};

export default Input;
