import { Cloud, CloudOff, UploadCloud } from "lucide-react";
import { useMemo } from "react";
import useStatus from "./hooks/useStatus";
import { Status } from "~/store/frontProblemTask";

function SaveStatus() {
  const { status } = useStatus();
  const text = useMemo(() => {
    switch (status) {
      case Status.SAVED:
        return "Saved";
      case Status.SAVING:
        return "Saving";
      case Status.ONLINE:
        return "You are back Online";
      case Status.OFFLINE:
        return "You are currently Offline";
    }
  }, [status]);

  const Icon = () => {
    switch (status) {
      case Status.SAVED:
      case Status.ONLINE:
        return <Cloud size="1rem" />;
      case Status.SAVING:
        return <UploadCloud size="1rem" />;
      case Status.OFFLINE:
        return <CloudOff size="1rem" />;
    }
  };

  return (
    <div className="flex items-center gap-2 text-sand-12">
      <Icon />
      <h2 className="text-sm">{text}</h2>
    </div>
  );
}

export default SaveStatus;
