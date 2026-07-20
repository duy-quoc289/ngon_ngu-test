import type { Metadata } from "next";
import "sketchbook-ui/style.css";
import { hand, marker, beVietnamPro, notoSansKr } from "@/lib/fonts";
import { SketchThemeProvider } from "@/components/providers/SketchThemeProvider";
import { AudioProvider } from "@/components/audio/AudioProvider";
import { AudioControlPanel } from "@/components/audio/AudioControlPanel";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "Học tiếng Hàn",
  description:
    "Tham khảo cá nhân học tiếng Hàn — Hangul, số đếm, quy tắc nối âm, từ vựng cơ bản (~160 từ).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${hand.variable} ${marker.variable} ${beVietnamPro.variable} ${notoSansKr.variable} scroll-smooth`}
    >
      <head>
        {/* FOUC fix — set dark class trước khi React hydrate */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-paper text-ink antialiased min-h-screen">
        {/* Filter SVG dùng cho viền vẽ tay lượn sóng (.ks-wobble) — xem app/globals.css */}
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden focusable="false">
          <filter id="ks-sketchy" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.06" numOctaves={2} seed={7} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={3.2} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
        <SketchThemeProvider>
          <AudioProvider>
            {children}
            <AudioControlPanel />
          </AudioProvider>
        </SketchThemeProvider>
      </body>
    </html>
  );
}
