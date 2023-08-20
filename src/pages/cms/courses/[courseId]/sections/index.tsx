import CourseLayout from "~/Layout/CourseLayout";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/router";
import ModalWithButton from "~/components/Common/ModalWithButton";
import { AddSectionSchema, type TAddSection } from "~/schemas/SectionSchema";
import Forms from "~/components/Forms";
import { trpc } from "~/helpers";
import Skeleton from "~/components/Common/Skeleton";
import { TRPCClientError } from "@trpc/client";
import { callToast } from "~/services/callToast";
import type { GetServerSideProps } from "next";
import { createTrpcHelper } from "~/helpers/createTrpcHelper";
import { TRPCError } from "@trpc/server";
import Badge from "~/components/Common/Badge";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

function Sections() {
  const router = useRouter();

  const { courseId } = router.query;

  const course = trpc.courses.getCourseById.useQuery(
    {
      id: courseId as string,
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

  const { isLoading, data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    trpc.sections.getSectionPagination.useInfiniteQuery(
      {
        limit: 8,
        courseId: courseId as string,
      },
      {
        enabled: !!courseId,
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
                label: "active",
                title: "Active",
                type: "checkbox",
                optional: true,
                value: true,
              },
            ]}
          />
        </ModalWithButton>
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
              page.sections.map(({ name, type, note, id, _count }) => (
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
                    <div className="flex gap-2">
                      <Badge type="success">{name}</Badge>
                      <Badge type="info">{type}</Badge>
                    </div>

                    <div>
                      <div className="absolute right-2 top-2 flex w-fit items-center rounded-lg bg-sand-7 px-1">
                        <Icon
                          icon="solar:user-hand-up-line-duotone"
                          className="text-lg"
                        />
                        <h6 className="text-sand-12">
                          <span className="font-bold">{_count.students}</span>{" "}
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
              ))
            )}
      </div>
      {/* Todo add archived sections */}
      {/* <div className="mt-10">
        <h2 className="text-2xl font-semibold">Archived</h2>
        <div className="grid grid-cols-12 gap-6 mt-4">
          {sections.isLoading
            ? new Array(6)
                .fill(0)
                .map((_, i) => (
                  <Skeleton
                    key={i}
                    height={"12rem"}
                    className="col-span-12 md:col-span-4"
                  />
                ))
            : sections.data?.map(({ name, type, note, id, _count }) => (
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
                    <div className="flex gap-2">
                      <Badge type="success">{name}</Badge>
                      <Badge type="info">{type}</Badge>
                    </div>

                    <div>
                      <div className="absolute flex items-center px-1 rounded-lg right-2 top-2 w-fit bg-sand-7">
                        <Icon
                          icon="solar:user-hand-up-line-duotone"
                          className="text-lg"
                        />
                        <h6 className="text-sand-12">
                          <span className="font-bold">{_count.students}</span>{" "}
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
              ))}
        </div>
      </div> */}
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
      id: courseId as string,
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
