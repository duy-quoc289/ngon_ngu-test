import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Không có Database generic (chưa generate types từ schema) — dùng `any` để
// .from()/.upsert()/.select() không bị TS suy luận thành `never`.
type AnyDatabase = any; // eslint-disable-line @typescript-eslint/no-explicit-any

let client: ReturnType<typeof createSupabaseClient<AnyDatabase>> | null = null;

/**
 * Client Supabase thuần (không dùng @supabase/ssr — không có server/cookies
 * trong static export). Session tự lưu localStorage của WebView, PKCE flow
 * vì OAuth ở đây đi qua system browser + deep link, không phải redirect
 * cùng tab như web.
 */
export function createClient() {
  if (client) return client;
  client = createSupabaseClient<AnyDatabase>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: "pkce",
        detectSessionInUrl: false,
        persistSession: true,
        autoRefreshToken: true,
      },
    },
  );
  return client;
}
