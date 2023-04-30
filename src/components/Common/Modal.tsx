import { ReactNode, forwardRef, useRef } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useOnClickOutside } from "usehooks-ts";

interface Props {
  children?: ReactNode;
  className?: string;
  onClose: () => void;
}

const Modal = ({ children, className, onClose }: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(modalRef, onClose);

  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-screen bg-sand-12 bg-opacity-30 backdrop-blur-sm">
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, translateY: "10px" }}
        animate={{ opacity: 1, translateY: 0 }}
        className={clsx(
          "absolute bg-sand-1 max-w-full rounded-md shadow flex flex-col",
          className
        )}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Modal;
