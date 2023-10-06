import { z } from "zod";
import { GetPronounsResponseValidator } from "../types/pronouns";
import { UserValidator } from "../types/users";

export const get = async <T>(
  endpoint: string,
  validator: z.ZodType<T> = z.any(),
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
    const res = await get(
      "/health",
      z.object({
        status: z.literal("OK").or(z.literal("OFFLINE")).or(z.literal("ERROR")),
        feature_flags: z.record(z.boolean()),
      }),
    );

    if (res === undefined) {
      return true;
    }

    const isReady = res.feature_flags["FEATURE_FLAG_PUBLIC"] &&
      res.status === "OK";

    return isReady;
  } catch {
    return false;
  }
};

export const getPronouns = async () => {
  const res = await get("/pronouns", GetPronounsResponseValidator);
  return res || {};
};

export const getUser = async (username: string) => {
  const res = await get("/users/" + username, UserValidator);

  return res;
};
