/* jshint esversion: 8 */
import $ from 'jquery';
import { IPronouns } from './types/pronouns';
import * as API from './api/pronouns.alejo.io';
import * as Selectors from './constants/selectors';

import '../style/content.less';

let pronouns: IPronouns;
const isDashboard: boolean = window.location.hostname === "dashboard.twitch.tv";
const isPopout: boolean = /^\/popout\/([a-zA-Z0-9_]{3,50})\/chat/.test(window.location.pathname);
const isModView: boolean = /^\/moderator\/([a-zA-Z0-9_]{3,24})/.test(window.location.pathname);

function generatePronounBadge(text: string): JQuery<HTMLElement> {
	return $('<div>').attr({
		'class': 'tw-inline tw-relative tw-tooltip__container',
		'data-a-target': 'chat-badge',
	}).append($('<span>').attr({
		'class': "chat-badge user-pronoun",
		'data-a-target': "chat-badge",
	}).text(text)).append($('<div>').attr({
		'class': 'tw-tooltip tw-tooltip--align-left tw-tooltip--up',
		'data-a-target': 'tw-tooltip-label',
		'role': 'tooltip',
	}).text('Pronoun'));
}

let processMessage = async (target: JQuery<EventTarget> | HTMLElement) => {
	target = $(target) as JQuery<HTMLElement>;
	let userElm: JQuery<HTMLElement> = target.find(Selectors.CHAT_DISPLAY_NAME);
	let username: string | undefined = userElm.attr('data-a-user') || userElm.text().toLowerCase();

	if (username !== undefined) {
		let pronoun: string | undefined = await API.getUserPronoun(username);
		if (pronoun !== undefined) {
			let badges = target.find(Selectors.CHAT_BADGES);
			badges.append(generatePronounBadge(pronouns[pronoun]));
		}
	}
}

let chatInserted = (elm: JQuery<HTMLElement>): ((ev: Event) => void) => {
	return (ev: Event) => {
		if (!ev.target) {
			return;
		}

		if ($(ev.target).attr('data-a-target') === "chat-welcome-message") {
			elm.off('DOMNodeInserted');
			$(Selectors.CHAT_SCROLLABLE_AREA).on('DOMNodeInserted', chatMessageInterceptor);
		}
	}
}

let chatMessageInterceptor = async (ev: Event) => {
	if (!ev.target || (ev.target as HTMLElement).nodeName === "SPAN") {
		return;
	}
	let target: JQuery<EventTarget> = $(ev.target);
	await processMessage(target);
}

let init = async () => {
	pronouns = await API.getPronouns();
	let elm: JQuery<HTMLElement> = isDashboard || isModView || isPopout ? $(Selectors.ROOT) : $(Selectors.RIGHT_COLUMN_CHAT_BAR);
	elm.on('DOMNodeInserted', chatInserted(elm));
}

init();