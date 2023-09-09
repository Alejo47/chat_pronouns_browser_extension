import { z } from "zod";

export const PronounsMapValidator = z.record(z.string(), z.string());

export const PronounValidator = z.object({
  name: z.string(),
  display: z.string(),
});

export type PronounsMap = z.infer<typeof PronounsMapValidator>;

export type Pronoun = z.infer<typeof PronounValidator>;
