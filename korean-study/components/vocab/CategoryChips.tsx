import type { ReactNode } from "react";
import { MagicWand } from "duma-icons-react";
import type { ComparisonColor, VocabCategory } from "@/lib/types";
import { getCategoryIcon } from "@/lib/vocab-category-icons";

interface ChipDef {
  id: string;
  title: string;
  icon: ReactNode;
  color: ComparisonColor;
  count: number;
}

interface Props {
  categories: VocabCategory[];
  total: number;
  active: string;
  onSelect: (id: string) => void;
}

export function CategoryChips({ categories, total, active, onSelect }: Props) {
  const chips: ChipDef[] = [
    { id: "all", title: "Tất cả", icon: <MagicWand size={14} />, color: "slate", count: total },
    ...categories.map((c) => ({
      id: c.id,
      title: c.title,
      icon: getCategoryIcon(c.id, c.icon),
      color: c.color,
      count: c.words.length,
    })),
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {chips.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onSelect(c.id)}
          className={`ks-cat-chip ks-cat-${c.color} ${c.id === active ? "is-active" : ""}`}
        >
          <span className="ks-cat-icon">{c.icon}</span>
          <span className="ks-cat-title">{c.title}</span>
          <span className="ks-cat-count">{c.count}</span>
        </button>
      ))}
    </div>
  );
}
