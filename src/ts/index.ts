import Logger from 'src/ts/logger';
import { setPronouns, processVoDMessage, processLiveMessage } from 'src/ts/messageProcessor';
import * as API from 'src/ts/api/pronouns.alejo.io';
import * as Selectors from 'src/ts/constants/selectors';

import 'src/style/content.scss';

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

	const elm: HTMLElement | null = document.querySelector(Selectors.ROOT);

	if (elm === null) {
		setTimeout(init, 1000);
		return;
	}

	const observer = new MutationObserver(mutationCallback);
	const config = { childList: true, subtree: true };

	observer.observe(elm, config);
}

init();
