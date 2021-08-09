/* jshint esversion: 8 */
import Logger from './logger';
import { initPronouns } from './pronouns';
import { processVoDMessage, processLiveMessage } from './messageProcessor';
import { onTagElementsLoaded, setHaveTagElementsLoaded, processStreamerPronounsTag } from './streamerProcesser';
import * as Selectors from './constants/selectors';

import '../style/content.less';

const isVoD = (): boolean => /^\/videos\/\d+/.test(window.location.pathname);

const nodeParser = (node: Node) => {
	if (node instanceof HTMLElement) {
        Logger.debug(node);

		if (node.getAttribute("data-test-selector") === "chat-line-message" || node.classList.contains('chat-line__message')) {
			processLiveMessage(node);
		} else if (node.classList.contains("chat-line__message--badges") && node.parentElement) {
			processLiveMessage(node.parentNode as HTMLElement);
		} else if (isVoD() && node.nodeName.toUpperCase() === "LI") {
			processVoDMessage(node);
		}
	}
}

let lastUrl = window.location.href; 
const handleURLChanges = () => {
	const url = window.location.href;
	if (url !== lastUrl) {
        lastUrl = url;	
        setHaveTagElementsLoaded(false);
	}
}

const mutationCallback = (mutations: MutationRecord[]) => {
    handleURLChanges();

	mutations.forEach((mutation: MutationRecord) => {		
		if (!mutation.addedNodes || mutation.addedNodes.length === 0) {
			return;
		}

		onTagElementsLoaded(() => {
			processStreamerPronounsTag();
		})
        
        const hasApplicationLoaded: boolean = !!document.querySelector(Selectors.ROOT);
        if (hasApplicationLoaded) {
		    mutation.addedNodes.forEach(nodeParser);
        }
	});
}


const init = async () => {
	Logger.info('Fetching pronouns');
	await initPronouns();
	Logger.info('Fetched pronouns');

	const observer = new MutationObserver(mutationCallback);
	const config = { childList: true, subtree: true };
	observer.observe(document.body, config);
}

init();
