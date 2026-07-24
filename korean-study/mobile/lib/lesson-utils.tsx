import type { ReactNode } from "react";

/** Render inline `**bold**` + `` `code` `` từ string. Port từ components/layout/Hero.tsx gốc. */
export function renderInlineMarkdown(s: string): ReactNode {
  const parts: ReactNode[] = [];
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
