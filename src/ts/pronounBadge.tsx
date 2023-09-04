import renderToString from "preact-render-to-string";

export function generatePronounBadge(text: string) {
  return renderToString(
    <div
      className="pr-badge-wrapper"
      data-a-target="pr-badge-cnt"
      data-provider="pronouns.alejo.io"
    >
      <span className="chat-badge user-pronoun" data-a-target="pr-badge-txt">
        {text}
      </span>
      <div className="pr-tooltip" role="tooltip">Pronouns(s)</div>
    </div>,
  );
}
