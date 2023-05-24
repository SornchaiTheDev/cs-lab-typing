import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/router";

interface Props {
  customPath?: string;
}
function BackArrow({ customPath }: Props) {
  const router = useRouter();

  const backHref = customPath
    ? customPath
    : router.asPath.split("/").slice(0, -1).join("/");

  return (
    <Link
      href={{ pathname: backHref }}
      className="mb-2 flex items-center text-sand-11 hover:text-sand-12"
    >
      <Icon icon="carbon:arrow-left" className="text-2xl" />
      Back
    </Link>
  );
}

export default BackArrow;
