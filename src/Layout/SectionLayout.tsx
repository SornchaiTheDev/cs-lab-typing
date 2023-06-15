import type { ReactNode } from "react";
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
  teacherMenus.splice(1, 0, { name: "Students", path: "students" });
  teacherMenus.splice(1, 0, { name: "Annoucement", path: "announcement" });
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
