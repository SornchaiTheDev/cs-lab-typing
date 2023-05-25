import React from "react";
import { getDuration } from "./utils/getDuration";
import { calculateTypingSpeed } from "./utils/calculateWPM";
import { calculateAccuracy } from "./utils/calculateAccuracy";
import { calculateErrorPercentage } from "./utils/calculateErrorPercentage";
import { useTypingStore } from "~/store";
function Stats() {
  const stats = useTypingStore((state) => state.stats);
  const { correctChar, errorChar, startTime, endTime, totalChars } = stats;
  const { minutes, seconds } = getDuration(startTime as Date, endTime as Date);
  const { rawWpm, adjWpm } = calculateTypingSpeed(
    totalChars,
    errorChar,
    minutes
  );

  const Accuracy = calculateAccuracy(totalChars, correctChar);

  const errorPercentage = calculateErrorPercentage(totalChars, errorChar);
  return (
    <div className="flex justify-center gap-4 text-sand-12">
      <div>
        <h6 className="text-sm">Raw Speed</h6>
        <h2 className="text-4xl font-bold">{rawWpm}</h2>
      </div>
      <div>
        <h6 className="text-sm">Adjusted Speed</h6>
        <h2 className="text-4xl font-bold">{adjWpm}</h2>
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
