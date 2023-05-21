import type { NextPage } from "next";
import Head from "next/head";
import WithUsernamePassword from "~/components/Login/WithUsernamePassword";
import Divider from "~/components/Login/Divider";
import WithGoogle from "~/components/Login/WithGoogle";
import Header from "~/components/Login/Header";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { callToast } from "~/services/callToast";

const Login: NextPage = () => {
  const { query } = useRouter();

  const catchError = (error: string) => {
    if (error) {
      if (error === "not-authorize") {
      } else if (error === "not-found") {
        callToast({ msg: "ไม่พบผู้ใช้นี้", type: "error" });
      } else if (error === "wrong-credential") {
        callToast({ msg: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง", type: "error" });
      } else {
        callToast({
          msg: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
          type: "error",
        });
      }
    }
  };
  useEffect(() => {
    catchError(query.error as string);
  }, [query]);
  return (
    <>
      <Head>
        <title>Login | CS-LAB</title>
      </Head>
      <div className="dark:bg-primary-1 fixed w-screen bg-sand-1">
        <div className="flex h-screen items-center justify-center">
          <div className="flex w-full max-w-md flex-col items-center p-4">
            <Header />
            <div className="mt-6 flex w-full flex-col items-center gap-6">
              <WithGoogle />
              <Divider />
              <WithUsernamePassword />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
