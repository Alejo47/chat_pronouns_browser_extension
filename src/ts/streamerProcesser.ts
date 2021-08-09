import { getUserPronoun } from './pronouns';

const PRONOUNS_TAG_ELEMENT_ID = "pr-streamer-tag";
const getPronounsElement = () => {
    return document.getElementById(PRONOUNS_TAG_ELEMENT_ID);
}

const getTagLinkElement = () => {
	/*
		We look for:
		+ It's a link <a>
		+ The tw-tag class
		+ A link to a tag page
	*/
	return document.querySelector("a.tw-tag[href*='/directory/all/tags']");
}

let haveTagElementsLoaded: boolean = false;

export const setHaveTagElementsLoaded = (value: boolean) => {
	haveTagElementsLoaded = value
}

export const getHaveTagElementsLoaded = (): boolean => {
	return haveTagElementsLoaded
}

export const onTagElementsLoaded = (callback: Function): void => {
    if (getHaveTagElementsLoaded()) {
        return;
    }

    const pronounsTagElement = getPronounsElement();
    const tagLinkElement = getTagLinkElement();

    if (pronounsTagElement || tagLinkElement) {
        setHaveTagElementsLoaded(true);
		callback();
        return;
    }
}



const getUsername = () => {
	const pathnameParts = window.location.pathname.split('/');
	if (pathnameParts.length < 2) {
		return;
	}

	const username = pathnameParts[1].toLowerCase();

	return username;
}

const validateTagMarkup = (tagLinkElement: Node) => {
	const [tagLinkSpacingElement] = tagLinkElement.childNodes
	if (!tagLinkSpacingElement) {
		return false;
	}

	const tagElement = tagLinkElement.parentElement;
	if (!tagElement) {
		return false;
	}

	return true;
}

const createNewTagElement = (tagElement: HTMLElement, pronoun: string, username: string) => {
	const newTagElement = tagElement.cloneNode(true) as any; // true copies all parts of element
	newTagElement.id = PRONOUNS_TAG_ELEMENT_ID;
	newTagElement.setAttribute('data-pronouns-username', username);

	const [newTagLinkElement] = newTagElement.childNodes;
	newTagLinkElement.setAttribute('aria-label', pronoun);
	newTagLinkElement.setAttribute('data-a-target', pronoun);
	newTagLinkElement.href = 'https://pronouns.alejo.io/';
	
	const [newTagLinkSpacingElement] = newTagLinkElement.childNodes;
	newTagLinkSpacingElement.innerHTML = pronoun;
	
	return newTagElement
}

export const processStreamerPronounsTag = async () => {
	const username = getUsername();
	if (!username) {
		return;
	}
	
	const pronounsTagElement = getPronounsElement();
	if (pronounsTagElement?.getAttribute('data-pronouns-username') === 'username') {
		return;
	}
	
	if (pronounsTagElement) {
		// remove any tag for other users
		pronounsTagElement.remove();
	}
	
	const tagLinkElement = getTagLinkElement();
	if (!tagLinkElement) {
		return;
	}

	if (!validateTagMarkup(tagLinkElement)) {
		return;
	}

	// the link is wrapped in some padding, lets get that element
	const tagElement = tagLinkElement.parentElement as HTMLElement;

	const pronoun = await getUserPronoun(username);
	if (!pronoun) {
		return;
	}

	const newTagElement = createNewTagElement(tagElement, pronoun, username);

	// add to tags container in the page
	const tagContainer = tagElement.parentElement as HTMLElement;
	tagContainer.prepend(newTagElement);
}