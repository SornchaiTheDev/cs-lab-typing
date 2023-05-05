import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/router";

function BackArrow() {
  const router = useRouter();

  const backHref = router.asPath.split("/").slice(0, -1).join("/");

  return (
    <Link
      href={{ pathname: backHref }}
      className="flex items-center mb-2 text-sand-11 hover:text-sand-12"
    >
      <Icon icon="carbon:arrow-left" className="text-2xl" />
      Back
    </Link>
  );
}

export default BackArrow;
