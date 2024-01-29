import CourseLayout from "~/layouts/CourseLayout";
import { useRouter } from "next/router";
import { AddCourseSchema, type TAddCourse } from "~/schemas/CourseSchema";
import Button from "~/components/Common/Button";
import DeleteAffect from "~/components/DeleteAffect";
import { getHighestRole, transformer, trpc } from "~/utils";
import Forms from "~/components/Forms";
import { useDeleteAffectStore } from "~/store";
import { TRPCClientError } from "@trpc/client";
import { callToast } from "~/services/callToast";
import { useSession } from "next-auth/react";
import type { GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/context";
import type { SearchValue } from "~/types";
import useGetUserByName from "~/hooks/useGetUserByName";

function Settings() {
  const { data: session } = useSession();
  const role = getHighestRole(session?.user?.roles ?? []);

  const isAdmin = role === "ADMIN";

  const [selectedObj, setSelectedObj] = useDeleteAffectStore((state) => [
    state.selectedObj,
    state.setSelectedObj,
  ]);
  const router = useRouter();
  const { courseId } = router.query;
  const {
    data: course,
    isLoading,
    refetch,
  } = trpc.courses.getCourseById.useQuery(
    {
      courseId: courseId as string,
    },
    {
      enabled: !!courseId,
    }
  );

  const queryUsers = useGetUserByName();
  const editCourseMutation = trpc.courses.updateCourse.useMutation();
  const editCourse = async (formData: TAddCourse) => {
    try {
      await editCourseMutation.mutateAsync({
        ...formData,
        courseId: courseId as string,
      });

      callToast({ msg: "Edit course successfully", type: "success" });
      await refetch();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        const errMsg = err.message;
        callToast({ msg: errMsg, type: "error" });
      }
    }
  };

  return (
    <>
      {selectedObj && <DeleteAffect type="course" />}

      <CourseLayout title={course?.name as string} isLoading={isLoading}>
        <div className="p-4 lg:w-1/2">
          <div className="w-full">
            <h4 className="text-xl text-sand-12">General</h4>
            <hr className="my-2" />

            <Forms
              isLoading={isLoading}
              confirmBtn={{
                title: "Edit Course",
                icon: "solar:pen-2-line-duotone",
              }}
              schema={AddCourseSchema}
              onSubmit={editCourse}
              fields={[
                {
                  label: "number",
                  title: "Number",
                  type: "text",
                  value: course?.number,
                },
                {
                  label: "name",
                  title: "Name",
                  type: "text",
                  value: course?.name,
                },
                {
                  label: "authors",
                  title: "Authors",
                  type: "multiple-search",
                  queryFn: queryUsers,
                  value: course?.authors.map(({ full_name, student_id }) => ({
                    label: full_name,
                    value: student_id,
                  })) as SearchValue[],
                },
                {
                  label: "note",
                  title: "Note",
                  type: "text",
                  value: course?.note ?? "",
                  optional: true,
                },
                {
                  label: "comments",
                  title: "Comments",
                  type: "textarea",
                  optional: true,
                  value: course?.comments ?? "",
                },
              ]}
            />
          </div>
          {isAdmin && (
            <div className="mt-10">
              <h4 className="text-xl text-red-9">Danger Zone</h4>
              <hr className="my-2" />
              <Button
                onClick={() =>
                  setSelectedObj({
                    selected: {
                      display: course?.name as string,
                      id: course?.id as number,
                    },
                    type: "course",
                  })
                }
                icon="solar:trash-bin-minimalistic-line-duotone"
                className="w-full bg-red-9 text-sand-1 shadow active:bg-red-11 lg:w-1/3"
              >
                Delete Course
              </Button>
            </div>
          )}
        </div>
      </CourseLayout>
    </>
  );
}

export default Settings;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const session = await getServerAuthSession({ req, res });
  const ip = req.headers["x-forwarded-for"] as string;
  const trpc = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session, ip }), // eslint here
    transformer,
  });
  const { courseId } = query;

  const role = getHighestRole(session?.user?.roles ?? []);

  if (role === "STUDENT" || !courseId) {
    return {
      notFound: true,
    };
  }

  const course = await trpc.courses.getCourseById.fetch({
    courseId: courseId as string,
  });

  if (!course) {
    return {
      notFound: true,
    };
  }

  return {
    props: {},
  };
};
