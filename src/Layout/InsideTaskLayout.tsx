import type { ReactNode } from "react";
import Layout from ".";
import HorizontalMenu from "~/components/Common/HorizontalMenu";

interface Props {
  title: string;
  children?: ReactNode;
  isLoading?: boolean;
  canAccessToSettings: boolean;
}

function InsideTaskLayout({
  title,
  children,
  isLoading,
  canAccessToSettings,
}: Props) {
  const menus = [
    { name: "Task", path: "" },
    { name: "History", path: "history" },
  ];

  return (
    <Layout {...{ title, isLoading }}>
      <HorizontalMenu
        basePath="/cms/tasks/[taskId]"
        menus={
          canAccessToSettings
            ? menus.concat({ name: "Settings", path: "settings" })
            : menus
        }
      />
      {children}
    </Layout>
  );
}

export default InsideTaskLayout;
