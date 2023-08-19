import { z } from "zod";
import { SearchValue } from "./common";

export const AddLabSchema = z.object({
  name: z.string().nonempty({ message: "Name cannot be empty" }),
  tags: z.array(SearchValue),
  isDisabled: z.boolean(),
});

export type TAddLabSchema = z.infer<typeof AddLabSchema>;
