import { getServerAuthSession } from "~/server/auth";
import { getHighestRole } from "./getHighestRole";
import type { IncomingMessage, ServerResponse } from "http";

export const getUserSession = async ({
  req,
  res,
}: {
  req: IncomingMessage & { cookies: Partial<{ [key: string]: string }> };
  res: ServerResponse<IncomingMessage>;
}) => {
  const session = await getServerAuthSession({ req, res });
  const role = getHighestRole(session?.user?.roles);
  const user = { ...session?.user, role };
  return user;
};
