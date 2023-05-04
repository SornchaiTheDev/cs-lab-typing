import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function Badge({ children }: Props) {
  return (
    <div className="flex items-center px-2 py-1 text-sm font-semibold text-white rounded-md w-fit bg-sand-12">
      <h5>{children}</h5>
    </div>
  );
}

export default Badge;
