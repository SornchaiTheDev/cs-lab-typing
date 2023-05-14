import { router, procedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const createAuthLogRouter = router({
  createLog: procedure
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
        await ctx.prisma.auth_logger.create({
          data: {
            ip_address: ip ?? "localhost",
            type,
            user: {
              connect: {
                email,
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
