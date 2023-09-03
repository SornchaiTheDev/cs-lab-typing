import React from "react";
import type { FieldValues, Path, UseFormRegister } from "react-hook-form";
import Skeleton from "../Common/Skeleton";

interface Props<T extends FieldValues> {
  title: string;
  label: Path<T>;
  isError?: boolean;
  error?: string;
  className?: string;
  register: UseFormRegister<T>;
  optional?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}

const TextArea = <T extends FieldValues>(props: Props<T>) => {
  const {
    title,
    isError,
    error,
    className,
    register,
    label,
    optional,
    disabled,
    isLoading,
  } = props;
  return (
    <div {...{ className }}>
      <div className="flex justify-between">
        <h4 className="mb-2 block font-semibold text-sand-12">
          {title}{" "}
          {optional && <span className="text-sm text-sand-11">(optional)</span>}
        </h4>
        {isError && (
          <h6 className="mb-2 block text-sm font-semibold text-tomato-9">
            {error}
          </h6>
        )}
      </div>
      {isLoading ? (
        <Skeleton width="100%" height="10rem" />
      ) : (
        <textarea
          disabled={disabled}
          rows={5}
          className="w-full rounded-lg border border-sand-6 bg-sand-1 p-2 text-sand-12 caret-sand-12 outline-none"
          {...{ ...register(label) }}
        />
      )}
    </div>
  );
};

export default TextArea;
