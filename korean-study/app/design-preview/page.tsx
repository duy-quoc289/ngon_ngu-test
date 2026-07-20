"use client";

import { useState } from "react";
import { Button, Input, Checkbox, Badge, Card } from "sketchbook-ui";
import styles from "./design-preview.module.css";

const PALETTE = [
  { name: "Giấy nền", hex: "#FBF6EC", tilt: -1 },
  { name: "Mực đen", hex: "#232323", tilt: 1 },
  { name: "Bút bi xanh", hex: "#2B4EFF", tilt: -1.5 },
  { name: "Bút dạ cam", hex: "#E8503A", tilt: 1.5 },
  { name: "Bút dạ xanh lá", hex: "#3F9142", tilt: -1 },
  { name: "Bút gel tím", hex: "#8B5FBF", tilt: 1 },
  { name: "Highlight vàng", hex: "#FFD93D", tilt: -2 },
  { name: "Washi hồng", hex: "#FFD6E0", tilt: 2 },
];

const VOCAB_CATEGORIES = [
  { title: "Chào hỏi", word: "안녕하세요", rom: "annyeonghaseyo", bg: "#D6E8FF", tilt: -3 },
  { title: "Gia đình", word: "가족", rom: "gajok", bg: "#FFD6E0", tilt: 2 },
  { title: "Ăn uống", word: "맛있어요", rom: "masisseoyo", bg: "#D9F2D9", tilt: -2 },
  { title: "Mua sắm", word: "얼마예요", rom: "eolmayeyo", bg: "#FFF3B0", tilt: 3 },
];

export default function DesignPreviewPage() {
  const [checked, setChecked] = useState(true);

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        {/* HERO */}
        <header className={styles.hero}>
          <h1 className={styles.heroTitle}>Học tiếng Hàn</h1>
          <span className={styles.stamp}>PHASE 0</span>
          <p className={styles.heroSub}>
            Trang thử nghiệm màu sắc &amp; font — phong cách sổ tay vẽ tay (sketchbook-ui)
          </p>
        </header>

        {/* PALETTE */}
        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>1. Bảng màu</h2>
          <div className={styles.swatchGrid}>
            {PALETTE.map((c) => (
              <div
                key={c.hex}
                className={styles.swatch}
                style={{ "--tilt": `${c.tilt}deg` } as React.CSSProperties}
              >
                <div className={styles.swatchColor} style={{ background: c.hex }} />
                <div className={styles.swatchLabel}>{c.name}</div>
                <div className={styles.swatchHex}>{c.hex}</div>
              </div>
            ))}
          </div>
        </section>

        {/* TYPOGRAPHY */}
        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>2. Chữ viết</h2>

          <div className={styles.typeCard}>
            <p className={styles.typeMeta}>
              Permanent Marker — CHỈ dùng nhãn tiếng Anh/số ngắn (không có subset vietnamese)
            </p>
            <p className={styles.typeMarker}>TOPIK LEVEL 1</p>
          </div>

          <div className={styles.typeCard}>
            <p className={styles.typeMeta}>Shantell Sans 700/800 — tiêu đề chính (hỗ trợ đầy đủ dấu tiếng Việt)</p>
            <p className={styles.typeCaveat}>Xin chào! Mình học tiếng Hàn mỗi ngày.</p>
          </div>

          <div className={styles.typeCard}>
            <p className={styles.typeMeta}>Shantell Sans 400 — nhãn nút bấm, điều hướng, UI ngắn</p>
            <p className={styles.typePatrick}>Bắt đầu bài học · Lưu tiến độ · Nghe lại</p>
          </div>

          <div className={styles.typeCard}>
            <p className={styles.typeMeta}>Be Vietnam Pro — nội dung giải thích (giữ rõ ràng, KHÔNG vẽ tay)</p>
            <p className={styles.typeBody}>
              Phần giải thích ngữ pháp, ví dụ câu và ghi chú dài sẽ luôn dùng font sans-serif
              rõ ràng này — vì đây là nội dung học tập, ưu tiên dễ đọc hơn là thẩm mỹ trang trí.
            </p>
          </div>

          <div className={styles.typeCard}>
            <p className={styles.typeMeta}>
              Noto Sans KR — chữ Hàn thực tế trong bài học
              <span className={styles.noteTag}>giữ nguyên, không vẽ tay</span>
            </p>
            <p className={styles.typeKo}>안녕하세요, 저는 한국어를 공부합니다.</p>
          </div>
        </section>

        {/* COMPONENTS */}
        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>3. Component mẫu (sketchbook-ui)</h2>

          <div className={styles.componentRow}>
            <Button colors={{ bg: "#2B4EFF", stroke: "#232323", text: "#FFFFFF" }} typography={{ fontFamily: "var(--font-hand)" }}>
              Bắt đầu học
            </Button>
            <Button colors={{ bg: "#E8503A", stroke: "#232323", text: "#FFFFFF" }} typography={{ fontFamily: "var(--font-hand)" }}>
              Nghe lại
            </Button>
            <Button colors={{ bg: "#FBF6EC", stroke: "#232323", text: "#232323" }} typography={{ fontFamily: "var(--font-hand)" }}>
              Bỏ qua
            </Button>
          </div>

          <div className={styles.componentRow}>
            <Input
              label="Tìm từ vựng"
              placeholder="Nhập tiếng Việt hoặc tiếng Hàn..."
              colors={{ bg: "#FFFDF7", stroke: "#232323", text: "#232323", label: "#232323" }}
              typography={{ fontFamily: "var(--font-hand)", labelSize: "0.95rem" }}
            />
            <Checkbox
              label="Đã học xong bài này"
              checked={checked}
              onChange={setChecked}
              colors={{ stroke: "#232323", check: "#3F9142", text: "#232323" }}
              typography={{ fontFamily: "var(--font-hand)" }}
            />
          </div>

          <div className={styles.componentRow}>
            <Badge variant="info" colors={{ bg: "#D6E8FF", text: "#1e3a8a", stroke: "#232323" }} typography={{ fontFamily: "var(--font-hand)" }}>
              Hangul
            </Badge>
            <Badge variant="success" colors={{ bg: "#D9F2D9", text: "#1a4d1a", stroke: "#232323" }} typography={{ fontFamily: "var(--font-hand)" }}>
              Đã hoàn thành
            </Badge>
            <Badge variant="warning" colors={{ bg: "#FFF3B0", text: "#6b5300", stroke: "#232323" }} typography={{ fontFamily: "var(--font-hand)" }}>
              Đang ôn tập
            </Badge>
          </div>

          <Card
            variant="notebook"
            colors={{ bg: "#FFFDF7", stroke: "#232323", text: "#232323" }}
            typography={{ fontFamily: "var(--font-body-vi)" }}
            style={{ maxWidth: 480, padding: "1.25rem 1.5rem" }}
          >
            <p className={styles.typeCaveat} style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>
              Bài 1: Nguyên âm cơ bản
            </p>
            <p className={styles.typeBody} style={{ fontSize: "0.95rem" }}>
              6 nguyên âm đơn trong bảng chữ cái Hangul — ㅏ ㅓ ㅗ ㅜ ㅡ ㅣ.
              Đây là ví dụ Card variant &quot;notebook&quot; dùng cho thẻ bài học.
            </p>
          </Card>
        </section>

        {/* VOCAB TILES — "xiên lệch" sticky note look */}
        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>4. Thẻ chủ đề từ vựng (sticky note, xiên lệch)</h2>
          <div className={styles.vocabGrid}>
            {VOCAB_CATEGORIES.map((cat) => (
              <div
                key={cat.title}
                className={styles.vocabTile}
                style={{ "--tilt": `${cat.tilt}deg` } as React.CSSProperties}
              >
                <Card
                  variant="sticky"
                  colors={{ bg: cat.bg, stroke: "#232323", text: "#232323" }}
                  typography={{ fontFamily: "var(--font-hand)" }}
                  style={{ padding: "1rem" }}
                >
                  <div className={styles.vocabTileInner}>
                    <p style={{ margin: 0, fontSize: "0.9rem" }}>{cat.title}</p>
                    <p className={styles.vocabWord}>{cat.word}</p>
                    <p className={styles.vocabMeta}>{cat.rom}</p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
