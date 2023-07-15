import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";
import { trpc } from "~/helpers";
import CommandPallete from "~/components/CommandPallete";
import { Toaster } from "react-hot-toast";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Nprogress from "nprogress";
import { useEffect } from "react";

import "~/styles/globals.css";
import "react-day-picker/dist/style.css";
import "~/styles/datepicker.css";
import "~/styles/nprogress.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
  router,
}) => {
  useEffect(() => {
    const handleRouteStart = () => Nprogress.start();
    const handleRouteDone = () => Nprogress.done();

    router.events.on("routeChangeStart", handleRouteStart);
    router.events.on("routeChangeComplete", handleRouteDone);
    router.events.on("routeChangeError", handleRouteDone);

    return () => {
      // Make sure to remove the event handler on unmount!
      router.events.off("routeChangeStart", handleRouteStart);
      router.events.off("routeChangeComplete", handleRouteDone);
      router.events.off("routeChangeError", handleRouteDone);
    };
  }, [router.events]);
  return (
    <SessionProvider session={session}>
      {/* <CommandPallete /> */}
      <Analytics />
      <Toaster position="top-right" />
      <DndProvider backend={HTML5Backend}>
        <Component {...pageProps} />
      </DndProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
