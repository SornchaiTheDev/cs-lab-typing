import { z } from "zod";

export const NonKUStudent = z.object({
  student_id: z.string().refine((value) => {
    const firstChar = value.charAt(0);
    return isNaN(parseInt(firstChar)) || /\s/.test(firstChar);
  }),
  password: z.string(),
  email: z.string().email(),
  full_name: z.string().min(1),
  roles: z.array(z.string()),
});

export type TNonKUStudent = z.infer<typeof NonKUStudent>;
