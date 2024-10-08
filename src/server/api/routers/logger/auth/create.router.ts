import { router, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const createAuthLogRouter = router({
  createLog: publicProcedure
    .meta({ openapi: { method: "POST", path: "/auth-logger", tags: ["logs"] } })
    .input(
      z.object({
        ip: z.string(),
        email: z.string().email(),
        type: z
          .literal("LOGIN")
          .or(z.literal("LOGOUT"))
          .or(z.literal("FAILED-LOGIN")),
      })
    )
    .output(z.string().or(z.undefined()))
    .mutation(async ({ ctx, input }) => {
      const { email, type, ip } = input;

      try {
        const user = await ctx.prisma.users.findFirst({
          where: {
            email,
            deleted_at: null,
          },
        });
        await ctx.prisma.users.update({
          where: {
            id: user?.id,
          },
          data: {
            last_logined: new Date(),
          },
        });
        await ctx.prisma.auth_loggers.create({
          data: {
            ip_address: ip ?? "localhost",
            type,
            user: {
              connect: {
                id: user?.id,
              },
            },
          },
        });
      } catch (err) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "UNAUTHORIZED" });
      }
      return "Success";
    }),
});
