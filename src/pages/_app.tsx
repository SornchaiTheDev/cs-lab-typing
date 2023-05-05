import "@/styles/globals.css";
import "react-day-picker/dist/style.css";
import "@/styles/datepicker.css"
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommandPallete from "@/components/CommandPallete";
import { Analytics } from "@vercel/analytics/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* <CommandPallete /> */}
      <Analytics />
      <ToastContainer />
      <Component {...pageProps} />
    </>
  );
}
