import type { FieldValues, Path, UseFormRegister } from "react-hook-form";
import Skeleton from "../Common/Skeleton";

interface CheckboxProps<T extends FieldValues> {
  title: string;
  label: Path<T>;
  register: UseFormRegister<T>;
  disabled?: boolean;
  isLoading?: boolean;
}

const Checkbox = <T extends FieldValues>({
  label,
  register,
  title,
  disabled,
  isLoading,
}: CheckboxProps<T>) => {
  return (
    <div className="flex items-center">
      {isLoading ? (
        <Skeleton width="100%" height="1.5rem" />
      ) : (
        <input
          disabled={disabled}
          {...{ ...register(label) }}
          type="checkbox"
          className="w-4 h-4 rounded-sm outline-none text-sand-12 border-sand-9 ring-sand-10 focus:ring-sand-12 checked:bg-sand-12 bg-sand-1 accent-sand-12"
        />
      )}
      <label htmlFor={title} className="ml-2 font-medium text-sand-12">
        {title}
      </label>
    </div>
  );
};

export default Checkbox;
