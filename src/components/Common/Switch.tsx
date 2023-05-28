import React from "react";
import { motion } from "framer-motion";
function Switch() {
  return (
    <>
    <input className="hidden"/>
    <div className="relative h-6 w-12 rounded-xl bg-sand-6 p-1">
      <motion.div
        animate={{ right: [-10, 4] }}
        className="absolute h-4 w-4 rounded-full bg-sand-1"
      ></motion.div>
    </div>
    </>
  );
}

export default Switch;
