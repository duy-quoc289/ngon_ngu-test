import type { Metadata } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";
import { AudioProvider } from "@/components/audio/AudioProvider";
import { AudioControlPanel } from "@/components/audio/AudioControlPanel";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

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
    <html lang="vi" className={`${inter.variable} ${notoSansKr.variable} scroll-smooth`}>
      <head>
        {/* FOUC fix — set dark class trước khi React hydrate */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200 antialiased min-h-screen">
        <AudioProvider>
          {children}
          <AudioControlPanel />
        </AudioProvider>
      </body>
    </html>
  );
}
