import { ReactNode, forwardRef, useRef } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useOnClickOutside } from "usehooks-ts";
import { Icon } from "@iconify/react";

interface Props {
  children?: ReactNode;
  className?: string;
  isOpen?: boolean;
  onClose: () => void;
  title: string;
  description?: string | ReactNode;
}

const Modal = ({
  children,
  className,
  onClose,
  isOpen,
  title,
  description,
}: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(modalRef, onClose);
  if (!isOpen) return null;
  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-screen bg-sand-12 bg-opacity-30 backdrop-blur-sm">
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, translateY: "10px" }}
        animate={{ opacity: 1, translateY: 0 }}
        className={clsx(
          "absolute p-4 bg-sand-1 max-w-full rounded-md shadow w-[95%]",
          className
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xl font-bold capitalize">{title}</h4>
            {!!description && <p className="text-sand-9">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-xl rounded-full hover:bg-sand-3 active:bg-sand-4"
          >
            <Icon icon="material-symbols:close-rounded" />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

export default Modal;
