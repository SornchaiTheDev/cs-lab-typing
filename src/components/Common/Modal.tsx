import { ReactNode, forwardRef } from "react";
import { motion } from "framer-motion";

interface Props {
  children?: ReactNode;
}

const Modal = forwardRef<HTMLDivElement, Props>(({ children }, ref) => {
  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-screen bg-sand-12 bg-opacity-30 backdrop-blur-sm">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, translateY: "10px" }}
        animate={{ opacity: 1, translateY: 0 }}
        className="absolute p-4 bg-sand-1 w-[95%] max-w-full md:w-[40rem] rounded-md shadow flex flex-col gap-4"
      >
        {children}
      </motion.div>
    </div>
  );
});

Modal.displayName = "Modal";

export default Modal;
