import { toast, type Toast } from "react-hot-toast";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

interface ToastProps extends Toast {
  msg: string;
  description?: string;
}

const iconType = (type: Toast["type"]) => {
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
  if (type === "blank") {
    icon = "solar:info-circle-line-duotone";
    color = "#0091ff";
  }
  return { icon, color };
};

function Toast({ msg, type, description, duration = 0, id }: ToastProps) {
  const { icon, color } = iconType(type);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPause, setIsPause] = useState(false);

  switch (msg) {
    case "INVALID_INPUT":
      msg = "Some fields are invalid";
      break;
    case "BAD_NON_KU_USERNAME":
      msg = "Non-KU Student username must not start with number";
      break;
    case "DUPLICATED_USER":
      msg =
        "Some users are already added. If you want to edit, Use Edit button";
      break;
    case "DUPLICATED_SEMESTER":
      msg =
        "This semester is already added. If you want to edit, Use Edit button";
      break;
    case "DUPLICATED_LAB":
      msg =
        "This lab is already added. If you want to edit, go to the lab setting page";
      break;
    case "DUPLICATED_TASK":
      msg =
        "This task is already added. If you want to edit, go to the task setting page";
      break;
    case "DUPLICATED_SECTION":
      msg =
        "This section is already added. If you want to edit, go to the section setting page";
      break;
    case "DUPLICATED_COURSE":
      msg =
        "This course is already added. If you want to edit, Use Edit button";
      break;
    case "EDIT_DUPLICATED_COURSE":
      msg =
        "The changes you made conflit with other courses. Please check the course number and name";
      break;
    case "SOMETHING_WENT_WRONG":
      msg = "Something went wrong";
      break;
    case "USER_NOT_FOUND":
      msg =
        "Cannot find that user. Make sure you already added that user or contact Admin.";
      break;
    case "SAME_YEAR_AND_TERM":
      msg = "There are already has same year and term";
      break;
    case "UNAUTHORIZED":
      msg = "You don't have permission to do that";
      break;
    case "ALREADY_DELETE":
      msg = "This item is already deleted";
      break;
    case "ALREADY_CLOSED":
      msg = "This task is already closed. This submission will be ignored";
      break;
  }

  return (
    <motion.div
      animate={{ translateY: [20, 0], opacity: [0, 1] }}
      onHoverStart={() => setIsPause(true)}
      onHoverEnd={() => setIsPause(false)}
      className="relative flex min-h-[4rem] w-full max-w-sm items-center gap-4 overflow-hidden rounded-lg border border-sand-6 bg-sand-1 p-4 shadow-sm"
    >
      <button
        className="absolute right-2 top-2 text-sand-12"
        onClick={() => toast.dismiss(id)}
      >
        <Icon icon="material-symbols:close-rounded" className="h-5 w-5" />
      </button>
      <div className="flex h-full flex-col">
        <Icon icon={icon} className="h-8 w-8" style={{ color }} />
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-sand-12">{msg}</h4>
        {description && <p className="text-sand-10">{description}</p>}
      </div>
      <motion.div
        initial={{ width: "100%" }}
        ref={progressRef}
        animate={{ width: isPause ? progressRef.current?.offsetWidth : "0%" }}
        transition={{ duration: duration / 1000 }}
        className="absolute bottom-0 left-0 h-1 w-full"
        style={{ background: color }}
      ></motion.div>
    </motion.div>
  );
}

export default Toast;
