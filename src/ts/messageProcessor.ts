import { IPronouns } from './types/pronouns';
import Logger from './logger';
import * as Selectors from './constants/selectors';
import * as API from './api/pronouns.alejo.io';

let pronouns: IPronouns;

export const setPronouns = (value: IPronouns) => {
	pronouns = value
}

const generatePronounBadge = (text: string): HTMLElement => {
	let textSpan = document.createElement('span');
	{
		textSpan.setAttribute('class', "chat-badge user-pronoun")
		textSpan.setAttribute('data-a-target', "chat-badge")
		textSpan.innerText = text;
	}

	let tooltipElm = document.createElement('div');
	{
		tooltipElm.setAttribute('class', 'tw-tooltip tw-tooltip--align-left tw-tooltip--up');
		tooltipElm.setAttribute('data-a-target', 'tw-tooltip-label');
		tooltipElm.setAttribute('role', 'tooltip');
		tooltipElm.innerText = 'Pronoun';
	}

	let badgeDiv = document.createElement('div');
	{
		badgeDiv.setAttribute('class', 'tw-inline tw-relative tw-tooltip__container');
		badgeDiv.setAttribute('data-a-target', 'chat-badge');
		badgeDiv.setAttribute('data-provider', 'pronouns.alejo.io');
		badgeDiv.append(tooltipElm);
		badgeDiv.append(textSpan);
	}

	console.log(textSpan, tooltipElm, badgeDiv);

	return badgeDiv;
}

export const tagAsProcessed = (target: HTMLElement, val: string = 'processing'): boolean => {
	if (target.getAttribute('pronouns') === null) {
		target.setAttribute('pronouns', '');
		return false;
	} else {
		return true;
	}
}

export const processVoDMessage = async (target: HTMLElement) => {
	if (tagAsProcessed(target)) {
		return;
	}

	const userElm: HTMLElement | null = target.querySelector(Selectors.VOD_CHAT_USERNAME);
	if (userElm === null) {
		return;
	}

	const username: string | null = userElm.getAttribute('data-a-user') || userElm.innerText.toLowerCase();
	if (username !== null) {
		const pronoun: string | undefined = await API.getUserPronoun(username);
		if (pronoun !== undefined) {

			const badges = target.querySelector(Selectors.VOD_CHAT_BADGES);
			if (badges === null) {
				return;
			}

			badges.append(generatePronounBadge(pronouns[pronoun]));
		}
	}
}

export const processLiveMessage = async (target: HTMLElement) => {
	if (tagAsProcessed(target)) {
		return;
	}

	const userElm: HTMLElement | null = target.querySelector(Selectors.LIVE_CHAT_DISPLAY_NAME) || target.querySelector(Selectors.FFZ.LIVE_CHAT_DISPLAY_NAME);
	if (userElm === null) {
		return;
	}

	const username: string | undefined = userElm.getAttribute('data-a-user') || userElm.innerText.toLowerCase();

	if (username !== undefined) {
		const pronoun: string | undefined = await API.getUserPronoun(username);
		if (pronoun !== undefined) {
			const badges = target.querySelector(`${Selectors.LIVE_CHAT_BADGES},${Selectors.FFZ.LIVE_CHAT_BADGES}`);
			if (badges === null) {
				return;
			}

			badges.append(generatePronounBadge(pronouns[pronoun]));
		}
	}
}
