import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { prisma } from "./prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/services/authOptions";
import { Session } from "next-auth";

interface CreateInnerContextOptions extends Partial<CreateNextContextOptions> {
  session: Session | null;
}

export async function createInnerContext(opts?: CreateInnerContextOptions) {
  return {
    prisma,
    session: opts?.session,
  };
}
export async function createContext(opts: CreateNextContextOptions) {
  const req = opts?.req;
  const res = opts?.res;
  const session = await getServerSession(req, res, authOptions);

  console.log(opts.req.cookies)

  const innerContext = await createInnerContext({ session });

  return {
    ...innerContext,
    req,
    res,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
