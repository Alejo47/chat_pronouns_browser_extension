import $ from 'jquery';
import { IPronouns } from './types/pronouns';
import Logger from './logger';
import * as Selectors from './constants/selectors';
import * as API from './api/pronouns.alejo.io';

let pronouns: IPronouns;

export const setPronouns = (value: IPronouns) => {
	pronouns = value
}

const generatePronounBadge = (text: string): JQuery<HTMLElement> => {
	return $('<div>').attr({
		'class': 'tw-inline tw-relative tw-tooltip__container',
		'data-a-target': 'chat-badge',
		'data-provider': 'pronouns.alejo.io',
	}).append($('<span>').attr({
		'class': "chat-badge user-pronoun",
		'data-a-target': "chat-badge",
	}).text(text)).append($('<div>').attr({
		'class': 'tw-tooltip tw-tooltip--align-left tw-tooltip--up',
		'data-a-target': 'tw-tooltip-label',
		'role': 'tooltip',
	}).text('Pronoun'));
}

export const tagAsProcessed = (target: JQuery<EventTarget>, val: string = 'processing'): boolean => {
	if (typeof( target.attr('pronouns') ) === 'undefined' ) {
		target.attr('pronouns', '');
		return false;
	} else {
		return true;
	}
}

export const processVoDMessage = async (target: JQuery<EventTarget> | HTMLElement) => {
	target = $(target) as JQuery<HTMLElement>;
	if (tagAsProcessed(target)) {
		return;
	}
	const userElm: JQuery<HTMLElement> = target.find(Selectors.VOD_CHAT_USERNAME);
	const username: string | undefined = userElm.attr('data-a-user') || userElm.text().toLowerCase();

	if (username !== undefined) {
		const pronoun: string | undefined = await API.getUserPronoun(username);
		if (pronoun !== undefined) {
			const badges = target.find(Selectors.VOD_CHAT_BADGES);
			badges.append(generatePronounBadge(pronouns[pronoun]));
		}
	}
}

export const processLiveMessage = async (target: JQuery<EventTarget> | HTMLElement) => {
	target = $(target) as JQuery<HTMLElement>;
	if (tagAsProcessed(target)) {
		return;
	}
	const userElm: JQuery<HTMLElement> = target.find(Selectors.LIVE_CHAT_DISPLAY_NAME) || target.find(Selectors.FFZ.LIVE_CHAT_DISPLAY_NAME);
	const username: string | undefined = userElm.attr('data-a-user') || userElm.text().toLowerCase();

	if (username !== undefined) {
		const pronoun: string | undefined = await API.getUserPronoun(username);
		if (pronoun !== undefined) {
			const badges = target.find(`${Selectors.LIVE_CHAT_BADGES},${Selectors.FFZ.LIVE_CHAT_BADGES}`);
			badges.append(generatePronounBadge(pronouns[pronoun]));
		}
	}
}
