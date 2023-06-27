import SectionLayout from "~/Layout/SectionLayout";
import { getHighestRole, sanitizeFilename, trpc } from "~/helpers";
import { useRouter } from "next/router";
import Skeleton from "~/components/Common/Skeleton";
import ProgressIndicator from "~/components/Common/ProgressIndicator";
import { Icon } from "@iconify/react";
import { useState } from "react";
import Modal from "~/components/Common/Modal";
import Collapse from "~/components/Common/Collapse";
import Stats from "~/components/Typing/Stats";
import { getDuration } from "~/components/Typing/utils/getDuration";
import type { submission_type } from "@prisma/client";
import { useSession } from "next-auth/react";
import type { GetServerSideProps } from "next";
import { createTrpcHelper } from "~/helpers/createTrpcHelper";
import { TRPCError } from "@trpc/server";

interface RecentTaskProps {
  selectedUser: {
    fullName: string;
    studentId: string;
    taskStatus: submission_type[];
  };
  sectionId: string;
  labId: number;
  onClose: () => void;
}
const RecentTasks = ({
  selectedUser,
  sectionId,
  labId,

  onClose,
}: RecentTaskProps) => {
  const { fullName, studentId, taskStatus } = selectedUser;

  const tasks = trpc.tasks.getUserTaskStatus.useQuery(
    {
      student_id: selectedUser.studentId,
      sectionId,
      labId,
    },
    { refetchOnWindowFocus: false, enabled: !!sectionId && !!labId }
  );

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
          <h5 className="font-medium">{fullName}</h5>
          <h6 className="text-sm">{studentId}</h6>
        </div>
        <ProgressIndicator
          className="md:justify-end"
          tasksStatus={taskStatus}
        />
      </div>
      {tasks.isLoading ? (
        <>
          <Skeleton width="100%" height="3rem" className="my-2" />
          <Skeleton width="100%" height="3rem" className="my-2" />
          <Skeleton width="100%" height="3rem" className="my-2" />
          <Skeleton width="100%" height="3rem" className="my-2" />
        </>
      ) : (tasks.data?.length as number) > 0 ? (
        tasks.data?.map(({ name, history }) => (
          <Collapse key={name} title={name}>
            {history ? (
              <Stats
                adjustedSpeed={history.adjusted_speed ?? 0}
                duration={getDuration(
                  history.started_at as Date,
                  history.ended_at as Date
                )}
                errorPercentage={history.percent_error ?? 0}
                rawSpeed={history.raw_speed ?? 0}
              />
            ) : null}
          </Collapse>
        ))
      ) : (
        <div className="my-[25%] flex flex-col items-center justify-center gap-2">
          <Icon className="text-4xl" icon="solar:ghost-smile-line-duotone" />
          <h4 className="text-lg">No Submissions Yet</h4>
        </div>
      )}
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
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { sectionId } = router.query;

  const isTA = getHighestRole(session?.user?.roles) === "STUDENT";

  const lab = trpc.labs.getLabStatus.useQuery(
    {
      sectionId: sectionId as string,
      labId,
    },
    { refetchOnWindowFocus: false, enabled: !!sectionId && !!labId }
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

  const [selectedUser, setSelectedUser] = useState<{
    fullName: string;
    studentId: string;
    taskStatus: submission_type[];
  } | null>(null);

  return (
    <>
      {selectedUser !== null && (
        <RecentTasks
          {...{ selectedUser, labId }}
          sectionId={sectionId as string}
          onClose={() => setSelectedUser(null)}
        />
      )}
      <Collapse
        title={name}
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
            {!isTA && (
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 rounded-lg bg-sand-12 px-2 py-1 text-sand-1 shadow active:bg-sand-11"
              >
                <Icon icon="solar:document-text-line-duotone" />
                Export as CSV
              </button>
            )}
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
                <div className="flex w-full flex-wrap items-center">
                  <div className="flex w-full flex-1 items-center gap-4">
                    <div>
                      <h5 className="font-medium">{full_name}</h5>
                      <h6 className="text-sm">{student_id}</h6>
                    </div>
                    <button
                      onClick={() =>
                        setSelectedUser({
                          fullName: full_name,
                          studentId: student_id,
                          taskStatus,
                        })
                      }
                      className="flex h-7 w-7 items-center gap-2 rounded border p-1 text-xl text-sand-12"
                    >
                      <Icon
                        icon="solar:eye-line-duotone"
                        className={isLoading ? "animate-spin" : undefined}
                      />
                    </button>
                  </div>

                  <ProgressIndicator
                    tasksStatus={taskStatus ?? []}
                    className="mt-4 md:mt-0 md:justify-end"
                  />
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

  const section = trpc.sections.getSectionById.useQuery(
    {
      id: sectionId as string,
    },
    {
      enabled: !!sectionId,
    }
  );

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

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const { helper, user } = await createTrpcHelper({ req, res });
  const { full_name } = user;
  const { courseId, sectionId } = query;

  try {
    await helper.courses.getCourseById.fetch({
      id: courseId as string,
    });
    const section = await helper.sections.getSectionById.fetch({
      id: sectionId as string,
    });

    if (
      !section?.instructors
        .map((user) => user.full_name)
        .includes(full_name as string)
    ) {
      return {
        notFound: true,
      };
    }
  } catch (err) {
    if (err instanceof TRPCError) {
      if (err.code === "UNAUTHORIZED") {
        return {
          notFound: true,
        };
      }
    }
  }

  return {
    props: {},
  };
};
