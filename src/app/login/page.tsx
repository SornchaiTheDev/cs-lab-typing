import React from "react";
import Divider from "~/components/Login/Divider";
import Header from "~/components/Login/Header";
import WithGoogle from "~/components/Login/WithGoogle";
import WithUsernamePassword from "~/components/Login/WithUsernamePassword";

function LoginPage() {
  return (
    <div className="fixed w-screen">
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
  );
}

export default LoginPage;
