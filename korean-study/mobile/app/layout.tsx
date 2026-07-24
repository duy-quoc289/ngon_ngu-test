import type { Metadata, Viewport } from "next";
import { hand, marker, beVietnamPro, notoSansKr } from "@/lib/fonts";
import { AudioProvider } from "@/components/audio/AudioProvider";
import { TabBar } from "@/components/TabBar";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "Korean Study",
  description: "Ôn tập từ vựng tiếng Hàn — bản mobile",
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#FBF6EC",
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${hand.variable} ${marker.variable} ${beVietnamPro.variable} ${notoSansKr.variable}`}
    >
      <head>
        {/* FOUC fix — set dark class trước khi React hydrate (port từ root app/layout.tsx) */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-paper text-ink antialiased">
        {/* Filter SVG cho viền vẽ tay lượn sóng (.ks-wobble) — port nguyên từ root */}
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden focusable="false">
          <filter id="ks-sketchy" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.06" numOctaves={2} seed={7} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={3.2} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
        <AudioProvider>
          {children}
          <TabBar />
        </AudioProvider>
      </body>
    </html>
  );
}
