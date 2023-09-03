import type { ReactNode } from "react";
import Layout from ".";

interface Props {
  title: string;
  children?: ReactNode;
}
function SemesterLayout({ title, children }: Props) {
  return <Layout {...{ title }}>{children}</Layout>;
}

export default SemesterLayout;
