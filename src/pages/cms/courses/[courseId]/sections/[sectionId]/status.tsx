import SectionLayout from "~/Layout/SectionLayout";
import { createColumnHelper } from "@tanstack/react-table";
import { trpc } from "~/helpers";
import { useRouter } from "next/router";
import type { users } from "@prisma/client";
import Skeleton from "~/components/Common/Skeleton";
import ProgressIndicator from "~/components/Common/ProgressIndicator";
import { Icon } from "@iconify/react";
import { useState } from "react";

const LabStatus = ({ name, labId }: { name: string; labId: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { sectionId } = router.query;
  const sectionIdInt = parseInt(sectionId as string);

  const users = trpc.labs.getLabStatus.useQuery({
    sectionId: sectionIdInt,
    labId,
  });

  const handleOnRefresh = async () => {
    try {
      setIsLoading(true);
      await users.refetch();
      setIsLoading(false);
    } catch (err) {}
  };

  return (
    <div className="p-4 my-4 bg-white rounded-md shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-xl font-semibold">{name}</h4>
          {isOpen && (
            <button
              onClick={handleOnRefresh}
              className="flex items-center gap-2 p-1 text-lg border rounded text-sand-12"
            >
              <Icon
                icon="solar:refresh-line-duotone"
                className={isLoading ? "animate-spin" : undefined}
              />
            </button>
          )}
        </div>

        <button
          className="p-2 rounded-full hover:bg-sand-4"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Icon
            icon={
              isOpen
                ? "solar:alt-arrow-up-line-duotone"
                : "solar:alt-arrow-down-line-duotone"
            }
          />
        </button>
      </div>
      {isOpen && (
        <div className="mt-4">
          {users.isLoading || isLoading ? (
            <>
              <Skeleton width="100%" height="3rem" className="my-2" />
              <Skeleton width="100%" height="3rem" className="my-2" />
              <Skeleton width="100%" height="3rem" className="my-2" />
              <Skeleton width="100%" height="3rem" className="my-2" />
            </>
          ) : (
            users.data?.map(({ full_name, student_id, taskStatus }) => (
              <div key={student_id}>
                <div className="flex items-center w-full">
                  <div className="flex-1 w-full">
                    <h5 className="font-medium">{full_name}</h5>
                    <h6 className="text-sm">{student_id}</h6>
                  </div>

                  <ProgressIndicator
                    tasksStatus={taskStatus?.concat(taskStatus).concat(taskStatus) ?? []}
                  />
                </div>
                <hr className="my-2" />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

function LabsStatus() {
  const router = useRouter();
  const columnHelper = createColumnHelper<users>();

  const { sectionId } = router.query;
  const sectionIdInt = parseInt(sectionId as string);
  const section = trpc.sections.getSectionById.useQuery({
    id: sectionIdInt,
  });

  return (
    <SectionLayout
      title={section.data?.name as string}
      isLoading={section.isLoading}
    >
      <div className="p-4">
        {section.isLoading ? (
          <>
            <Skeleton width="100%" height="4rem" className="p-4 my-4" />
            <Skeleton width="100%" height="4rem" className="p-4 my-4" />
            <Skeleton width="100%" height="4rem" className="p-4 my-4" />
          </>
        ) : (
          section.data?.labs.map(({ name, id }) => (
            <LabStatus key={name} name={name} labId={id} />
          ))
        )}
      </div>
    </SectionLayout>
  );
}

export default LabsStatus;
