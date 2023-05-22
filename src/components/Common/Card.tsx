import type { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import React from "react";

interface Props {
  badges?: string[];
  title: string;
  href: Url;
}

function Card({ title, badges, href }: Props) {
  return (
    <Link
      href={href}
      className="relative col-span-12 flex h-[12rem] flex-col justify-end overflow-hidden rounded-lg border border-sand-6 bg-sand-4 shadow-lg hover:bg-sand-5 md:col-span-4"
    >
      <div className="flex flex-col gap-2 p-2">
        <div className="flex gap-2">
          {badges?.map((badge) => (
            <div
              key={badge}
              className="w-fit rounded-lg bg-lime-9 px-2 text-white"
            >
              {badge}
            </div>
          ))}
        </div>
        <div>
          <h4 className="text-xl font-medium text-sand-12">{title}</h4>
        </div>
      </div>
    </Link>
  );
}

export default Card;
