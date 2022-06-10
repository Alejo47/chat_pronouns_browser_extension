import * as Selectors from './constants/selectors';
import { generatePronounBadge } from './pronounBadge';
import { getUserPronoun } from './pronouns';

export const tagAsProcessed = (target: HTMLElement): boolean => {
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
	if (!userElm) {
		return target;
	}

	const badges = target.querySelector(Selectors.VOD_CHAT_BADGES);
	if (!badges) {
		return target;
	}

	const username: string | null = userElm.getAttribute('data-a-user') || userElm.textContent;
	if (!username) {
		return target;
	}

	const userPronoun = await getUserPronoun(username);
	if (!userPronoun) {
		return target;
	}

	badges.prepend(generatePronounBadge(userPronoun));

	return target;
}

export const processLiveMessage = async (target: HTMLElement): Promise<HTMLElement> => {
	if (tagAsProcessed(target)) {
		return target;
	}

	const userElm: HTMLElement | null = target.querySelector(Selectors.LIVE_CHAT_DISPLAY_NAME) || target.querySelector(Selectors.FFZ.LIVE_CHAT_DISPLAY_NAME);
	if (!userElm) {
		return target;
	}
	
	const badges = target.querySelector(`${Selectors.LIVE_CHAT_BADGES},${Selectors.FFZ.LIVE_CHAT_BADGES}`);
	if (!badges) {
		return target;
	}

	const username: string | null = userElm.getAttribute('data-a-user') || userElm.textContent;
	if (!username) {
		return target;
	}

	const userPronoun = await getUserPronoun(username);
	if (!userPronoun) {
		return target;
	}
	

	badges.prepend(generatePronounBadge(userPronoun));

	return target;
}
