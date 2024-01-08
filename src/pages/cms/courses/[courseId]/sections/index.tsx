import CourseLayout from "~/layouts/CourseLayout";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/router";
import ModalWithButton from "~/components/Common/ModalWithButton";
import { AddSectionSchema, type TAddSection } from "~/schemas/SectionSchema";
import Forms from "~/components/Forms";
import { convertToCompact, trpc } from "~/utils";
import Skeleton from "~/components/Common/Skeleton";
import { TRPCClientError } from "@trpc/client";
import { callToast } from "~/services/callToast";
import type { GetServerSideProps } from "next";
import { createTrpcHelper } from "~/utils/createTrpcHelper";
import { TRPCError } from "@trpc/server";
import Badge from "~/components/Common/Badge";
import { useInView } from "react-intersection-observer";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import Select from "~/components/Forms/Select";
import type { SectionType } from "@prisma/client";

function Sections() {
  const router = useRouter();

  const { courseId } = router.query;

  const course = trpc.courses.getCourseById.useQuery(
    {
      courseId: courseId as string,
    },
    {
      enabled: !!courseId,
    }
  );

  const addSectionMutation = trpc.sections.createSection.useMutation();
  const addSection = async (formData: TAddSection & { courseId: number }) => {
    try {
      const section = await addSectionMutation.mutateAsync({
        ...formData,
        courseId: courseId as string,
      });
      if (section) {
        callToast({ msg: "Added Section successfully", type: "success" });

        await router.push({
          pathname: router.pathname + "/[sectionId]",
          query: { ...router.query, sectionId: section.id },
        });
      }
    } catch (err) {
      if (err instanceof TRPCClientError) {
        const errMsg = err.message;
        callToast({ msg: errMsg, type: "error" });
      }
    }
  };

  const getAllSemester = trpc.semesters.getAllSemesters.useQuery();
  const authorUser = trpc.users.getAllUsersInRole.useQuery({
    roles: ["ADMIN", "TEACHER", "STUDENT"],
  });

  const allSemesters = trpc.semesters.getAllSemesters.useQuery();

  const [searchString, setSearchString] = useState("");
  const [semester, setSemester] = useState("Loading...");
  const [sectionStatus, setSectionStatus] = useState("All");
  const [sectionType, setSectionType] = useState("All")



  useEffect(() => {
    if (!!allSemesters.data) {
      setSemester(allSemesters.data[0] ?? "Loading...")
    }
  }, [allSemesters.data, setSemester])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchSection = useMemo(() => debounce(() => refetch(), 500), []);

  useEffect(() => {
    fetchSection();
  }, [searchString, fetchSection, semester, sectionStatus, sectionType]);

  const {
    isLoading,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = trpc.sections.getSectionPagination.useInfiniteQuery(
    {
      limit: 8,
      courseId: courseId as string,
      search: searchString,
      semester,
      status: sectionStatus,
      sectionType: sectionType as SectionType
    },
    {
      enabled: false,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      if (hasNextPage) {
        fetchNextPage();
      }
    }
  }, [inView, fetchNextPage, hasNextPage]);
  return (
    <CourseLayout
      title={course.data?.name as string}
      isLoading={course.isLoading}
    >
      <div className="my-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <ModalWithButton
            title="Add Section"
            icon="solar:add-circle-line-duotone"
            className="/overflow-y-auto max-h-[90%] md:w-[40rem]"
          >
            <Forms
              confirmBtn={{
                title: "Add Section",
                icon: "solar:add-circle-line-duotone",
              }}
              schema={AddSectionSchema}
              onSubmit={addSection}
              fields={[
                {
                  label: "semester",
                  title: "Semester",
                  type: "select",
                  options: getAllSemester.data,
                  emptyMsg: "You need to create a semester first",
                },
                { label: "name", title: "Name", type: "text" },
                {
                  label: "type",
                  title: "Type",
                  type: "select",
                  options: ["Lesson", "Exam"],
                  value: "Lesson",
                },
                {
                  label: "instructors",
                  title: "Instructors",
                  type: "multiple-search",
                  options:
                    authorUser.data?.map(({ full_name, student_id }) => ({
                      label: full_name,
                      value: student_id,
                    })) ?? [],
                },
                { label: "note", title: "Note", type: "text", optional: true },
                {
                  label: "closed_at",
                  title: "Close Date",
                  type: "dateTime",
                  optional: true,
                },
                {
                  label: "active",
                  title: "Active",
                  type: "checkbox",
                  optional: true,
                  value: true,
                },
              ]}
            />
          </ModalWithButton>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <Select options={["All", "Active", "Archive"]} className="flex-1 min-w-[8rem]" value={sectionStatus} preMessage="Status" onChange={setSectionStatus} />
            <Select options={["All", "Lesson", "Exam"]} className="flex-1 min-w-[8rem]" value={sectionType} preMessage="Type" onChange={setSectionType} />
            <Select options={allSemesters.data ?? []} className="flex-1 min-w-[12rem]" preMessage="Semester" value={semester} onChange={setSemester} />
            <div className="flex h-full w-full items-center gap-2 rounded-lg border border-sand-6 p-2 md:w-fit">
              <Icon icon="carbon:search" className="text-sand-10" />
              <input
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
                className="w-full bg-transparent text-sand-12 outline-none placeholder:text-sand-8"
                placeholder="Search"
              />
            </div>
          </div>
        </div>

      </div>

      <div className="mt-4 grid grid-cols-12 gap-6">
        {isLoading
          ? new Array(6)
            .fill(0)
            .map((_, i) => (
              <Skeleton
                key={i}
                height={"12rem"}
                className="col-span-12 md:col-span-4"
              />
            ))
          : data?.pages.map((page) =>
            page.sections.map(
              ({ name, semester, note, id, _count, type }) => (
                <Link
                  key={id}
                  href={{
                    pathname: "sections/[sectionId]",
                    query: { ...router.query, sectionId: id },
                  }}
                  shallow={true}
                  className="relative col-span-12 flex h-[12rem] flex-col justify-end overflow-hidden rounded-lg border border-sand-6 bg-sand-4 shadow-lg hover:bg-sand-5 md:col-span-4"
                >
                  <div className="flex flex-col gap-2 p-2">
                    <div className="flex gap-1">
                      <Badge type="success">{`${semester.term} ${semester.year}`}</Badge>
                      <Badge type="info">{type}</Badge>
                    </div>
                    <h4 className="text-xl font-medium text-sand-12">
                      {name}
                    </h4>

                    <div>
                      <div className="absolute right-2 top-2 flex w-fit items-center rounded-lg bg-sand-7 px-1">
                        <Icon
                          icon="solar:user-hand-up-line-duotone"
                          className="text-lg"
                        />
                        <h6 className="text-sand-12">
                          <span className="font-bold">
                            {convertToCompact(_count.students)}
                          </span>{" "}
                          student{_count.students > 1 ? "s" : ""}
                        </h6>
                      </div>
                      <div className="min-h-[1.5rem]">
                        <h6 className="text-sand-10">
                          {note?.length === 0 ? "-" : note}
                        </h6>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            )
          )}
      </div>

      <div ref={ref} className="my-10 flex items-center justify-center gap-2">
        {isFetchingNextPage && (
          <>
            <div className="h-2 w-2 animate-ping rounded-full bg-green-9"></div>
            <h4>Loading</h4>
          </>
        )}
      </div>
    </CourseLayout>
  );
}

export default Sections;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const { helper } = await createTrpcHelper({ req, res });
  const { courseId } = query;

  try {
    await helper.courses.getCourseById.fetch({
      courseId: courseId as string,
    });
  } catch (err) {
    if (err instanceof TRPCError) {
      if (err.message === "NOT_FOUND") {
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
