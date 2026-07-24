// Inline script chạy ở <head> để set class="dark" trước React hydrate (tránh FOUC).
// Default: light. Lưu lựa chọn vào localStorage key 'ks-theme'.
export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('ks-theme');
    var dark = stored === 'dark';
    document.documentElement.classList.toggle('dark', dark);
  } catch (e) {}
})();
`;

/** Toggle dark/light, lưu vào localStorage, trả về isDark mới. */
export function toggleTheme(): boolean {
  const isDark = document.documentElement.classList.toggle('dark');
  try { localStorage.setItem('ks-theme', isDark ? 'dark' : 'light'); } catch {}
  return isDark;
}

/** Đọc theme hiện tại. */
export function getIsDark(): boolean {
  if (typeof window === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}
