import Button from "~/components/Common/Button";
import Skeleton from "~/components/Common/Skeleton";
import useTask from "./hooks/useTask";

interface Props {
  taskId: string;
}

function TypingTask({ taskId }: Props) {
  const {
    body,
    setBody,
    isLoading,
    isSaving,
    isAlreadySave,
    isOwner,
    handleOnSaveTyping,
  } = useTask({
    taskId,
  });

  return (
    <div className="my-2 mt-4 flex-1">
      {isLoading ? (
        <Skeleton width={"50%"} height={"10rem"} />
      ) : (
        <textarea
          placeholder="Type here..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={!isOwner}
          className="monospace min-h-[20rem] w-full rounded-md border-2 border-dashed border-sand-6 bg-transparent p-2 text-sand-12 outline-none focus:border-sand-10 focus:ring-transparent"
        />
      )}
      {isOwner && (
        <Button
          isLoading={isSaving}
          onClick={handleOnSaveTyping}
          disabled={isAlreadySave}
          className="mt-4 w-full rounded bg-sand-12 px-4 text-sm text-sand-1 active:bg-sand-11 md:w-fit"
          icon="solar:diskette-line-duotone"
        >
          Save
        </Button>
      )}
    </div>
  );
}

export default TypingTask;
