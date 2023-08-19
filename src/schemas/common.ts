import { z } from "zod";

export const SearchValue = z.object({
  label: z.string(),
  value: z.number().or(z.string()),
});
