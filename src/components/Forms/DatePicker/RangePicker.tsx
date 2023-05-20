import { DateRange, DayPicker } from "react-day-picker";
import { format, addDays } from "date-fns";
import { useState, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { Icon } from "@iconify/react";
import "react-day-picker/dist/style.css";

interface Props {
  value: DateRange;
  onChange: (date: DateRange) => void;
}

function RangePicker({ value, onChange }: Props) {
  const [isShow, setIsShow] = useState<boolean>(false);
  const dateRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(dateRef, () => setIsShow(false));

  const handleOnSelect = (date: DateRange | undefined) => {
    if (date) {
      setRange(date);
      onChange(date);
    }
  };

  const [range, setRange] = useState<DateRange>({
    from: value.from,
    to: value.to,
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
        <div className="absolute z-40 bg-white border rounded-lg shadow top-14 border-sand-6">
          <DayPicker
            mode="range"
            defaultMonth={new Date()}
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
