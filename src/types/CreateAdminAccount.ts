import { z } from "zod";

export const schema = z.object({
  username: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
});

export type FormData = z.infer<typeof schema>;
