import { z } from "zod";

export const CreateAdminAccountSchemna = z
  .object({
    username: z.string().min(1, { message: "Username cannot be empty" }),
    password: z
      .string()
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/\d/, {
        message: "Password must contain at least one number",
      })
      .regex(/[!@#$%]/, {
        message: "Password must contain at least one special character",
      })
      .min(12, {
        message: "Password must be at least 12 characters long",
      }),
    confirmPassword: z.string(),
    email: z.string().email({ message: "Email is invalid" }),
  })
  .refine((arg) => arg.password === arg.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password Doesn't Match",
  });

export type TCreateAdminAccount = z.infer<typeof CreateAdminAccountSchemna>;
