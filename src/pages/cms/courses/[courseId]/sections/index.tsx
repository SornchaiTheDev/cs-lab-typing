import CourseLayout from "@/Layout/CourseLayout";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetStaticProps } from "next";
import ModalWithButton from "@/components/Common/ModalWithButton";
import { AddSectionSchema, TAddSection } from "@/forms/SectionSchema";
import { generatePerson } from "@/helpers";
import Forms from "@/components/Forms";

interface Props {
  course: {
    id: string;
    name: string;
  };
}

function Sections({ course }: Props) {
  const router = useRouter();

  const addSection = (formData: TAddSection) => {
    const { name, note, instructors, semester } = formData;
  };

  return (
    <CourseLayout title={course.name}>
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
                options: ["2566/FIRST", "2566/SECOND", "2566/SUMMER"],
              },
              { label: "name", title: "Name", type: "text" },
              {
                label: "instructors",
                title: "Instructors",
                type: "multiple",
                options: generatePerson(100),
              },
              { label: "note", title: "Note", type: "text", optional: true },
            ]}
          />
        </ModalWithButton>
      </div>
      <div className="grid grid-cols-12 gap-6 mt-4">
        {new Array(10).fill(0).map((_, i) => (
          <Link
            key={i}
            href={{
              pathname: "sections/[sectionId]",
              query: { ...router.query, sectionId: 1 },
            }}
            shallow={true}
            className="relative col-span-12 md:col-span-4 overflow-hidden border flex flex-col justify-end border-sand-6 h-[12rem] rounded-lg bg-sand-4 hover:bg-sand-5 shadow-lg"
          >
            <div className="flex flex-col gap-2 p-2">
              <div className="px-2 text-white rounded-lg bg-lime-9 w-fit">
                12 (F 15 - 17)
              </div>
              <div>
                <div className="absolute flex items-center px-1 rounded-lg w-fit bg-sand-7 right-2 top-2">
                  <Icon
                    icon="solar:user-hand-up-line-duotone"
                    className="text-lg"
                  />
                  <h6 className="text-sand-12">
                    <span className="font-bold">18</span> students
                  </h6>
                </div>
                <h6 className="text-sand-10">
                  Lorem ipsum dolor sit amet consectetur
                </h6>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </CourseLayout>
  );
}

export default Sections;

export const getStaticProps: GetStaticProps<Props> = () => {
  return {
    props: {
      course: {
        id: "01418112",
        name: "Fundamental Programming Concept",
      },
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
