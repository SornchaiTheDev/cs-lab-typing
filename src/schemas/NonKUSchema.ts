import { z } from "zod";
import { SearchValue } from "./common";

export const NonKUStudent = z.object({
  student_id: z.string().refine((value) => {
    const firstChar = value.charAt(0);
    return isNaN(parseInt(firstChar)) || /\s/.test(firstChar);
  }),
  password: z.string(),
  email: z.string().email(),
  full_name: z.string().min(1),
  roles: z.array(SearchValue),
});

export type TNonKUStudent = z.infer<typeof NonKUStudent>;
