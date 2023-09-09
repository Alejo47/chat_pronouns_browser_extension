import { z } from "zod";

export const UserValidator = z.object({
  channel_id: z.string(),
  channel_login: z.string(),
  pronoun_id: z.string(),
  alt_pronoun_id: z.string().nullish(),
});

export type User = z.infer<typeof UserValidator>;
