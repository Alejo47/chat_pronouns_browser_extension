import { PronounGroup } from "src/ts/types/pronouns";

export const parsePronounGroupToString = (
  p: PronounGroup,
  alt?: PronounGroup
) => {
  if (p.singular) {
    return `${p.subject}`;
  }

  if (alt !== undefined) {
    return `${p.subject}/${alt.subject}`;
  } else {
    return `${p.subject}/${p.object}`;
  }
};
