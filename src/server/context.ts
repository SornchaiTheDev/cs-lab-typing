import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { prisma } from "./prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(opts: CreateNextContextOptions) {
  const req = opts?.req;
  const res = opts?.res;
  const session = req && res && (await getServerSession(req, res, authOptions));

  const ip = opts.req.headers["x-forwarded-for"] as string;
  return {
    session,
    ip,
    prisma,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
