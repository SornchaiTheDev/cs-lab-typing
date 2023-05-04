import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/components/DatePicker/styles.css";
import CommandPallete from "@/components/CommandPallete";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* <CommandPallete /> */}
      <ToastContainer />
      <Component {...pageProps} />
    </>
  );
}
