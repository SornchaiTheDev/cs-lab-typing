import { Icon } from "@iconify/react";
import useTheme from "~/hooks/useTheme";

function NotFound() {
  const {} = useTheme();

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2 text-sand-12">
      <Icon icon="solar:ghost-bold-duotone" className="text-6xl text-sand-12" />
      <div className="flex items-center gap-2">
        <h4 className="border-r-2 border-sand-8 px-2 text-3xl font-bold">
          404
        </h4>
        <h5 className="text-lg">Page that you request was not found</h5>
      </div>
    </div>
  );
}

export default NotFound;
