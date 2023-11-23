import SectionLayout from "~/Layout/SectionLayout";
import { getHighestRole, sanitizeFilename, trpc } from "~/helpers";
import { useRouter } from "next/router";
import Skeleton from "~/components/Common/Skeleton";
import ProgressIndicator from "~/components/Common/ProgressIndicator";
import { Icon } from "@iconify/react";
import { useState } from "react";
import Modal from "~/components/Common/Modal";
import Collapse from "~/components/Common/Collapse";
import { getDuration } from "~/components/Typing/utils/getDuration";
import type { SectionType, submission_type } from "@prisma/client";
import { useSession } from "next-auth/react";
import type { GetServerSideProps } from "next";
import { createTrpcHelper } from "~/helpers/createTrpcHelper";
import { TRPCError } from "@trpc/server";
import LineChart from "~/components/Typing/Datas/LineChart";
import TypingTable from "~/components/Typing/Datas/Table";
import type { PaginationState } from "@tanstack/react-table";
import { callToast } from "~/services/callToast";
import BestScoreStats from "~/components/Typing/BestScoreStats";
import { twMerge } from "tailwind-merge";

interface TypingSubmissionProps {
  sectionId: string;
  taskId: number;
  labId: number;
  studentId: string;
}
const TypingSubmissions = ({
  sectionId,
  taskId,
  labId,
  studentId,
}: TypingSubmissionProps) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 6,
  });
  const typingHistories = trpc.tasks.getTypingHistory.useQuery(
    {
      sectionId,
      taskId,
      labId,
      studentId,
    },
    {
      enabled: !!sectionId && !!taskId && !!labId,
    }
  );

  return (
    <>
      <div className="h-[10rem] w-full">
        <LineChart datas={typingHistories.data?.submissions ?? []} />
      </div>

      <TypingTable
        type={typingHistories.data?.section?.type ?? "Lesson"}
        isLoading={typingHistories.isLoading}
        datas={typingHistories.data?.submissions ?? []}
        onPaginationChange={setPagination}
        highestScore={typingHistories.data?.highestScore ?? null}
        {...{ pagination }}
      />
    </>
  );
};
interface RecentTaskProps {
  selectedUser: {
    fullName: string;
    studentId: string;
    taskStatus: submission_type[];
  };
  sectionId: string;
  sectionType: SectionType;
  labId: number;
  onClose: () => void;
}
const RecentTasks = ({
  selectedUser,
  sectionId,
  labId,
  onClose,
  sectionType,
}: RecentTaskProps) => {
  const { fullName, studentId, taskStatus } = selectedUser;

  const tasks = trpc.tasks.getUserTaskStatus.useQuery(
    {
      student_id: studentId,
      sectionId,
      labId,
    },
    { enabled: !!sectionId && !!labId }
  );

  return (
    <Modal
      title="Recent submissions"
      className="h-full max-h-[80%] max-w-[50rem] overflow-y-auto"
      onClose={onClose}
      isOpen
    >
      <div className="my-4 flex items-center gap-2 text-sand-12">
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
        tasks.data?.map(({ name, history, id }) => {
          if (history) {
            return (
              <Collapse key={name} title={name}>
                <h4 className="mb-2 text-center text-lg font-bold">
                  Best Score
                </h4>
                <BestScoreStats
                  adjustedSpeed={history.adjusted_speed ?? 0}
                  duration={getDuration(
                    history.started_at as Date,
                    history.ended_at as Date
                  )}
                  errorPercentage={history.percent_error ?? 0}
                  rawSpeed={history.raw_speed ?? 0}
                  score={sectionType === "Lesson" ? undefined : history.score}
                />
                <TypingSubmissions
                  {...{ sectionId, labId, taskId: id, studentId }}
                />
              </Collapse>
            );
          }
        })
      ) : (
        <div className="my-[25%] flex flex-col items-center justify-center gap-2 text-sand-12">
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
  sectionType,
}: {
  name: string;
  labId: number;
  sectionName: string;
  sectionType: SectionType;
}) => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingTasks, setIsFetchingTasks] = useState(false);

  const router = useRouter();
  const { sectionId } = router.query;

  const isTA = getHighestRole(session?.user?.roles ?? []) === "STUDENT";

  const lab = trpc.labs.getLabStatus.useQuery(
    {
      sectionId: sectionId as string,
      labId,
    },
    { enabled: !!sectionId && !!labId && isOpen }
  );

  const submissions = trpc.labs.getLabTaskSubmissions.useQuery(
    { sectionId: sectionId as string, labId: labId },
    { enabled: false }
  );

  const handleOnRefresh = async () => {
    try {
      setIsLoading(true);
      await lab.refetch();
      await submissions.refetch();

      setIsLoading(false);
    } catch (err) {
      if (err instanceof TRPCError) {
        callToast({ type: "error", msg: err.message });
      }
    }
  };

  const exportCSV = async () => {
    try {
      setIsFetchingTasks(true);
      const { data } = await submissions.refetch();
      if (!data) throw new Error("SOMETHING_WENT_WRONG");
      let csvString = "Student Id,Task Id,Raw Speed,Adjusted Speed,Error %";
      if (sectionType === "Exam") {
        csvString += ",Score";
      }
      csvString += "\n";
      data.tasks.map((task) =>
        task.map(
          ({
            student_id,
            raw_speed,
            adjusted_speed,
            percent_error,
            score,
            task_id,
          }) => {
            csvString += `${student_id},${task_id},${raw_speed},${adjusted_speed},${percent_error}`;
            if (sectionType === "Exam") {
              csvString += `,${score}`;
            }
            csvString += "\n";
          }
        )
      );
      const csvBlob = new Blob([csvString], { type: "text/csv" });
      const fileName = sanitizeFilename(`${sectionName}_${name}_status`);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(csvBlob);
      link.download = fileName;
      link.click();
    } catch (err) {
      if (err instanceof TRPCError || err instanceof Error) {
        callToast({ type: "error", msg: err.message });
      }
    }
    setIsFetchingTasks(false);
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
          {...{ selectedUser, labId, sectionType }}
          sectionId={sectionId as string}
          onClose={() => setSelectedUser(null)}
        />
      )}
      <Collapse
        onChange={setIsOpen}
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
                disabled={isFetchingTasks}
                className={twMerge(
                  "flex items-center gap-2 rounded-lg bg-sand-12 px-2 py-1 text-sand-1 shadow active:bg-sand-11",
                  isFetchingTasks && "cursor-not-allowed opacity-40"
                )}
              >
                <Icon
                  icon={
                    isFetchingTasks
                      ? "line-md:loading-twotone-loop"
                      : "solar:document-text-line-duotone"
                  }
                />
                {isFetchingTasks ? "Exporting..." : "Export as CSV"}
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
      sectionId: sectionId as string,
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
              sectionType={section.data?.type as SectionType}
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
  const { helper } = await createTrpcHelper({ req, res });

  const { courseId, sectionId } = query;

  try {
    await helper.courses.getCourseById.fetch({
      courseId: courseId as string,
    });
    await helper.sections.getSectionById.fetch({
      sectionId: sectionId as string,
    });
  } catch (err) {
    if (err instanceof TRPCError) {
      return {
        notFound: true,
      };
    }
  }

  return {
    props: {},
  };
};
