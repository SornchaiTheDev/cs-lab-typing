import { ReactNode } from "react";
import Layout from ".";
import HorizontalMenu from "@/components/Common/HorizontalMenu";

interface Props {
  title: string;
  children?: ReactNode;
}

function TaskLayout({ title, children }: Props) {
  return (
    <Layout {...{ title }}>
      <HorizontalMenu
        basePath="/cms/tasks"
        menus={[
          { name: "All Tasks", path: "tasks" },
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

export default TaskLayout;
