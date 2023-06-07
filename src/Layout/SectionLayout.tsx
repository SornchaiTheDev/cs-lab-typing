import { ReactNode } from "react";
import CourseLayout from "./CourseLayout";
import { useRouter } from "next/router";
import Layout from ".";
import HorizontalMenu from "~/components/Common/HorizontalMenu";
import useRole from "~/hooks/useRole";

interface Props {
  title: string;
  children?: ReactNode;
  isLoading?: boolean;
}

function SectionLayout({ title, children, isLoading }: Props) {
  const { isTeacher } = useRole();

  const menus = [
    { name: "Overview", path: "" },
    { name: "Logs", path: "logs" },
    {
      name: "History",
      path: "history",
    },
    {
      name: "Settings",
      path: "settings",
    },
  ];

  const teacherMenus = [...menus];

  teacherMenus.splice(1, 0, { name: "LAB SET", path: "labset" });
  teacherMenus.splice(1, 0, { name: "Status", path: "status" });
  return (
    <Layout {...{ title }} isLoading={isLoading}>
      <HorizontalMenu
        basePath="/cms/courses/[courseId]/sections/[sectionId]"
        menus={isTeacher ? teacherMenus : menus}
      />
      {children}
    </Layout>
  );
}

export default SectionLayout;
