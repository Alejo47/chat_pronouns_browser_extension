import { z } from "zod";

export const PronounGroupValidator = z.object({
  name: z.string(),
  subject: z.string(),
  object: z.string(),
  singular: z.boolean(),
});

export const GetPronounsResponseValidator = z.record(
  z.string(),
  PronounGroupValidator,
);

export type PronounGroup = z.infer<typeof PronounGroupValidator>;

export type GetPronounsResponse = z.infer<typeof GetPronounsResponseValidator>;
