import { Icon } from "@iconify/react";
import clsx from "clsx";
import Image from "next/image";
import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";

interface Menus {
  name: string;
  description: string;
  icon: string;
}

const menus: Menus[] = [
  {
    name: "Courses Management",
    description: "Create, modify, and delete courses.",
    icon: "solar:book-2-line-duotone",
  },
  {
    name: "Labs Management",
    description: "Create, modify, and delete labs.",
    icon: "solar:checklist-minimalistic-line-duotone",
  },
  {
    name: "Tasks Management",
    description: "Create, modify, and delete tasks",
    icon: "solar:programming-line-duotone",
  },
  {
    name: "Sections Management",
    description: "Create, modify, and delete sections",
    icon: "solar:widget-line-duotone",
  },
  {
    name: "Semesters Management",
    description: "Create, modify, and delete semesters",
    icon: "solar:calendar-line-duotone",
  },
  {
    name: "Users Management",
    description: "Create, modify, and delete users",
    icon: "solar:user-line-duotone",
  },
  {
    name: "LOGS",
    description: "View logs of the system",
    icon: "solar:graph-line-duotone",
  },
];

function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  return (
    <div className="flex justify-center w-full h-full m-10 roboto">
      <div className="container max-w-6xl">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-bold">Dashboard</h2>
          <div className="flex items-center gap-4">
            <Popover.Root>
              <Popover.Trigger asChild>
                <button>
                  <Image
                    src="https://lh3.googleusercontent.com/a/AGNmyxbgXeXNBWkivERv6OUy29IMSG3iHYH9HAfAozB2bw=s83-c-mo"
                    alt="Sornchai Somsakul - Profile Image"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="flex flex-col gap-2 pb-2 bg-white rounded-lg shadow-md"
                  sideOffset={5}
                  align="end"
                >
                  <div className="px-6 pt-4">
                    <div className="p-1 mb-2 rounded bg-red-9 w-fit">
                      <h5 className="text-xs text-white">ADMIN</h5>
                    </div>
                    <h4 className="text-lg font-medium leading-tight text-sand-12">
                      Sornchai Somsakul
                    </h4>
                    <h5 className="text-sand-10">sornchaithedev@gmail.com</h5>
                  </div>
                  <hr />
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="flex items-center justify-between w-full px-6 py-2 text-sand-11 hover:text-sand-12 hover:bg-sand-3"
                  >
                    Theme
                    <Icon icon="solar:sun-2-line-duotone" className="text-xl" />
                  </button>
                  <div>
                    <button className="flex items-center justify-between w-full px-6 py-2 text-sand-11 hover:text-sand-12 hover:bg-sand-3">
                      Settings
                      <Icon
                        icon="solar:settings-line-duotone"
                        className="text-xl"
                      />
                    </button>

                    <button className="flex items-center justify-between w-full px-6 py-2 text-sand-11 hover:text-sand-12 hover:bg-sand-3">
                      Sign Out
                      <Icon icon="solar:login-2-line-duotone" />
                    </button>
                  </div>

                  <Popover.Arrow className="fill-white" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-6 mt-20">
          {menus.map(({ name, icon, description }) => (
            <button
              key={name}
              className={clsx(
                "col-span-4 h-[10rem] relative rounded-lg bg-sand-4 hover:bg-sand-5 shadow-lg"
              )}
            >
              <div className="absolute flex flex-col items-center w-full gap-4 bottom-4 text-whites">
                <Icon icon={icon} className="text-5xl text-sand-12" />
                <div>
                  <h4 className="text-xl font-bold text-sand-12">{name}</h4>
                  <p className="text-gray-1s text-sand-11">{description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
