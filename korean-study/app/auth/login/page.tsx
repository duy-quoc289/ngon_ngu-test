import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  // Nếu đã login rồi → về trang chủ
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="inline-grid place-items-center w-14 h-14 rounded-2xl bg-primary-500 text-white text-2xl font-black" lang="ko">한</span>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">KRD</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Đăng nhập để lưu tiến độ học</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <LoginWithGoogle />
          <p className="mt-4 text-xs text-center text-slate-400 dark:text-slate-500">
            Chỉ dùng để lưu tiến độ học. Không spam, không quảng cáo.
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
          Chưa muốn đăng nhập?{" "}
          <a href="/" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
            Dùng không cần tài khoản
          </a>
        </p>
      </div>
    </div>
  );
}

// Client component riêng để gọi Supabase browser client
import { LoginWithGoogle } from "@/components/auth/LoginWithGoogle";
