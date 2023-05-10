import "@/styles/globals.css";
import "react-day-picker/dist/style.css";
import "@/styles/datepicker.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import CommandPallete from "@/components/CommandPallete";
import { Analytics } from "@vercel/analytics/react";
import { trpc } from "@/helpers";
import { SessionProvider } from "next-auth/react";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <SessionProvider>
        {/* <CommandPallete /> */}
        <Analytics />
        <Toaster position="top-right" />
        <ToastContainer />
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
};

export default trpc.withTRPC(App);
