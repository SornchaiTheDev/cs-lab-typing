import React from "react";

function ProblemSelectSection() {
  return (
    <div className="mr-2 min-w-80 w-80 overflow-hidden rounded-lg border border-sand-6 bg-sand-1">
      <h2 className="p-4 text-xl font-bold text-sand-12">Lab1</h2>
      <div className="mt-4 flex flex-col gap-4">
        <button className="bg-sand-6 px-4 py-2 text-start">
          <h5 className="font-bold text-sand-12">
            1. 09 Find a, b in which a*b=n and (a+b) is the lowest
          </h5>
        </button>
        <h5 className="px-4 text-sand-9">2. Sum of 2 number</h5>
      </div>
    </div>
  );
}

export default ProblemSelectSection;
