import Logger from "src/ts/logger";
import {
  processLiveMessage,
  processVoDMessage,
  setNewPronouns,
} from "src/ts/messageProcessor";
import * as api from "src/ts/api/api.pronouns.alejo.io";
import * as Selectors from "src/ts/constants/selectors";

import "src/style/content.css";

const isVoD = () => /^\/videos\/\d+/.test(window.location.pathname);

const nodeParser = (node: Node) => {
  if (!(node instanceof HTMLElement)) {
    return;
  } else if (node.getAttribute("data-a-target") === "pr-badge-cnt") {
    return;
  }

  if (node.querySelector(`[data-a-target="chat-line-message"]`)) {
    Logger.debug(node);
    processLiveMessage(node);
  } else if (isVoD() && node.nodeName.toUpperCase() === "LI") {
    Logger.debug(node);
    processVoDMessage(node);
  }
};

const init = async () => {
  const elm = document.querySelector(Selectors.ROOT);

  if (elm === null) {
    // If not found, retry
    setTimeout(init, 1000);
    return;
  }

  Logger.info("Fetching pronouns");
  const pronouns = await api.getPronouns();
  setNewPronouns(pronouns);
  Logger.info("Fetched pronouns");

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes) {
        for (const node of mutation.addedNodes) {
          nodeParser(node);
        }
      }
    }
  });

  const config = { childList: true, subtree: true };

  observer.observe(elm, config);
};

init();
