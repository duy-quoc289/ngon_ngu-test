import { Suspense } from "react";
import { TopicPage } from "@/components/lessons/TopicPage";
import type { Topic } from "@/lib/types";
import data from "@/data/grammar.json";

export default function GrammarPage() {
  return (
    <Suspense fallback={<TopicFallback />}>
      <TopicPage data={data as unknown as Topic} />
    </Suspense>
  );
}

function TopicFallback() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 text-center text-slate-400">
      Đang tải bài học…
    </div>
  );
}
