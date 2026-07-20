// Nguồn dữ liệu chung cho "chặng học" trên trang chủ — dùng chung giữa
// ProgressCard (đường hành trình) và SectionCard grid (trạng thái từng thẻ)
// để 2 nơi này không bao giờ lệch nhau.

export interface HomePhase {
  href: string;
  label: string;
  storageKey: string;
  total: number; // -1 = chỉ kiểm tra có key không (không đếm số lesson)
}

export const HOME_PHASES: HomePhase[] = [
  { href: "/hangul", label: "Hangul", storageKey: "ks-progress-hangul", total: 7 },
  { href: "/numbers", label: "Số đếm", storageKey: "ks-progress-numbers", total: 9 },
  { href: "/pronunciation", label: "Nối âm", storageKey: "ks-progress-pronunciation", total: 8 },
  { href: "/vocab", label: "Từ vựng", storageKey: "ks-vocab-state", total: -1 },
  { href: "/flashcards", label: "Flashcards", storageKey: "ks-srs-vocab", total: -1 },
];

export function isPhaseDone(storageKey: string, total: number): boolean {
  try {
    if (total === 0) return false; // phase chưa triển khai
    if (total === -1) return Boolean(localStorage.getItem(storageKey)); // chỉ cần đã visit
    const raw = localStorage.getItem(storageKey);
    if (!raw) return false;
    const arr = JSON.parse(raw) as string[];
    return arr.length >= total;
  } catch {
    return false;
  }
}
