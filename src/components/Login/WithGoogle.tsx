import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

function WithGoogle() {

  return (
    <button
      onClick={() =>
        signIn("google", { callbackUrl: "/" })
      }
      className="flex items-center justify-center w-full gap-3 py-3 text-sand-12 border rounded-lg hover:bg-sand-4 bg-sand-3 border-sand-6"
    >
      <FcGoogle size="1.5rem" />
      เข้าสู่ระบบด้วย Google
    </button>
  );
}

export default WithGoogle;
