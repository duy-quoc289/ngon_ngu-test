/** Bộ 3 SVG icon (play/pause/loading) — CSS sẽ swap visibility theo class is-playing/is-loading. */
export function PlayIcons() {
  return (
    <>
      <svg viewBox="0 0 24 24" className="ks-icon ks-icon-play" fill="currentColor">
        <path d="M8 5v14l11-7z" />
      </svg>
      <svg viewBox="0 0 24 24" className="ks-icon ks-icon-pause" fill="currentColor">
        <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        className="ks-icon ks-icon-loading"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <circle cx="12" cy="12" r="9" strokeDasharray="40" strokeLinecap="round" />
      </svg>
    </>
  );
}
