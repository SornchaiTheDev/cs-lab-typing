import { useState, useRef, ReactNode, useEffect } from "react";
import Button from "./Button";
import { useOnClickOutside } from "usehooks-ts";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { Icon } from "@iconify/react";

interface ConfirmBtn {
  title: string;
  icon?: string;
  onClick: () => void;
}
interface Props {
  title: string;
  children?: ReactNode;
  icon: string;
  className?: string;
  description?: string;
  color?: string;
  confirmBtn?: ConfirmBtn;
  show?: boolean;
}

function ModalWithButton({
  title,
  children,
  icon,
  className,
  description,
  color = "bg-sand-12",
  confirmBtn,
  show,
}: Props) {
  const [isShow, setIsShow] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show) {
      onClose();
    }
  }, [show]);
  const onClose = () => {
    setIsShow(false);
  };

  const handleOnConfirmClick = () => {
    if (confirmBtn) {
      confirmBtn.onClick();
    }
    // onClose();
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
          <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen bg-sand-12 bg-opacity-30 backdrop-blur-sm">
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
                  <h4 className="text-xl text-sand-12 font-bold">{title}</h4>
                  {!!description && (
                    <p className="text-sand-9">{description}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-xl rounded-full hover:bg-sand-3 active:bg-sand-4 text-sand-12"
                >
                  <Icon icon="material-symbols:close-rounded" />
                </button>
              </div>
              {children}
              {confirmBtn && (
                <Button
                  onClick={handleOnConfirmClick}
                  isLoading={false}
                  icon={confirmBtn.icon}
                  className="w-full py-3 mt-4 shadow bg-sand-12 text-sand-1 active:bg-sand-11"
                >
                  {confirmBtn.title}
                </Button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ModalWithButton;
