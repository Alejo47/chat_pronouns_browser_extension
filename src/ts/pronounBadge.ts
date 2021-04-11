
export function generatePronounBadge(text: string): HTMLElement {
	let textSpan = document.createElement('span');
	{
		textSpan.setAttribute('class', "chat-badge user-pronoun")
		textSpan.setAttribute('data-a-target', "chat-badge")
		textSpan.innerText = text;
	}

	let tooltipElm = document.createElement('div');
	{
		tooltipElm.setAttribute('class', 'tw-tooltip tw-tooltip--align-left tw-tooltip--up');
		tooltipElm.setAttribute('data-a-target', 'tw-tooltip-label');
		tooltipElm.setAttribute('role', 'tooltip');
		tooltipElm.innerText = 'Pronoun';
	}

	let badgeDiv = document.createElement('div');
	{
		badgeDiv.setAttribute('class', 'tw-inline tw-relative tw-tooltip__container');
		badgeDiv.setAttribute('data-a-target', 'chat-badge');
		badgeDiv.setAttribute('data-provider', 'pronouns.alejo.io');
		badgeDiv.append(tooltipElm);
		badgeDiv.append(textSpan);
	}

	return badgeDiv;
}
