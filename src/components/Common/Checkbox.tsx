import React, { useState } from "react";
import type { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface CheckboxProps<T extends FieldValues> {
  title: string;
  label: Path<T>;
  register: UseFormRegister<T>;
}

const Checkbox = <T extends FieldValues>({
  label,
  register,
  title,
}: CheckboxProps<T>) => {
  return (
    <div className="flex items-center">
      <input
        {...{ ...register(label) }}
        type="checkbox"
        className="w-4 h-4 rounded-full accent-sand-12"
      />
      <label htmlFor={title} className="ml-2 font-medium text-sand-12">
        {title}
      </label>
    </div>
  );
};

export default Checkbox;