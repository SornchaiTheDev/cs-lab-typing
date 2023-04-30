import { Icon } from "@iconify/react";
import { useState, useRef, ReactNode } from "react";
import Button from "./Button";
import { useOnClickOutside } from "usehooks-ts";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  title: string;
  children: ReactNode;
  icon: string;
}

function ModalWithButton({ title, children, icon }: Props) {
  const [isShow, setIsShow] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const onClose = () => {
    setIsShow(false);
  };

  useOnClickOutside(modalRef, onClose);

  return (
    <>
      <Button onClick={() => setIsShow(true)} icon={icon} className="m-2">
        {title}
      </Button>
      <AnimatePresence>
        {isShow && (
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-screen bg-sand-12 bg-opacity-30 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, translateY: "10px" }}
              animate={{ opacity: 1, translateY: 0 }}
              ref={modalRef}
              className="absolute p-4  bg-sand-1 w-[95%] max-w-full md:w-[40rem] rounded-md shadow flex flex-col gap-4"
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
