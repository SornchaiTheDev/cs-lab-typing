import { useState, useRef, ReactNode } from "react";
import Button from "./Button";
import { useOnClickOutside } from "usehooks-ts";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { Icon } from "@iconify/react";

interface Props {
  title: string;
  children?: ReactNode;
  icon: string;
  className?: string;
  description?: string;
  color?: string;
}

function ModalWithButton({
  title,
  children,
  icon,
  className,
  description,
  color = "bg-sand-12",
}: Props) {
  const [isShow, setIsShow] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const onClose = () => {
    setIsShow(false);
  };

  useOnClickOutside(modalRef, onClose);

  return (
    <>
      <Button
        onClick={() => setIsShow(true)}
        icon={icon}
        className={clsx("shadow  text-sand-1 active:bg-sand-11", color)}
      >
        {title}
      </Button>
      <AnimatePresence>
        {isShow && (
          <div className="fixed top-0 left-0 z-20 flex items-center justify-center w-full h-screen bg-sand-12 bg-opacity-30 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, translateY: "10px" }}
              animate={{ opacity: 1, translateY: 0 }}
              ref={modalRef}
              className={clsx(
                "absolute p-4 bg-sand-1 max-w-full rounded-md shadow w-[95%]",
                className
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold">{title}</h4>
                  {!!description && (
                    <p className="text-sand-9">{description}</p>
                  )}
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
        )}
      </AnimatePresence>
    </>
  );
}

export default ModalWithButton;
