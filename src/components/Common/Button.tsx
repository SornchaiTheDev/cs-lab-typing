import { Icon } from "@iconify/react";
import clsx from "clsx";

interface Props {
  onClick?: () => void;
  children?: React.ReactNode;
  icon?: string;
  className?: string;
  isLoading?: boolean;
}
function Button({ onClick, children, icon, className, isLoading }: Props) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center gap-4 p-2 rounded-lg shadow bg-sand-12 text-sand-1 active:bg-sand-11 justify-center",
        className
      )}
    >
      {isLoading ? (
        <Icon icon="line-md:loading-twotone-loop" className="text-xl" />
      ) : (
        <>
          {!!icon && <Icon icon={icon} className="text-xl" />}
          {children}
        </>
      )}
    </button>
  );
}

export default Button;
