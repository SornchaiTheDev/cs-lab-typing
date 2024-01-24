import { z } from "zod";

export const SearchValue = z.object({
  label: z.string(),
  value: z.string().or(z.number()), // maybe need to add number type here or
});
