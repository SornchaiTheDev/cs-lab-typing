import { teacherAboveProcedure, router } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { isArrayUnique, isAllUserValid } from "~/helpers";
import { addStudent } from "./role/student";
import { addNonKUStudent } from "./role/nonKU";
import { addTeacher } from "./role/teacher";

export const createUserRouter = router({
  addUser: teacherAboveProcedure
    .input(
      z.object({
        users: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { users } = input;
      if (!isArrayUnique(users)) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DUPLICATED_USER",
        });
      }

      if (isAllUserValid(users)) {
        try {
          for (const user of users) {
            const splitedUser = user.split(",");
            if (splitedUser.length === 3) {
              await addStudent(ctx.prisma, user);
            } else if (splitedUser.length === 4) {
              await addNonKUStudent(ctx.prisma, user);
            } else if (splitedUser.length === 2) {
              await addTeacher(ctx.prisma, user);
            }
          }
        } catch (err) {
          if (err instanceof Error) {
            if (err.message === "DUPLICATED_USER") {
              throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "DUPLICATED_USER",
              });
            }
          }
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "SOMETHING_WENT_WRONG",
          });
        }
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "INVALID_INPUT",
        });
      }
    }),
});
