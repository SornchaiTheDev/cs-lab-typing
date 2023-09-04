import type { ReactNode } from "react";
import Layout from ".";
import HorizontalMenu from "~/components/Common/HorizontalMenu";
import useRole from "~/hooks/useRole";
import { trpc } from "~/helpers/trpc";
import { useRouter } from "next/router";

interface Props {
  title: string;
  children?: ReactNode;
  isLoading?: boolean;
}

function SectionLayout({ title, children, isLoading }: Props) {
  const { isAdmin, isTeacher, isStudent } = useRole();
  const router = useRouter();
  const { sectionId } = router.query;

  const students = trpc.sections.getStudentsBySectionId.useQuery({
    sectionId: sectionId as string,
  });

  const menus = [
    { name: "Overview", path: "" },
    // { name: "Annoucement", path: "announcement" },
    { name: `Students (${students.data ?? 0})`, path: "students" },
    { name: "LAB SET", path: "labset" },
    { name: "Status", path: "status" },
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

  const teacherMenus = [...menus];

  const taMenus = [
    { name: "Overview", path: "" },
    // { name: "Annoucement", path: "announcement" },
    { name: "LAB SET", path: "labset" },
    { name: "Status", path: "status" },
  ];

  return (
    <Layout
      {...{ title }}
      isLoading={isLoading}
      showBreadcrumb={isTeacher || isAdmin}
      customBackPath={isStudent ? "/" : undefined}
    >
      <HorizontalMenu
        basePath="/cms/courses/[courseId]/sections/[sectionId]"
        menus={isAdmin || isTeacher ? teacherMenus : taMenus}
      />
      {children}
    </Layout>
  );
}

export default SectionLayout;
