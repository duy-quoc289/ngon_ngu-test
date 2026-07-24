"use client";

import Link from "next/link";
import { TOPICS } from "@/lib/topics";
import { useProgress } from "@/lib/progress";

function TopicCard({ meta }: { meta: (typeof TOPICS)[number] }) {
  const { completed, hydrated } = useProgress(meta.data.topic);
  const total = meta.data.lessons.length;
  const done = hydrated ? completed.size : 0;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <Link href={`/learn/${meta.slug}`} className={`ks-topic-card ks-cat-${meta.color}`}>
      <span className="ks-topic-icon" aria-hidden>{meta.icon}</span>
      <span className="ks-topic-title">{meta.data.title}</span>
      <span className="ks-topic-count">{total} bài</span>
      <div className="ks-topic-progress-track">
        <div className="ks-topic-progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </Link>
  );
}

export default function LearnHomePage() {
  return (
    <div className="ks-app-shell">
      <header className="ks-path-header">
        <div>
          <h1 className="ks-path-title font-hand">Học</h1>
          <p className="ks-path-subtitle">Chọn chủ đề để bắt đầu</p>
        </div>
      </header>

      <main className="ks-topic-grid-main">
        <div className="ks-topic-grid">
          {TOPICS.map((t) => <TopicCard key={t.slug} meta={t} />)}
        </div>
      </main>
    </div>
  );
}
