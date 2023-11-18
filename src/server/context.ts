import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { Session } from "next-auth";
import { prisma } from "~/server/db";
import { getServerAuthSession } from "./auth";

interface CreateInnerContextOptions extends Partial<CreateNextContextOptions> {
  session: Session | null;
  ip: string | string[];
}

export const createInnerTRPCContext = (opts: CreateInnerContextOptions) => {
  return {
    ...opts,
    prisma,
  };
};

export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  const session = await getServerAuthSession({ req, res });

  const ip = req.headers["x-forwarded-for"] || "localhost";

  return await createInnerTRPCContext({ ...opts, session, ip });
};

export type Context = inferAsyncReturnType<typeof createInnerTRPCContext>;
