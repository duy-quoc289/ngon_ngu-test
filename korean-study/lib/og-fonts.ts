// Helper tải font Google Fonts dạng buffer cho `next/og` ImageResponse (Satori).
// Satori không dùng font hệ thống nên PHẢI nạp buffer font tường minh — kể cả
// 1 ký tự Hàn ("한") cũng sẽ vỡ/không hiện nếu không có font hỗ trợ Hangul.
//
// Trick: Google Fonts CSS2 API trả về `woff2` cho trình duyệt hiện đại, nhưng
// Satori chỉ đọc được ttf/otf/woff (không đọc woff2). Giả User-Agent của trình
// duyệt cũ (không hỗ trợ woff2) để API trả về định dạng `woff` thay thế.
const OLD_BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.57.2 (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2";

/** Tải 1 weight của 1 font family, chỉ subset đúng các ký tự trong `text` (nhẹ, nhanh). */
export async function loadGoogleFont(family: string, weight: number, text: string): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await fetch(cssUrl, { headers: { "User-Agent": OLD_BROWSER_UA } }).then((r) => r.text());

  const match = css.match(/src: url\(([^)]+)\)/);
  if (!match) throw new Error(`Không tải được font "${family}" weight ${weight}`);

  const res = await fetch(match[1]);
  return res.arrayBuffer();
}
