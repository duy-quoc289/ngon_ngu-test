import type { ReactNode } from "react";
import { Hand, Cutlery, ShoppingCart, Home } from "duma-icons-react";

/**
 * Icon vẽ tay thay cho emoji category trong `data/vocab.json`. Dùng chung cho
 * mọi nơi hiển thị category (chip filter, badge trên từng thẻ từ vựng...) —
 * đừng đọc thẳng `category.icon` (emoji thô) ở component mới, luôn qua đây.
 */
const CATEGORY_ICONS: Record<string, ReactNode> = {
  greetings: <Hand size={14} />,
  food: <Cutlery size={14} />,
  shopping: <ShoppingCart size={14} />,
  family: <Home size={14} />,
};

export function getCategoryIcon(categoryId: string, fallback: ReactNode): ReactNode {
  return CATEGORY_ICONS[categoryId] ?? fallback;
}
