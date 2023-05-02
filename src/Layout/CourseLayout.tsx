import { ReactNode } from "react";
import Layout from ".";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";

interface Props {
  title: string;
  children?: ReactNode;
}

const menus = [
  {
    name: "Overview",
    href: "",
  },
  {
    name: "Sections",
    href: "sections",
  },
  {
    name: "Labs",
    href: "labs",
  },
  {
    name: "Tasks",
    href: "tasks",
  },
  {
    name: "Settings",
    href: "settings",
  },
];

function CourseLayout({ title, children }: Props) {
  const router = useRouter();
  const { courseId } = router.query;
  const activeMenu = router.asPath.split("/").pop();

  return (
    <Layout {...{ title }}>
      <div className="flex items-center gap-8 px-2 pb-1 overflow-x-auto overflow-y-hidden text-sm border-b border-sand-6 text-sand-11">
        {menus.map(({ name, href }) => (
          <Link
            key={name}
            href={`/cms/courses/${courseId}/${href}`}
            className={clsx(
              "relative px-3 py-2 rounded-lg hover:text-sand-12 border-sand-12 hover:bg-sand-6",
              (activeMenu + href === courseId || activeMenu === href) &&
                "font-bold before:border-b-2 before:absolute before:-bottom-[0.3rem] before:left-0 before:right-0 before:border-sand-12 text-sand-12"
            )}
          >
            {name}
          </Link>
        ))}
      </div>
      {children}
    </Layout>
  );
}

export default CourseLayout;
