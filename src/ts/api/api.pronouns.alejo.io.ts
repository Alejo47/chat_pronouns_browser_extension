import axios from "axios";
import path from "path";
import { GetPronounsResponse } from "src/ts/types/pronouns";
import { User } from "src/ts/types/users";

async function get<T = JSON>(endpoint: string): Promise<T> {
  const url = new URL(
    process.env.BASE_API_URL ?? "https://api.pronouns.alejo.io/v1"
  );
  url.pathname = path.join(url.pathname, endpoint);
  return await axios.get(url.toString());
}

export async function getHealthcheck(): Promise<boolean> {
  try {
    const res = await get<{
      "cache-size": number;
      "cache-keys": string[];
      "cache-status": "OK" | "ERROR";
      "pubsub-status": "OK" | "ERROR";
      status: "OK" | "ERROR";
    }>("/healthcheck");

    return (
      res.status === "OK" &&
      res["cache-status"] === "OK" &&
      res["pubsub-status"] === "OK"
    );
  } catch {
    return false;
  }
}

export async function getPronouns(): Promise<GetPronounsResponse> {
  return await get<GetPronounsResponse>("pronouns");
}

export async function getUser(username: string): Promise<User> {
  return await get<User>("users/" + username);
}
