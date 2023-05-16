import CourseLayout from "@/Layout/CourseLayout";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/router";
import ModalWithButton from "@/components/Common/ModalWithButton";
import { AddSectionSchema, TAddSection } from "@/forms/SectionSchema";
import Forms from "@/components/Forms";
import { trpc } from "@/helpers";
import Toast from "@/components/Common/Toast";
import toast from "react-hot-toast";
import Skeleton from "@/components/Common/Skeleton";
import { TRPCClientError } from "@trpc/client";

function Sections() {
  const router = useRouter();

  const { courseId } = router.query;
  const course = trpc.courses.getCourseById.useQuery({
    id: parseInt(courseId as string),
  });

  const addSectionMutation = trpc.sections.createSection.useMutation();
  const addSection = async (formData: TAddSection & { courseId: number }) => {
    try {
      const section = await addSectionMutation.mutateAsync({
        ...formData,
        courseId: parseInt(courseId as string),
      });
      if (section) {
        toast.custom((t) => (
          <Toast {...t} msg="Added Section successfully" type="success" />
        ));
        router.push({
          pathname: router.pathname + "/[sectionId]",
          query: { ...router.query, sectionId: section.id },
        });
      }
    } catch (err) {
      if (err instanceof TRPCClientError) {
        const errMsg = err.message;
        toast.custom((t) => <Toast {...t} msg={errMsg} type="error" />);
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
  });
  return (
    <CourseLayout title={course.data?.name!} isLoading={course.isLoading}>
      <div className="my-4">
        <ModalWithButton
          title="Add Section"
          icon="solar:add-circle-line-duotone"
          className="md:w-[40rem] max-h-[90%] /overflow-y-auto"
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
      <div className="grid grid-cols-12 gap-6 mt-4">
        {sections.isLoading ? (
          <Skeleton width={"10rem"} height={"2rem"} />
        ) : (
          sections.data!.map(({ name, note, id, students }) => (
            <Link
              key={id}
              href={{
                pathname: "sections/[sectionId]",
                query: { ...router.query, sectionId: id },
              }}
              shallow={true}
              className="relative col-span-12 md:col-span-4 overflow-hidden border flex flex-col justify-end border-sand-6 h-[12rem] rounded-lg bg-sand-4 hover:bg-sand-5 shadow-lg"
            >
              <div className="flex flex-col gap-2 p-2">
                <div className="px-2 text-white rounded-lg bg-lime-9 w-fit">
                  {name}
                </div>
                <div>
                  <div className="absolute flex items-center px-1 rounded-lg w-fit bg-sand-7 right-2 top-2">
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
                    <h6 className="text-sand-10">{note}</h6>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </CourseLayout>
  );
}

export default Sections;
