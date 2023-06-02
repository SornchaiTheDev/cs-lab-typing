import React from "react";
import { getDuration } from "./utils/getDuration";
import { calculateTypingSpeed } from "./utils/calculateWPM";
import { calculateErrorPercentage } from "./utils/calculateErrorPercentage";
import { useTypingStore } from "~/store";
function Stats() {
  const stats = useTypingStore((state) => state.stats);
  const { errorChar, startedAt, endedAt, totalChars } = stats;
  const { minutes, seconds } = getDuration(startedAt as Date, endedAt as Date);
  const { rawSpeed, adjustedSpeed } = calculateTypingSpeed(
    totalChars,
    errorChar,
    minutes
  );
  const errorPercentage = calculateErrorPercentage(totalChars, errorChar);

  return (
    <div className="flex justify-center gap-10 text-sand-12">
      <div>
        <h6 className="text-sm">Raw Speed</h6>
        <h2 className="text-4xl font-bold">{rawSpeed}</h2>
      </div>
      <div>
        <h6 className="text-sm">Adjusted Speed</h6>
        <h2 className="text-4xl font-bold">{adjustedSpeed}</h2>
      </div>
      <div>
        <h6 className="text-sm">Error %</h6>
        <h2 className="text-4xl font-bold">{errorPercentage}%</h2>
      </div>
      <div>
        <h6 className="text-sm">Duration</h6>
        <h2 className="text-4xl font-bold">
          {seconds.toFixed(2)}
          <span>s</span>
        </h2>
      </div>
    </div>
  );
}

export default Stats;
