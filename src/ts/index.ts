/* jshint esversion: 8 */
import $ from 'jquery';
import Logger, { LoggerLevel } from './logger';
import { IPronouns } from './types/pronouns';
import { setPronouns, processVoDMessage, processLiveMessage } from './messageProcessor';
import * as API from './api/pronouns.alejo.io';
import * as Selectors from './constants/selectors';

import '../style/content.less';

const isVoD = (): boolean => /^\/videos\/\d+/.test(window.location.pathname);

const nodeParser = (node: Node) => {
	if (node instanceof HTMLElement) {
		if (node.getAttribute("data-test-selector") === "chat-line-message" || node.classList.contains('chat-line__message')) {
			Logger.debug(node);
			processLiveMessage(node);
		} else if (node.classList.contains("chat-line__message--badges") && node.parentElement) {
			Logger.debug(node);
			processLiveMessage(node.parentNode as HTMLElement);
		} else if (isVoD() && node.nodeName.toUpperCase() === "LI") {
			Logger.debug(node);
			processVoDMessage(node);
		} else {
			Logger.debug(node);
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
	Logger.info('Fetching pronouns');
	setPronouns(await API.getPronouns());
	Logger.info('Fetched pronouns');

	const elm: JQuery<HTMLElement> = $(Selectors.ROOT);

	if (elm.length === 0) {
		setTimeout(init, 1000);
		return;
	}

	const observer = new MutationObserver(mutationCallback);
	const config = { childList: true, subtree: true };

	observer.observe(elm[0], config);
}

init();
