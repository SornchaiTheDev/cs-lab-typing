import { toast } from "react-hot-toast";
import type { Toast } from "react-hot-toast";
import clsx from "clsx";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type ToastProps = {
  type: ToastType;
  title: string;
  description?: string;
} & Toast;

type ToastType = "success" | "loading" | "error" | "info";

const iconType = (type: ToastType) => {
  let icon = "",
    color = "";
  if (type === "success") {
    icon = "solar:check-circle-line-duotone";
    color = "#99d52a";
  }
  if (type === "error") {
    icon = "solar:close-circle-line-duotone";
    color = "#e5484d";
  }
  if (type === "loading") {
    icon = "line-md:loading-twotone-loop";
    color = "#1b1b18";
  }
  if (type === "info") {
    icon = "solar:info-circle-line-duotone";
    color = "#0091ff";
  }
  return { icon, color };
};

function Toast({ title, type, description, duration = 0 }: ToastProps) {
  const { icon, color } = iconType(type);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPause, setIsPause] = useState(false);

  return (
    <motion.div
      animate={{ translateY: [20, 0], opacity: [0, 1] }}
      onHoverStart={() => setIsPause(true)}
      onHoverEnd={() => setIsPause(false)}
      className="w-full max-w-sm p-4 bg-white overflow-hidden items-center rounded-lg shadow-sm min-h-[4rem] flex gap-4 border border-sand-6 relative"
    >
      <div className="flex flex-col h-full">
        <Icon icon={icon} className="w-8 h-8" style={{ color }} />
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-sand-12">{title}</h4>
        {description && <p className="text-sand-10">{description}</p>}
      </div>
      <motion.div
        initial={{ width: "100%" }}
        ref={progressRef}
        animate={{ width: isPause ? progressRef.current?.offsetWidth : "0%" }}
        transition={{ duration: duration / 1000 }}
        className="absolute bottom-0 left-0 w-full h-1"
        style={{ background: color }}
      ></motion.div>
    </motion.div>
  );
}

export default Toast;
