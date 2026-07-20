import type { ComponentType, ReactNode } from "react";
import {
  Puzzle,
  Filter,
  Pencil,
  Pin,
  Zap,
  Box,
  Clock,
  Link,
  Water,
  Wind,
  Hide,
  WaveRight,
  Bulb,
  Gift,
  Rocket,
  type IconProps,
} from "duma-icons-react";

/**
 * Override cho các lesson mà `icon` trong data/*.json là emoji trang trí
 * (không phải ký tự Hàn/Hán/số thật) — key là `${topic}:${lessonId}`.
 * Lesson nào không có ở đây thì giữ nguyên `icon` gốc (ký tự thật, không đổi).
 */
const LESSON_ICONS: Record<string, ComponentType<IconProps>> = {
  "hangul:structure": Puzzle,
  "hangul:consonants-types": Filter,
  "hangul:exercise": Pencil,
  "numbers:han-han-usage": Pin,
  "numbers:shorten": Zap,
  "numbers:counters": Box,
  "numbers:time-trap": Clock,
  "numbers:exercise": Pencil,
  "pronunciation:rule-1": Link,
  "pronunciation:rule-3": Water,
  "pronunciation:rule-4": Wind,
  "pronunciation:rule-5": Hide,
  "pronunciation:rule-7": WaveRight,
  "summary:tips": Bulb,
  "summary:advantage": Gift,
  "summary:next-steps": Rocket,
};

export function getLessonIcon(topic: string, lessonId: string, size: number): ReactNode | undefined {
  const Icon = LESSON_ICONS[`${topic}:${lessonId}`];
  return Icon ? <Icon size={size} /> : undefined;
}
