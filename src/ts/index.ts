import Logger from "src/ts/logger";
import {
  checkForNewAPI,
  isNewAPIAvailable,
  processLiveMessage,
  processVoDMessage,
  setDeprecatedPronouns,
  setNewPronouns,
} from "src/ts/messageProcessor";
import * as deprecatedAPI from "src/ts/api/pronouns.alejo.io";
import * as newAPI from "src/ts/api/api.pronouns.alejo.io";
import * as Selectors from "src/ts/constants/selectors";

import "src/style/content.css";

const isVoD = () => /^\/videos\/\d+/.test(window.location.pathname);

const nodeParser = (node: Node) => {
  if (!(node instanceof HTMLElement)) {
    return;
  }
  if (
    node.getAttribute("data-a-target") === "pr-badge-cnt" ||
    node.classList.contains("kFXyOc") ||
    node.getAttribute("data-test-selector") ===
      "channel-leaderboard-container"
  ) {
    return;
  }

  if (
    node.getAttribute("data-test-selector") === "chat-line-message" ||
    node.classList.contains("chat-line__message")
  ) {
    Logger.debug(node);
    processLiveMessage(node);
  } else if (
    node.classList.contains("chat-line__message--badges") &&
    node.parentElement
  ) {
    Logger.debug(node);
    processLiveMessage(node.parentNode as HTMLElement);
  } else if (isVoD() && node.nodeName.toUpperCase() === "LI") {
    Logger.debug(node);
    processVoDMessage(node);
  } else {
    // Logger.debug("uknown node:", node);
  }
};

const init = async () => {
  Logger.info("Checking for new API");
  await checkForNewAPI();
  Logger.info(`New API status: ${isNewAPIAvailable() ? "RUNNING" : "OFFLINE"}`);
  Logger.info("Fetching pronouns");
  if (!isNewAPIAvailable()) {
    const pronouns = await deprecatedAPI.getPronounsDeprecated();
    setDeprecatedPronouns(pronouns);
  } else {
    const pronouns = await newAPI.getPronouns();
    setNewPronouns(pronouns);
  }
  Logger.info("Fetched pronouns");

  const elm = document.querySelector(Selectors.ROOT);

  if (elm === null) {
    setTimeout(init, 1000);
    return;
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(nodeParser);
      }
    });
  });
  const config = { childList: true, subtree: true };

  observer.observe(elm, config);
};

init();
