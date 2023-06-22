import BackArrow from "~/components/Common/BackArrow";
import { Icon } from "@iconify/react";
import * as Popover from "@radix-ui/react-popover";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { getHighestRole, replaceSlugwithQueryPath } from "~/helpers";
import { signOut, useSession } from "next-auth/react";
import clsx from "clsx";
import Skeleton from "~/components/Common/Skeleton";
import { NextSeo } from "next-seo";

interface Props {
  children?: React.ReactNode;
  title: string;
  isLoading?: boolean;
  showBreadcrumb?: boolean;
  customBackPath?: string;
}
function Layout({
  children,
  title,
  isLoading,
  showBreadcrumb = true,
  customBackPath = undefined,
}: Props) {
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

  const role = getHighestRole(data?.user?.roles);

  const pageTitle = title
    ? title.charAt(0).toUpperCase() + title.slice(1)
    : "CS-LAB";

  return (
    <>
      <NextSeo
        title={`${pageTitle} | CS-LAB`}
        defaultTitle="CS-LAB"
        description="Programming Lab web application for Computer Science Kasetsart University"
      />

      <div className="flex min-h-screen flex-col">
        <div className="roboto container mx-auto flex max-w-6xl flex-1 flex-col p-4 lg:p-0">
          <div className="mt-10 flex justify-between">
            <div className="flex-1">
              {!isBasePath && <BackArrow customPath={customBackPath} />}
              <div className="flex gap-2">
                {!isBasePath &&
                  showBreadcrumb &&
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
                <h2 className="text-2xl font-bold capitalize text-sand-12 md:text-4xl">
                  {title}
                </h2>
              )}
            </div>
            <div>
              <Popover.Root>
                <Popover.Trigger asChild>
                  <button className="min-h-[40px] min-w-[40px] overflow-hidden rounded-full bg-sand-6">
                    {profileImage && (
                      <Image
                        src={profileImage}
                        alt={`${data.user?.full_name} - Profile Image`}
                        width={40}
                        height={40}
                      />
                    )}
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content
                    className="flex min-w-[12rem] flex-col gap-2 rounded-lg bg-sand-3 pb-2 shadow-md"
                    sideOffset={5}
                    align="end"
                  >
                    <div className="px-6 pt-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={clsx(
                            "mb-2 w-fit rounded p-1",
                            role === "ADMIN" && "bg-red-9",
                            role === "TEACHER" && "bg-blue-9",
                            role === "STUDENT" && "bg-lime-9"
                          )}
                        >
                          <h5 className="text-xs text-white">{role}</h5>
                        </div>
                      </div>
                      <h4 className="text-lg font-medium leading-tight text-sand-12">
                        {data?.user?.full_name}
                      </h4>
                      <h5 className="text-sand-10">{data?.user?.email}</h5>
                    </div>
                    <hr />
                    {/* <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="flex w-full items-center justify-between px-6 py-2 text-sand-11 hover:bg-sand-4 hover:text-sand-12"
                  >
                    Theme
                    <Icon icon="solar:sun-2-line-duotone" className="text-xl" />
                  </button> */}
                    <button
                      onClick={() => router.push("/")}
                      className="flex w-full items-center justify-between px-6 py-2 text-sand-11 hover:bg-sand-4 hover:text-sand-12"
                    >
                      Home
                      <Icon icon="solar:home-2-line-duotone" />
                    </button>
                    <div>
                      <button
                        onClick={() => signOut()}
                        className="flex w-full items-center justify-between px-6 py-2 text-sand-11 hover:bg-sand-4 hover:text-sand-12"
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
          <div className="mt-6 flex flex-1 flex-col">{children}</div>
        </div>
        <div className="roboto w-full gap-2 bg-sand-12 py-6 text-center">
          <h6 className="text-sand-6">
            made with 💖 for CS Kasetsart University
          </h6>

          <a
            href="https://github.com/SornchaiTheDev"
            target="_blank"
            className="font-bold text-sand-6 underline decoration-dashed hover:text-sand-2"
          >
            @SornchaiTheDev
          </a>
        </div>
      </div>
    </>
  );
}

export default Layout;
