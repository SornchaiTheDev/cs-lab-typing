import { ReactNode } from "react";
import Layout from ".";
import HorizontalMenu from "~/components/Common/HorizontalMenu";

interface Props {
  title: string;
  children?: ReactNode;
  isLoading?: boolean;
}

function InsideTaskLayout({ title, children, isLoading }: Props) {
  return (
    <Layout {...{ title, isLoading }}>
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
