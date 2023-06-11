import SectionLayout from "~/Layout/SectionLayout";
import { sanitizeFilename, trpc } from "~/helpers";
import { useRouter } from "next/router";
import Skeleton from "~/components/Common/Skeleton";
import ProgressIndicator from "~/components/Common/ProgressIndicator";
import { Icon } from "@iconify/react";
import { useState } from "react";
import Modal from "~/components/Common/Modal";
import Collapse from "~/components/Common/Collapse";

interface RecentTaskProps {
  selectedUser: string | null;
  onClose: () => void;
}
const RecentTasks = ({ selectedUser, onClose }: RecentTaskProps) => {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  return (
    <Modal
      title="Recent submissions"
      className="h-full max-h-[80%] max-w-[50rem]"
      onClose={onClose}
      isOpen
    >
      <div className="my-4 flex items-center gap-2">
        <div className="p-2">
          <Icon className="text-xl" icon="solar:user-line-duotone" />
        </div>
        <div className="flex-1">
          <h5 className="font-medium">Sornchai Somsakul</h5>
          <h6 className="text-sm">6510405814</h6>
        </div>
        <ProgressIndicator tasksStatus={["NOT_SUBMITTED"]} />
      </div>
      <Collapse
        title="Task01"
        isOpen={selectedTask === "task01"}
        onClick={() => setSelectedTask(null)}
      ></Collapse>
    </Modal>
  );
};

const LabStatus = ({
  name,
  labId,
  sectionName,
}: {
  name: string;
  labId: number;
  sectionName: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { sectionId } = router.query;
  const sectionIdInt = parseInt(sectionId as string);

  const lab = trpc.labs.getLabStatus.useQuery(
    {
      sectionId: sectionIdInt,
      labId,
    },
    { refetchOnWindowFocus: false }
  );

  const handleOnRefresh = async () => {
    try {
      setIsLoading(true);
      await lab.refetch();
      setIsLoading(false);
    } catch (err) {}
  };

  const exportCSV = () => {
    let csvString = "Student Id,";

    const length = lab.data?.taskLength ?? 0;

    new Array(length).fill("").forEach((_, i) => {
      csvString += `${(i + 1).toString().padStart(2, "0")} passed`;
      if (i !== length - 1) {
        csvString += ",";
      }
    });

    csvString += "\n";

    lab.data?.usersTaskStatus.forEach(({ student_id, taskStatus }) => {
      csvString += `${student_id},`;
      taskStatus.forEach((status, i) => {
        let _status = 0;

        if (status === "PASSED") {
          _status = 1;
        }

        csvString += `${_status}`;

        if (i !== length - 1) {
          csvString += ",";
        }
      });
      csvString += "\n";
    });
    const csvBlob = new Blob([csvString], { type: "text/csv" });
    const fileName = sanitizeFilename(`${sectionName}_${name}_status.csv`);
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(csvBlob);
    link.download = fileName;
    link.click();
  };

  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  return (
    <>
      {selectedUser !== null && (
        <RecentTasks
          {...{ selectedUser }}
          onClose={() => setSelectedUser(null)}
        />
      )}
      <Collapse
        title={name}
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        titleBtn={
          <>
            <button
              onClick={handleOnRefresh}
              className="flex items-center gap-2 rounded border p-1 text-lg text-sand-12"
            >
              <Icon
                icon="solar:refresh-line-duotone"
                className={isLoading ? "animate-spin" : undefined}
              />
            </button>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 rounded-lg bg-sand-12 px-2 py-1 text-sand-1 shadow active:bg-sand-11"
            >
              <Icon icon="solar:document-text-line-duotone" />
              Export as CSV
            </button>
          </>
        }
      >
        {lab.isLoading || isLoading ? (
          <>
            <Skeleton width="100%" height="3rem" className="my-2" />
            <Skeleton width="100%" height="3rem" className="my-2" />
            <Skeleton width="100%" height="3rem" className="my-2" />
            <Skeleton width="100%" height="3rem" className="my-2" />
          </>
        ) : (
          lab.data?.usersTaskStatus?.map(
            ({ full_name, student_id, taskStatus }) => (
              <div key={student_id}>
                <div className="flex w-full items-center">
                  <div className="flex w-full flex-1 items-center gap-4">
                    <div>
                      <h5 className="font-medium">{full_name}</h5>
                      <h6 className="text-sm">{student_id}</h6>
                    </div>
                    <button
                      onClick={() => setSelectedUser(student_id)}
                      className="flex h-7 w-7 items-center gap-2 rounded border p-1 text-xl text-sand-12"
                    >
                      <Icon
                        icon="solar:eye-line-duotone"
                        className={isLoading ? "animate-spin" : undefined}
                      />
                    </button>
                  </div>

                  <ProgressIndicator tasksStatus={taskStatus ?? []} />
                </div>
                <hr className="my-2" />
              </div>
            )
          )
        )}
      </Collapse>
    </>
  );
};

function LabsStatus() {
  const router = useRouter();

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
            <Skeleton width="100%" height="4rem" className="my-4 p-4" />
            <Skeleton width="100%" height="4rem" className="my-4 p-4" />
            <Skeleton width="100%" height="4rem" className="my-4 p-4" />
          </>
        ) : (
          section.data?.labs.map(({ name, id }) => (
            <LabStatus
              key={name}
              name={name}
              labId={id}
              sectionName={section.data?.name as string}
            />
          ))
        )}
      </div>
    </SectionLayout>
  );
}

export default LabsStatus;
