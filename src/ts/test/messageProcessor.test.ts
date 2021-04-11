import { expect } from "chai";
import 'isomorphic-fetch';
import nock from 'nock';
import { mockPronouns, mockUser } from "../api/pronouns.alejo.io.mockData";
import { processLiveMessage, setPronouns } from "../messageProcessor";

const chatMessageText = 'test';
const chatMessageUsername = 'Alejo_47';

const createElement = (nodeKind: keyof HTMLElementTagNameMap, attrs?: { [key: string]: string }, classNames?: string, children?: (string | Node)[]): HTMLElement => {
	let node = document.createElement(nodeKind);
	if (attrs !== undefined) {
		Object.keys(attrs).forEach(
			(key: string) => node.setAttribute(key, attrs[key])
		);
	}

	if (classNames !== undefined) {
		node.className = classNames;
	}

	if (children !== undefined) {
		node.append(...children);
	}

	return node;
}

const generateTurboBadge = () => {
	return createElement('a', {
		'data-a-target': 'chat-badge',
		'class': 'ScCoreLink-udwpw5-0 hiykSn tw-link',
		'rel': 'noopener noreferrer',
		'target': '_blank',
		'href': 'https://www.twitch.tv/products/turbo?ref=chat_badge'
	}, 'tw-inline tw-relative tw-tooltip__container', [
		createElement('img', {
			'alt': 'Turbo',
			'aria-label': 'Turbo badge',
			'src': 'https://static-cdn.jtvnw.net/badges/v1/bd444ec6-8f34-4bf9-91f4-af1e3428d80f/1'
		}, 'chat-badge')
	]);
}

const generateSampleChatMessage = (): HTMLElement => {
	const userInformationElement = createElement('div', undefined, 'chat-line__username-container tw-inline-block', [ // User information
		createElement('span', undefined, undefined, [ // User badges
			generateTurboBadge()
		]),
		createElement('span', { // Username
			'role': 'button',
			'tabindex': '0'
		}, 'chat-line__username', [
			createElement('span', undefined, undefined, [ // Display name wrapper
				createElement('span', { // Display name
					'data-a-target': 'chat-message-username',
					'data-a-user': chatMessageUsername.toLowerCase(),
					'data-test-selector': 'message-username',
					'style': 'color: rgb(0, 0, 0);'
				}, 'chat-author__display-name', [
					chatMessageUsername
				])
			])
		])
	])

	const chatLine = createElement('div', undefined, 'chat-line__no-background tw-inline', [ // Chat line
		userInformationElement,
		createElement('span', { // Username-Message separator
			'aria-hidden': 'true',
			'data-test-selector': 'chat-message-separator'
		}, undefined, [': ']),
		createElement('span', { // Message Text
			'data-a-target': 'chat-message-text'
		}, 'text-fragment', [
			chatMessageText
		]),
	]);

	return createElement('div', { // Chat line wrapper
		'data-a-target': 'chat-line-message',
		'data-test-selector': 'chat-line-message',
		'tabindex': '0'
	}, 'chat-line__message', [
		createElement('div', undefined, 'tw-relative', [ // Chat line sub-wrapper
			createElement('div', undefined, 'tw-relative', [ // Chat line sub-wrapper
				createElement('div', undefined, '', [ // Chat line sub-wrapper
					chatLine
				])
			])
		])
	]);
};

describe('Message from user with pronouns', () => {
	const sampleChatMessage = generateSampleChatMessage();
	before(() => {
		setPronouns(mockPronouns);
		nock('https://pronouns.alejo.io:443')
			.get('/api/users/' + chatMessageUsername.toLowerCase())
			.reply(200, [mockUser]);
	})

	it('should insert pronouns in live message', (done: () => void) => {
		processLiveMessage(sampleChatMessage).then((element: Element) => {
			const pronounsBadge = element.querySelector('[data-provider="pronouns.alejo.io"]');
			const pronounsBadgeSpan = element.querySelector('span[data-a-target="chat-badge"]');

			expect(pronounsBadge).to.exist;
			expect(pronounsBadgeSpan).to.exist;
			expect(pronounsBadgeSpan ? pronounsBadgeSpan.textContent : undefined).to.be.equals(mockPronouns[mockUser.pronoun_id]);
			done();
		}).catch(done);
	})

	xit('should insert pronouns in VOD message', () => {
		// TODO
	})
})