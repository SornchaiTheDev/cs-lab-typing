import { TRPCError, initTRPC } from "@trpc/server";
import { Context } from "./context";
import { transformer } from "@/helpers";
import { ZodError } from "zod";
import { OpenApiMeta } from "trpc-openapi";

const t = initTRPC
  .meta<OpenApiMeta>()
  .context<Context>()
  .create({
    transformer,
    errorFormatter(opts) {
      const { shape, error } = opts;
      return {
        ...shape,
        data: {
          ...shape.data,
          zodError:
            error.code === "INTERNAL_SERVER_ERROR" &&
            error.cause instanceof ZodError
              ? error.cause.flatten()
              : null,
        },
      };
    },
  });

export const router = t.router;
export const mergeRouter = t.mergeRouters;
export const procedure = t.procedure;
export const middleware = t.middleware;

const isAdmin = middleware(async (opts) => {
  const { ctx } = opts;
  console.log(ctx.session);
  if (!ctx.session || !ctx.session?.roles.includes("ADMIN")) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return opts.next({
    ctx: {
      user: ctx.session,
    },
  });
});

export const adminProcedure = procedure.use(isAdmin);
