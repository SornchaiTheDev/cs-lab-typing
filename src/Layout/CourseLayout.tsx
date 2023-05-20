import { ReactNode } from "react";
import Layout from ".";
import HorizontalMenu from "~/components/Common/HorizontalMenu";

interface Props {
  title: string;
  children?: ReactNode;
  isLoading?: boolean;
}

function CourseLayout({ title, children, isLoading }: Props) {
  return (
    <Layout {...{ title }} isLoading={isLoading}>
      <HorizontalMenu
        menus={[
          {
            name: "Overview",
            path: "",
          },
          {
            name: "Sections",
            path: "sections",
          },
          {
            name: "Labs",
            path: "labs",
          },
          {
            name: "Settings",
            path: "settings",
          },
        ]}
        basePath="/cms/courses/[courseId]"
      />
      {children}
    </Layout>
  );
}

export default CourseLayout;
