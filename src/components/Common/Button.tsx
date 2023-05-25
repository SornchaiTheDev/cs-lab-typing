import { Icon } from "@iconify/react";
import clsx from "clsx";

interface Props {
  onClick?: () => void | Promise<void>;
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
        "flex min-h-[2.5rem] items-center justify-center gap-4 rounded-lg  p-2 disabled:cursor-not-allowed disabled:bg-sand-6 disabled:text-sand-8",
        className
      )}
    >
      {isLoading ? (
        <Icon icon="line-md:loading-twotone-loop" className="text-xl" />
      ) : (
        !!icon && <Icon icon={icon} className="text-xl" />
      )}
      {children}
    </button>
  );
}

export default Button;
