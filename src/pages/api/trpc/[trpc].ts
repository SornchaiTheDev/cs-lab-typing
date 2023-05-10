import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "@/server/routers/_app";
import { createContext } from "@/server/context";

// export API handler
// @see https://trpc.io/docs/api-handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  onError(opts) {
    const { error, type, path, input, ctx, req } = opts;
    console.log(error);
    if (error.code === "INTERNAL_SERVER_ERROR") {
      console.log("Something went wrong");
    }

    return error.message;
  },
});
