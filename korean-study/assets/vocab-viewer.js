// Vocab viewer — render từ vựng theo category với filter & search

(function () {
  'use strict';

  const TOPIC = 'vocab';
  const DATA_URL = `../data/${TOPIC}.json`;
  const STORAGE_KEY = `ks-vocab-state`;

  const state = {
    data: null,
    catId: 'all',
    query: '',
    flat: [], // tất cả từ flatten ra để lọc
  };

  /* ─── Utilities ─── */
  function escapeHtml(s) {
    if (!s) return '';
    return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function highlight(text, query) {
    if (!query) return escapeHtml(text);
    const safe = escapeHtml(text);
    const q = query.trim();
    if (!q) return safe;
    const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return safe.replace(re, '<mark>$1</mark>');
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ catId: state.catId, query: state.query }));
  }
  function loadState() {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (s.catId) state.catId = s.catId;
      if (s.query) state.query = s.query;
    } catch {}
  }

  /* ─── Render ─── */
  function renderCategories() {
    const root = document.getElementById('ks-vocab-cats');
    const totalAll = state.flat.length;
    const cats = [
      { id: 'all', title: 'Tất cả', icon: '✨', color: 'slate', count: totalAll },
      ...state.data.categories.map((c) => ({
        id: c.id,
        title: c.title,
        icon: c.icon,
        color: c.color,
        count: c.words.length,
      })),
    ];
    root.innerHTML = cats
      .map((c) => `
        <button type="button" data-cat="${c.id}"
                class="ks-cat-chip ks-cat-${c.color} ${c.id === state.catId ? 'is-active' : ''}">
          <span class="ks-cat-icon">${c.icon}</span>
          <span class="ks-cat-title">${escapeHtml(c.title)}</span>
          <span class="ks-cat-count">${c.count}</span>
        </button>`)
      .join('');
  }

  function applyFilter() {
    const q = state.query.trim().toLowerCase();
    let filtered = state.flat;
    if (state.catId !== 'all') {
      filtered = filtered.filter((w) => w._catId === state.catId);
    }
    if (q) {
      filtered = filtered.filter((w) => {
        return (
          (w.ko || '').toLowerCase().includes(q) ||
          (w.rom || '').toLowerCase().includes(q) ||
          (w.vi || '').toLowerCase().includes(q) ||
          (w.viExtra || '').toLowerCase().includes(q) ||
          (w.tags || []).some((t) => t.toLowerCase().includes(q))
        );
      });
    }
    return filtered;
  }

  function renderList() {
    const list = applyFilter();
    const root = document.getElementById('ks-vocab-list');
    const empty = document.getElementById('ks-vocab-empty');
    const countEl = document.getElementById('ks-count-text');
    countEl.textContent = `${list.length}/${state.flat.length}`;

    if (list.length === 0) {
      root.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }
    empty.classList.add('hidden');

    const q = state.query.trim();
    root.innerHTML = list.map((w) => renderCard(w, q)).join('');
  }

  function renderCard(w, query) {
    const audioPath = w.audio ? `../audio/${w.audio}.mp3` : '';
    const tagsHtml = (w.tags || [])
      .map((t) => `<span class="ks-vocab-tag">${escapeHtml(t)}</span>`)
      .join('');
    const exampleHtml = w.example
      ? `<div class="ks-vocab-example">
           <div class="ks-vocab-example-ko" lang="ko">${escapeHtml(w.example.ko)}</div>
           <div class="ks-vocab-example-rom">${escapeHtml(w.example.rom || '')}</div>
           <div class="ks-vocab-example-vi">${escapeHtml(w.example.vi)}</div>
         </div>`
      : '';
    const noteHtml = w.note
      ? `<div class="ks-vocab-note">${escapeHtml(w.note)}</div>`
      : '';
    const catTag = state.data.categories.find((c) => c.id === w._catId);
    const catLabel = catTag
      ? `<span class="ks-vocab-cat-pill ks-cat-${catTag.color}">${catTag.icon} ${escapeHtml(catTag.title)}</span>`
      : '';

    return `
      <article class="ks-vocab-card" data-id="${escapeHtml(w.audio || '')}">
        <div class="ks-vocab-card-main">
          <div class="ks-vocab-ko" lang="ko">${highlight(w.ko, query)}</div>
          <div class="ks-vocab-meta">
            <span class="ks-vocab-rom">${highlight(w.rom, query)}</span>
            <span class="ks-vocab-sep">·</span>
            <span class="ks-vocab-vi">${highlight(w.vi, query)}</span>
            ${w.viExtra ? `<span class="ks-vocab-vi-extra">${escapeHtml(w.viExtra)}</span>` : ''}
          </div>
          <div class="ks-vocab-tags">
            ${catLabel}
            ${tagsHtml}
          </div>
          ${exampleHtml}
          ${noteHtml}
        </div>
        ${audioPath ? `
        <button type="button" class="ks-vocab-play ks-play" data-audio="${audioPath}" aria-label="Nghe ${escapeHtml(w.ko)}">
          <svg viewBox="0 0 24 24" class="ks-icon ks-icon-play" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          <svg viewBox="0 0 24 24" class="ks-icon ks-icon-pause" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>
          <svg viewBox="0 0 24 24" class="ks-icon ks-icon-loading" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="9" stroke-dasharray="40" stroke-linecap="round"/></svg>
        </button>` : ''}
      </article>`;
  }

  /* ─── Events ─── */
  function wireUp() {
    // Category chips
    document.getElementById('ks-vocab-cats').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-cat]');
      if (!btn) return;
      state.catId = btn.dataset.cat;
      saveState();
      renderCategories();
      renderList();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Search
    const searchInput = document.getElementById('ks-vocab-search');
    const clearBtn = document.getElementById('ks-vocab-search-clear');
    searchInput.value = state.query;
    clearBtn.hidden = !state.query;

    let debounce;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        state.query = e.target.value;
        clearBtn.hidden = !state.query;
        saveState();
        renderList();
      }, 120);
    });
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      state.query = '';
      clearBtn.hidden = true;
      saveState();
      renderList();
      searchInput.focus();
    });

    // Phím tắt: / để focus search
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
    });
  }

  /* ─── Init ─── */
  async function init() {
    try {
      const res = await fetch(DATA_URL);
      if (!res.ok) throw new Error(`Failed to load ${DATA_URL}`);
      state.data = await res.json();
    } catch (err) {
      document.getElementById('ks-vocab-list').innerHTML = `
        <div class="ks-card text-center text-red-500">
          <p class="font-semibold">Không tải được dữ liệu</p>
          <p class="text-sm mt-2">${err.message}</p>
          <p class="text-sm mt-2 text-slate-500">Chạy <code>python3 -m http.server</code> trong thư mục korean-study/.</p>
        </div>`;
      return;
    }

    // Bind title / titleKo
    document.title = `${state.data.title} — Học tiếng Hàn`;
    document.querySelectorAll('[data-bind="title"]').forEach((el) => (el.textContent = state.data.title));
    document.querySelectorAll('[data-bind="titleKo"]').forEach((el) => (el.textContent = state.data.titleKo || ''));

    // Flatten các category vào 1 mảng
    state.flat = state.data.categories.flatMap((c) =>
      c.words.map((w) => ({ ...w, _catId: c.id }))
    );

    loadState();
    renderCategories();
    renderList();
    wireUp();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
