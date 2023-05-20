import clsx from "clsx";

interface Props {
  width?: string | number;
  height?: string | number;
  className?: string;
}

function Skeleton({ width, height, className }: Props) {
  return (
    <div
      className={clsx(
        "rounded-lg bg-gradient-to-r from-sand-6 to-sand-4 animate-pulse",
        className
      )}
      style={{ width, height }}
    ></div>
  );
}

export default Skeleton;
