import clsx from "clsx";
import { forwardRef } from "react";
import type { HTMLInputTypeAttribute } from "react";
import { UseFormRegister } from "react-hook-form";
import { FormData } from "@/types/CreateAdminAccount";
interface Props {
  title: string;
  label: keyof FormData;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  isError?: boolean;
  error?: string;
  register: UseFormRegister<FormData>;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    title,
    label,
    type,
    placeholder,
    error,
    isError,
    register,
    className,
  } = props;
  return (
    <div {...{ className }}>
      <div className="flex justify-between">
        <h4 className="block mb-2 font-semibold">{title}</h4>
        {isError && (
          <h6 className="block mb-2 text-sm font-semibold text-tomato-9">
            {error}
          </h6>
        )}
      </div>
      <input
        className={clsx(
          "w-full p-2 border rounded-md outline-none",
          isError && "border-tomato-7"
        )}
        {...{ type, placeholder, ...register(label) }}
      />
    </div>
  );
});

Input.displayName = "Input";

export default Input;
