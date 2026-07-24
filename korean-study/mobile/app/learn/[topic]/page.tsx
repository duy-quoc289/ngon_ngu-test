import { Suspense } from "react";
import { notFound } from "next/navigation";
import { TOPICS, getTopic } from "@/lib/topics";
import { TopicScreen } from "@/components/TopicScreen";

export function generateStaticParams() {
  return TOPICS.map((t) => ({ topic: t.slug }));
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const meta = getTopic(topic);
  if (!meta) notFound();
  return (
    <Suspense fallback={null}>
      <TopicScreen meta={meta} />
    </Suspense>
  );
}
