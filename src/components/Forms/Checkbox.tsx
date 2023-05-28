import { useRef, forwardRef, ForwardedRef, useState } from "react";
import type { FieldValues, Path, UseFormRegister } from "react-hook-form";
import Skeleton from "../Common/Skeleton";
import { motion } from "framer-motion";
import clsx from "clsx";

interface CheckboxProps<T extends FieldValues> {
  title: string;
  label: Path<T>;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const Checkbox = <T extends FieldValues>({
  title,
  disabled,
  isLoading,
  onChange,
  value,
}: CheckboxProps<T>) => {
  const [isActive, setIsActive] = useState(value);

  const handleOnClick = () => {
    if (disabled) return;
    onChange(!isActive);
    setIsActive(!isActive);
  };

  return (
    <button
      type="button"
      onClick={handleOnClick}
      className="flex flex-col gap-2 w-fit"
    >
      <label htmlFor={title} className="font-medium text-sand-12">
        {title}
      </label>

      {isLoading ? (
        <Skeleton width="100%" height="1.5rem" />
      ) : (
        <div
          className={clsx(
            "relative h-6 w-12 rounded-xl p-1",
            isActive ? "bg-sand-11" : "bg-sand-6"
          )}
        >
          <motion.div
            initial={isActive ? { right: 4, left: "auto" } : { right: "auto", left: 4 }}
            animate={isActive ? { right: 4, left: "auto" } : { right: "auto", left: 4 }}
            className="absolute h-4 w-4 rounded-full bg-sand-1"
          ></motion.div>
        </div>
      )}
    </button>
  );
};

export default Checkbox;
