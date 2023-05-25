import type { OpenApiMeta } from "trpc-openapi";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import type { Context } from "../context";

const t = initTRPC
  .meta<OpenApiMeta>()
  .context<Context>()
  .create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
      return {
        ...shape,
        data: {
          ...shape.data,
          zodError:
            error.cause instanceof ZodError ? error.cause.flatten() : null,
        },
      };
    },
  });

export const router = t.router;
export const publicProcedure = t.procedure;
export const mergeRouter = t.mergeRouters;

const isAdmin = t.middleware(async (opts) => {
  const { ctx, next } = opts;

  if (!ctx.session || !ctx.session?.user?.roles.includes("ADMIN")) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      user: ctx.session.user,
    },
  });
});

const isTeacherAbove = t.middleware(async (opts) => {
  const { ctx, next } = opts;

  if (!ctx.session || !ctx.session?.user?.roles.includes("TEACHER")) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      user: ctx.session.user,
    },
  });
});

export const teacherProcedure = publicProcedure.use(isTeacherAbove);
export const adminProcedure = publicProcedure.use(isAdmin);
