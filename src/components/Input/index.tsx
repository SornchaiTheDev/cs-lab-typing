import clsx from "clsx";
import { HTMLInputTypeAttribute } from "react";

interface Props {
  label: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  isError?: boolean;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Input({
  label,
  type,
  placeholder,
  error,
  isError,
  value,
  onChange,
}: Props) {
  return (
    <div>
      <div className="flex justify-between">
        <h4 className="block mb-2 font-semibold">{label}</h4>
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
        {...{ type, placeholder, value, onChange }}
      />
    </div>
  );
}

export default Input;
