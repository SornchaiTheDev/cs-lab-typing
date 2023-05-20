import { ReactNode } from "react";
import Layout from ".";
import HorizontalMenu from "~/components/Common/HorizontalMenu";

interface Props {
  title: string;
  children?: ReactNode;
}
function SemesterLayout({ title, children }: Props) {
  return <Layout {...{ title }}>{children}</Layout>;
}

export default SemesterLayout;
