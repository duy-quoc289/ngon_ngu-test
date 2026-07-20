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

## 7. Icon — đã đổi sang `duma-icons-react` (vẽ tay thật)

Icon chức năng trước đây là SVG line-icon sạch (Feather-style, viết tay
thủ công rải rác từng component) — lạc tông với border/card đã sketchify.
Ban đầu đổi sang `react-doodle-icons` (dựa trên bộ **Doodle Icons của
Khushmeen Sidhu**), nhưng phát hiện bug nghiêm trọng: mọi icon dùng
`<clipPath>` đều hard-code `id="clip0"` — khi ≥2 icon loại này xuất hiện
cùng trang (luôn đúng trên mọi trang thật của app), scoping ID toàn cục
của SVG khiến các icon sau bị lệch clip-mask → vỡ hình ("tất cả icon bị
cut 1 phần"). Đã migrate toàn bộ sang
[`duma-icons-react`](https://www.npmjs.com/package/duma-icons-react)
(cùng bộ artwork Doodle Icons, nhưng namespace id đúng cách, ví dụ
`id="duma-search-clip0"` — không còn xung đột).

```tsx
import { Cross, Tick } from "duma-icons-react"; // chỉ export dạng barrel, không có deep-import theo icon
<Cross size={20} /> // mặc định color="currentColor", nhận className/style bình thường
// size scale theo cạnh dài nhất, cạnh còn lại theo tỉ lệ viewBox gốc (không ép vuông)
```

**Quy tắc quan trọng — không phải icon nào cũng nên đổi**: bộ này vẽ bằng
nét marker dày, chi tiết, nhìn đẹp ở cỡ ≥14-16px dùng 1 lần/trang, nhưng
dễ vỡ thành vệt mực ở cỡ rất nhỏ (≤12px) lặp lại nhiều lần trên 1 trang.
Icon đơn giản 1 nét (Cross, Tick, Play, Fire, Star, Search) đọc được tới
~10-14px; icon nhiều chi tiết (Setting, User, Logout, Sync, Puzzle,
VolumeUp) cần ≥18-24px mới rõ nét. Vì vậy:

**Lưu ý riêng — có vài icon trong bộ tự nó khó nhìn dù đúng cỡ**:
`TvIcon` chỉ vẽ ăng-ten + nửa trên khung hình (không có thân/chân), nhìn
mơ hồ ở MỌI kích thước — đã đổi sang `MovieClapperIcon` (bảng cờ-lê phim,
dùng cho link "Talk To Me In Korean"). `LayerIcon` là 3 hình thoi lồng
nhau nét mảnh, chỉ rõ nét khi ≥60px — ở cỡ nhỏ (18-24px, dùng cho tile
Flashcards ở `SectionGrid`/`ProgressCard` và link Anki) đã đổi sang
`CardIcon` (1 thẻ đơn giản, rõ nét ở mọi cỡ). Nếu định dùng icon mới từ
bộ này, nên preview ở đúng kích thước thật trước khi chốt — đừng chỉ tin
theo tên icon.

- **Đã đổi (đợt 1 — SVG icon chức năng)**: back-chevron, hamburger, close X
  (Alert/Badge lớn/LessonShell drawer), search, settings gear, chevron
  trước/sau (LessonNav, card CTA arrow), user/logout (UserButton dropdown),
  play (nút lớn dictation + showcase design-system).
- **Đã đổi (đợt 2 — emoji dùng như icon chức năng)**: rà toàn bộ codebase
  tìm emoji còn sót, quy tắc phân loại:
  - **Emoji đóng vai trò UI/trạng thái** (không mang nghĩa nội dung) → đổi
    hết sang icon: ✅/❌/⚠️/ℹ️ trong `Alert`, ✅/❌ trong `DictationCard`/
    `WordBuildCard`/trang dictation, 🔥/🎯/📦/🔄 (stat: streak/accuracy/
    mature/reps ở `flashcards` + `profile`), 🔍 mặc định của `EmptyState`,
    📊 tiêu đề `ProgressCard`, ✨ chip "Tất cả" trong `CategoryChips`,
    🎧 empty-state dictation, 🎴/🎧/★ (thay char-tile cho Flashcards/
    Dictation/Lộ trình ở `SectionGrid` + `ProgressCard` — vì đây là tile
    KHÔNG có ký tự Hàn thật để hiển thị, khác với 한/1/발/단/문 là chữ thật),
    ✍️/🎧/🧩 (mode badge ở `flashcards/study`, riêng 🔤 giữ nguyên vì
    không có icon "ngôn ngữ/ABC" phù hợp trong bộ), 🔊/⏩ trong
    `AudioControlPanel`.
  - **Đã đổi (đợt 3 — quét lại toàn bộ, "bộ icon đã chốt")**: 🏆/💪/📖
    (kết quả phiên ôn ở `flashcards/study` → `Trophy`/`Target`/`Doc`),
    🔤 mode "한→Vi" ở `flashcards/study` → `Card` (đại diện cho việc lật
    thẻ), toàn bộ emoji tiêu đề section ở `app/design-system/page.tsx`
    (🎨→`PaintBrush`, 🔤→`Pen`, 🔘→`Tap`, 📝→`Pencil`, 🏷→`Tag`, 🔖→`Bookmark`,
    🃏→`Card`, ⏳→`Stopwatch`, 💀→`Frame`, 📖→`Doc`, 💡→`Bulb`).
  - **Đã đổi (đợt 4 — quét lại `data/*.json` + rà toàn repo, "vẫn còn emoji cũ")**:
    phát hiện thêm 1 nguồn emoji chưa từng soát trước đó — trường `icon` của
    từng lesson trong `data/hangul.json`/`numbers.json`/`pronunciation.json`/
    `summary.json` render qua `Hero`/`LessonSidebar`, phần lớn là ký tự Hàn/Hán/
    số THẬT (giữ nguyên, ví dụ `ㅏ`/`한`/`①`) nhưng xen lẫn emoji trang trí
    (ví dụ `numbers.json` `time-trap` → ⏰, `pronunciation.json` `rule-1` → 🔗).
    Tách 2 loại bằng map override `lib/lesson-icons.tsx` (key `topic:lessonId`
    → icon component), áp cho cả `Hero` (28px) và `LessonSidebar`/`LessonList`
    (14px) — lesson nào không có trong map thì render `icon` gốc y như cũ.
    Đã đổi: `hangul:structure`→`Puzzle`, `hangul:consonants-types`→`Filter`,
    `hangul:exercise`/`numbers:exercise`→`Pencil`, `numbers:han-han-usage`→`Pin`,
    `numbers:shorten`→`Zap`, `numbers:counters`→`Box`, `numbers:time-trap`→`Clock`,
    `pronunciation:rule-1`→`Link`, `pronunciation:rule-3`→`Water`,
    `pronunciation:rule-4`→`Wind`, `pronunciation:rule-5`→`Hide` (ẩn dụ "ㅎ biến
    mất"), `pronunciation:rule-7`→`WaveRight`, `summary:tips`→`Bulb`,
    `summary:advantage`→`Gift`, `summary:next-steps`→`Rocket`. Cũng bỏ emoji
    trang trí thừa gõ thẳng trong title (`"Nối âm ⭐"` → `"Nối âm"`,
    `"Bẫy giờ-phút ⏰"` → `"Bẫy giờ-phút"` — dữ liệu đã trùng ý với icon riêng).
    Ngoài ra: `.ks-vocab-note::before { content: '💡 ' }` (CSS, không sửa được
    bằng icon component) → chuyển render `Bulb` thật ngay trong `VocabCard.tsx`,
    xoá rule CSS. Cờ 🇰🇷/🇻🇳 (logo nav `app/page.tsx`, logo `auth/login`, title
    "Lợi thế người Việt 🇻🇳" ở `summary.json`) — phát hiện RENDER VỠ (hiện chữ
    "KR"/"VN" thay vì lá cờ) trên môi trường thiếu font color-emoji, và bộ icon
    không có icon quốc kỳ thay thế → bỏ hẳn, logo nav/login đổi sang badge
    vuông bo góc màu primary chứa ký tự "한" (nhất quán với các tile ký tự Hàn
    khác trong app), title bỏ hẳn phần cờ trang trí.
  - **Đã đổi (đợt 5 — phát hiện qua feedback người dùng, "vẫn còn emoji cũ ở
    /vocab")**: 👨‍👩‍👧 (chip danh mục "Gia đình" ở `CategoryChips` + mô tả "160
    từ" ở `SectionGrid`) — ban đầu đánh giá nhầm là "không có icon phù hợp",
    thực ra `Home` (mái nhà = gia đình) là ẩn dụ hợp lý và có sẵn trong bộ →
    đã đổi. Bài học: đừng chốt "không có icon phù hợp" quá sớm, nên rà lại
    danh sách icon đầy đủ trước khi quyết định giữ emoji.
  - **Đã đổi (đợt 6 — "badge trong grid vẫn còn emoji", bug thật)**: badge
    danh mục trên TỪNG thẻ từ vựng (`ks-vocab-cat-pill` trong `VocabCard.tsx`)
    vẫn đọc thẳng `category.icon` (emoji thô từ `data/vocab.json`), bỏ qua
    hoàn toàn map icon đã làm cho `CategoryChips.tsx` — 2 component tách biệt
    nên đổi 1 chỗ không tự động ăn theo chỗ kia. Fix: tách map dùng chung ra
    `lib/vocab-category-icons.tsx` (`getCategoryIcon(categoryId, fallback)`),
    cả `CategoryChips` và `VocabCard` đều gọi qua đây. Bài học: khi 1 nguồn dữ
    liệu (`category.icon`) được nhiều component độc lập render, phải rà HẾT
    nơi gọi `.icon` (`grep ".icon\b"`) chứ không chỉ nơi phát hiện đầu tiên.
  - **Emoji mang nghĩa nội dung, vẫn giữ (không có icon nào trong bộ khớp
    nghĩa)**: 👃 (`pronunciation:rule-2`, đồng hóa mũi — không có icon mũi),
    🪨 (`pronunciation:rule-6`, căng âm hóa — không có icon đá/độ cứng). 👋
    trong câu chào tiếng Hàn "안녕하세요" ở `app/page.tsx` — đã có icon `Hand`
    cạnh nó rồi, emoji này là 1 phần câu văn Hàn, không phải icon UI.
  - ✓/✗ dạng ký tự văn bản nhỏ (không phải emoji đầy đủ) trong
    `LessonSidebar`/`LessonNav`/`GrammarLesson`/ribbon "✓ Đã học"/ví dụ ngữ pháp
    trong `data/grammar.json` — giữ nguyên, cùng lý do "quá nhỏ" như mục CỐ
    TÌNH GIỮ NGUYÊN bên dưới.
- **CỐ TÌNH giữ nguyên** (không đổi): icon play/pause/loading trong
  `PlayIcons.tsx`/`AudioButton.tsx` — render ở 11-14px và lặp lại hàng trăm
  lần trên trang từ vựng, hand-drawn sẽ mờ/rối; nút X nhỏ 12px trong
  `Badge.tsx` (remove tag); chevron dropdown 12px trong `UserButton.tsx`.
  Logo Google trong `LoginWithGoogle.tsx` giữ nguyên vì là brand mark chính
  thức, không được vẽ lại.
- `app/dictation-demo/page.tsx` không sửa vì là route chết, không có link
  nào trỏ tới (ứng viên để xoá riêng nếu xác nhận không cần).

### 7.1. Màu icon — không để `currentColor` mặc định tràn lan

Icon `duma-icons-react` mặc định `color="currentColor"`, nên nếu component
cha không set màu, icon render đen/mực (`text-ink`) — mất hết sắc thái mà
emoji gốc từng có. Quy tắc đã áp dụng khi rà lại toàn bộ app:

- **Icon trạng thái/cảm xúc (expressive)** → tô màu semantic tường minh
  qua className, không dựa vào inherit: `Tick`/`Cross` phản hồi đúng-sai
  → `text-success-500`/`text-error-500` (DictationCard, WordBuildCard);
  `Fire` → `text-secondary-500` (streak); `Target` → `text-error-500`
  (accuracy); `Box` → `text-primary-600` (thẻ vững); `Sync` → `text-success-500`
  (đã ôn); `Trophy` → `text-warning-500` (mọi nơi ăn mừng: `ProgressCard`
  badge "Hoàn thành", empty-state `flashcards`, `flashcards/study`); `Hand`
  ở lời chào trang chủ → `text-warning-500`; `Fire`/`Heart` ở footer →
  `text-secondary-500`.
- **Icon đã nằm trong khối có màu sẵn (inherit đúng)** → không cần thêm
  className: `Alert` (icon ăn theo `${cfg.text}` của variant), `Tick`/`Cross`
  trong `GrammarLesson` (ăn theo `text-emerald-700`/`text-red-700` của div
  cha), `Tick`/`Cross` trong feedback `app/dictation/page.tsx` (ăn theo
  `text-success-700`/`text-error-700`), `Tick` trong `LessonNav` (nằm trong
  `Button variant="primary"` nên tự trắng), `LogoutIcon` trong `UserButton`
  (div cha đã `text-red-500`), `Tick` trong `LessonSidebar` (CSS
  `.ks-side-icon-done` set `color: var(--sk-on-pen)`).
- **Icon chức năng/chrome (functional)** → cố tình giữ neutral/ink, KHÔNG
  tô màu riêng: back-arrow, hamburger, search box icon, settings gear,
  volume/speed control icon trong `AudioControlPanel`, `UserIcon` trong
  dropdown `UserButton`. Lý do: đây là điều khiển UI thuần, tô màu sẽ tạo
  nhiễu thị giác không cần thiết so với text xung quanh.
- **Icon trong text/mô tả nội dung** (ví dụ `Hand`/`Cutlery`/`ShoppingCart`
  chèn giữa câu mô tả 160 từ ở `SectionGrid`) → giữ màu muted ăn theo
  `text-ink/55` của đoạn văn, không tô nổi bật — mục đích là làm dấu chấm
  câu trực quan, không phải icon nhấn mạnh.
- **Tile icon lớn trên nền washi màu** (`Star`/`CardIcon`/`Headphone` ở
  `SectionGrid`, size 24, nền `--sk-washi-*`) → giữ `text-ink` đồng nhất
  với các tile ký tự Hàn thật (한/1/발/단/문) trong cùng grid — bản thân nền
  washi đã mang màu sắc, tô thêm màu cho icon sẽ phá vỡ tính nhất quán của
  cả dãy tile.
- **Chip danh mục** (`CategoryChips`) → không tô riêng theo category khi
  chip ở trạng thái chưa active (toàn bộ chip dùng chung `color: rgb(71 85 105)`
  slate cho mọi danh mục), và tự động trắng khi active (nền gradient theo
  màu category đã đủ phân biệt). Tô icon riêng ở đây sẽ đụng độ với quy tắc
  màu chip đã có.

## 8. Cách xem trước khi merge

```bash
git checkout -b feat/sketchbook-theme
# copy đè các file trong zip vào đúng đường dẫn
npm install
npm run dev
```

Kiểm tra ít nhất các trang: `/`, trang Hangul, trang số đếm, trang từ vựng
(vocab), và thử cả dark mode toggle để thấy rõ phần nào chưa được thiết kế lại.
