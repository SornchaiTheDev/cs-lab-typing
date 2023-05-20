import { ChangeEvent, useState, useEffect } from "react";
import { validateTimeRange } from "./timeValidate";
import { DateRange } from "react-day-picker";

interface Props {
  date: DateRange;
  onApply: (date: DateRange) => void;
}

function TimePickerRange({ date, onApply }: Props) {
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");

  const startDate = new Date(
    date.from?.getFullYear() as number,
    date.from?.getMonth() as number,
    date.from?.getDate() as number,
    parseInt(startTime.split(":")[0] as string),
    parseInt(startTime.split(":")[1] as string)
  );

  const endDate = new Date(
    date.to?.getFullYear() as number,
    date.to?.getMonth() as number,
    date.to?.getDate() as number,
    parseInt(endTime.split(":")[0] as string),
    parseInt(endTime.split(":")[1] as string)
  );

  const handleStartTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEndTime(event.target.value);
  };

  useEffect(() => {
    if (startTime === "") setStartTime("00:00");
    if (endTime === "") setEndTime("00:00");
  }, [startTime, endTime]);

  return (
    <div className="flex items-center gap-2 text-sand-12">
      <input
        value={startTime}
        className="w-28 rounded border border-sand-6 bg-sand-3 p-2 outline-none"
        onChange={handleStartTimeChange}
      />
      <label>to</label>
      <input
        value={endTime}
        className="w-28 rounded border border-sand-6 bg-sand-3 p-2 outline-none"
        onChange={handleEndTimeChange}
      />
      <button
        onClick={() => onApply({ from: startDate, to: endDate })}
        disabled={!validateTimeRange(startTime, endTime)}
        className="w-full rounded bg-sand-12 px-4 py-2 text-sm text-sand-1 active:bg-sand-11 disabled:bg-sand-8"
      >
        Apply
      </button>
    </div>
  );
}

export default TimePickerRange;
