import { ReactNode } from "react";
import Layout from ".";
import HorizontalMenu from "~/components/Common/HorizontalMenu";

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
          { name: "All Tasks", path: "" },
          {
            name: "History",
            path: "history",
          },
        ]}
      />
      {children}
    </Layout>
  );
}

export default TaskLayout;
