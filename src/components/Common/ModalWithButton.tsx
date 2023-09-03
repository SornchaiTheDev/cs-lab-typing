import { useState, useRef, type ReactNode, useEffect } from "react";
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
        className={clsx("text-sand-1  shadow active:bg-sand-11", color)}
      >
        {title}
      </Button>
      <AnimatePresence>
        {isShow && (
          <div className="fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-sand-12 bg-opacity-30 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, translateY: "10px" }}
              animate={{ opacity: 1, translateY: 0 }}
              ref={modalRef}
              className={clsx(
                "absolute w-[95%] max-w-full rounded-md bg-sand-1 p-4 shadow",
                className
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold text-sand-12">{title}</h4>
                  {!!description && (
                    <p className="text-sand-9">{description}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-xl text-sand-12 hover:bg-sand-3 active:bg-sand-4"
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
                  className="mt-4 w-full bg-sand-12 py-3 text-sand-1 shadow active:bg-sand-11"
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
