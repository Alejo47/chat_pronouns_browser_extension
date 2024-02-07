import { z } from "zod";
import { GetPronounsResponseValidator } from "../types/pronouns";
import { User, UserValidator } from "../types/users";

const userFetchingCache: Record<string, Promise<User | undefined>> = {};

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
  if (userFetchingCache[username] !== undefined) {
    return await userFetchingCache[username];
  }

  const promise = new Promise<User | undefined>(async (res, rej) => {
    try {
      const response = await get("/users/" + username, UserValidator);

      res(response);
    } catch (ex) {
      rej(ex);
    }
  });

  userFetchingCache[username] = promise;
  setTimeout(() => {
    delete userFetchingCache[username];
  }, 15 * 60 * 1000);
  return await promise;
};
