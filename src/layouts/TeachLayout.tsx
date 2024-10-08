import type { ReactNode } from "react";
import Layout from ".";
import HorizontalMenu from "~/components/Common/HorizontalMenu";
import useRole from "~/hooks/useRole";

interface Props {
  title: string;
  children?: ReactNode;
  isLoading?: boolean;
}

function TeachLayout({ title, children, isLoading }: Props) {
  const { isAdmin, isTeacher } = useRole();

  const menus = [
    { name: "Overview", path: "" },
    { name: "Annoucement", path: "announcement" },
    {
      name: "History",
      path: "history",
    },
    { name: "Logs", path: "logs" },
    {
      name: "Settings",
      path: "settings",
    },
  ];

  const adminMenus = [...menus];

  const teacherMenus = [...menus];

  teacherMenus.splice(2, 0, { name: "Status", path: "status" });
  teacherMenus.splice(2, 0, { name: "LAB SET", path: "labset" });
  teacherMenus.splice(2, 0, { name: "Students", path: "students" });

  const taMenus = [
    { name: "Overview", path: "" },
    { name: "Annoucement", path: "announcement" },
    { name: "LAB SET", path: "labset" },
    { name: "Status", path: "status" },
  ];

  return (
    <Layout
      {...{ title }}
      isLoading={isLoading}
      showBreadcrumb={false}
      customBackPath="/"
    >
      <HorizontalMenu
        basePath="/teach/course/[courseId]/section/[sectionId]"
        menus={isAdmin ? adminMenus : isTeacher ? teacherMenus : taMenus}
      />
      {children}
    </Layout>
  );
}

export default TeachLayout;
