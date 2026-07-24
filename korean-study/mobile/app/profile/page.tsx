"use client";

import vocabData from "@/data/vocab.json";
import type { VocabCategory } from "@/lib/types";
import { useSrsStore } from "@/lib/srs-store";
import { useProgress } from "@/lib/progress";
import { useAuth } from "@/lib/auth";
import { TOPICS } from "@/lib/topics";

const ALL_IDS = (vocabData.categories as VocabCategory[]).flatMap((c) => c.words.map((w) => w.audio));

function TopicProgressRow({ meta }: { meta: (typeof TOPICS)[number] }) {
  const { completed, hydrated } = useProgress(meta.data.topic);
  const total = meta.data.lessons.length;
  const done = hydrated ? completed.size : 0;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="ks-profile-topic-row">
      <span className="ks-profile-topic-icon" aria-hidden>{meta.icon}</span>
      <div className="ks-profile-topic-info">
        <div className="ks-profile-topic-name">{meta.data.title}</div>
        <div className="ks-topic-progress-track">
          <div className="ks-topic-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <span className="ks-profile-topic-count">{done}/{total}</span>
    </div>
  );
}

export default function ProfilePage() {
  const { stats, hydrated } = useSrsStore(ALL_IDS);
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  return (
    <div className="ks-app-shell">
      <header className="ks-path-header">
        <div>
          <h1 className="ks-path-title font-hand">Cá nhân</h1>
          <p className="ks-path-subtitle">
            {loading ? "…" : user ? `Đã đồng bộ · ${user.email}` : "Chế độ khách — dữ liệu lưu trên máy này"}
          </p>
        </div>
      </header>

      <main className="ks-profile-main">
        {!loading && (
          <div className="ks-profile-auth-card ks-surface">
            {user ? (
              <>
                <div className="ks-profile-auth-user">
                  {user.user_metadata?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.user_metadata.avatar_url as string} alt="" className="ks-profile-avatar" />
                  ) : (
                    <span className="ks-profile-avatar ks-profile-avatar-fallback">
                      {(user.user_metadata?.full_name as string ?? user.email ?? "?")[0].toUpperCase()}
                    </span>
                  )}
                  <div>
                    <div className="ks-profile-auth-name">{user.user_metadata?.full_name as string ?? user.email}</div>
                    <div className="ks-profile-auth-email">{user.email}</div>
                  </div>
                </div>
                <button type="button" className="ks-runner-btn is-ghost" onClick={signOut}>Đăng xuất</button>
              </>
            ) : (
              <button type="button" className="ks-runner-btn is-primary ks-profile-login-btn" onClick={signInWithGoogle}>
                Đăng nhập với Google — đồng bộ dữ liệu
              </button>
            )}
          </div>
        )}

        <div className="ks-profile-stat-row">
          <div className="ks-profile-stat ks-surface">
            <span className="ks-profile-stat-icon">🔥</span>
            <span className="ks-profile-stat-value">{hydrated ? stats.streak : "–"}</span>
            <span className="ks-profile-stat-label">ngày streak</span>
          </div>
          <div className="ks-profile-stat ks-surface">
            <span className="ks-profile-stat-icon">📇</span>
            <span className="ks-profile-stat-value">{hydrated ? stats.total : "–"}</span>
            <span className="ks-profile-stat-label">từ đã ôn</span>
          </div>
          <div className="ks-profile-stat ks-surface">
            <span className="ks-profile-stat-icon">⭐</span>
            <span className="ks-profile-stat-value">{hydrated ? stats.mature : "–"}</span>
            <span className="ks-profile-stat-label">đã thuộc</span>
          </div>
        </div>

        <h2 className="ks-profile-section-title font-hand">Tiến độ bài học</h2>
        <div className="ks-profile-topic-list ks-surface">
          {TOPICS.map((t) => <TopicProgressRow key={t.slug} meta={t} />)}
        </div>
      </main>
    </div>
  );
}
