import type { OpenApiMeta } from "trpc-openapi";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import type { Context } from "../context";
import { getHighestRole } from "~/helpers";
import { isRelationWithThisCourse } from "../utils/isRelationWithThisCourse";

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

const isAuthed = t.middleware(async (opts) => {
  const { ctx, next } = opts;

  if (ctx.session?.user === undefined) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      user: ctx.session.user,
    },
  });
});

const isTeacher = isAuthed.unstable_pipe(async (opts) => {
  const { ctx, next } = opts;

  const isTeacher = getHighestRole(ctx.user.roles) === "TEACHER";
  if (!isTeacher) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next();
});

const isTeacherAbove = isAuthed.unstable_pipe(async (opts) => {
  const { ctx, next } = opts;

  const isTeacher = ctx.user.roles.includes("TEACHER");
  const isAdmin = ctx.user.roles.includes("ADMIN");

  if (!isAdmin && !isTeacher) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      user: {
        ...ctx.user,
        roles: ctx.user.roles as ("ADMIN" | "TEACHER")[],
      },
    },
  });
});

const isTaAbove = isAuthed.unstable_pipe(async (opts) => {
  const { ctx, next } = opts;
  const role = getHighestRole(ctx.user.roles);

  const isInstructors = await ctx.prisma.users.findFirst({
    where: {
      student_id: ctx.user.student_id,
      deleted_at: null,
    },
    select: {
      instructors: true,
    },
  });

  if (role === "STUDENT" && isInstructors?.instructors.length === 0) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next();
});

const isAdmin = isAuthed.unstable_pipe(async (opts) => {
  const { ctx, next } = opts;

  const isAdmin = ctx.user.roles.includes("ADMIN");

  if (!isAdmin) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next();
});

const isTaAboveRelateWithCourse = isTaAbove.unstable_pipe(async (opts) => {
  const { ctx, next, rawInput } = opts;
  const _rawInput = rawInput as { id: string };

  const isRelated = await isRelationWithThisCourse(
    ctx.user.student_id,
    _rawInput.id
  );

  if (!isRelated) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next();
});

const isTeacherAboveRelateWithCourse = isTeacherAbove.unstable_pipe(
  async (opts) => {
    const { ctx, next, rawInput } = opts;
    const _rawInput = rawInput as { courseId: string | number };

    if (typeof _rawInput.courseId === "number") {
      _rawInput.courseId = _rawInput.courseId.toString();
    }

    const isRelated = await isRelationWithThisCourse(
      ctx.user.student_id,
      _rawInput.courseId
    );

    if (!isRelated) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next();
  }
);

export const authedProcedure = publicProcedure.use(isAuthed);
export const TaAboveProcedure = publicProcedure.use(isTaAbove);
export const teacherAboveProcedure = publicProcedure.use(isTeacherAbove);
export const teacherAboveAndRelatedProcedure = publicProcedure.use(
  isTeacherAboveRelateWithCourse
);
export const taAboveAndRelatedToCourseProcedure = publicProcedure.use(
  isTaAboveRelateWithCourse
);
export const teacherProcedure = publicProcedure.use(isTeacher);
export const adminProcedure = publicProcedure.use(isAdmin);
