import CourseLayout from "@/Layout/CourseLayout";
import { Icon } from "@iconify/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GetStaticProps } from "next";
import ModalWithButton from "@/components/Common/ModalWithButton";
import { useForm } from "react-hook-form";
import { AddSectionSchema, TAddSection } from "@/forms/AddSection";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/Common/Input";
import Multiple from "@/components/Search/Multiple";
import Button from "@/components/Common/Button";
import Select from "@/components/Common/Select";
import { semesters } from "@/__mock__";

interface Props {
  course: {
    id: string;
    name: string;
  };
}

function Sections({ course }: Props) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<TAddSection>({
    resolver: zodResolver(AddSectionSchema),
  });

  const [instructors, setInstructors] = useState<string[]>([]);
  const [isInstructorsError, setIsInstructorsError] = useState(false);
  const [semester, setSemester] = useState<string | null>(null);
  const [isSemesterError, setIsSemesterError] = useState(false);

  const addSection = (formData: TAddSection) => {
    const { name, note } = formData;
  };

  useEffect(() => {
    if (isSubmitted) {
      if (instructors.length === 0) setIsInstructorsError(true);
      else setIsInstructorsError(false);

      if (!semester) setIsSemesterError(true);
      else setIsSemesterError(false);
    }
  }, [instructors, semester, isSubmitted]);

  return (
    <CourseLayout title={course.name}>
      <div className="my-4">
        <ModalWithButton
          title="Add Section"
          icon="solar:add-circle-line-duotone"
          className="md:w-[40rem] max-h-[90%] /overflow-y-auto"
          confirmBtn={{
            title: "Add Section",
            icon: "solar:add-circle-line-duotone",
            onClick: () => {},
          }}
        >
          <form
            className="flex flex-col gap-2"
            onSubmit={handleSubmit(addSection)}
          >
            <Select
              options={semesters}
              title="Semester"
              value={semester}
              onChange={setSemester}
              isError={isSemesterError}
              error="Semester cannot be empty"
            />
            <Input
              title="Name"
              label="name"
              register={register}
              error={errors.name && errors.name.message}
              isError={errors.name !== undefined}
              className="flex-1"
            />

            <Multiple
              title="Instructors"
              value={setInstructors}
              isError={isInstructorsError}
              error="Instructors cannot be empty"
            />
            <Input title="Note" label="note" register={register} optional />
          </form>
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
