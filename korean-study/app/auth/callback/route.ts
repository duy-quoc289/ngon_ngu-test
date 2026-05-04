import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Supabase OAuth callback — đổi code lấy session.
 * URL: /auth/callback?code=...&next=/
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Lỗi → về trang login kèm thông báo
  return NextResponse.redirect(
    `${origin}/auth/login?error=Đăng+nhập+thất+bại%2C+thử+lại.`,
  );
}
