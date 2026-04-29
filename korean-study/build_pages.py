"""Build các trang HTML từ content/*.md với layout Tailwind chung.

Chạy: python3 build_pages.py
Output: pages/{hangul,numbers,pronunciation,summary}.html
"""
import os
import re
import markdown

CONTENT_DIR = "content"
PAGES_DIR = "pages"

PAGES = [
    # hangul đã chuyển sang app shell (data/hangul.json + lesson-viewer.js), không build từ md
    {"slug": "numbers",       "file": "numbers.md",       "title": "Số đếm (숫자)",          "icon": "1", "subtitle": "2 hệ thống đếm"},
    {"slug": "pronunciation", "file": "pronunciation.md", "title": "Quy tắc nối âm",          "icon": "발", "subtitle": "받침 발음 규칙"},
    {"slug": "summary",       "file": "summary.md",       "title": "Lộ trình ôn tập",         "icon": "★", "subtitle": "Kế hoạch 4 tuần"},
]


LAYOUT = """<!DOCTYPE html>
<html lang="vi" class="scroll-smooth">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} — Học tiếng Hàn</title>
<script>
  // FOUC fix — set dark class trước khi CSS load
  if (matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.classList.add('dark');
</script>
<script src="https://cdn.tailwindcss.com?plugins=typography"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/style.css">
<script>
  tailwind.config = {{
    darkMode: 'media',
    theme: {{
      extend: {{
        fontFamily: {{
          sans: ['Inter', 'Noto Sans KR', 'system-ui', 'sans-serif'],
        }},
        colors: {{
          accent: {{ 50:'#eff6ff', 100:'#dbeafe', 500:'#5b8def', 600:'#2f5fd0', 700:'#1e40af' }},
        }},
      }}
    }}
  }}
</script>
<script src="../assets/app.js" defer></script>
</head>
<body class="bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200 font-sans antialiased">

<nav class="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
  <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
    <a href="../index.html" class="flex items-center gap-2 font-semibold hover:text-accent-600 transition-colors">
      <span class="text-xl">🇰🇷</span>
      <span>Học tiếng Hàn</span>
    </a>
    <div class="hidden sm:flex items-center gap-4 text-sm">
      <a href="hangul.html" class="hover:text-accent-600">Hangul</a>
      <a href="numbers.html" class="hover:text-accent-600">Số đếm</a>
      <a href="pronunciation.html" class="hover:text-accent-600">Nối âm</a>
      <a href="summary.html" class="hover:text-accent-600">Lộ trình</a>
    </div>
    <select onchange="if(this.value)location.href=this.value" class="sm:hidden bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-sm">
      <option value="">Trang khác…</option>
      <option value="hangul.html">Hangul</option>
      <option value="numbers.html">Số đếm</option>
      <option value="pronunciation.html">Nối âm</option>
      <option value="summary.html">Lộ trình</option>
    </select>
  </div>
</nav>

<header class="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-4">
  <div class="flex items-center gap-4">
    <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-violet-500 text-white grid place-items-center text-2xl font-bold shadow-lg shadow-accent-500/30">
      {icon}
    </div>
    <div>
      <h1 class="text-2xl sm:text-3xl font-bold m-0 bg-gradient-to-r from-accent-600 to-violet-500 bg-clip-text text-transparent">{title}</h1>
      <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">{subtitle}</p>
    </div>
  </div>
</header>

<main class="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
  <article class="ks-prose prose prose-slate dark:prose-invert max-w-none">
{body}
  </article>
</main>

<footer class="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
  <div class="flex flex-wrap gap-4 items-center justify-between">
    <span>Made with ❤️ — reference cá nhân</span>
    <a href="../index.html" class="text-accent-600 hover:underline">← Về trang chủ</a>
  </div>
</footer>

</body>
</html>
"""


AUDIO_BUTTON_TEMPLATE = (
    '<button type="button" class="ks-play" data-audio="{src}" aria-label="Phát phát âm">'
    '<svg viewBox="0 0 24 24" class="ks-icon ks-icon-play" fill="currentColor">'
    '<path d="M8 5v14l11-7z"/></svg>'
    '<svg viewBox="0 0 24 24" class="ks-icon ks-icon-pause" fill="currentColor">'
    '<path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>'
    '<svg viewBox="0 0 24 24" class="ks-icon ks-icon-loading" fill="none" stroke="currentColor" stroke-width="2.5">'
    '<circle cx="12" cy="12" r="9" stroke-dasharray="40" stroke-linecap="round"/></svg>'
    '</button>'
)

AUDIO_RE = re.compile(
    r'<audio[^>]*src="(?P<src>audio/[^"]+\.mp3)"[^>]*></audio>'
)


def md_to_html(md_text: str) -> str:
    html = markdown.markdown(
        md_text,
        extensions=["extra", "tables", "fenced_code", "sane_lists"],
    )
    # Audio đặt ở korean-study/audio/, page ở korean-study/pages/ → cần ../
    # Thay <audio controls> bằng custom <button class="ks-play"> compact
    def repl(m):
        return AUDIO_BUTTON_TEMPLATE.format(src='../' + m.group('src'))

    html = AUDIO_RE.sub(repl, html)
    return html


def build_page(page: dict):
    src = os.path.join(CONTENT_DIR, page["file"])
    dst = os.path.join(PAGES_DIR, f"{page['slug']}.html")
    with open(src, encoding="utf-8") as f:
        md = f.read()
    body = md_to_html(md)
    html = LAYOUT.format(
        title=page["title"],
        icon=page["icon"],
        subtitle=page["subtitle"],
        body=body,
    )
    os.makedirs(PAGES_DIR, exist_ok=True)
    with open(dst, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"  → {dst}  ({os.path.getsize(dst)/1024:.1f} KB)")


def main():
    print("Building pages...")
    for page in PAGES:
        build_page(page)
    print(f"Done. {len(PAGES)} pages built.")


if __name__ == "__main__":
    main()
