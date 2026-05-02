import { Suspense } from "react";
import { TopicPage } from "@/components/lessons/TopicPage";
import type { Topic } from "@/lib/types";
import data from "@/data/summary.json";

export default function SummaryPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 py-12 text-center text-slate-400">
          Đang tải bài học…
        </div>
      }
    >
      <TopicPage data={data as unknown as Topic} />
    </Suspense>
  );
}
