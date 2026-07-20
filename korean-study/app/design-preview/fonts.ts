import { Shantell_Sans, Permanent_Marker, Be_Vietnam_Pro } from "next/font/google";

// Font viết tay CHÍNH — tiêu đề, nút bấm, nhãn, badge.
// Có dải weight 300-800 (đủ để vừa làm heading đậm vừa làm label nhẹ)
// và hỗ trợ đầy đủ subset "vietnamese" — an toàn cho dấu tiếng Việt.
export const hand = Shantell_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-hand",
});

// Font "con dấu" marker — CHỈ dùng cho nhãn tiếng Anh/số ngắn (TOPIK, NEW, PHASE 0...).
// Font này không có subset vietnamese nên tuyệt đối không đặt text tiếng Việt vào đây.
export const marker = Permanent_Marker({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marker",
});

// Font nội dung tiếng Việt — PHẢI rõ ràng, không vẽ tay. Đây là app học tập,
// phần giải thích/ngữ pháp/ví dụ câu cần dễ đọc, không nên hy sinh cho thẩm mỹ.
export const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body-vi",
});
