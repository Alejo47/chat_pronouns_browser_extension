import { IPronouns } from 'src/ts/types/deprecated/pronouns';
import * as Selectors from 'src/ts/constants/selectors';
import * as deprecatedAPI from 'src/ts/api/pronouns.alejo.io';
import * as newAPI from 'src/ts/api/api.pronouns.alejo.io';
import { generatePronounBadge } from 'src/ts/pronounBadge';
import { GetPronounsResponse } from './types/pronouns';
import { parsePronounGroupToString } from './helpers';

let deprecatedPronouns: IPronouns;
let newPronouns: GetPronounsResponse;
let _IsNewAPIAvailable = false;

export const setDeprecatedPronouns = (value: IPronouns) => {
	deprecatedPronouns = value
}

export const setNewPronouns = (value: GetPronounsResponse) => {
	newPronouns = value
}

export const checkForNewAPI = async () => {
	_IsNewAPIAvailable = await newAPI.getHealthcheck();
	return _IsNewAPIAvailable;
}

export const isNewAPIAvailable = () => _IsNewAPIAvailable;

export const tagAsProcessed = (target: HTMLElement, val: string = 'processing'): boolean => {
	if (target.getAttribute('pronouns') === null) {
		target.setAttribute('pronouns', '');
		return false;
	} else {
		return true;
	}
}

export const processVoDMessage = async (target: HTMLElement): Promise<HTMLElement> => {
	if (tagAsProcessed(target)) {
		return target;
	}

	const userElm: HTMLElement | null = target.querySelector(Selectors.VOD_CHAT_USERNAME);
	if (userElm === null) {
		return target;
	}

	const username: string | null = userElm.getAttribute('data-a-user') || userElm.textContent;
	if (username !== null) {
		if (isNewAPIAvailable()) {
			const user = await newAPI.getUser(username.toLowerCase());
			if (user !== undefined) {
	
				const badges = target.querySelector(Selectors.VOD_CHAT_BADGES);
				if (badges === null) {
					return target;
				}

				badges.append(
					generatePronounBadge(
						parsePronounGroupToString(
							newPronouns[user.pronoun_id],
							user.alt_pronoun_id ?
								newPronouns[user.alt_pronoun_id] :
								undefined,
						)
					)
				);
			}
		} else {
			const pronoun: string | undefined = await deprecatedAPI.getUserPronoun(username.toLowerCase());
			if (pronoun !== undefined) {
	
				const badges = target.querySelector(Selectors.VOD_CHAT_BADGES);
				if (badges === null) {
					return target;
				}

				badges.append(generatePronounBadge(deprecatedPronouns[pronoun]));
			}
		}
	}

	return target;
}

export const processLiveMessage = async (target: HTMLElement): Promise<HTMLElement> => {
	if (tagAsProcessed(target)) {
		return target;
	}

	const userElm: HTMLElement | null = target.querySelector(Selectors.LIVE_CHAT_DISPLAY_NAME) || target.querySelector(Selectors.FFZ.LIVE_CHAT_DISPLAY_NAME);
	if (userElm === null) {
		return target;
	}

	const username: string | null = userElm.getAttribute('data-a-user') || userElm.textContent;
	if (username !== null) {

		const pronoun: string | undefined = await deprecatedAPI.getUserPronoun(username.toLowerCase());
		if (pronoun !== undefined) {
			const badges = target.querySelector(`${Selectors.LIVE_CHAT_BADGES},${Selectors.FFZ.LIVE_CHAT_BADGES}`);
			if (badges === null) {
				return target;
			}

			badges.append(generatePronounBadge(deprecatedPronouns[pronoun]));
		}
	}

	return target;
}
