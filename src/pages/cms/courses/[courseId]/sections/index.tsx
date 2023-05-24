import CourseLayout from "~/Layout/CourseLayout";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/router";
import ModalWithButton from "~/components/Common/ModalWithButton";
import { AddSectionSchema, type TAddSection } from "~/forms/SectionSchema";
import Forms from "~/components/Forms";
import { trpc } from "~/helpers";
import Skeleton from "~/components/Common/Skeleton";
import { TRPCClientError } from "@trpc/client";
import { callToast } from "~/services/callToast";

function Sections() {
  const router = useRouter();

  const { courseId } = router.query;
  const courseIdAsNumber = parseInt(courseId as string);
  const course = trpc.courses.getCourseById.useQuery({
    id: courseIdAsNumber,
  });

  const addSectionMutation = trpc.sections.createSection.useMutation();
  const addSection = async (formData: TAddSection & { courseId: number }) => {
    try {
      const section = await addSectionMutation.mutateAsync({
        ...formData,
        courseId: parseInt(courseId as string),
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
    roles: ["ADMIN", "TEACHER"],
  });
  const TAUsers = trpc.users.getAllUsersInRole.useQuery({
    roles: ["STUDENT"],
  });
  const sections = trpc.sections.getSectionPagination.useQuery({
    page: 1,
    limit: 10,
    courseId: courseIdAsNumber,
  });
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
              },
              { label: "name", title: "Name", type: "text" },
              {
                label: "instructors",
                title: "Instructors",
                type: "multiple-search",
                options: authorUser.data?.map((user) => user.full_name) ?? [],
              },
              {
                label: "tas",
                title: "TA (s)",
                type: "multiple-search",
                optional: true,
                options: TAUsers.data?.map((user) => user.full_name) ?? [],
                value: [],
              },
              { label: "note", title: "Note", type: "text", optional: true },
            ]}
          />
        </ModalWithButton>
      </div>
      <div className="mt-4 grid grid-cols-12 gap-6">
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
          : sections.data?.map(({ name, note, id, students }) => (
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
                  <div className="w-fit rounded-lg bg-lime-9 px-2 text-white">
                    {name}
                  </div>
                  <div>
                    <div className="absolute right-2 top-2 flex w-fit items-center rounded-lg bg-sand-7 px-1">
                      <Icon
                        icon="solar:user-hand-up-line-duotone"
                        className="text-lg"
                      />
                      <h6 className="text-sand-12">
                        <span className="font-bold">{students.length}</span>{" "}
                        student{students.length > 1 ? "s" : ""}
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
    </CourseLayout>
  );
}

export default Sections;
