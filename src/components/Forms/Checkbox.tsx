import { useState, useEffect } from "react";
import type { FieldValues, Path } from "react-hook-form";
import Skeleton from "../Common/Skeleton";
import { motion } from "framer-motion";
import { cn } from "~/lib/utils";

interface CheckboxProps<T extends FieldValues> {
  title?: string;
  label?: Path<T>;
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

  useEffect(() => {
    setIsActive(value);
  }, [value]);

  const handleOnClick = () => {
    if (disabled) return;
    onChange(!isActive);
    setIsActive(!isActive);
  };

  return (
    <>
      <label htmlFor={title} className="font-medium text-sand-12">
        {title}
      </label>
      <button
        type="button"
        onClick={handleOnClick}
        className="flex w-fit flex-col gap-2"
      >
        {isLoading ? (
          <Skeleton width="100%" height="1.5rem" />
        ) : (
          <div className="relative h-6 w-12 overflow-hidden rounded-xl border bg-sand-4 border-sand-6 p-1">
            <motion.div
              initial={{ x: isActive ? -4 : -100 }}
              animate={{ x: isActive ? -40 : -90 }}
              transition={{ type: "keyframes", duration: 0.25 }}
              className="absolute top-0 h-96 w-20 bg-lime-9"
            ></motion.div>
            <motion.div
              transition={{ type: "keyframes", duration: 0.25 }}
              initial={
                isActive
                  ? { right: 0, left: "auto" }
                  : { right: "auto", left: 0 }
              }
              animate={
                isActive
                  ? { right: 0, left: "auto" }
                  : { right: "auto", left: 0 }
              }
              className={cn(
                "absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-sand-1 border border-sand-6"
              )}
            ></motion.div>
          </div>
        )}
      </button>
    </>
  );
};

export default Checkbox;
