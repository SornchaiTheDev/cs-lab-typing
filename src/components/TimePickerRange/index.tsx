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
    date.from?.getFullYear()!,
    date.from?.getMonth()!,
    date.from?.getDate()!,
    parseInt(startTime.split(":")[0]),
    parseInt(startTime.split(":")[1])
  );

  const endDate = new Date(
    date.to?.getFullYear()!,
    date.to?.getMonth()!,
    date.to?.getDate()!,
    parseInt(endTime.split(":")[0]),
    parseInt(endTime.split(":")[1])
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
        className="p-2 border rounded outline-none bg-sand-3 w-28 border-sand-6"
        onChange={handleStartTimeChange}
      />
      <label>to</label>
      <input
        value={endTime}
        className="p-2 border rounded outline-none bg-sand-3 w-28 border-sand-6"
        onChange={handleEndTimeChange}
      />
      <button
        onClick={() => onApply({ from: startDate, to: endDate })}
        disabled={!validateTimeRange(startTime, endTime)}
        className="w-full px-4 py-2 text-sm rounded text-sand-1 bg-sand-12 active:bg-sand-11 disabled:bg-sand-8"
      >
        Apply
      </button>
    </div>
  );
}

export default TimePickerRange;
