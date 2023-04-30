import { useState, useRef, ReactNode } from "react";
import Button from "./Button";
import { useOnClickOutside } from "usehooks-ts";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

interface Props {
  title: string;
  children: ReactNode;
  icon: string;
  className?: string;
}

function ModalWithButton({ title, children, icon, className }: Props) {
  const [isShow, setIsShow] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const onClose = () => {
    setIsShow(false);
  };

  useOnClickOutside(modalRef, onClose);

  return (
    <>
      <Button onClick={() => setIsShow(true)} icon={icon} className="m-2 shadow bg-sand-12 text-sand-1 active:bg-sand-11">
        {title}
      </Button>
      <AnimatePresence>
        {isShow && (
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-screen bg-sand-12 bg-opacity-30 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, translateY: "10px" }}
              animate={{ opacity: 1, translateY: 0 }}
              ref={modalRef}
              className={clsx(
                "absolute p-4 bg-sand-1 max-w-full rounded-md shadow flex flex-col gap-4",
                className
              )}
            >
              {children}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ModalWithButton;
