import { Icon } from "@iconify/react";
import clsx from "clsx";

interface Props {
  onClick?: () => void;
  children?: React.ReactNode;
  icon?: string;
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
}
function Button({
  onClick,
  children,
  icon,
  className,
  isLoading,
  disabled,
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "flex items-center min-h-[2.5rem] gap-4 p-2 rounded-lg  justify-center disabled:bg-sand-6 disabled:cursor-not-allowed disabled:text-sand-8",
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
