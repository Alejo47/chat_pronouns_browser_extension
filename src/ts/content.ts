/* jshint esversion: 8 */
import $ from 'jquery';
import Pronoun, { IPronouns } from './types/pronouns';

let pronouns: IPronouns;
const isDashboard: boolean = window.location.hostname === "dashboard.twitch.tv";

function generatePronounBadge(text: string): JQuery<HTMLElement> {
	return $('<div>').attr({
		'class': 'tw-inline tw-relative tw-tooltip-wrapper',
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

let chatInserted = (elm: JQuery<HTMLElement>): ((ev: Event) => void) => {
	return (ev: Event) => {
		if (!ev.target) {
			return;
		}

		if ($(ev.target).attr('data-a-target') === "chat-welcome-message") {
			elm.off('DOMNodeInserted');
			$('[data-test-selector="chat-scrollable-area__message-container"]').on('DOMNodeInserted', chatMessageInterceptor);
		}
	}
}

let chatMessageInterceptor = async (ev: Event) => {
	debugger
	if (!ev.target || (ev.target as HTMLElement).nodeName === "SPAN") {
		return;
	}
	let target: JQuery<EventTarget> = $(ev.target);
	let username: string | undefined = target.find('span.chat-author__display-name').attr('data-a-user');

	if (username !== undefined) {
		let pronoun: string | undefined = await Pronoun.getUserPronoun(username);
		if (pronoun !== undefined) {
			let badges = target.find('.chat-line__username-container.tw-inline-block > span:not([class])');
			badges.append(generatePronounBadge(pronouns[pronoun]));
		}
	}
}

let init = async () => {
	pronouns = await Pronoun.getPronouns();
	let elm: JQuery<HTMLElement> = !isDashboard ? $('[data-a-target="right-column-chat-bar"]') : $('#root');
	elm.on('DOMNodeInserted', chatInserted(elm));
}

init();