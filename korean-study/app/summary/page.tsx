import { Suspense } from "react";
import { TopicPage } from "@/components/lessons/TopicPage";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";
import type { Topic } from "@/lib/types";
import data from "@/data/summary.json";

function LoadingFallback() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 lg:py-8 flex gap-6">
      {/* Sidebar skeleton */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
          <SkeletonText lines={1} className="mb-4" />
          <Skeleton variant="text" className="h-2 mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="text" className="h-9 rounded-lg" />
            ))}
          </div>
        </div>
      </aside>
      {/* Content skeleton */}
      <main className="flex-1 min-w-0">
        <Skeleton variant="card" className="mb-6" />
        <div className="space-y-4">
          <SkeletonText lines={3} />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      </main>
    </div>
  );
}

export default function SummaryPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TopicPage data={data as unknown as Topic} />
    </Suspense>
  );
}
