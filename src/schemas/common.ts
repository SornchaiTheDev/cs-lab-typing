import { z } from "zod";

export const SearchValue = z.object({
  label: z.string(),
  value: z.string(), // maybe need to add number type here or
});
