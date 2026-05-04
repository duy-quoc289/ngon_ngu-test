import { createBrowserClient } from "@supabase/ssr";

/**
 * Dùng trong Client Components ("use client").
 * Gọi mỗi lần cần — thư viện tự cache bên trong.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
