"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { Browser } from "@capacitor/browser";
import { App as CapApp } from "@capacitor/app";
import { createClient } from "@/lib/supabase/client";

/** Phải khớp với intent-filter trong AndroidManifest.xml và Redirect URL
 *  allowlist trên Supabase Dashboard (Authentication → URL Configuration) —
 *  bước đó tôi không tự làm được, cần bạn thêm thủ công. */
const REDIRECT_URL = "com.koreanstudy.app://auth/callback";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: authSub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Bắt deep link `com.koreanstudy.app://auth/callback?code=...` sau khi
    // system browser redirect về app (Capacitor App plugin).
    const listenerPromise = CapApp.addListener("appUrlOpen", async ({ url }) => {
      if (!url.startsWith(REDIRECT_URL)) return;
      try {
        const code = new URL(url).searchParams.get("code");
        if (code) await supabase.auth.exchangeCodeForSession(code);
      } catch (err) {
        console.error("OAuth callback error:", err);
      } finally {
        await Browser.close().catch(() => {});
      }
    });

    return () => {
      authSub.subscription.unsubscribe();
      listenerPromise.then((l) => l.remove());
    };
  }, []);

  async function signInWithGoogle() {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: REDIRECT_URL, skipBrowserRedirect: true },
    });
    if (error) {
      console.error("signInWithGoogle error:", error);
      return;
    }
    if (data?.url) await Browser.open({ url: data.url });
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
  }

  return (
    <Ctx.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
