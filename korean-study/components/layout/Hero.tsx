interface Props {
  icon?: string;
  step?: string;
  title: string;
  hint?: string;
}

export function Hero({ icon = "📘", step, title, hint }: Props) {
  return (
    <section className="ks-hero">
      <div className="ks-hero-icon" lang="ko">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        {step && <div className="ks-hero-step">{step}</div>}
        <h1 className="ks-hero-title">{title}</h1>
        {hint && <p className="ks-hero-hint">{renderInlineMarkdown(hint)}</p>}
      </div>
    </section>
  );
}

/** Render inline `**bold**` + `` `code` `` từ string. */
function renderInlineMarkdown(s: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIdx = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(s)) !== null) {
    if (m.index > lastIdx) parts.push(s.slice(lastIdx, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) {
      parts.push(<strong key={key++}>{tok.slice(2, -2)}</strong>);
    } else {
      parts.push(<code key={key++}>{tok.slice(1, -1)}</code>);
    }
    lastIdx = re.lastIndex;
  }
  if (lastIdx < s.length) parts.push(s.slice(lastIdx));
  return parts;
}

export { renderInlineMarkdown };
