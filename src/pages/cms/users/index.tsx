import Layout from "@/Layout";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import Link from "next/link";

interface Menus {
  name: string;
  description: string;
  icon: string;
  path: string;
}

const menus: Menus[] = [
  {
    name: "Administrator",
    description: "Create, modify, and delete Administrator Role",
    icon: "solar:shield-user-line-duotone",
    path: "admin",
  },
  {
    name: "Teacher",
    description: "Create, modify, and delete Teacher Role",
    icon: "solar:case-round-minimalistic-linear",
    path: "teacher",
  },
  {
    name: "Student",
    description: "Create, modify, and delete Student Role",
    icon: "solar:user-hand-up-line-duotone",
    path: "student",
  },
];

function Users() {
  return (
    <Layout title="Users">
      <div className="grid grid-cols-12 gap-6 mt-20">
        {menus.map(({ name, icon, description, path }) => (
          <Link
            href={`/cms/users/${path}`}
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

export default Users;
