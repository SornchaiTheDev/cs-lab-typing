import { TRPCError, initTRPC } from "@trpc/server";
import { Context } from "./context";
import { transformer } from "@/helpers";
import { ZodError } from "zod";

const t = initTRPC.context<Context>().create({
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
export const procedure = t.procedure;
export const middleware = t.middleware;

const isAdmin = middleware(async (opts) => {
  const { ctx } = opts;
  if (false) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return opts.next({
    ctx: {
      // user: ctx.user,
    },
  });
});

export const adminProcedure = procedure.use(isAdmin);
