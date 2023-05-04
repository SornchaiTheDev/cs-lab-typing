import { ReactNode } from "react";
import Layout from ".";
import HorizontalMenu from "@/components/Common/HorizontalMenu";

interface Props {
  title: string;
  children?: ReactNode;
}
function LabLayout({ title, children }: Props) {
  return (
    <Layout {...{ title }}>
      <HorizontalMenu
        menus={[
          {
            name: "Manage Task",
            path: "",
          },
          {
            name: "History",
            path: "history",
          },
          {
            name: "Settings",
            path: "settings",
          },
        ]}
        basePath="/cms/courses/[courseId]/labs/[labId]"
      />

      {children}
    </Layout>
  );
}

export default LabLayout;
