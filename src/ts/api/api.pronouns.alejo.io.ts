import { z } from "zod";
import { GetPronounsResponseValidator } from "../types/pronouns";
import { UserValidator } from "../types/users";

export const get = async <T>(
  endpoint: string,
  validator: z.ZodType<T>,
  init?: RequestInit,
) => {
  const url = new URL("https://api.pronouns.alejo.io/v1");

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

export const getHealthcheck = async () => {
  try {
    const res = await get("/health", z.object({}));

    return res !== undefined;
  } catch {
    return false;
  }
};

export const getPronouns = async () => {
  const res = await get("/pronouns", GetPronounsResponseValidator);
  return res || {};
};

export const getUser = async (username: string) => {
  console.debug(username);
  const res = await get("/users/" + username, UserValidator);

  console.debug(username, res);

  return res;
};
