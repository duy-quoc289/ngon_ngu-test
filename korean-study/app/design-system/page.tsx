"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Spinner } from "@/components/ui/Spinner";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-1 text-slate-800 dark:text-slate-100">
        {title}
      </h2>
      <div className="h-0.5 w-12 bg-primary-500 mb-6 rounded-full" />
      {children}
    </section>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export default function DesignSystemPage() {
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [inputVal, setInputVal] = useState("");

  const handleLoadingDemo = () => {
    setLoadingBtn(true);
    setTimeout(() => setLoadingBtn(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Design System
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Component playground
            </p>
          </div>
          <a
            href="/"
            className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
          >
            ← Về trang chủ
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* ── COLOR PALETTE ── */}
        <Section title="🎨 Color Palette">
          {(
            [
              { name: "Primary", key: "primary", swatches: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] },
              { name: "Secondary", key: "secondary", swatches: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] },
              { name: "Success", key: "success", swatches: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] },
              { name: "Warning", key: "warning", swatches: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] },
              { name: "Error", key: "error", swatches: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] },
              { name: "Info", key: "info", swatches: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] },
            ] as const
          ).map((palette) => (
            <div key={palette.key} className="mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                {palette.name}
              </p>
              <div className="flex gap-1">
                {palette.swatches.map((shade) => (
                  <div key={shade} className="flex-1 text-center">
                    <div
                      className={`h-10 rounded-md bg-${palette.key}-${shade}`}
                    />
                    <p className="text-[10px] text-slate-400 mt-1">{shade}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Section>

        {/* ── TYPOGRAPHY ── */}
        <Section title="🔤 Typography">
          <div className="space-y-3 bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <div className="flex items-baseline gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 w-16 shrink-0">text-5xl</span>
              <p className="text-5xl font-bold text-slate-800 dark:text-slate-100">안녕하세요</p>
            </div>
            <div className="flex items-baseline gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 w-16 shrink-0">text-4xl</span>
              <p className="text-4xl font-bold text-slate-800 dark:text-slate-100">Học tiếng Hàn</p>
            </div>
            <div className="flex items-baseline gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 w-16 shrink-0">text-3xl</span>
              <p className="text-3xl font-semibold text-slate-800 dark:text-slate-100">Reference cá nhân</p>
            </div>
            <div className="flex items-baseline gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 w-16 shrink-0">text-2xl</span>
              <p className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Hangul, Numbers, Vocab</p>
            </div>
            <div className="flex items-baseline gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 w-16 shrink-0">text-xl</span>
              <p className="text-xl text-slate-700 dark:text-slate-200">Phase 3 — Flashcard SRS</p>
            </div>
            <div className="flex items-baseline gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 w-16 shrink-0">text-lg</span>
              <p className="text-lg text-slate-600 dark:text-slate-300">Spaced repetition system</p>
            </div>
            <div className="flex items-baseline gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 w-16 shrink-0">text-base</span>
              <p className="text-base text-slate-600 dark:text-slate-400">Body text — mô tả chi tiết về bài học</p>
            </div>
            <div className="flex items-baseline gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 w-16 shrink-0">text-sm</span>
              <p className="text-sm text-slate-500 dark:text-slate-400">Caption và meta information</p>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-xs text-slate-400 w-16 shrink-0">text-xs</span>
              <p className="text-xs text-slate-400">Tags, hints, timestamps</p>
            </div>
          </div>
        </Section>

        {/* ── BUTTONS ── */}
        <Section title="🔘 Buttons">
          <Row label="Variants">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="danger">Danger</Button>
          </Row>
          <Row label="Sizes">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </Row>
          <Row label="States">
            <Button loading={loadingBtn} onClick={handleLoadingDemo}>
              {loadingBtn ? "Loading..." : "Click để loading"}
            </Button>
            <Button disabled>Disabled</Button>
            <Button
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            >
              With Icon
            </Button>
            <Button
              variant="outline"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              }
              iconPosition="right"
            >
              Icon Right
            </Button>
          </Row>
        </Section>

        {/* ── INPUTS ── */}
        <Section title="📝 Inputs">
          <div className="grid sm:grid-cols-2 gap-6">
            <Input
              label="Default Input"
              placeholder="Nhập từ tiếng Hàn..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <Input
              label="Với helper text"
              placeholder="search..."
              helperText="Gõ để tìm từ vựng"
              prefixIcon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                </svg>
              }
            />
            <Input
              label="Error variant"
              variant="error"
              defaultValue="invalid input"
              helperText="Từ này không tồn tại trong từ điển"
            />
            <Input
              label="Success variant"
              variant="success"
              defaultValue="안녕하세요"
              helperText="Chính xác! Phát âm đúng"
            />
            <Input label="Disabled" disabled placeholder="Disabled input..." />
            <Input inputSize="sm" placeholder="Small size..." />
          </div>
        </Section>

        {/* ── BADGES ── */}
        <Section title="🏷 Badges">
          <Row label="Variants">
            <Badge variant="default">Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
          </Row>
          <Row label="Sizes">
            <Badge variant="primary" size="sm">Small</Badge>
            <Badge variant="primary" size="md">Medium</Badge>
          </Row>
          <Row label="Removable">
            <Badge variant="primary" removable onRemove={() => {}}>
              Phase 2/4
            </Badge>
            <Badge variant="success" removable onRemove={() => {}}>
              Vocabulary
            </Badge>
            <Badge variant="warning" removable onRemove={() => {}}>
              In Progress
            </Badge>
          </Row>
        </Section>

        {/* ── TAGS ── */}
        <Section title="🔖 Tags">
          <Row label="Colors">
            <Tag color="blue">greeting</Tag>
            <Tag color="green">polite</Tag>
            <Tag color="yellow">informal</Tag>
            <Tag color="red">formal</Tag>
            <Tag color="purple">intro</Tag>
            <Tag color="pink">farewell</Tag>
            <Tag color="gray">common</Tag>
          </Row>
          <Row label="Sizes">
            <Tag color="blue" size="xs">xs tag</Tag>
            <Tag color="blue" size="sm">sm tag</Tag>
          </Row>
        </Section>

        {/* ── CARDS ── */}
        <Section title="🃏 Cards">
          <div className="grid sm:grid-cols-3 gap-4">
            <Card variant="flat">
              <CardBody>
                <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">Flat</p>
                <p className="text-sm text-slate-500">No shadow, no border</p>
              </CardBody>
            </Card>
            <Card variant="elevated">
              <CardBody>
                <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">Elevated</p>
                <p className="text-sm text-slate-500">Default shadow</p>
              </CardBody>
            </Card>
            <Card variant="outlined">
              <CardBody>
                <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">Outlined</p>
                <p className="text-sm text-slate-500">Border only</p>
              </CardBody>
            </Card>
            <Card variant="elevated" hoverable className="col-span-full sm:col-span-1">
              <CardBody>
                <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">Hoverable ↑</p>
                <p className="text-sm text-slate-500">Hover để thấy lift</p>
              </CardBody>
            </Card>
            <Card variant="outlined" clickable hoverable className="col-span-full sm:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-700 dark:text-slate-200">Clickable Card</p>
                  <Badge variant="primary" size="sm">New</Badge>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Card với Header / Body / Footer. Hover để thấy lift, click để thấy scale animation.
                </p>
                <div className="flex gap-2 mt-3">
                  <Tag color="blue">hangul</Tag>
                  <Tag color="green">beginner</Tag>
                </div>
              </CardBody>
              <CardFooter>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Stage 1 · 24 bài</span>
                  <Button size="sm" variant="ghost">Xem chi tiết →</Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </Section>

        {/* ── SPINNERS ── */}
        <Section title="⏳ Spinners">
          <Row label="Sizes">
            <Spinner size="xs" />
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </Row>
          <Row label="Colors">
            <Spinner size="md" color="primary" />
            <span className="inline-flex items-center justify-center bg-primary-500 rounded-lg p-3">
              <Spinner size="md" color="white" />
            </span>
          </Row>
        </Section>

        {/* ── SKELETONS ── */}
        <Section title="💀 Skeletons">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-3">Text Lines</p>
              <SkeletonText lines={4} />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-3">Button + Avatar</p>
              <div className="flex items-center gap-3">
                <Skeleton variant="avatar" />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </div>
              </div>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-3">Card Skeleton</p>
              <div className="grid sm:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} variant="outlined">
                    <CardBody className="space-y-3">
                      <Skeleton variant="text" width="70%" />
                      <SkeletonText lines={2} />
                      <div className="flex gap-2">
                        <Skeleton variant="button" height="24px" rounded="full" />
                        <Skeleton variant="button" height="24px" width="60px" rounded="full" />
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ── VOCAB CARD DEMO ── */}
        <Section title="📖 Vocab Card (demo)">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { ko: "안녕하세요", rom: "an-nyeong-ha-se-yo", vi: "Xin chào", viExtra: "(lịch sự)", tags: ["greeting", "polite"], category: "Chào hỏi" },
              { ko: "감사합니다", rom: "gam-sa-ham-ni-da", vi: "Cảm ơn", viExtra: "(formal)", tags: ["thanks", "formal"], category: "Chào hỏi" },
              { ko: "미안해요", rom: "mi-an-hae-yo", vi: "Xin lỗi", viExtra: "(semi-formal)", tags: ["apology", "polite"], category: "Chào hỏi" },
            ].map((word) => (
              <Card key={word.ko} variant="outlined" hoverable clickable>
                <CardBody>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100" lang="ko">
                      {word.ko}
                    </p>
                    <button
                      className="ks-play shrink-0 mt-1"
                      aria-label={`Nghe ${word.ko}`}
                    >
                      <svg className="ks-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-primary-500 font-medium mb-1">{word.rom}</p>
                  <p className="text-slate-700 dark:text-slate-200 font-medium">
                    {word.vi}{" "}
                    {word.viExtra && (
                      <span className="text-sm font-normal text-slate-500">{word.viExtra}</span>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <Badge variant="default" size="sm">{word.category}</Badge>
                    {word.tags.map((t) => (
                      <Tag key={t} color="gray" size="xs">{t}</Tag>
                    ))}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </Section>

        {/* ── DARK MODE NOTE ── */}
        <div className="rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 p-5 text-sm text-primary-700 dark:text-primary-300">
          <p className="font-semibold mb-1">💡 Dark mode</p>
          <p>Toggle dark mode bằng cách thêm/xóa class <code className="bg-primary-100 dark:bg-primary-900/30 px-1 py-0.5 rounded text-xs font-mono">dark</code> trên thẻ <code className="bg-primary-100 dark:bg-primary-900/30 px-1 py-0.5 rounded text-xs font-mono">&lt;html&gt;</code>. Tất cả components đều hỗ trợ dark mode.</p>
        </div>
      </div>
    </div>
  );
}
