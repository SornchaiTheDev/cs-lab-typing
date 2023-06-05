import type { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import type { ReactNode } from "react";
import Badge from "./Badge";
import type { BadgeType } from "./Badge";
interface Props {
  badges?: { title: string; type: BadgeType }[];
  title: string;
  href: Url;
  children?: ReactNode;
  disabled?: boolean;
}

function Card({ title, badges, href, children, disabled }: Props) {
  return (
    <Link
      href={disabled ? "#" : href}
      className="relative col-span-12 flex h-[12rem] flex-col justify-end overflow-hidden rounded-lg border border-sand-6 bg-sand-4 shadow-lg hover:bg-sand-5 md:col-span-4"
    >
      <div className="flex flex-col gap-2 p-2">
        <div className="flex gap-2">
          {badges?.map(({ title, type }) => (
            <Badge key={title} type={type}>
              {title}
            </Badge>
          ))}
        </div>
        <div>
          <h4 className="text-xl font-medium text-sand-12">{title}</h4>
          {children}
        </div>
      </div>
    </Link>
  );
}

export default Card;
