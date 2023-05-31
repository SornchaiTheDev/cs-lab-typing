import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { transformer } from "./transformer";
import { createInnerTRPCContext } from "~/server/context";

export const helper = createServerSideHelpers({
  router: appRouter,
  ctx: createInnerTRPCContext(),
  transformer: transformer,
});
