import { ReactNode } from "react";
import Layout from ".";
import HorizontalMenu from "~/components/Common/HorizontalMenu";

interface Props {
  title: string;
  children?: ReactNode;
  isLoading?: boolean;
}
function LabLayout({ title, children, isLoading }: Props) {
  return (
    <Layout {...{ title, isLoading }}>
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
