import Layout from "~/Layout";
import ModalWithButton from "~/components/Common/ModalWithButton";
import Forms from "~/components/Forms";
import { AddCourseSchema, type TAddCourse } from "~/schemas/CourseSchema";
import { Icon } from "@iconify/react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { getHighestRole, trpc } from "~/helpers";
import Skeleton from "~/components/Common/Skeleton";
import { TRPCClientError } from "@trpc/client";
import { callToast } from "~/services/callToast";
import { useSession } from "next-auth/react";
import type { SearchValue } from "~/types";
import { useInView } from "react-intersection-observer";
import { debounce } from "lodash";

function Courses() {
  const router = useRouter();
  const { data: session } = useSession();

  const role = getHighestRole(session?.user?.roles);

  const [searchString, setSearchString] = useState("");

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = trpc.courses.getCoursePagination.useInfiniteQuery(
    {
      limit: 8,
      search: searchString,
    },
    { enabled: false, getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchSection = useMemo(() => debounce(() => refetch(), 500), []);

  useEffect(() => {
    fetchSection();
  }, [searchString, fetchSection]);
  const authorUser = trpc.users.getAllUsersInRole.useQuery(
    {
      roles: ["ADMIN", "TEACHER"],
    },
    {
      enabled: role === "ADMIN",
    }
  );

  const addCourseMutation = trpc.courses.createCourse.useMutation();
  const addCourse = async (formData: TAddCourse) => {
    try {
      const course = await addCourseMutation.mutateAsync(formData);
      if (course) {
        callToast({
          msg: "Added course successfully",
          type: "success",
        });

        await router.push({
          pathname: router.pathname + "/[courseId]",
          query: { ...router.query, courseId: course.id },
        });
      }
    } catch (err) {
      if (err instanceof TRPCClientError) {
        const errMsg = err.message;
        callToast({ msg: errMsg, type: "error" });
      }
    }
  };

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      if (hasNextPage) {
        fetchNextPage();
      }
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return (
    <Layout title="courses">
      <div className="mb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {role === "ADMIN" && (
            <ModalWithButton
              title="Add Course"
              icon="solar:add-circle-line-duotone"
              className="max-h-[90%] overflow-y-auto md:w-[40rem]"
            >
              <Forms
                confirmBtn={{
                  title: "Add Course",
                  icon: "solar:add-circle-line-duotone",
                }}
                schema={AddCourseSchema}
                onSubmit={addCourse}
                fields={[
                  { label: "number", title: "Number", type: "text" },
                  {
                    label: "name",
                    title: "Name",
                    type: "text",
                  },
                  {
                    label: "authors",
                    title: "Authors",
                    type: "multiple-search",
                    options:
                      (authorUser.data?.map((user) => ({
                        label: user.full_name,
                        value: user.student_id,
                      })) as SearchValue[]) ?? [],
                  },
                  {
                    label: "note",
                    title: "Note",
                    type: "text",
                    optional: true,
                  },
                  {
                    label: "comments",
                    title: "Comments",
                    type: "textarea",
                    optional: true,
                  },
                ]}
              />
            </ModalWithButton>
          )}
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
      <div className="mb-10 mt-2 grid grid-cols-12 gap-6">
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
              page.courses.map(({ id, name, note, number, sections }) => {
                return (
                  <Link
                    key={id}
                    href={{
                      pathname: "/cms/courses/[courseId]",
                      query: { courseId: id },
                    }}
                    className="relative col-span-12 flex h-[12rem] flex-col justify-end overflow-hidden rounded-lg border border-sand-6 bg-sand-4 shadow-lg hover:bg-sand-5 md:col-span-4"
                  >
                    <div className="flex flex-col gap-2 p-2">
                      <div className="w-fit rounded-lg bg-lime-9 px-2 text-white">
                        {number}
                      </div>
                      <div>
                        <h4 className="text-xl font-medium text-sand-12">
                          {name}
                        </h4>
                        <div className="absolute right-2 top-2 flex w-fit items-center gap-1 rounded-lg bg-sand-7 px-1">
                          <Icon
                            icon="solar:user-hand-up-line-duotone"
                            className="text-lg"
                          />
                          <h6 className="text-sand-12">
                            <span className="font-bold">
                              {sections[0]?._count.students ?? 0}
                            </span>{" "}
                            students
                          </h6>
                        </div>
                        <h6 className="text-sand-10">
                          {note?.length === 0 ? "-" : note}
                        </h6>
                      </div>
                    </div>
                  </Link>
                );
              })
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
    </Layout>
  );
}

export default Courses;
