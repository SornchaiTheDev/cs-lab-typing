import { ChangeEvent, useState, useEffect } from "react";
import { validateTimeRange } from "./timeValidate";

interface Props {
  onApply: (startTime: string, endTime: string) => void;
}

function TimePickerRange({ onApply }: Props) {
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");

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
    <div className="flex items-center gap-2 p-1 text-sand-12">
      <label>Start at</label>
      <input
        value={startTime}
        className="p-1 border rounded outline-none bg-sand-3 w-28 border-sand-6"
        onChange={handleStartTimeChange}
      />
      <label>to</label>
      <input
        value={endTime}
        className="p-1 border rounded outline-none bg-sand-3 w-28 border-sand-6"
        onChange={handleEndTimeChange}
      />
      <button
        onClick={() => onApply(startTime, endTime)}
        disabled={!validateTimeRange(startTime, endTime)}
        className="px-4 py-2 text-sm rounded text-sand-1 bg-sand-12 active:bg-sand-11 disabled:bg-sand-8"
      >
        Apply
      </button>
    </div>
  );
}

export default TimePickerRange;
