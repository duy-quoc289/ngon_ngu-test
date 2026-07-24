import type { Topic } from "@/lib/types";
import hangul from "@/data/hangul.json";
import numbers from "@/data/numbers.json";
import pronunciation from "@/data/pronunciation.json";
import grammar from "@/data/grammar.json";
import summary from "@/data/summary.json";

export interface TopicMeta {
  slug: string;
  icon: string;
  color: "blue" | "rose" | "amber" | "violet" | "emerald" | "slate";
  data: Topic;
}

export const TOPICS: TopicMeta[] = [
  { slug: "hangul", icon: "🔤", color: "blue", data: hangul as Topic },
  { slug: "numbers", icon: "🔢", color: "amber", data: numbers as Topic },
  { slug: "pronunciation", icon: "🗣️", color: "violet", data: pronunciation as Topic },
  { slug: "grammar", icon: "📖", color: "emerald", data: grammar as Topic },
  { slug: "summary", icon: "🎯", color: "rose", data: summary as Topic },
];

export function getTopic(slug: string): TopicMeta | undefined {
  return TOPICS.find((t) => t.slug === slug);
}
