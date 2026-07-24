import { Shantell_Sans, Permanent_Marker, Be_Vietnam_Pro, Noto_Sans_KR } from "next/font/google";

// Font viết tay CHÍNH — tiêu đề, nút, nhãn, badge. Weight 300-800, hỗ trợ
// đầy đủ subset "vietnamese" (Caveat — mặc định của sketchbook-ui — KHÔNG có
// subset này nên không dùng, xem app/design-preview/fonts.ts để biết chi tiết).
export const hand = Shantell_Sans({
  variable: "--font-hand",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

// Con dấu marker — CHỈ dùng cho nhãn tiếng Anh/số ngắn, không có subset vietnamese.
export const marker = Permanent_Marker({
  variable: "--font-marker",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Font nội dung chính — thay cho Inter trước đây. Rõ ràng, không vẽ tay,
// vì đây là app học tập và phần giải thích cần dễ đọc.
export const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-body-vi",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});
