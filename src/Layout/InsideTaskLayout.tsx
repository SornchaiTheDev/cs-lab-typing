import { ReactNode } from "react";
import Layout from ".";
import HorizontalMenu from "@/components/Common/HorizontalMenu";

interface Props {
  title: string;
  children?: ReactNode;
}

function InsideTaskLayout({ title, children }: Props) {
  return (
    <Layout {...{ title }}>
      <HorizontalMenu
        basePath="/cms/tasks/[taskId]"
        menus={[
          { name: "Task", path: "" },
          { name: "Settings", path: "settings" },
        ]}
      />
      {children}
    </Layout>
  );
}

export default InsideTaskLayout;
