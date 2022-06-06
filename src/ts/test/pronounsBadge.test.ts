import { assert, expect } from 'chai';
import { generatePronounBadge } from 'src/ts/pronounBadge';

describe('Function generatePronounBadge', () => {
	const pronounText = "Some/Pronouns";

	var badge = generatePronounBadge(pronounText);

	it('should build base DIV badge', () => {
		assert(badge instanceof HTMLDivElement, 'be proper node type');

		expect(badge.childElementCount, 'have 2 children').to.be.equal(2);
		expect(badge.getAttribute('data-a-target'), 'have proper target').to.be.equal('pr-badge-cnt');
		expect(badge.getAttribute('data-provider'), 'have proper provider').to.be.equal('pronouns.alejo.io');
	})

	it('should build SPAN including text', () => {
		assert(badge.children[0] instanceof HTMLSpanElement, 'is a SPAN element');

		const badgeSpan = badge.children[0] as HTMLSpanElement;

		expect(badgeSpan.getAttribute('data-a-target'), 'have proper target').to.be.equal('pr-badge-txt');
		expect(badgeSpan.textContent, 'have proper role').to.be.equal(pronounText);
	})

	it('should build DIV tooltip', () => {
		assert(badge.children[1] instanceof HTMLDivElement, 'is a DIV element');

		const badgeTooltip = badge.children[1] as HTMLDivElement;

		expect(badgeTooltip.getAttribute('data-a-target'), 'have proper target').to.be.equal('pr-badge-tt');
		expect(badgeTooltip.getAttribute('role'), 'have proper role').to.be.equal('tooltip');
		expect(badgeTooltip.textContent, 'have proper tooltip').to.be.equal('Pronoun(s)');
	})
})