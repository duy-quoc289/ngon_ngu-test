# Hướng dẫn: Theme "Sketchbook" (vẽ tay / sổ tay)

Tài liệu này mô tả những gì đã thay đổi khi áp dụng phong cách hand-drawn doodle
(dựa trên [sketchbook-ui](https://sarthakrawat-1.github.io/sketchbook-ui/)) vào
dự án, cách chạy thử, và những phần còn lại nếu bạn muốn làm tiếp.

## 1. Cài đặt & chạy thử

```bash
npm install
npm run dev
```

Mở `http://localhost:3000` — toàn bộ site giờ dùng theme mới.
Trang `/design-preview` vẫn còn để tham khảo bảng màu/font gốc.

Không cần thêm bước cấu hình nào khác — `sketchbook-ui` đã có trong
`package.json` (`"sketchbook-ui": "^1.0.1"`), chỉ cần `npm install`.

## 2. Danh sách file đã đổi / thêm mới

| File | Loại | Nội dung |
|---|---|---|
| `lib/fonts.ts` | Mới | Khai báo 4 font dùng chung: Shantell Sans (viết tay), Permanent Marker (con dấu), Be Vietnam Pro (nội dung), Noto Sans KR (tiếng Hàn) |
| `lib/sketch-theme.ts` | Mới | Bảng màu "bút mực" + hằng số font dùng lại trong các component đã đổi sang sketchbook-ui |
| `components/providers/SketchThemeProvider.tsx` | Mới | Client wrapper bọc `SketchProvider` (vì `app/layout.tsx` là server component) |
| `app/layout.tsx` | Sửa | Nạp font mới, bọc toàn app trong `SketchThemeProvider` |
| `app/globals.css` | Sửa | Đổi `@theme` (font-sans, bảng màu primary/secondary/success/warning/error/info), nền giấy kẻ dòng cho `body`, font viết tay cho `h1-h3`, đổi ~100 màu hex thủ công trong các class `.ks-*`, sketchify `.ks-hero`, `.ks-vocab-card`, `.ks-tile`, `.ks-play` (viền mực đen + đổ bóng lệch thay vì box-shadow mềm) |
| `components/ui/Button.tsx` | Sửa | Dùng `Button` thật của `sketchbook-ui`, giữ nguyên prop API cũ (`variant`, `size`, `loading`, `icon`, `iconPosition`) |
| `components/ui/Badge.tsx` | Sửa | Dùng `Badge` thật của `sketchbook-ui`, giữ nguyên prop API cũ, tự vẽ nút X cho `removable` |
| `components/ui/Card.tsx` | Sửa | Dùng `Card` thật của `sketchbook-ui` (`variant`: flat→paper, elevated/outlined→notebook) |
| `components/ui/Tag.tsx` | Sửa | Đổi màu từ Tailwind mặc định sang bảng màu washi tape |
| `components/ui/ProgressBar.tsx` | Sửa | Sửa gradient dùng đúng token màu mới thay vì trộn với màu Tailwind mặc định |
| `app/design-preview/*` | Mới | Trang thử nghiệm màu/font (giữ lại để tham khảo) |

**Không phải sửa gì thêm** ở ~30 component khác (`VocabCard`, `AudioButton`,
`LessonNav`, các loại lesson...) vì chúng dùng class Tailwind (`bg-primary-500`,
`border-primary-300`...) hoặc class `.ks-*` — cả hai đều tự động ăn theo theme
mới nhờ sửa ở tầng token (`@theme`) và CSS toàn cục.

## 3. Quy tắc font quan trọng — ĐỌC TRƯỚC KHI SỬA THÊM

`Caveat` (font mặc định của chính thư viện `sketchbook-ui`) **không có subset
`vietnamese`** trong Google Fonts. Nếu bạn thêm component `sketchbook-ui` mới
mà không set `typography.fontFamily`, nó sẽ tự dùng Caveat — chữ tiếng Việt
có dấu sẽ vỡ (rơi về font dự phòng, chữ loang lổ).

**Luôn làm thế này** khi dùng component `sketchbook-ui` mới cho text có thể
chứa tiếng Việt:

```tsx
import { skFont } from "@/lib/sketch-theme";

<Button typography={{ fontFamily: skFont }}>Bắt đầu học</Button>
```

`skFont` trỏ tới `var(--font-hand)` = Shantell Sans, font duy nhất trong bộ
4 font đã chọn vừa có nét viết tay vừa hỗ trợ đầy đủ dấu tiếng Việt (weight
300–800). `Permanent Marker` thì ngược lại — **chỉ dùng cho text tiếng Anh/số
ngắn** (không có subset vietnamese).

| Font | CSS var | Dùng cho | Hỗ trợ dấu VN? |
|---|---|---|---|
| Shantell Sans | `--font-hand` | Tiêu đề, nút, badge, nhãn UI | ✅ |
| Permanent Marker | `--font-marker` | Nhãn tiếng Anh/số ngắn (TOPIK, NEW...) | ❌ |
| Be Vietnam Pro | `--font-body-vi` | Đoạn văn, giải thích, nội dung dài | ✅ |
| Noto Sans KR | `--font-noto-kr` | Chữ Hàn thật trong bài học (giữ chuẩn, không vẽ tay) | — |

## 4. Bảng màu (`lib/sketch-theme.ts`)

```
paper       #FBF6EC   giấy nền
ink         #232323   mực đen / viền
penBlue     #2B4EFF   primary — nút chính, link
penCoral    #E8503A   secondary / danger
penGreen    #3F9142   success
penPurple   #8B5FBF   info
highlight   #FFD93D   warning / highlighter
washiPink/Blue/Green/Yellow  — nền thẻ, badge, sticky note
```

Muốn đổi tông màu: sửa 1 chỗ duy nhất là `lib/sketch-theme.ts` (cho các
component đã dùng sketchbook-ui) và khối `@theme` đầu file `app/globals.css`
(cho phần còn lại dùng class Tailwind `primary-*`/`secondary-*`/...).

## 5. Đã làm — đã build/type-check/lint sạch, đã kiểm tra trên trình duyệt

- Toàn site: font, màu, nền giấy kẻ dòng, tiêu đề viết tay
- Atom dùng chung: `Button`, `Badge`, `Card` (viền vẽ tay thật từ sketchbook-ui), `Tag`, `ProgressBar`
- **`Input`, `Skeleton`, `Spinner`** — nay cũng dùng component thật của
  `sketchbook-ui` (viền/hình SVG wobble vẽ tay thật, không còn CSS giả lập)
  thay vì Tailwind thuần như trước. Giữ nguyên prop API cũ nên không phải sửa
  chỗ gọi (trừ 2 chỗ ở `app/summary/page.tsx` dùng `className="h-9"`-kiểu để
  chỉnh chiều cao — đã đổi sang prop `height` số vì component thật tự set
  `height` qua inline style, class Tailwind không còn đè được nữa).
  `Tabs`, `Alert`, `EmptyState` vẫn giữ Tailwind thuần vì thư viện không có
  primitive tương ứng.
- Thêm class `.ks-field-label` (nhãn phía trên Input, trước đó bị tham chiếu
  nhưng chưa từng định nghĩa trong CSS).
- Fix màu placeholder của `Input` bị đóng cứng trong CSS gốc của thư viện
  (`rgba(42,42,42,.5)`) khiến chữ mờ gần như biến mất ở dark mode — đè lại
  bằng `.dark .sketch-input-field::placeholder` trong `globals.css`.
- **Dark mode cho Button/Badge/Card/Tag/Input**: chuyển từ hex cứng sang biến CSS
  `--sk-*` (định nghĩa ở đầu `app/globals.css`, ngay sau khối `@theme`) —
  tự đổi màu khi bật `.dark`, không cần sửa logic trong component
- Các bề mặt đã sketchify (viền mực đen + đổ bóng lệch thay vì box-shadow mềm/gradient):
  hero banner, thẻ từ vựng, ô luyện chữ Hangul (tile), nút phát audio,
  bảng điều khiển audio nổi, khối so sánh (`ks-cmp-*`), danh sách bài tập
  (`ks-ex-*`), khối quy tắc nối âm + chip âm tiết (`ks-rule-*`, `ks-chip`),
  chip danh mục + ô tìm kiếm trang từ vựng (`ks-cat-chip`, `ks-vocab-search`),
  sidebar điều hướng (`ks-side-item`, nhẹ tay hơn vì là danh sách dọc nhiều dòng)
- Đã xoá `tailwind.config.ts` + `lib/design-tokens.ts` (xác nhận không còn
  dùng — dự án chạy Tailwind v4 thuần bằng `@theme` trong CSS, không có dòng
  `@config` nào trỏ tới 2 file này).
- Đã soát lại `.dark .ks-hero` trong `globals.css` — không thấy bị định nghĩa
  trùng lặp như ghi chú cũ (có thể đã được dọn từ trước); không cần sửa gì.

## 6. CHƯA làm — làm tiếp nếu cần

1. **Viền vẽ tay thật (SVG wobble)** — các bề mặt tự dựng (`.ks-*`, mục 5)
   vẫn dùng viền thẳng dày (2px solid) + box-shadow lệch để gợi cảm giác sổ
   tay, CHỨ CHƯA phải đường viền lượn sóng thật (wobble path) như
   `Button`/`Card`/`Input` (những cái đã chuyển sang component thật của
   sketchbook-ui thì ĐÃ có viền wobble thật, tự động). Muốn có viền lượn
   sóng thật cho các thẻ `.ks-*` còn lại cần dùng `SketchBorder`/`SketchPaper`
   (primitive nội bộ của thư viện, xem `node_modules/sketchbook-ui/dist/lib`)
   — việc này cần nhìn trực tiếp để canh vì mỗi loại thẻ có kích thước khác
   nhau, và là khối lượng việc lớn (~10 loại bề mặt) nên để làm riêng.

## 7. Cách xem trước khi merge

```bash
git checkout -b feat/sketchbook-theme
# copy đè các file trong zip vào đúng đường dẫn
npm install
npm run dev
```

Kiểm tra ít nhất các trang: `/`, trang Hangul, trang số đếm, trang từ vựng
(vocab), và thử cả dark mode toggle để thấy rõ phần nào chưa được thiết kế lại.
