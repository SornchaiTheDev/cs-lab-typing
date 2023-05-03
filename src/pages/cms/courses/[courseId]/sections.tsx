import CourseLayout from "@/Layout/CourseLayout";
import { Icon } from "@iconify/react";
import Link from "next/link";
import React, { useState } from "react";
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

const semesters = [
  "2023 First",
  "2023 Second",
  "2023 Summer",
  "2024 First",
  "2024 Second",
  "2024 Summer",
  "2025 First",
  "2025 Second",
  "2025 Summer",
  "2026 First",
  "2026 Second",
  "2026 Summer",
  "2027 First",
  "2027 Second",
  "2027 Summer",
  "2028 First",
  "2028 Second",
  "2028 Summer",
  "2029 First",
  "2029 Second",
  "2029 Summer",
  "2030 First",
  "2030 Second",
  "2030 Summer",
  "2031 First",
  "2031 Second",
  "2031 Summer",
  "2032 First",
  "2032 Second",
  "2032 Summer",
  "2033 First",
  "2033 Second",
  "2033 Summer",
];

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
    formState: { errors },
  } = useForm<TAddSection>({
    resolver: zodResolver(AddSectionSchema),
  });

  const addSection = () => {};

  const [instructors, setInstructors] = useState<string[]>([]);
  const [isInstructorsError, setIsInstructorsError] = useState(false);
  const [semester, setSemester] = useState<string>("2023 First");

  return (
    <CourseLayout title={course.name}>
      <div className="my-4">
        <ModalWithButton
          title="Add Section"
          icon="solar:add-circle-line-duotone"
          className="md:w-[40rem] max-h-[90%] /overflow-y-auto"
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

            <Button
              icon="solar:add-circle-line-duotone"
              className="py-3 shadow bg-sand-12 text-sand-1 active:bg-sand-11"
            >
              Add Section
            </Button>
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
