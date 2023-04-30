import { ReactNode, forwardRef } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface Props {
  children?: ReactNode;
  className?: string;
}

const Modal = forwardRef<HTMLDivElement, Props>(
  ({ children, className }, ref) => {
    return (
      <div className="fixed top-0 left-0 flex items-center justify-center w-full h-screen bg-sand-12 bg-opacity-30 backdrop-blur-sm">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, translateY: "10px" }}
          animate={{ opacity: 1, translateY: 0 }}
          className={clsx(
            "absolute bg-sand-1 max-w-full rounded-md shadow flex flex-col gap-4",
            className
          )}
        >
          {children}
        </motion.div>
      </div>
    );
  }
);

Modal.displayName = "Modal";

export default Modal;
