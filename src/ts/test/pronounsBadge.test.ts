import { assert, expect } from 'chai';
import { generatePronounBadge } from '../pronounBadge';

describe('Function generatePronounBadge', () => {
	const pronounText = "Some/Pronouns";

	var badge = generatePronounBadge(pronounText);

	it('should build base DIV badge', () => {
		assert(badge instanceof HTMLDivElement, 'be proper node type');

		expect(badge.childElementCount, 'have 2 children').to.be.equal(2);
		expect(badge.getAttribute('data-a-target'), 'have proper target').to.be.equal('chat-badge');
		expect(badge.getAttribute('data-provider'), 'have proper provider').to.be.equal('pronouns.alejo.io');
	})

	it('should build DIV tooltip', () => {
		assert(badge.children[0] instanceof HTMLDivElement, 'is a DIV element');

		const tooltip = badge.children[0] as HTMLDivElement;

		expect(tooltip.getAttribute('data-a-target'), 'have proper target').to.be.equal('tw-tooltip-label');
		expect(tooltip.getAttribute('role'), 'have proper role').to.be.equal('tooltip');
		expect(tooltip.textContent, 'have proper role').to.be.equal('Pronoun(s)');
	})

	it('should build SPAN including text', () => {
		assert(badge.children[1] instanceof HTMLSpanElement, 'is a SPAN element');

		const badgeSpan = badge.children[1] as HTMLSpanElement;

		expect(badgeSpan.getAttribute('data-a-target'), 'have proper target').to.be.equal('chat-badge');
		expect(badgeSpan.textContent, 'have proper role').to.be.equal(pronounText);
	})
})