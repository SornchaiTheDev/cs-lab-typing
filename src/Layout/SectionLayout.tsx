import { ReactNode } from "react";
import CourseLayout from "./CourseLayout";
import { useRouter } from "next/router";
import Layout from ".";
import HorizontalMenu from "~/components/Common/HorizontalMenu";

interface Props {
  title: string;
  children?: ReactNode;
  isLoading?: boolean;
}

function SectionLayout({ title, children, isLoading }: Props) {
  return (
    <Layout {...{ title }} isLoading={isLoading}>
      <HorizontalMenu
        basePath="/cms/courses/[courseId]/sections/[sectionId]"
        menus={[
          { name: "Overview", path: "" },
          { name: "LAB SET", path: "labset" },
          { name: "Logs", path: "logs" },
          {
            name: "History",
            path: "history",
          },
          {
            name: "Settings",
            path: "settings",
          },
        ]}
      />
      {children}
    </Layout>
  );
}

export default SectionLayout;
