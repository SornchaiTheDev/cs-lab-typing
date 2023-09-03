import type { menus } from "~/types/Menus";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface Props {
  menus: menus[];
  basePath?: string;
}

function HorizontalMenu({ menus, basePath }: Props) {
  const router = useRouter();
  const pathname = basePath ? basePath : router.pathname;
  let activePath = router.pathname.split("/").pop() as string;

  if (pathname.includes(activePath)) activePath = "";

  return (
    <div className="flex items-center gap-8 overflow-x-auto border-b border-sand-6 px-2 pb-1 text-sm text-sand-11">
      {menus.map(({ name, path }) => (
        <Link
          key={path}
          href={{
            pathname: pathname + "/" + path,
            query: { ...router.query },
          }}
          className={clsx(
            "relative rounded-lg border-sand-12 px-3 py-2 hover:bg-sand-6 hover:text-sand-12",
            path === activePath &&
              "font-bold text-sand-12 before:absolute before:-bottom-[0.24rem] before:left-0 before:right-0 before:border-b-2 before:border-sand-12"
          )}
        >
          {name}
        </Link>
      ))}
    </div>
  );
}

export default HorizontalMenu;
