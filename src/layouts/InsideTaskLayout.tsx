import type { ReactNode } from "react";
import Layout from ".";
import HorizontalMenu from "~/components/Common/HorizontalMenu";

interface Props {
  title: string;
  children?: ReactNode;
  isLoading?: boolean;
  canAccessToSettings: boolean;
  canAccessToHistory: boolean;
}

function InsideTaskLayout({
  title,
  children,
  isLoading,
  canAccessToSettings,
  canAccessToHistory,
}: Props) {
  const menus = [{ name: "Task", path: "" }];

  if (canAccessToHistory) {
    menus.splice(1, 0, { name: "Editor", path: "editor" });
    menus.splice(2, 0, { name: "History", path: "history" });
  }

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
