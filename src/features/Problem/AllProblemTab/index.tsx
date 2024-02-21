import { useRouter } from "next/router";
import { trpc } from "~/utils";
import Problem from "./Problem";

function AllProblemTab() {
  const router = useRouter();
  const { labId, sectionId } = router.query;
  const tasks = trpc.front.getTasks.useQuery({
    labId: labId as string,
    sectionId: sectionId as string,
  });

  return (
    <div className="flex flex-col gap-4">
      {tasks?.isLoading && <div>Loading...</div>}
      {tasks?.data?.tasks.map(({ name, status, id, type }, i) => (
        <Problem
          key={id}
          id={id}
          name={name}
          order={i + 1}
          status={status}
          type={type}
        />
      ))}
    </div>
  );
}

export default AllProblemTab;
