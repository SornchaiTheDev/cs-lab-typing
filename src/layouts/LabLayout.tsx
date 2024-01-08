import type { ReactNode } from "react";
import { useRouter } from "next/router";
import Layout from ".";
import HorizontalMenu from "~/components/Common/HorizontalMenu";

interface Props {
  title: string;
  children?: ReactNode;
  isLoading?: boolean;
  canAccessToSuperUserMenus?: boolean;
}
function LabLayout({
  title,
  children,
  isLoading,
  canAccessToSuperUserMenus,
}: Props) {
  const router = useRouter();

  const { courseId, sectionId } = router.query;

  const menus = [
    {
      name: "Manage Task",
      path: "",
    },
  ];
  if (canAccessToSuperUserMenus) {
    menus.splice(1, 0, {
      name: "History",
      path: "history",
    });
    menus.splice(2, 0, {
      name: "Settings",
      path: "settings",
    });
  }
  return (
    <Layout
      {...{ title, isLoading }}
      customBackPath={
        canAccessToSuperUserMenus
          ? undefined
          : `/cms/courses/${courseId}/sections/${sectionId}/labset`
      }
    >
      <HorizontalMenu
        menus={menus}
        basePath="/cms/courses/[courseId]/labs/[labId]"
      />

      {children}
    </Layout>
  );
}

export default LabLayout;
