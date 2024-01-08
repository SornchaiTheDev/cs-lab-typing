import { twMerge } from "tailwind-merge";

interface Props {
  width?: string | number;
  height?: string | number;
  className?: string;
}

function Skeleton({ width, height, className }: Props) {
  return (
    <div
      className={twMerge(
        "animate-pulse rounded-lg bg-gradient-to-r from-sand-6 to-sand-4",
        className
      )}
      style={{ width, height }}
    ></div>
  );
}

export default Skeleton;
