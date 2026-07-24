import type { ReactNode } from "react";

/**
 * Wrap match (case-insensitive) trong <mark> để highlight kết quả search.
 * Trả về ReactNode để giữ JSX safety (không cần dangerouslySetInnerHTML).
 */
export function Highlight({
  text,
  query,
  className,
}: {
  text: string;
  query: string;
  className?: string;
}): ReactNode {
  if (!query) return <span className={className}>{text}</span>;
  const q = query.trim();
  if (!q) return <span className={className}>{text}</span>;

  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Split with capture group → parts at odd indices là match
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));

  return (
    <span className={className}>
      {parts.map((part, i) =>
        i % 2 === 1 ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>,
      )}
    </span>
  );
}
