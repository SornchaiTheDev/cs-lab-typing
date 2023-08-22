import React from "react";

function Divider() {
  return (
    <div className="flex w-1/2 items-center gap-4">
      <div className="h-[2px] w-full bg-sand-12"></div>
      <h5 className="text-sm text-sand-12">หรือ</h5>
      <div className="h-[2px] w-full bg-sand-12"></div>
    </div>
  );
}

export default Divider;
