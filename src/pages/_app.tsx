import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";
import { trpc } from "~/helpers";
import CommandPallete from "~/components/CommandPallete";
import "~/styles/globals.css";
import "react-day-picker/dist/style.css";
import "~/styles/datepicker.css";
import { Toaster } from "react-hot-toast";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Analytics />
      <Toaster position="top-right" />
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
