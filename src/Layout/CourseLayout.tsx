import { ReactNode } from "react";
import Layout from ".";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import { menus } from "@/types/Menus";
import HorizontalMenu from "@/components/Common/HorizontalMenu";

interface Props {
  title: string;
  children?: ReactNode;
}

function CourseLayout({ title, children }: Props) {
  return (
    <Layout {...{ title }}>
      <HorizontalMenu
        menus={[
          {
            name: "Overview",
            path: "",
          },
          {
            name: "Sections",
            path: "sections",
          },
          {
            name: "Labs",
            path: "labs",
          },
          {
            name: "Tasks",
            path: "tasks",
          },
          {
            name: "Settings",
            path: "settings",
          },
        ]}
        basePath="/cms/courses/[courseId]"
      />

      {children}
    </Layout>
  );
}

export default CourseLayout;
