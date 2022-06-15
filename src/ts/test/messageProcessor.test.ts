import { expect } from "chai";
import 'isomorphic-fetch';
import nock from 'nock';
import { mockPronouns, mockUser } from "src/ts/api/pronouns.alejo.io.mockData";
import { processLiveMessage, processVoDMessage, setDeprecatedPronouns } from "src/ts/messageProcessor";

const chatMessageText = 'test';
const chatMessageUsername = 'Alejo_47';

const chatMessageFakeUsername = 'NotAnUser';

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

const generateSampleLiveChatMessage = (username: string): HTMLElement => {
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
					'data-a-user': username.toLowerCase(),
					'data-test-selector': 'message-username',
					'style': 'color: rgb(0, 0, 0);'
				}, 'chat-author__display-name', [
					username
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

const generateSampleVoDChatMessage = (username: string): HTMLElement => {
	
	const timeStamp = createElement('div', {
		'data-test-selector': 'message-timestamp'
	}, 'tw-align-right tw-flex tw-flex-shrink-0 vod-message__header', [
		createElement('div', undefined, 'tw-mg-r-05', [
			createElement('div', {
				'aria-describedby': 'b7614cc32145289920ebff8a7a2d01e9'
			}, 'tw-inline-flex tw-relative tw-tooltip__container', [
				createElement('button', undefined, 'ScInteractableBase-awmohi-0 ScInteractableDefault-awmohi-1 bArsnw tw-block tw-full-width tw-interactable', [
					createElement('div', undefined, 'tw-pd-x-05', [
						createElement('p', undefined, 'tw-font-size-7', [
							'1:23:45'
						])
					])
				]),
				createElement('div', {
					'data-a-target': 'tw-tooltip-label',
					'role': 'tooltip',
					'id': 'b7614cc32145289920ebff8a7a2d01e9'
				}, 'tw-tooltip tw-tooltip--align-left tw-tooltip--up', [
					'Jump to video'
				])
			])
		])
	]);

	const messageAuthor = createElement('a', {
		'data-test-selector': 'comment-author-selector',
		'data-tt_content': 'tab_videos',
		'data-tt_medium': 'video-message-author',
		'rel': 'noopener noreferrer',
		'target': '_blank',
		'href': `/${username.toLowerCase()}`
	}, 'ScCoreLink-udwpw5-0 hiykSn tw-link video-chat__message-author video-chat__message-author--me', [
		createElement('span', undefined, undefined, [
			createElement('span', {
				'data-a-target': "chat-message-username", 'data-a-user': "alejo_47",
				'data-test-selector': "message-username",
				'style': "color: rgb(0, 0, 0);"
			}, 'chat-author__display-name', [
				username
			])
		])
	])

	const messageText = createElement('div', {
		'data-test-selector': 'comment-message-selector'
	}, 'tw-inline video-chat__message', [
		createElement('span', undefined, 'tw-pd-r-05', [ ':' ]),
		createElement('span', undefined, '', [
			createElement('span', {
				'data-a-target': 'chat-message-text'
			}, 'text-fragment', [
				chatMessageText
			])
		])
	])
	
	const message = createElement('div', undefined, 'tw-full-width', [
		createElement('div', undefined, 'tw-align-items-start tw-flex tw-flex-nowrap', [
			createElement('div', undefined, 'tw-flex-grow-1', [
				createElement('span', undefined, undefined, [
					generateTurboBadge()
				]),
				messageAuthor,
				messageText
			]),
			createElement('div', {
				'data-test-selector': 'menu-options-wrapper'
			}, 'tw-flex-shrink-0 video-chat__message-menu', [
				createElement('div', undefined, 'tw-mg-05')
			])
		])
	])

	return createElement('li', undefined, 'tw-full-width', [
		createElement('div', {
			'data-test-selector': 'message-layout'
		}, 'tw-align-items-start tw-flex tw-flex-nowrap tw-full-width vod-message vod-message--timestamp', [
			timeStamp,
			message
		])
	]);
};

describe('Message from user with pronouns', () => {
	beforeEach(() => {
		setDeprecatedPronouns(mockPronouns);
		nock('https://pronouns.alejo.io')
			.get('/api/users/' + chatMessageUsername.toLowerCase())
			.reply(200, [mockUser]);
	})

	it('should insert pronouns in live message', async () => {
		const sampleChatMessage = generateSampleLiveChatMessage(chatMessageUsername);

		const element = await processLiveMessage(sampleChatMessage);

		console.log(element.outerHTML)

		const pronounsBadge = element.querySelector('[data-provider="pronouns.alejo.io"]');
		const pronounsBadgeSpan = element.querySelector('span[data-a-target="pr-badge-txt"]');

		expect(pronounsBadge).to.exist;
		expect(pronounsBadgeSpan).to.exist;
		expect(pronounsBadgeSpan ? pronounsBadgeSpan.textContent : undefined).to.be.equals(mockPronouns[mockUser.pronoun_id]);
	})

	it('should insert pronouns in VOD message', async () => {
		const sampleChatMessage = generateSampleVoDChatMessage(chatMessageUsername);

		const element = await processVoDMessage(sampleChatMessage);

		const pronounsBadge = element.querySelector('[data-provider="pronouns.alejo.io"]');
		const pronounsBadgeSpan = element.querySelector('span[data-a-target="pr-badge-txt"]');

		expect(pronounsBadge).to.exist;
		expect(pronounsBadgeSpan).to.exist;
		expect(pronounsBadgeSpan ? pronounsBadgeSpan.textContent : undefined).to.be.equals(mockPronouns[mockUser.pronoun_id]);
	})
})

describe('Message from user without pronouns', () => {
	beforeEach(() => {
		setDeprecatedPronouns(mockPronouns);
		nock('https://pronouns.alejo.io')
			.get('/api/users/' + chatMessageFakeUsername.toLowerCase())
			.reply(200, []);
	})

	it('should not insert pronouns in live message', async () => {
		const sampleChatMessage = generateSampleLiveChatMessage(chatMessageFakeUsername);

		const element = await processLiveMessage(sampleChatMessage);

		const pronounsBadge = element.querySelector('[data-provider="pronouns.alejo.io"]');

		expect(pronounsBadge).to.not.exist;
	})

	it('should not insert pronouns in VOD message', async () => {
		const sampleChatMessage = generateSampleVoDChatMessage(chatMessageFakeUsername);

		const element = await processVoDMessage(sampleChatMessage);

		const pronounsBadge = element.querySelector('[data-provider="pronouns.alejo.io"]');

		expect(pronounsBadge).to.not.exist;
	})
})