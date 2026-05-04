import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Đã bỏ "output: export" vì app dùng Server Actions + Route Handlers (Supabase Auth)
  // Deploy: Vercel (free tier) hoặc bất kỳ host hỗ trợ Node.js
  images: {
    // Cho phép avatar từ Supabase/Google
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
