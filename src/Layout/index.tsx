import BackArrow from "@/components/Common/BackArrow";
import { Icon } from "@iconify/react";
import * as Popover from "@radix-ui/react-popover";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { replaceSlugwithQueryPath } from "@/helpers";
import { signOut, useSession } from "next-auth/react";
import clsx from "clsx";
import Skeleton from "@/components/Common/Skeleton";
import { api } from "@/services/Axios";

interface Props {
  children?: React.ReactNode;
  title: string;
  isLoading?: boolean;
}
function Layout({ children, title, isLoading }: Props) {
  const { data } = useSession();
  const profileImage = data?.user?.image;

  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  const isBasePath = router.pathname === "/cms";
  const breadcrumbs = router.pathname
    .split("/")
    .slice(1)
    .map((segment, index, segments) => ({
      label: replaceSlugwithQueryPath(segment, router.query),
      path: `/${segments
        .map((seg) => replaceSlugwithQueryPath(seg, router.query))
        .slice(0, index + 1)
        .join("/")}`,
    }));

  const role = data ? (JSON.parse(data?.roles as string) as string[]) : [];
  const showRole = role.filter((role) => role != "STUDENT")[0];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container flex flex-col flex-1 max-w-6xl p-4 mx-auto lg:p-0 roboto">
        <div className="flex justify-between mt-10">
          <div>
            {!isBasePath && <BackArrow />}
            <div className="flex gap-2">
              {!isBasePath &&
                breadcrumbs.slice(0, -1).map(({ label, path }) => (
                  <Link
                    key={path}
                    href={path}
                    className="block text-xl text-sand-11 hover:text-sand-12"
                  >
                    {label} /
                  </Link>
                ))}
            </div>
            {isLoading ? (
              <Skeleton width="20rem" height="3rem" />
            ) : (
              <h2 className="text-4xl font-bold capitalize text-sand-12">
                {title}
              </h2>
            )}
          </div>
          <div>
            <Popover.Root>
              <Popover.Trigger asChild>
                <button>
                  {profileImage && (
                    <Image
                      src={profileImage}
                      alt="Sornchai Somsakul - Profile Image"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="flex flex-col gap-2 pb-2 rounded-lg shadow-md bg-sand-3"
                  sideOffset={5}
                  align="end"
                >
                  <div className="px-6 pt-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={clsx(
                          "p-1 mb-2 rounded w-fit",
                          showRole === "ADMIN" ? "bg-red-9" : "bg-lime-9"
                        )}
                      >
                        <h5 className="text-xs text-white">{showRole}</h5>
                      </div>
                    </div>
                    <h4 className="text-lg font-medium leading-tight text-sand-12">
                      {data?.full_name}
                    </h4>
                    <h5 className="text-sand-10">{data?.email}</h5>
                  </div>
                  <hr />
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="flex items-center justify-between w-full px-6 py-2 text-sand-11 hover:text-sand-12 hover:bg-sand-4"
                  >
                    Theme
                    <Icon icon="solar:sun-2-line-duotone" className="text-xl" />
                  </button>
                  <div>
                    <button
                      onClick={() => signOut()}
                      className="flex items-center justify-between w-full px-6 py-2 text-sand-11 hover:text-sand-12 hover:bg-sand-4"
                    >
                      Sign Out
                      <Icon icon="solar:login-2-line-duotone" />
                    </button>
                  </div>

                  <Popover.Arrow className="fill-sand-3" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </div>
        <div className="flex flex-col flex-1 mt-6">{children}</div>
      </div>
      <div className="w-full gap-2 py-6 text-center bg-sand-12 roboto">
        <h6 className="text-sand-6">
          made with 💖 for CS Kasetsart University
        </h6>

        <a
          href="https://github.com/SornchaiTheDev"
          target="_blank"
          className="font-bold underline decoration-dashed text-sand-6 hover:text-sand-2"
        >
          @SornchaiTheDev
        </a>
      </div>
    </div>
  );
}

export default Layout;
