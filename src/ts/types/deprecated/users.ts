import { z } from "zod";

export const UserValidator = z.object({
  id: z.string(),
  login: z.string(),
  pronoun_id: z.string(),
});

export type User = z.infer<typeof UserValidator>;
