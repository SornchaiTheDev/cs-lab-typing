import React from "react";

interface Props {
  width: string | number;
  height: string | number;
}

function Skeleton({ width, height }: Props) {
  return (
    <div
      className="rounded-lg bg-gradient-to-r from-sand-6 to-sand-4 animate-pulse"
      style={{ width, height }}
    ></div>
  );
}

export default Skeleton;
