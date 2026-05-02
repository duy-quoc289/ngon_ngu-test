// Inline script chạy ở <head> để set class="dark" trước React hydrate (tránh FOUC).
// Đồng thời lắng nghe đổi system theme.
export const themeInitScript = `
(function () {
  var mq = matchMedia('(prefers-color-scheme: dark)');
  function sync() {
    document.documentElement.classList.toggle('dark', mq.matches);
  }
  sync();
  mq.addEventListener && mq.addEventListener('change', sync);
})();
`;
