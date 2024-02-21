import { useAtom } from "jotai";
import { useEffect } from "react";
import { Status, saveStatusAtom } from "~/store/frontProblemTask";

function useStatus() {
  const [status, setStatus] = useAtom(saveStatusAtom);
  useEffect(() => {
    const handleOnline = () => {
      setStatus(Status.ONLINE);
    };

    const handleOffline = () => {
      setStatus(Status.OFFLINE);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setStatus]);

  useEffect(() => {
    if (status === Status.ONLINE) {
      setTimeout(() => {
        setStatus(Status.SAVED);
      }, 1000);
    }
  }, [status, setStatus]);

  return { status };
}

export default useStatus;
