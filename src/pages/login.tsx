import type { NextPage } from "next";
import Head from "next/head";
import WithUsernamePassword from "@/components/Login/WithUsernamePassword";
import Divider from "@/components/Login/Divider";
import WithGoogle from "@/components/Login/WithGoogle";
import Header from "@/components/Login/Header";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { api } from "@/services/Axios";

const Login: NextPage = () => {
  const { query } = useRouter();

  const catchError = async (error: string) => {
    if (error) {
      if (error === "not-authorize") {
        toast("กรุณาเข้าสู่ระบบด้วย @ku.th !", {
          type: "error",
        });
      } else if (error === "not-found") {
        toast("ไม่พบผู้ใช้นี้", {
          type: "error",
        });
      } else if (error === "wrong-credential") {
        toast("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง", {
          type: "error",
        });
      } else {
        toast("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", {
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
      <div className="fixed w-screen bg-sand-1 dark:bg-primary-1">
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center w-full max-w-md p-4">
            <Header />
            <div className="flex flex-col items-center w-full gap-6 mt-6">
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
