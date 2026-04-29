// Lesson viewer — render JSON lessons với 4 type: explainer, tile-grid, comparison, exercise

(function () {
  'use strict';

  // Topic được lấy từ <body data-topic="..."> hoặc fallback hangul
  const TOPIC = (document.body && document.body.dataset.topic) || 'hangul';
  const DATA_URL = `../data/${TOPIC}.json`;
  const STORAGE_KEY = `ks-progress-${TOPIC}`;

  const state = {
    data: null,
    idx: 0,
    completed: new Set(),
  };

  /* ─── Utilities ─── */
  function md(s) {
    if (!s) return '';
    return s
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-sm">$1</code>');
  }

  function el(tag, attrs = {}, html = '') {
    const e = document.createElement(tag);
    for (const k in attrs) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'data') Object.assign(e.dataset, attrs[k]);
      else e.setAttribute(k, attrs[k]);
    }
    if (html) e.innerHTML = html;
    return e;
  }

  function saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...state.completed]));
  }

  function loadProgress() {
    try {
      state.completed = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
    } catch {
      state.completed = new Set();
    }
  }

  /* ─── Render ─── */

  function renderSidebar() {
    const html = state.data.lessons.map((l, i) => {
      const isActive = i === state.idx;
      const isDone = state.completed.has(l.id);
      const status = isDone ? '<span class="ks-side-icon ks-side-icon-done">✓</span>'
                            : `<span class="ks-side-icon">${i + 1}</span>`;
      return `
        <li>
          <a href="#${l.id}" data-idx="${i}"
             class="ks-side-item ${isActive ? 'is-active' : ''} ${isDone ? 'is-done' : ''}">
            ${status}
            <span class="ks-side-text">
              <span class="ks-side-emoji" lang="ko">${l.icon || ''}</span>
              <span>${l.title}</span>
            </span>
          </a>
        </li>`;
    }).join('');

    document.getElementById('ks-lesson-list').innerHTML = html;
    const mobile = document.getElementById('ks-lesson-list-mobile');
    if (mobile) mobile.innerHTML = html;
  }

  function renderProgress() {
    const total = state.data.lessons.length;
    const done = state.completed.size;
    const pct = Math.round((done / total) * 100);
    const bar = document.getElementById('ks-progress-bar');
    const txt = document.getElementById('ks-progress-text');
    if (bar) bar.style.width = `${pct}%`;
    if (txt) txt.textContent = `${done}/${total}`;
  }

  function renderHero(lesson) {
    return `
      <section class="ks-hero">
        <div class="ks-hero-icon" lang="ko">${lesson.icon || '📘'}</div>
        <div class="flex-1 min-w-0">
          <div class="ks-hero-step">Bài ${state.idx + 1} / ${state.data.lessons.length}</div>
          <h1 class="ks-hero-title">${lesson.title}</h1>
          ${lesson.hint ? `<p class="ks-hero-hint">${md(lesson.hint)}</p>` : ''}
        </div>
      </section>`;
  }

  /* ─── Lesson type renderers ─── */

  function renderExplainer(lesson) {
    return lesson.blocks.map((b) => {
      switch (b.kind) {
        case 'intro':
          return `<div class="ks-card ks-card-intro"><p>${md(b.text)}</p></div>`;

        case 'diagram': {
          const examples = b.examples.map((ex) => {
            const partsHtml = ex.parts.map((p) => `<span class="ks-diagram-part" lang="ko">${p}</span>`).join('<span class="ks-diagram-plus">+</span>');
            return `
              <div class="ks-diagram-row">
                <div class="ks-diagram-parts">${partsHtml}</div>
                <span class="ks-diagram-arrow">→</span>
                <div class="ks-diagram-result">
                  <div lang="ko">${ex.result}</div>
                  <div class="ks-diagram-rom">${ex.romanization}</div>
                </div>
              </div>`;
          }).join('');
          return `<div class="ks-card"><h3 class="ks-card-title">${b.title}</h3>${examples}</div>`;
        }

        case 'rules': {
          const items = b.items.map((r) => {
            const chars = (r.chars || []).map((c) => `<span class="ks-chip" lang="ko">${c}</span>`).join('');
            const examples = (r.examples || []).map((e) => `<span class="ks-chip ks-chip-syl" lang="ko">${e}</span>`).join('');
            return `
              <div class="ks-rule">
                <div class="ks-rule-label">${r.label}</div>
                <div class="ks-rule-chars">${chars}</div>
                <div class="ks-rule-rule">${md(r.rule)}</div>
                ${examples ? `<div class="ks-rule-examples">Ví dụ: ${examples}</div>` : ''}
              </div>`;
          }).join('');
          return `<div class="ks-card"><h3 class="ks-card-title">${b.title}</h3><div class="ks-rule-list">${items}</div></div>`;
        }

        default:
          return '';
      }
    }).join('');
  }

  function renderTileGrid(lesson) {
    const tiles = lesson.tiles.map((t) => {
      const audioPath = t.audio ? `../audio/${t.audio}.mp3` : '';
      return `
        <button type="button"
                class="ks-tile"
                ${audioPath ? `data-audio="${audioPath}"` : ''}
                aria-label="Nghe ${t.char}">
          <div class="ks-tile-char" lang="ko">${t.char}</div>
          <div class="ks-tile-rom">${t.rom}</div>
          <div class="ks-tile-vi">${t.vi}</div>
          ${t.made ? `<div class="ks-tile-made" lang="ko">${t.made}</div>` : ''}
          ${t.syllable ? `<div class="ks-tile-syl"><span lang="ko">${t.syllable}</span></div>` : ''}
          <div class="ks-tile-play-hint">
            <svg viewBox="0 0 24 24" width="14" height="14" class="ks-icon ks-icon-play" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            <svg viewBox="0 0 24 24" width="14" height="14" class="ks-icon ks-icon-pause" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>
            <svg viewBox="0 0 24 24" width="14" height="14" class="ks-icon ks-icon-loading" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="9" stroke-dasharray="40" stroke-linecap="round"/></svg>
          </div>
        </button>`;
    }).join('');
    return `<div class="ks-tile-grid">${tiles}</div>`;
  }

  function renderComparison(lesson) {
    const groups = lesson.groups.map((g) => {
      const items = g.items.map((it) => {
        const audioPath = it.audio ? `../audio/${it.audio}.mp3` : '';
        return `
          <button type="button" class="ks-cmp-item"
                  ${audioPath ? `data-audio="${audioPath}"` : ''}>
            <span class="ks-cmp-char" lang="ko">${it.char}</span>
            ${it.syllable ? `<span class="ks-cmp-syl" lang="ko">${it.syllable}</span>` : ''}
          </button>`;
      }).join('');
      return `
        <div class="ks-cmp-group ks-cmp-${g.color}">
          <div class="ks-cmp-name">${g.name}</div>
          <div class="ks-cmp-desc">${g.description}</div>
          <div class="ks-cmp-items">${items}</div>
        </div>`;
    }).join('');
    return `<div class="ks-cmp-grid">${groups}</div>`;
  }

  function renderRule(lesson) {
    const formula = lesson.formula
      ? `<div class="ks-rule-formula">${md(lesson.formula)}</div>` : '';
    const explain = lesson.explanation
      ? `<div class="ks-card ks-card-intro"><p>${md(lesson.explanation)}</p></div>` : '';
    let diagram = '';
    if (lesson.diagram) {
      const d = lesson.diagram;
      diagram = `
        <div class="ks-card">
          <h3 class="ks-card-title">Cách biến đổi</h3>
          <div class="ks-rule-transform">
            <div class="ks-rule-state">
              <div class="ks-rule-state-label">Viết</div>
              <div class="ks-rule-state-text" lang="ko">${d.before || ''}</div>
            </div>
            <div class="ks-rule-arrow">→</div>
            <div class="ks-rule-state">
              <div class="ks-rule-state-label">Đọc</div>
              <div class="ks-rule-state-text ks-rule-state-after" lang="ko">${d.after || d.result || ''}</div>
            </div>
            ${d.result && d.result !== d.after ? `<div class="ks-rule-pron">${d.result}</div>` : ''}
          </div>
        </div>`;
    }
    let examplesHtml = '';
    if (lesson.examples && lesson.examples.length) {
      const items = lesson.examples.map((e) => {
        const audioPath = e.audio ? `../audio/${e.audio}.mp3` : '';
        return `
          <button type="button" class="ks-rule-example"
                  ${audioPath ? `data-audio="${audioPath}"` : ''}>
            <div class="ks-rule-example-pair">
              <span class="ks-rule-example-written" lang="ko">${e.written}</span>
              <span class="ks-rule-example-arrow">→</span>
              <span class="ks-rule-example-read" lang="ko">${e.read || ''}</span>
            </div>
            <div class="ks-rule-example-meta">
              ${e.rom ? `<span class="ks-rule-example-rom">${e.rom}</span>` : ''}
              ${e.vi ? `<span class="ks-rule-example-vi">${e.vi}</span>` : ''}
            </div>
            ${audioPath ? `<div class="ks-rule-example-play">
              <svg viewBox="0 0 24 24" class="ks-icon ks-icon-play" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              <svg viewBox="0 0 24 24" class="ks-icon ks-icon-pause" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>
              <svg viewBox="0 0 24 24" class="ks-icon ks-icon-loading" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="9" stroke-dasharray="40" stroke-linecap="round"/></svg>
            </div>` : ''}
          </button>`;
      }).join('');
      examplesHtml = `
        <div class="ks-card">
          <h3 class="ks-card-title">Ví dụ — click để nghe</h3>
          <div class="ks-rule-examples-grid">${items}</div>
        </div>`;
    }
    return `${formula ? `<div class="ks-card"><h3 class="ks-card-title">Công thức</h3>${formula}</div>` : ''}${explain}${diagram}${examplesHtml}`;
  }

  function renderExercise(lesson) {
    const items = lesson.items.map((it, i) => {
      const audioPath = it.audio ? `../audio/${it.audio}.mp3` : '';
      return `
        <div class="ks-ex-item">
          <div class="ks-ex-num">${i + 1}</div>
          <div class="ks-ex-word" lang="ko">${it.ko}</div>
          <details class="ks-ex-answer">
            <summary>Hiện đáp án</summary>
            <div class="ks-ex-rom">${it.rom}</div>
            <div class="ks-ex-vi">${it.vi}</div>
          </details>
          ${audioPath ? `
          <button type="button" class="ks-play ks-ex-audio" data-audio="${audioPath}" aria-label="Nghe">
            <svg viewBox="0 0 24 24" class="ks-icon ks-icon-play" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            <svg viewBox="0 0 24 24" class="ks-icon ks-icon-pause" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>
            <svg viewBox="0 0 24 24" class="ks-icon ks-icon-loading" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="9" stroke-dasharray="40" stroke-linecap="round"/></svg>
          </button>` : ''}
        </div>`;
    }).join('');
    return `
      <div class="ks-card">
        <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 class="ks-card-title m-0">Đọc thử</h3>
          <button type="button" id="ks-ex-toggle-all" class="ks-btn-ghost text-sm">Hiện tất cả đáp án</button>
        </div>
        <div class="ks-ex-list">${items}</div>
      </div>`;
  }

  /* ─── Main render ─── */

  function renderLesson() {
    const lesson = state.data.lessons[state.idx];
    const container = document.getElementById('ks-lesson-container');

    let body = '';
    switch (lesson.type) {
      case 'explainer':  body = renderExplainer(lesson); break;
      case 'tile-grid':  body = renderTileGrid(lesson); break;
      case 'comparison': body = renderComparison(lesson); break;
      case 'exercise':   body = renderExercise(lesson); break;
      case 'rule':       body = renderRule(lesson); break;
      default:           body = `<div class="ks-card">Lesson type unknown: ${lesson.type}</div>`;
    }

    container.innerHTML = renderHero(lesson) + body;

    // Update nav buttons
    document.getElementById('ks-prev').disabled = state.idx === 0;
    document.getElementById('ks-next').disabled = state.idx === state.data.lessons.length - 1;
    document.getElementById('ks-current-num').textContent = state.idx + 1;
    document.getElementById('ks-total-num').textContent = state.data.lessons.length;

    // Mark this lesson as visited (counts as "done")
    state.completed.add(lesson.id);
    saveProgress();
    renderSidebar();
    renderProgress();

    // Wire up exercise toggle-all button
    const toggleAll = document.getElementById('ks-ex-toggle-all');
    if (toggleAll) {
      toggleAll.addEventListener('click', () => {
        const details = container.querySelectorAll('details.ks-ex-answer');
        const allOpen = [...details].every((d) => d.open);
        details.forEach((d) => (d.open = !allOpen));
        toggleAll.textContent = allOpen ? 'Hiện tất cả đáp án' : 'Ẩn tất cả đáp án';
      });
    }
  }

  /* ─── Navigation ─── */

  function gotoLesson(idx) {
    if (idx < 0 || idx >= state.data.lessons.length) return;
    state.idx = idx;
    history.replaceState(null, '', `#${state.data.lessons[idx].id}`);
    renderLesson();
    closeMobileDrawer();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openMobileDrawer() {
    document.getElementById('ks-sidebar-drawer').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    document.getElementById('ks-sidebar-drawer').classList.add('hidden');
    document.body.style.overflow = '';
  }

  /* ─── Init ─── */

  async function init() {
    try {
      const res = await fetch(DATA_URL);
      if (!res.ok) throw new Error(`Failed to load ${DATA_URL}`);
      state.data = await res.json();
      // Update document title + bind elements với data-bind
      document.title = `${state.data.title} — Học tiếng Hàn`;
      document.querySelectorAll('[data-bind="title"]').forEach((el) => (el.textContent = state.data.title));
      document.querySelectorAll('[data-bind="titleKo"]').forEach((el) => (el.textContent = state.data.titleKo || ''));
      document.querySelectorAll('[data-bind="lessonCount"]').forEach((el) => (el.textContent = `${state.data.lessons.length} bài học`));
    } catch (err) {
      document.getElementById('ks-lesson-container').innerHTML = `
        <div class="ks-card text-center text-red-500">
          <p class="font-semibold">Không tải được dữ liệu bài học</p>
          <p class="text-sm mt-2">${err.message}</p>
          <p class="text-sm mt-2 text-slate-500">Kiểm tra đường dẫn <code>${DATA_URL}</code> hoặc chạy local server (<code>python3 -m http.server</code>).</p>
        </div>`;
      return;
    }

    loadProgress();

    // Initial lesson from URL hash
    const hash = location.hash.slice(1);
    const initIdx = state.data.lessons.findIndex((l) => l.id === hash);
    if (initIdx >= 0) state.idx = initIdx;

    renderLesson();

    // Sidebar item click (event delegation)
    document.addEventListener('click', (e) => {
      const link = e.target.closest('.ks-side-item');
      if (!link) return;
      e.preventDefault();
      gotoLesson(parseInt(link.dataset.idx));
    });

    // Prev / Next
    document.getElementById('ks-prev').addEventListener('click', () => gotoLesson(state.idx - 1));
    document.getElementById('ks-next').addEventListener('click', () => gotoLesson(state.idx + 1));

    // Mobile drawer
    document.getElementById('ks-toggle-sidebar').addEventListener('click', openMobileDrawer);
    document.getElementById('ks-close-drawer').addEventListener('click', closeMobileDrawer);
    document.getElementById('ks-drawer-backdrop').addEventListener('click', closeMobileDrawer);

    // Keyboard nav
    document.addEventListener('keydown', (e) => {
      if (e.target.matches('input, textarea')) return;
      if (e.key === 'ArrowLeft') gotoLesson(state.idx - 1);
      else if (e.key === 'ArrowRight') gotoLesson(state.idx + 1);
    });

    // Hash change (back/forward buttons)
    window.addEventListener('hashchange', () => {
      const h = location.hash.slice(1);
      const i = state.data.lessons.findIndex((l) => l.id === h);
      if (i >= 0 && i !== state.idx) {
        state.idx = i;
        renderLesson();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
