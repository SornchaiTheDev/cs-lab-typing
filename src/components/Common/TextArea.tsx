import React from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface Props<T extends FieldValues> {
  title: string;
  label: Path<T>;
  isError?: boolean;
  error?: boolean;
  className?: string;
  register: UseFormRegister<T>;
  optional?: boolean;
}

const TextArea = <T extends FieldValues>(props: Props<T>) => {
  const { title, isError, error, className, register, label, optional } = props;
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

      <textarea
        rows={5}
        className="w-full p-2 border rounded-lg outline-none border-sand-6"
        {...{ ...register(label) }}
      ></textarea>
    </div>
  );
};

export default TextArea;
