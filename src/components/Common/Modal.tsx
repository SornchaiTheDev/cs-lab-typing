import { type ReactNode, useRef } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useOnClickOutside } from "usehooks-ts";
import { Icon } from "@iconify/react";
import { twMerge } from "tailwind-merge";

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
    <div className="fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-sand-12 bg-opacity-30 backdrop-blur-sm">
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, translateY: "10px" }}
        animate={{ opacity: 1, translateY: 0 }}
        className={twMerge(
          "absolute w-[95%] max-w-full rounded-md bg-sand-1 p-4 shadow",
          className
        )}
      >
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-xl font-bold capitalize">{title}</h4>
            {!!description && typeof description === "string" ? (
              <p className="text-sand-9">{description}</p>
            ) : (
              description
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-xl hover:bg-sand-3 active:bg-sand-4"
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
