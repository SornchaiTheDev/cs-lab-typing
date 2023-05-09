import { FormEvent, useState, useRef, useEffect } from "react";
import { BsArrowRightCircle } from "react-icons/bs";
import { BiLoaderCircle } from "react-icons/bi";
import clsx from "clsx";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

function WithEmail() {
  const [step, setStep] = useState<"username" | "password">("username");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { query } = useRouter();

  const handleOnSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (step != "password") {
      return setStep("password");
    }

    setIsSubmit(true);
    signIn("credentials", {
      username,
      password,
      callbackUrl: `${
        query.callbackUrl ? query.callbackUrl : window.location.origin
      }`,
    });
  };

  useEffect(() => {
    if (step === "password") passwordRef.current?.focus();
  }, [step]);

  return (
    <form onSubmit={handleOnSubmit} className="w-full">
      <div className="relative w-full">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="ชื่อผู้ใช้"
          className={clsx(
            "py-3 px-4 w-full border outline-none focus:ring-1 ring-zinc-200 dark:bg-secondary-1 dark:text-ascent-1",
            step === "username" ? "rounded-lg" : "rounded-t-lg"
          )}
        />
        {step === "username" && (
          <button
            type="submit"
            className="absolute -translate-y-1/2 rounded-full top-1/2 right-3"
          >
            <BsArrowRightCircle
              className={clsx("text-lg ", username === "" && "text-zinc-200")}
            />
          </button>
        )}
      </div>

      {step === "password" && (
        <>
          <div className="relative w-full">
            <input
              ref={passwordRef}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="รหัสผ่าน"
              className="w-full px-4 py-3 border rounded-b outline-none dark:bg-secondary-1 dark:text-ascent-1"
            />

            <button
              type="submit"
              className="absolute -translate-y-1/2 rounded-full top-1/2 right-3"
            >
              {isSubmit ? (
                <BiLoaderCircle className="text-lg text-ascent-1 animate-spin" />
              ) : (
                <BsArrowRightCircle
                  className={clsx(
                    "text-lg ",
                    password === "" && "text-zinc-200"
                  )}
                />
              )}
            </button>
          </div>
        </>
      )}
    </form>
  );
}

export default WithEmail;
