import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { Icon } from "@iconify/react";
import { twMerge } from "tailwind-merge";

interface Props {
  title: string;
  optional?: boolean;
  value: Date;
  onChange: (date: Date) => void;
  isError?: boolean;
  error?: string;
}

function DateTimePicker({
  value,
  onChange,
  title,
  optional,
  isError,
  error,
}: Props) {
  const [isShow, setIsShow] = useState<boolean>(false);
  const [time, setTime] = useState("00:00");
  const dateRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(dateRef, () => setIsShow(false));

  const handleOnSelect = (date: Date | undefined) => {
    if (date) {
      onChange(date);
    }
    setIsShow(false);
  };

  const handleOnTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    if (time.length > 5) return;
    const hour = parseInt(time.split(":")[0] as string);
    const minute = parseInt(time.split(":")[1] as string);
    setTime(time);

    if (Number.isNaN(hour) || Number.isNaN(minute)) return;

    value.setHours(hour);
    value.setMinutes(minute);
    onChange(value);
  };

  useEffect(() => {
    if (time === "") {
      setTime("00:00");
    }
  }, [time]);

  useEffect(() => {
    if (value) {
      const time = value.getHours() + ":" + value.getMinutes();
      setTime(time);
    }
  }, [value]);

  return (
    <div className="relative" ref={dateRef}>
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
      <div className="flex items-center gap-2">
        <div
          className={twMerge(
            "relative min-h-[2.5rem] w-full rounded-lg border border-sand-6 bg-sand-1 text-sand-12 outline-none",
            isError && "border-tomato-7"
          )}
          onClick={() => setIsShow(!isShow)}
        >
          <h5 className="select-none p-2">
            {value && format(value, "dd/MM/yyyy")}
          </h5>
          <Icon
            icon="solar:calendar-line-duotone"
            className="absolute right-2 top-1/2 -translate-y-1/2"
          />
        </div>
        {isShow && (
          <div className="absolute bottom-12 select-none rounded-lg border border-sand-6 bg-sand-1 text-sand-11 shadow">
            <DayPicker
              mode="single"
              selected={value}
              onSelect={handleOnSelect}
            />
          </div>
        )}
        <input
          value={time}
          className="max-h-[2.5rem] w-28 rounded-lg border border-sand-6 bg-sand-1 p-2 text-sand-12 outline-none"
          onChange={handleOnTimeChange}
        />
      </div>
    </div>
  );
}

export default DateTimePicker;
