import type { OpenApiMeta } from "trpc-openapi";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import type { Context } from "../context";
import { getHighestRole } from "~/helpers";

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

  if (
    !(ctx.session?.user && getHighestRole(ctx.session?.user.roles) === "ADMIN")
  ) {
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

  if (
    !(
      ctx.session?.user &&
      (ctx.session?.user.roles.includes("TEACHER") ||
        ctx.session?.user.roles.includes("ADMIN"))
    )
  ) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      user: ctx.session.user,
    },
  });
});

const isTaAbove = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  const role = getHighestRole(ctx.session?.user?.roles);

  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const isInstructors = await ctx.prisma.users.findFirst({
    where: {
      student_id: ctx.session.user.student_id,
      deleted_at: null,
    },
    select: {
      instructors: true,
    },
  });

  if (role === "STUDENT" && isInstructors?.instructors.length === 0) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      user: ctx.session.user,
    },
  });
});

const isTeacher = t.middleware(async (opts) => {
  const { ctx, next } = opts;

  if (
    !(
      ctx.session?.user && getHighestRole(ctx.session?.user.roles) === "TEACHER"
    )
  ) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      user: ctx.session.user,
    },
  });
});

const isAuthed = t.middleware(async (opts) => {
  const { ctx, next } = opts;

  if (!(ctx.session?.user && ctx.session?.user.roles.includes("STUDENT"))) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      user: ctx.session.user,
    },
  });
});

export const TaAboveProcedure = publicProcedure.use(isTaAbove);
export const teacherProcedure = publicProcedure.use(isTeacher);
export const teacherAboveProcedure = publicProcedure.use(isTeacherAbove);
export const adminProcedure = publicProcedure.use(isAdmin);
export const authedProcedure = publicProcedure.use(isAuthed);
