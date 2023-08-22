import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { FcGoogle } from "react-icons/fc";

function WithGoogle() {
  const { query } = useRouter();

  return (
    <button
      onClick={() =>
        signIn("google", {
          redirect: false,
          callbackUrl: `${
            query.callbackUrl ? query.callbackUrl : window.location.origin
          }`,
        })
      }
      className="flex items-center justify-center w-full gap-3 py-3 text-sand-12 border rounded-lg hover:bg-sand-4 bg-sand-3 border-sand-6"
    >
      <FcGoogle size="1.5rem" />
      เข้าสู่ระบบด้วย Google
    </button>
  );
}

export default WithGoogle;
