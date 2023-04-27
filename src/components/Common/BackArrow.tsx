import { Icon } from "@iconify/react";
import { useRouter } from "next/router";

function BackArrow() {
  const router = useRouter();

  return (
    <button onClick={router.back} className="flex items-center mb-2 text-sand-11 hover:text-sand-12">
      <Icon icon="carbon:arrow-left" className="text-2xl" />
      Back
    </button>
  );
}

export default BackArrow;
