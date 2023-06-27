import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { transformer } from "./transformer";
import { createInnerTRPCContext } from "~/server/context";
import { getServerAuthSession } from "~/server/auth";
import type { IncomingMessage, ServerResponse } from "http";
import { getHighestRole } from "./getHighestRole";

export const createTrpcHelper = async ({
  req,
  res,
}: {
  req: IncomingMessage & { cookies: Partial<{ [key: string]: string }> };
  res: ServerResponse<IncomingMessage>;
}) => {
  const session = await getServerAuthSession({ req, res });
  const ip = req.headers["x-forwarded-for"] as string;
  const role = getHighestRole(session?.user?.roles);
  
  const helper = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session, ip }),
    transformer,
  });
  return { helper, user: { ...session?.user, role } };
};
