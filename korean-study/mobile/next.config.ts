import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export — bundle này sẽ được đóng gói vào WebView native (Capacitor/Ionic),
  // không có Node.js server nên không dùng được Server Actions / Route Handlers động / cookies.
  output: "export",
  // Không có server để tối ưu ảnh on-demand.
  images: {
    unoptimized: true,
  },
  turbopack: {
    // Project riêng, tránh Next.js suy luận nhầm root là thư mục cha (có lockfile của app web chính).
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
