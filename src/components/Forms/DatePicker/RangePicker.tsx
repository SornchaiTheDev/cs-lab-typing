import { DateRange, DayPicker } from "react-day-picker";
import { format, addDays } from "date-fns";
import { useState, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import "react-day-picker/dist/style.css";

interface Props {
  value?: number | undefined;
  onChange: (date: DateRange) => void;
}

const pastMonth = new Date(2023, 4, 15);

function RangePicker({ value = undefined, onChange }: Props) {
  const [isShow, setIsShow] = useState<boolean>(false);
  const dateRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(dateRef, () => setIsShow(false));

  const handleOnSelect = (date: DateRange | undefined) => {
    if (date) {
      setRange(date);
      onChange(date);
    }
  };

  const [range, setRange] = useState<DateRange | undefined>({
    from: value ? new Date(value) : undefined,
    to: value ? new Date(value) : undefined,
  });

  let footer = <p>Please pick the first day.</p>;
  if (range?.from) {
    if (!range.to) {
      footer = <p>{format(range.from, "dd/MM/yyyy")}</p>;
    } else if (range.to) {
      footer = (
        <p>
          {format(range.from, "dd/MM/yyyy")}–{format(range.to, "dd/MM/yyyy")}
        </p>
      );
    }
  }

  return (
    <div className="relative" ref={dateRef}>
      <button
        className="flex items-center w-full gap-2 p-2 border rounded-md bg-sand-3 border-sand-7"
        onClick={() => setIsShow(!isShow)}
      >
        <Icon icon="solar:calendar-line-duotone" />
        {footer}
      </button>
      {isShow && (
        <div className="absolute bg-white border rounded-lg shadow top-14 border-sand-6">
          <DayPicker
            mode="range"
            defaultMonth={pastMonth}
            selected={range}
            max={new Date().getTime()}
            onSelect={handleOnSelect}
          />
        </div>
      )}
    </div>
  );
}

export default RangePicker;
