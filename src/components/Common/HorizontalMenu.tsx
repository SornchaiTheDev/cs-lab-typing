import { menus } from "~/types/Menus";
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
  const queryKey = Object.keys(router.query).at(-1) as string;
  let activePath = router.pathname.split("/").pop() as string;

  if (pathname.includes(activePath)) activePath = "";

  return (
    <div className="flex items-center gap-8 px-2 pb-1 overflow-x-auto text-sm border-b border-sand-6 text-sand-11">
      {menus.map(({ name, path }) => (
        <Link
          key={path}
          href={{
            pathname: pathname + "/" + path,
            query: { ...router.query },
          }}
          className={clsx(
            "relative px-3 py-2 rounded-lg hover:text-sand-12 border-sand-12 hover:bg-sand-6",
            path === activePath &&
              "font-bold before:border-b-2 before:absolute before:-bottom-[0.24rem] before:left-0 before:right-0 before:border-sand-12 text-sand-12"
          )}
        >
          {name}
        </Link>
      ))}
    </div>
  );
}

export default HorizontalMenu;
