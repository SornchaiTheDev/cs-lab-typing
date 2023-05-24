import React from "react";

function ProgressIndicator() {
  return (
    <div className="mt-2 grid grid-cols-12 gap-1">
      <div className="col-span-2 h-2 rounded-sm bg-lime-9"></div>
      <div className="col-span-2 h-2 rounded-sm bg-lime-9"></div>
      <div className="col-span-2 h-2 rounded-sm bg-lime-9"></div>
      <div className="col-span-2 h-2 rounded-sm bg-red-9"></div>
      <div className="col-span-2 h-2 rounded-sm bg-red-9"></div>
      <div className="col-span-2 h-2 rounded-sm bg-sand-9"></div>
    </div>
  );
}

export default ProgressIndicator;
