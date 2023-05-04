import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { useState, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { Icon } from "@iconify/react";
import clsx from "clsx";

interface Props {
  title: string;
  optional?: boolean;
  value: Date;
  onChange: (date: Date) => void;
  isError?: boolean;
  error?: string;
}

function Single({ value, onChange, title, optional, isError, error }: Props) {
  const [isShow, setIsShow] = useState<boolean>(false);
  const dateRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(dateRef, () => setIsShow(false));

  const handleOnSelect = (date: Date | undefined) => {
    if (date) {
      onChange(date);
    }
    setIsShow(false);
  };

  return (
    <div className="relative" ref={dateRef}>
      <div className="flex justify-between">
        <h4 className="block mb-2 font-semibold text-sand-12">
          {title}{" "}
          {optional && <span className="text-sm text-sand-11">(optional)</span>}
        </h4>
        {isError && (
          <h6 className="block mb-2 text-sm font-semibold text-tomato-9">
            {error}
          </h6>
        )}
      </div>
      <div
        className={clsx(
          "relative w-full bg-white border rounded-lg outline-none border-sand-6 min-h-[2.5rem]",
          isError && "border-tomato-7"
        )}
        onClick={() => setIsShow(true)}
      >
        <h5 className="p-2">{value && format(value, "dd/MM/yyyy")}</h5>
        <Icon
          icon="solar:calendar-line-duotone"
          className="absolute -translate-y-1/2 right-2 top-1/2"
        />
      </div>
      {isShow && (
        <div className="absolute bg-white border rounded-lg shadow top-20 border-sand-6">
          <DayPicker mode="single" selected={value} onSelect={handleOnSelect} />
        </div>
      )}
    </div>
  );
}

export default Single;
