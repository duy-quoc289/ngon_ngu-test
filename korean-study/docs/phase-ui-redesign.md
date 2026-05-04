# Phase UI — Complete UI/UX Redesign

**Status:** ⏳ Planned · Overhaul toàn bộ design system.

Nâng cấp toàn diện UI/UX từ **functional MVP** (Phase 1-2) thành **polished learning platform** với design system nhất quán, animations mượt mà, và UX thân thiện hơn.

## Mục tiêu

- **Brand identity** rõ ràng — color palette, typography hierarchy, spacing system
- **Component library** có tổ chức — atoms → molecules → organisms (Atomic Design)
- **Micro-interactions** và animations làm app "sống động" hơn
- **Responsive design** tốt hơn — mobile-first approach
- **Accessibility** (WCAG 2.1 AA) — keyboard nav, ARIA labels, contrast ratios
- **Performance** — optimize cho Core Web Vitals (LCP < 2.5s, CLS < 0.1)
- **Dark mode** refined — không chỉ invert colors, mà có palette riêng
- **Consistency** — mọi page/component follow cùng 1 design language

## Design audit hiện tại

### ✅ Những gì đã tốt

- **Tailwind CSS v4** với `@theme` → custom tokens sẵn có
- **Dark mode** functional với class-based toggle
- **Korean fonts** (Noto Sans KR) load đúng cách
- **AudioProvider** global → audio playback mượt
- **Responsive** cơ bản OK (mobile nav, drawer sidebar)
- **Type-safe** với TypeScript + strict mode

### ❌ Vấn đề cần fix

1. **Inconsistent spacing** — một số page dùng `px-4`, một số `px-6`, không có grid system rõ ràng
2. **Color palette hạn chế** — chỉ có `accent-*`, thiếu semantic colors (success, warning, error, info)
3. **Typography scale** không rõ — font sizes hard-coded, không có scale system (xs/sm/base/lg/xl/...)
4. **Component coupling** — một số component có style inline, một số dùng global CSS, không nhất quán
5. **Animation thiếu** — hầu hết transitions dùng Tailwind default, không có custom easing
6. **No focus states** rõ ràng → accessibility kém cho keyboard users
7. **Card shadows** đơn điệu → thiếu depth hierarchy
8. **Button variants** thiếu — chỉ có primary, không có secondary/ghost/outline
9. **Loading states** chưa có → khi fetch data, UI freeze
10. **Empty states** chưa có → khi search không ra, chỉ hiện blank

## Design System mới

### A — Color Palette (Semantic + Brand)

**Brand colors:**
- **Primary** (Korean blue): `#4A7CFF` → gradient `#4A7CFF → #6B5FFF`
- **Secondary** (warm coral): `#FF7A59` → accent for CTAs
- **Neutral** (slate): giữ nguyên `slate-50` → `slate-950`

**Semantic colors:**
- **Success**: `emerald-500` (#10b981)
- **Warning**: `amber-500` (#f59e0b)
- **Error**: `rose-500` (#f43f5e)
- **Info**: `sky-500` (#0ea5e9)

**Dark mode palette riêng:**
- Không chỉ `dark:bg-slate-900`, mà dùng `dark:bg-slate-950` + subtle gradients
- Text không phải pure white → `slate-100` để giảm eye strain
- Borders dùng `slate-800` + opacity

### B — Typography Scale (Inter + Noto Sans KR)

Áp dụng **modular scale** (ratio 1.25):

| Token | Size | Line Height | Use Case |
|-------|------|-------------|----------|
| `text-xs` | 0.75rem (12px) | 1rem | Tags, hints |
| `text-sm` | 0.875rem (14px) | 1.25rem | Body small, captions |
| `text-base` | 1rem (16px) | 1.5rem | Body text |
| `text-lg` | 1.125rem (18px) | 1.75rem | Large body, lead |
| `text-xl` | 1.25rem (20px) | 1.75rem | H3 |
| `text-2xl` | 1.5rem (24px) | 2rem | H2 |
| `text-3xl` | 1.875rem (30px) | 2.25rem | H1 |
| `text-4xl` | 2.25rem (36px) | 2.5rem | Hero title |
| `text-5xl` | 3rem (48px) | 1 | Display |

**Font weights:**
- **Regular** (400): body text
- **Medium** (500): subtle emphasis
- **Semibold** (600): headings, buttons
- **Bold** (700): hero titles
- **Black** (900): Korean display text (한글 lớn trong Hero)

### C — Spacing System (8pt Grid)

Base unit = `0.25rem` (4px)

| Token | Value | Use Case |
|-------|-------|----------|
| `space-1` | 0.25rem (4px) | Tight spacing (icon + text) |
| `space-2` | 0.5rem (8px) | Compact elements |
| `space-3` | 0.75rem (12px) | Default gap |
| `space-4` | 1rem (16px) | Card padding |
| `space-6` | 1.5rem (24px) | Section spacing |
| `space-8` | 2rem (32px) | Large gaps |
| `space-12` | 3rem (48px) | Page section spacing |
| `space-16` | 4rem (64px) | Hero spacing |

Container max-width: `1200px` (đồng nhất trên tất cả pages)

### D — Shadows & Depth

5 levels of elevation:

```css
/* Tailwind config */
shadow-xs: 0 1px 2px rgb(0 0 0 / 0.05)
shadow-sm: 0 1px 3px rgb(0 0 0 / 0.1), 0 1px 2px rgb(0 0 0 / 0.06)
shadow-md: 0 4px 6px rgb(0 0 0 / 0.07), 0 2px 4px rgb(0 0 0 / 0.06)
shadow-lg: 0 10px 15px rgb(0 0 0 / 0.1), 0 4px 6px rgb(0 0 0 / 0.05)
shadow-xl: 0 20px 25px rgb(0 0 0 / 0.1), 0 8px 10px rgb(0 0 0 / 0.04)
```

Dark mode: giảm opacity + thêm highlight (top border subtle white)

### E — Border Radius

```css
rounded-sm: 0.25rem (4px) — buttons, tags
rounded-md: 0.375rem (6px) — inputs
rounded-lg: 0.5rem (8px) — cards
rounded-xl: 0.75rem (12px) — large cards, modals
rounded-2xl: 1rem (16px) — hero sections
rounded-full: 9999px — badges, avatars
```

### F — Animations & Easing

Custom easings (Penner Easing):
```css
ease-smooth: cubic-bezier(0.4, 0, 0.2, 1) — default
ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55) — playful (score animations)
ease-in-out-quad: cubic-bezier(0.45, 0, 0.55, 1) — smooth entry/exit
```

**Animation tokens:**
- `transition-fast`: 150ms
- `transition-base`: 250ms
- `transition-slow`: 400ms

**Keyframe animations to add:**
- `fade-in` — opacity 0→1 (page transitions)
- `slide-up` — translateY(10px)→0 + fade (cards entering)
- `scale-in` — scale(0.95)→1 + fade (modals)
- `shimmer` — loading skeleton (card placeholders)

## Sub-phases

### Phase A — Foundation: Design Tokens & Theme Setup (~4-6h)

**Deliverables:**
- Update `globals.css` với full color palette (semantic colors)
- Tạo `tailwind.config.ts` với custom theme extensions
- Typography scale vars (thay vì hard-code `text-3xl` mọi nơi)
- Spacing scale vars
- Shadow/border-radius tokens
- Animation/easing vars

**Files:**
```
lib/
  design-tokens.ts   # Export all design constants (colors, sizes, ...)
app/
  globals.css        # @theme expanded + custom CSS vars
tailwind.config.ts   # Extend theme với tokens
```

### Phase B — Component Library: Atoms (~8-10h)

Build **base components** reusable trên toàn app (Storybook optional, hoặc chỉ `/playground` page):

**Components:**
1. **Button** (`components/ui/Button.tsx`)
   - Variants: `primary | secondary | ghost | outline | danger`
   - Sizes: `sm | md | lg`
   - States: `default | hover | active | disabled | loading`
   - Icon support (left/right)
   - Keyboard focus ring

2. **Input** (`components/ui/Input.tsx`)
   - Variants: `default | error | success`
   - Sizes: `sm | md | lg`
   - Prefix/suffix icons
   - Label + helper text

3. **Badge** (`components/ui/Badge.tsx`)
   - Variants: `default | primary | success | warning | error | info`
   - Sizes: `sm | md`
   - Removable (with X button)

4. **Card** (`components/ui/Card.tsx`)
   - Variants: `flat | elevated | outlined`
   - Hover states (lift on hover)
   - Clickable variant (cursor pointer + scale)

5. **Tag** (`components/ui/Tag.tsx`)
   - Color variants (auto-generate từ categories)
   - Sizes: `xs | sm`

6. **Spinner** (`components/ui/Spinner.tsx`)
   - Sizes: `xs | sm | md | lg`
   - Colors: `primary | white | current`

7. **Skeleton** (`components/ui/Skeleton.tsx`)
   - Shimmer animation
   - Variants: `text | card | avatar | button`

**Pattern:**
```tsx
// Button.tsx
interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant = "primary", size = "md", ... }: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = {
    primary: "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500",
    secondary: "bg-coral-500 text-white hover:bg-coral-600 focus:ring-coral-500",
    // ...
  };
  // ...
}
```

### Phase C — Component Library: Molecules (~6-8h)

Compose atoms thành **composite components**:

1. **EmptyState** (`components/ui/EmptyState.tsx`)
   - Icon + title + description + CTA button
   - Use case: search no results, no flashcards due

2. **LoadingState** (`components/ui/LoadingState.tsx`)
   - Spinner + optional text
   - Full-page variant vs inline variant

3. **Alert** (`components/ui/Alert.tsx`)
   - Variants: `info | success | warning | error`
   - Dismissible
   - Icon auto-mapped (info → ℹ️, success → ✅, ...)

4. **Modal** (`components/ui/Modal.tsx`)
   - Overlay + backdrop blur
   - Escape to close
   - Focus trap (tab cycles inside modal)
   - Slide-up + fade-in animation

5. **Tooltip** (`components/ui/Tooltip.tsx`)
   - Hover to show
   - Positions: `top | bottom | left | right`
   - Arrow pointer

6. **ProgressBar** (`components/ui/ProgressBar.tsx`)
   - Linear bar với gradient fill
   - Label (X/Y completed)
   - Animated on value change

7. **Tabs** (`components/ui/Tabs.tsx`)
   - Horizontal tabs với underline indicator
   - Keyboard ←/→ to switch
   - Smooth indicator slide animation

### Phase D — Redesign Existing Pages (~10-12h)

Apply design system lên **toàn bộ pages hiện tại**:

#### D1 — Homepage (`app/page.tsx`)
- Hero với gradient background mới (subtle mesh gradient)
- Section cards dùng `Card` component mới
- Progress bar dùng `ProgressBar` component
- CTA buttons dùng `Button` component
- Add **streak widget** (số ngày liên tiếp học)

#### D2 — Lesson pages (Hangul/Numbers/Pronunciation)
- `TopBar` redesign — thêm breadcrumb, better progress indicator
- `LessonShell` dùng `Card` cho sidebar items
- `LessonNav` buttons dùng `Button` component
- Add **completion confetti** animation khi finish 1 lesson
- Loading state khi switch lessons (skeleton cards)

#### D3 — Vocab page (`app/vocab/page.tsx`)
- `VocabCard` redesign — better spacing, hover lift effect
- `SearchBox` dùng `Input` component mới
- `CategoryChips` dùng `Badge` component
- Empty state khi search không ra (dùng `EmptyState`)
- Loading skeleton khi filter

#### D4 — Summary page (`app/summary/page.tsx`)
- Timeline redesign — vertical line với dots
- Phase cards dùng `Card` với `elevated` variant
- Status badges dùng `Badge` component

### Phase E — Micro-interactions & Animations (~4-5h)

Thêm **polished animations** ở key interactions:

1. **Page transitions** — fade-in khi navigate giữa pages
2. **Button hover/active** — scale + shadow lift
3. **Card hover** — lift + shadow increase
4. **Audio button** — ripple effect khi click (concentric circles)
5. **Lesson completion** — confetti 🎉 animation (react-confetti hoặc CSS-only)
6. **Streak counter** — flame emoji 🔥 pulse animation
7. **Progress bar fill** — smooth width transition với spring easing
8. **Sidebar drawer** — slide-in from left (mobile)
9. **Modal** — backdrop fade + modal slide-up
10. **Toast notifications** — slide-in from top-right (success/error messages)

**Tools:**
- `framer-motion` (React animation library) — cho complex animations
- Hoặc pure CSS keyframes + Tailwind classes (lighter weight)

### Phase F — Responsive Refinement (~3-4h)

**Mobile-first approach:**

- **Breakpoints:**
  - `sm: 640px` — large phones
  - `md: 768px` — tablets
  - `lg: 1024px` — laptops
  - `xl: 1280px` — desktops

**Mobile optimizations:**
- Touch targets ≥ 44x44px (Apple HIG, Material Design)
- Bottom nav bar cho quick access (Homepage / Vocab / Flashcards)
- Swipe gestures (swipe left/right to navigate lessons)
- Reduce font sizes on mobile (scale down 0.9x)
- Hero gradient background simplified (giảm opacity để avoid banding trên mobile)

**Tablet optimizations:**
- 2-column grid cho vocab cards (thay vì 1 trên mobile, 3 trên desktop)
- Sidebar persistent (không collapse thành drawer)

### Phase G — Accessibility (A11y) Audit & Fixes (~4-5h)

**WCAG 2.1 AA compliance:**

1. **Keyboard navigation:**
   - Tab order hợp lý
   - Focus states visible (ring-2 ring-primary-500)
   - Escape to close modals/drawers
   - Arrow keys to navigate lessons (đã có)

2. **Screen reader support:**
   - ARIA labels cho icon buttons (`aria-label="Phát audio"`)
   - `aria-live` regions cho dynamic content (toast notifications)
   - `role="button"` cho clickable divs
   - `alt` text cho hình ảnh (nếu có)

3. **Color contrast:**
   - Text/background ≥ 4.5:1 (normal text)
   - Text/background ≥ 3:1 (large text ≥18pt)
   - Check contrast cho dark mode

4. **Motion preferences:**
   - `prefers-reduced-motion` media query → disable animations
   - Toggle trong settings (nếu có)

**Testing tools:**
- Lighthouse (Chrome DevTools) — accessibility score
- axe DevTools extension
- Manual keyboard testing (unplug mouse!)

### Phase H — Performance Optimization (~3-4h)

**Core Web Vitals targets:**
- **LCP** (Largest Contentful Paint) < 2.5s
- **FID** (First Input Delay) < 100ms
- **CLS** (Cumulative Layout Shift) < 0.1

**Optimizations:**

1. **Images:**
   - Không có images nặng (chỉ có audio) → OK
   - SVG icons dùng inline (avoid extra requests)

2. **Fonts:**
   - `font-display: swap` (đã có trong `layout.tsx`)
   - Preload critical fonts (Inter, Noto Sans KR)
   - Self-host fonts (thay vì Google Fonts CDN) nếu muốn faster

3. **Code splitting:**
   - Dynamic imports cho heavy components (`VocabPage` → lazy load)
   - Separate bundles cho mỗi route (Next.js làm tự động)

4. **Audio files:**
   - Compress MP3s (128kbps là đủ cho voice)
   - Lazy load audio (chỉ fetch khi user bấm play) — đã có
   - Preload audio của card đầu tiên trong lesson

5. **CSS:**
   - Purge unused Tailwind classes (đã có trong production build)
   - Critical CSS inline (Next.js làm tự động)

6. **JavaScript:**
   - Remove unused dependencies
   - Tree-shaking với ES modules
   - Minify + compress (Vercel làm tự động)

**Measuring:**
- Lighthouse CI trong GitHub Actions
- Real User Monitoring (RUM) với Vercel Analytics (optional)

### Phase I — Dark Mode Refinement (~2-3h)

**Improvements:**

1. **Palette riêng cho dark mode:**
   - Không chỉ `dark:bg-slate-900`, mà dùng subtle gradients
   - Text màu `slate-100` (không phải pure white)
   - Borders dùng `slate-800/50` (opacity để blend với bg)

2. **Shadows trong dark mode:**
   - Thêm top highlight: `border-t border-white/5`
   - Shadow dùng black với opacity thấp hơn

3. **Color adjustments:**
   - Primary color trong dark mode sáng hơn 1 shade (`primary-400` thay vì `500`)
   - Reduce saturation 10% để avoid eye strain

4. **Images/illustrations:**
   - Nếu thêm illustrations, có variant dark mode (hoặc dùng `mix-blend-mode`)

5. **Smooth toggle:**
   - Add transition class khi toggle dark mode (fade background color)
   - Toggle button với icon animation (sun ↔ moon)

### Phase J — Documentation & Playground (~2-3h)

**Design system docs:**

Tạo page `/design-system` (hoặc `/playground`) để showcase components:

```
app/design-system/page.tsx
  ├── Color Palette (swatches)
  ├── Typography Scale (các font sizes)
  ├── Spacing System (visual grid)
  ├── Buttons (tất cả variants)
  ├── Cards
  ├── Badges
  ├── Inputs
  ├── Loading states
  └── Animations demos
```

**Benefits:**
- QA dễ test visual regression
- Developer onboarding nhanh hơn
- Design consistency (reference duy nhất)

## File Structure (new files)

```
korean-study/
├── components/
│   └── ui/                     # Atomic components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Badge.tsx
│       ├── Card.tsx
│       ├── Tag.tsx
│       ├── Spinner.tsx
│       ├── Skeleton.tsx
│       ├── EmptyState.tsx
│       ├── LoadingState.tsx
│       ├── Alert.tsx
│       ├── Modal.tsx
│       ├── Tooltip.tsx
│       ├── ProgressBar.tsx
│       └── Tabs.tsx
├── lib/
│   ├── design-tokens.ts        # Design constants export
│   └── animations.ts           # Framer Motion variants (nếu dùng)
├── app/
│   ├── design-system/
│   │   └── page.tsx            # Component playground
│   └── globals.css             # Expanded với full tokens
├── tailwind.config.ts          # Custom theme config
└── docs/
    └── phase-ui-redesign.md    # ← file này
```

## Effort Estimate

| Sub-phase | Effort | Cumulative |
|-----------|--------|------------|
| A — Design tokens & theme | 4-6h | 4-6h |
| B — Atoms (base components) | 8-10h | 12-16h |
| C — Molecules (composite) | 6-8h | 18-24h |
| D — Redesign existing pages | 10-12h | 28-36h |
| E — Micro-interactions | 4-5h | 32-41h |
| F — Responsive refinement | 3-4h | 35-45h |
| G — Accessibility audit | 4-5h | 39-50h |
| H — Performance optimization | 3-4h | 42-54h |
| I — Dark mode refinement | 2-3h | 44-57h |
| J — Documentation/playground | 2-3h | 46-60h |

**Total: ~46-60 giờ** (1.5-2 tháng part-time, hoặc 1-1.5 tuần full-time)

**Khuyến nghị:**
1. Ship **Phase A+B** trước (~12-16h) → có component library base
2. Incremental rollout: redesign 1 page/tuần (D1 → D2 → D3 → D4)
3. Phase E-I có thể làm song song với Phase 3 (SRS) — không conflict

## Decision Points

1. **Animation library**: Framer Motion (30KB) vs pure CSS (0KB)? → CSS nếu muốn lightweight
2. **Component library**: Build from scratch vs dùng Radix UI primitives (headless)? → Scratch = full control
3. **Icon system**: Emoji (current) vs Lucide icons (SVG)? → Emoji đủ tốt cho learning app
4. **Font hosting**: Google Fonts CDN vs self-host? → CDN OK cho MVP, self-host cho perf
5. **Color palette**: Keep current blue vs rebrand? → Có thể A/B test với users
6. **Storybook**: Setup Storybook cho component dev? → Overkill cho project nhỏ, `/design-system` page đủ
7. **CSS approach**: Tailwind classes vs CSS Modules? → Keep Tailwind (đã invested)
8. **Bottom nav**: Thêm bottom nav mobile? → Yes nếu có ≥4 main sections (Homepage/Vocab/Flashcards/Grammar)

## Out of Scope

- **3D graphics** (Three.js) — overkill cho learning app
- **Complex illustrations** — keep minimal/flat design
- **Video embeds** — chỉ audio là đủ
- **Lottie animations** — CSS/SVG animations đủ
- **Internationalization** (i18n) — chỉ tiếng Việt + tiếng Hàn
- **RTL support** — không cần (Korean + Vietnamese đều LTR)
- **Print styles** — web-only app

## Success Metrics

**Qualitative:**
- [ ] Mọi page follow cùng design language
- [ ] Zero inconsistent spacing/colors/typography
- [ ] Dark mode không có "ugly invert" artifacts
- [ ] Animations smooth, không jarring
- [ ] Accessible với keyboard + screen reader

**Quantitative:**
- [ ] Lighthouse accessibility score ≥ 95
- [ ] Lighthouse performance score ≥ 90
- [ ] Core Web Vitals pass (LCP < 2.5s, CLS < 0.1)
- [ ] Bundle size ≤ 150KB (JS gzipped)
- [ ] < 10 requests cho homepage (fonts + CSS + JS)

## Implementation Strategy

### Week 1 — Foundation
- [ ] Day 1-2: Phase A (design tokens)
- [ ] Day 3-5: Phase B (atoms) — Button, Input, Badge, Card
- [ ] Weekend: Phase B (atoms) — Spinner, Skeleton, Tag

### Week 2 — Components
- [ ] Day 1-2: Phase C (molecules) — EmptyState, LoadingState, Alert
- [ ] Day 3-5: Phase C (molecules) — Modal, Tooltip, ProgressBar, Tabs

### Week 3 — Rollout
- [ ] Day 1: Phase D1 (Homepage redesign)
- [ ] Day 2: Phase D2 (Lesson pages)
- [ ] Day 3: Phase D3 (Vocab page)
- [ ] Day 4: Phase D4 (Summary page)
- [ ] Day 5: Phase E (micro-interactions)

### Week 4 — Polish
- [ ] Day 1-2: Phase F (responsive refinement)
- [ ] Day 3: Phase G (accessibility audit)
- [ ] Day 4: Phase H (performance optimization)
- [ ] Day 5: Phase I (dark mode refinement)

### Week 5 — Docs & Ship
- [ ] Day 1: Phase J (design system docs)
- [ ] Day 2-3: QA testing + bug fixes
- [ ] Day 4: Production deployment
- [ ] Day 5: Monitoring + hotfixes

## Dependencies

**Before starting:**
- [ ] Phase 1 (Hangul/Numbers/Pronunciation) — ✅ Done
- [ ] Phase 2 (Vocab) — ✅ Done

**Can work parallel with:**
- Phase 3 (SRS) — redesign có thể ảnh hưởng đến SRS UI, nhưng không blocking
- Phase 4 (Grammar) — miễn Phase A+B done trước

**Blocks:**
- Không có blocking dependencies từ phases khác

## References & Inspiration

**Design systems:**
- [Tailwind UI](https://tailwindui.com) — component patterns
- [Shadcn UI](https://ui.shadcn.com) — component architecture (copy-paste approach)
- [Radix Colors](https://www.radix-ui.com/colors) — semantic color scales
- [Inter font](https://rsms.me/inter/) — typography best practices

**Learning platforms:**
- [Duolingo](https://duolingo.com) — gamification, micro-interactions
- [Memrise](https://memrise.com) — card-based learning UI
- [LingoDeer](https://lingodeer.com) — clean, minimal design

**Animation:**
- [Framer Motion docs](https://www.framer.com/motion/) — React animation patterns
- [Magic UI](https://magicui.design) — animation inspiration

## Notes

- **Don't over-engineer**: Mục tiêu là personal learning app, không phải enterprise design system
- **Ship incrementally**: Mỗi sub-phase ship riêng, không cần đợi toàn bộ xong mới deploy
- **User feedback**: Sau mỗi major redesign (D1-D4), test với 1-2 người để catch usability issues sớm
- **Performance budget**: Mỗi component thêm vào phải justify ROI (UX improvement vs KB cost)
- **Accessibility first**: Mọi component phải keyboard-navigable + screen-reader friendly từ đầu, không fix sau

---

**Plan tạo:** 2026-05-04  
**Status:** ⏳ Chưa bắt đầu  
**Owner:** Duy  
**Timeline:** 4-6 tuần (part-time), hoặc 1-1.5 tuần (full-time)
