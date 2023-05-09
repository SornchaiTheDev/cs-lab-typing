import { Icon } from "@iconify/react";
import clsx from "clsx";
import Link from "next/link";
import Layout from "@/Layout";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";

interface Menus {
  name: string;
  description: string;
  icon: string;
  path: string;
}

const menus: Menus[] = [
  {
    name: "Courses Management",
    description: "Create, modify, and delete courses.",
    icon: "solar:book-2-line-duotone",
    path: "courses",
  },
  {
    name: "Tasks Management",
    description: "Create, modify, and delete tasks",
    icon: "solar:programming-line-duotone",
    path: "tasks",
  },
  // {
  //   name: "Sections Management",
  //   description: "Create, modify, and delete sections",
  //   icon: "solar:widget-line-duotone",
  //   path: "sections",
  // },
  {
    name: "Semesters Management",
    description: "Create, modify, and delete semesters",
    icon: "solar:calendar-line-duotone",
    path: "semesters",
  },
  {
    name: "Users Management",
    description: "Create, modify, and delete users",
    icon: "solar:user-line-duotone",
    path: "users",
  },
  {
    name: "LOGGER",
    description: "View logs of the system",
    icon: "solar:graph-line-duotone",
    path: "logger",
  },
];

function Dashboard() {
  return (
    <Layout title="dashboard">
      <div className="grid grid-cols-12 gap-6 mt-20">
        {menus.map(({ name, icon, description, path }) => (
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  if (session.user) {
    const roles = JSON.parse(session.user.roles) as string[];
    const isAdmin = !!roles.find((role) => role === "ADMIN");
    if (!isAdmin) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  }

  return {
    props: {},
  };
}
