import { forwardRef } from "react";
import { Icon } from "@iconify/react";

const DateInput = forwardRef<HTMLButtonElement, any>(
  ({ value, onClick }, ref) => (
    <button
      className="flex items-center gap-2 p-2 border rounded-md bg-sand-3 border-sand-7"
      onClick={onClick}
      ref={ref}
    >
      <Icon icon="solar:calendar-line-duotone" />
      {value}
    </button>
  )
);

DateInput.displayName = "DateInput";

export default DateInput;
