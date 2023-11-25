import { type FormEvent, useState, useRef, useEffect } from "react";
import { BsArrowRightCircle } from "react-icons/bs";
import { BiLoaderCircle } from "react-icons/bi";
import { signIn } from "next-auth/react";
import { twMerge } from "tailwind-merge";

function WithEmail() {
  const [step, setStep] = useState<"username" | "password">("username");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleOnSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (step != "password") {
      return setStep("password");
    }

    setIsSubmit(true);
    signIn("credentials", {
      username,
      password,
      callbackUrl: "/"
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
          className={twMerge(
            "w-full border border-sand-6 bg-sand-3 px-4 py-3 text-sand-12 outline-none ring-sand-3 focus:ring-1 placeholder:text-sand-9",
            step === "username" ? "rounded-lg" : "rounded-t-lg"
          )}
        />
        {step === "username" && (
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full"
          >
            <BsArrowRightCircle
              className={twMerge("text-lg text-sand-11", username === "" && "text-sand-8")}
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
              className="w-full rounded-b border-b border-l border-r border-t-0 border-sand-6 bg-sand-3 px-4 py-3 text-sand-12 outline-none focus:border-sand-6 focus:ring-0  placeholder:text-sand-9"
            />

            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full"
            >
              {isSubmit ? (
                <BiLoaderCircle className="text-ascent-1 animate-spin text-lg" />
              ) : (
                <BsArrowRightCircle
                  className={twMerge(
                    "text-lg text-sand-11",
                    password === "" && "text-sand-6"
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
