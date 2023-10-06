import { PronounValidator } from "src/ts/types/deprecated/pronouns";
import { UserValidator } from "src/ts/types/deprecated/users";
import { z } from "zod";

export const getDeprecated = async <T>(
  endpoint: string,
  validator: z.ZodType<T>,
  init?: RequestInit,
) => {
  const url = new URL("https://pronouns.alejo.io/api");

  url.pathname =
    `${url.pathname}${(endpoint[0] === "/" ? endpoint : `/${endpoint}`)}`;

  try {
    const res = await fetch(url.toString(), init);

    const resJson = await res.json();

    const validation = validator.safeParse(resJson);
    if (!validation.success) {
      return undefined;
    } else {
      return validation.data;
    }
  } catch {
    return undefined;
  }
};

export const getPronounsDeprecated = async () => {
  const res = await getDeprecated("/pronouns", z.array(PronounValidator));
  return res
    ? res.reduce<Record<string, string>>((p, c) => {
      p[c.name] = c.display;
      return p;
    }, {})
    : {};
};

export const getUserDeprecated = async (
  username: string,
) => {
  if (username.length < 1) {
    return;
  }

  const res = await getDeprecated("users/" + username, z.array(UserValidator));

  if (!res) {
    return undefined;
  }

  const match = res.find((user) => {
    return user.login.toLowerCase() === username.toLowerCase();
  });

  return match !== undefined ? match.pronoun_id : undefined;
};
