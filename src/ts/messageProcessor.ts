import * as Selectors from "src/ts/constants/selectors";
import * as api from "src/ts/api/api.pronouns.alejo.io";
import { generatePronounBadge } from "src/ts/pronounBadge";
import { GetPronounsResponse } from "./types/pronouns";
import { parsePronounGroupToString } from "./helpers";

let newPronouns: GetPronounsResponse;

export const setNewPronouns = (value: GetPronounsResponse) => {
  newPronouns = value;
};

export const tagAsProcessed = (target: HTMLElement) => {
  if (target.getAttribute("pronouns") === null) {
    target.setAttribute("pronouns", "");
    return false;
  } else {
    return true;
  }
};

export const processVoDMessage = async (
  target: HTMLElement,
): Promise<HTMLElement> => {
  if (tagAsProcessed(target)) {
    return target;
  }

  const userElm: HTMLElement | null = target.querySelector(
    Selectors.VOD_CHAT_USERNAME,
  );
  if (userElm === null) {
    return target;
  }

  const username: string | null =
    userElm.getAttribute("data-a-user") || userElm.textContent;
  if (username !== null) {
    const user = await api.getUser(username.toLowerCase());
    if (user !== undefined) {
      const badges = target.querySelector(Selectors.VOD_CHAT_BADGES);
      if (badges === null) {
        return target;
      }

      badges.insertAdjacentHTML(
        "beforeend",
        generatePronounBadge(
          parsePronounGroupToString(
            newPronouns[user.pronoun_id],
            user.alt_pronoun_id
              ? newPronouns[user.alt_pronoun_id]
              : undefined,
          ),
        ),
      );
    }
  }

  return target;
};

export const processLiveMessage = async (
  target: HTMLElement,
): Promise<HTMLElement> => {
  if (tagAsProcessed(target)) {
    return target;
  }

  const userElm: HTMLElement | null =
    target.querySelector(Selectors.LIVE_CHAT_DISPLAY_NAME) ||
    target.querySelector(Selectors.FFZ.LIVE_CHAT_DISPLAY_NAME);
  if (userElm === null) {
    return target;
  }
  const username = userElm.getAttribute("data-a-user") || userElm.textContent;
  if (username !== null) {
    const pronouns = await api.getUser(username.toLowerCase());
    if (pronouns !== undefined) {
      const badges = target.querySelector(
        `${Selectors.LIVE_CHAT_BADGES},${Selectors.FFZ.LIVE_CHAT_BADGES}`,
      );
      if (badges === null) {
        return target;
      }

      let prettyPrint: string = newPronouns[pronouns.pronoun_id].subject;

      if (!newPronouns[pronouns.pronoun_id].singular) {
        if (pronouns.alt_pronoun_id) {
          prettyPrint += "/" + newPronouns[pronouns.alt_pronoun_id].subject;
        } else {
          prettyPrint += "/" + newPronouns[pronouns.pronoun_id].object;
        }
      }

      const badgeHTML = generatePronounBadge(prettyPrint);

      badges.insertAdjacentHTML("beforeend", badgeHTML);
    }
  }

  return target;
};
