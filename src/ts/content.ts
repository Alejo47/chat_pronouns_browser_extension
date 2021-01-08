/* jshint esversion: 8 */
import $ from 'jquery';
import { IPronouns } from './types/pronouns';
import * as API from './api/pronouns.alejo.io';
import * as Selectors from './constants/selectors';

import '../style/content.less';

let pronouns: IPronouns;
const isVoD: boolean = /^\/videos\/\d+/.test(window.location.pathname);

const generatePronounBadge = (text: string): JQuery<HTMLElement> => {
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

const processVoDMessage = async (target: JQuery<EventTarget> | HTMLElement) => {
	target = $(target) as JQuery<HTMLElement>;
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

const processLiveMessage = async (target: JQuery<EventTarget> | HTMLElement) => {
	target = $(target) as JQuery<HTMLElement>;
	const userElm: JQuery<HTMLElement> = target.find(Selectors.LIVE_CHAT_DISPLAY_NAME);
	const username: string | undefined = userElm.attr('data-a-user') || userElm.text().toLowerCase();

	if (username !== undefined) {
		const pronoun: string | undefined = await API.getUserPronoun(username);
		if (pronoun !== undefined) {
			const badges = target.find(Selectors.LIVE_CHAT_BADGES);
			badges.append(generatePronounBadge(pronouns[pronoun]));
		}
	}
}

const nodeParser = (node: Node) => {
	if (node instanceof HTMLElement) {
		if (node.getAttribute("data-test-selector") === "chat-line-message") {
			processLiveMessage(node);
		} else if (isVoD && node.nodeName.toUpperCase() === "LI") {
			processVoDMessage(node);
		}
	}
}

const mutationCallback = (mutations: MutationRecord[]) => {
	mutations.forEach((mutation: MutationRecord) => {
		if (mutation.addedNodes && mutation.addedNodes.length > 0) {
			mutation.addedNodes.forEach(nodeParser);
		}
	});
}

const init = async () => {
	pronouns = await API.getPronouns();
	const elm: JQuery<HTMLElement> = $(Selectors.ROOT);
	if (elm.length <= 0) {
		setTimeout(init, 1000);
		return;
	}
	const observer = new MutationObserver(mutationCallback);
	const config = { childList: true, subtree: true };
	observer.observe(elm[0], config);
}

init();