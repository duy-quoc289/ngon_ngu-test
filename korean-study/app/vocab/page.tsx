import { VocabPage } from "@/components/vocab/VocabPage";
import type { VocabData } from "@/lib/types";
import data from "@/data/vocab.json";

export default function Page() {
  return <VocabPage data={data as unknown as VocabData} />;
}
