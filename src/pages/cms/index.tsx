import { Icon } from "@iconify/react";
import clsx from "clsx";
import Link from "next/link";
import Layout from "@/Layout";
import { GetServerSideProps } from "next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

interface Menus {
  name: string;
  description: string;
  icon: string;
  path: string;
  role: string | null;
}

interface Props {
  menus: Menus[];
}

function Dashboard({ menus }: Props) {
  return (
    <Layout title="dashboard">
      <div className="grid grid-cols-12 gap-6 mt-20">
        {menus &&
          menus.map(({ name, icon, description, path }) => (
            <Link
              href={`/cms/${path}`}
              key={name}
              className={clsx(
                "col-span-12 md:col-span-4 h-[10rem] relative rounded-lg bg-sand-4 hover:bg-sand-5 shadow-lg"
              )}
            >
              <div className="absolute flex flex-col items-center w-full gap-4 bottom-4 text-whites">
                <Icon icon={icon} className="text-5xl text-sand-12" />
                <div className="text-center">
                  <h4 className="text-xl font-bold text-sand-12">{name}</h4>
                  <p className="text-gray-1s text-sand-11">{description}</p>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </Layout>
  );
}

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
  let menus: Menus[] = [
    {
      name: "Courses Management",
      description: "Create, modify, and delete courses.",
      icon: "solar:book-2-line-duotone",
      path: "courses",
      role: "TEACHER",
    },
    {
      name: "Tasks Management",
      description: "Create, modify, and delete tasks",
      icon: "solar:programming-line-duotone",
      path: "tasks",
      role: "TEACHER",
    },
    {
      name: "Semesters Management",
      description: "Create, modify, and delete semesters",
      icon: "solar:calendar-line-duotone",
      path: "semesters",
      role: null,
    },
    {
      name: "Users Management",
      description: "Create, modify, and delete users",
      icon: "solar:user-line-duotone",
      path: "users",
      role: null,
    },
    {
      name: "LOGGER",
      description: "View logs of the system",
      icon: "solar:graph-line-duotone",
      path: "logger",
      role: null,
    },
  ];

  const isAdmin = session.roles.includes("ADMIN");

  if (!isAdmin) {
    menus = menus.filter((menu) => {
      if (menu.role) {
        return session.roles.includes(menu.role);
      }
    });
  }

  return {
    props: {
      menus,
    },
  };
};
