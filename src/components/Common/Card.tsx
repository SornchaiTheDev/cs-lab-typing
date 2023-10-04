import type { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import type { ReactNode } from "react";
import Badge from "./Badge";
import type { BadgeType } from "./Badge";
interface Props {
  badges?: { title: string; type: BadgeType }[];
  title: string;
  beforeTitle?: ReactNode;
  afterTitle?: ReactNode;
  href: Url;
  children?: ReactNode;
  disabled?: boolean;
}

function Card({
  title,
  badges,
  href,
  children,
  disabled,
  afterTitle,
  beforeTitle,
}: Props) {
  return (
    <Link
      href={disabled ? "#" : href}
      className="relative col-span-12 flex h-[12rem] flex-col justify-end overflow-hidden rounded-lg border border-sand-6 bg-sand-4 shadow-lg hover:bg-sand-5 md:col-span-4"
    >
      <div className="flex flex-col flex-wrap gap-2 p-2">
        <div className="flex flex-wrap gap-2">
          {badges?.map(({ title, type }) => (
            <Badge key={title} type={type}>
              {title}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {beforeTitle}
          <h4 className="text-xl font-medium text-sand-12">{title}</h4>
          {afterTitle}
        </div>
        {children}
      </div>
    </Link>
  );
}

export default Card;
