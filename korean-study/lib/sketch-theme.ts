/**
 * Bảng màu + font dùng chung cho theme "sketchbook" (vẽ tay, sổ tay).
 * Trỏ tới CSS custom properties định nghĩa trong app/globals.css (khối
 * `:root` / `.dark` ngay sau `@theme`) — nhờ vậy Button/Badge/Card/Tag
 * tự động đổi màu theo dark mode mà không cần logic JS.
 *
 * Muốn đổi tông màu: sửa giá trị `--sk-*` trong app/globals.css, KHÔNG
 * sửa hex ở đây (các dòng dưới chỉ là tên biến).
 */

export const sketchColors = {
  paper: "var(--sk-paper)",
  paperOverlay: "var(--sk-paper-overlay)",
  ink: "var(--sk-ink)",
  penBlue: "var(--sk-pen-blue)",
  penCoral: "var(--sk-pen-coral)",
  penRed: "var(--sk-pen-red)",
  penGreen: "var(--sk-pen-green)",
  penPurple: "var(--sk-pen-purple)",
  highlight: "var(--sk-highlight)",
  washiPink: "var(--sk-washi-pink)",
  washiBlue: "var(--sk-washi-blue)",
  washiGreen: "var(--sk-washi-green)",
  washiYellow: "var(--sk-washi-yellow)",
  white: "var(--sk-white)",
  // Màu chữ đặt trên nền pen-* đặc (button primary/secondary/danger...)
  onPen: "var(--sk-on-pen)",
} as const;

// Font viết tay chính — PHẢI dùng font này (không phải Caveat mặc định của
// sketchbook-ui) cho mọi text có khả năng chứa tiếng Việt, vì Caveat không
// có subset "vietnamese" và sẽ làm vỡ dấu. Xem lib/fonts.ts.
export const skFont = "var(--font-hand)";
