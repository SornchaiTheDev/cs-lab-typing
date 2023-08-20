interface Props {
  rawSpeed: number;
  adjustedSpeed: number;
  errorPercentage: number;
  duration: { minutes: number; seconds: number };
  score?: number;
}
function Stats({
  adjustedSpeed,
  duration,
  errorPercentage,
  rawSpeed,
  score,
}: Props) {
  const isGreaterThanOneMinute = duration.seconds > 60;
  const _duration = isGreaterThanOneMinute
    ? duration.minutes
    : duration.seconds;

  return (
    <div className="flex flex-wrap justify-center gap-10 text-sand-12">
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
          {_duration.toFixed(2)}
          <span>{isGreaterThanOneMinute ? "m" : "s"}</span>
        </h2>
      </div>
      {!!score && (
        <div>
          <h6 className="text-sm">Score</h6>
          <h2 className="text-4xl font-bold">{score}</h2>
        </div>
      )}
    </div>
  );
}

export default Stats;
