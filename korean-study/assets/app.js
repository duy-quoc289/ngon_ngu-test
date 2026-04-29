// Shared audio player + UX enhancements

(function () {
  'use strict';

  /* ─────────── Sync dark class với prefers-color-scheme ─────────── */
  // Tailwind đang ở mode 'media' nên auto đổi via media query, nhưng custom CSS
  // dùng `.dark X` selector cần class trên <html> → sync ở đây.
  const darkMQ = window.matchMedia('(prefers-color-scheme: dark)');
  function syncDarkClass() {
    document.documentElement.classList.toggle('dark', darkMQ.matches);
  }
  syncDarkClass();
  darkMQ.addEventListener('change', syncDarkClass);

  /* ─────────── Audio player (shared) ─────────── */
  const audio = new Audio();
  let currentBtn = null;

  // Settings (lưu localStorage)
  const SETTINGS_KEY = 'ks-audio-settings';
  const settings = Object.assign(
    { volume: 0.7, rate: 1.0 },
    JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')
  );
  audio.volume = settings.volume;
  audio.playbackRate = settings.rate;

  function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  function setBtnState(btn, state) {
    if (!btn) return;
    btn.classList.remove('is-loading', 'is-playing');
    if (state) btn.classList.add(state);
  }

  function stopCurrent() {
    if (currentBtn) setBtnState(currentBtn, null);
    audio.pause();
    currentBtn = null;
  }

  function playFromButton(btn) {
    const src = btn.dataset.audio;
    if (!src) return;

    // Click trùng button đang phát → pause
    if (currentBtn === btn && !audio.paused) {
      stopCurrent();
      return;
    }

    if (currentBtn && currentBtn !== btn) setBtnState(currentBtn, null);
    currentBtn = btn;
    setBtnState(btn, 'is-loading');

    audio.src = src;
    audio.playbackRate = settings.rate;
    audio.volume = settings.volume;
    audio
      .play()
      .then(() => setBtnState(btn, 'is-playing'))
      .catch((err) => {
        console.error('Audio play failed:', err);
        setBtnState(btn, null);
        currentBtn = null;
      });
  }

  audio.addEventListener('ended', () => stopCurrent());
  audio.addEventListener('error', () => stopCurrent());

  document.addEventListener('click', (e) => {
    // Bất kỳ element có data-audio đều trigger play (.ks-tile, .ks-cmp-item, .ks-play, ...)
    const btn = e.target.closest('[data-audio]');
    if (btn) {
      e.preventDefault();
      playFromButton(btn);
    }
  });

  // Keyboard: Space to replay last clicked
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && currentBtn && document.activeElement.tagName !== 'INPUT') {
      e.preventDefault();
      audio.currentTime = 0;
      audio.play();
    }
  });

  /* ─────────── Floating control panel ─────────── */
  function createControlPanel() {
    const panel = document.createElement('div');
    panel.className = 'ks-controls';
    panel.innerHTML = `
      <button type="button" class="ks-controls-toggle" aria-label="Cài đặt audio" title="Cài đặt audio">
        <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor">
          <path d="M8 4.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM8 6a2 2 0 110 4 2 2 0 010-4z"/>
          <path d="M9.6 1H6.4l-.4 1.7a6 6 0 00-1.4.8L3 2.7 1.4 4.3l.8 1.6a6 6 0 00-.8 1.4L0 7.6v3.2l1.4.4a6 6 0 00.8 1.4l-.8 1.6L3 15.8l1.6-.8a6 6 0 001.4.8L6.4 17h3.2l.4-1.7a6 6 0 001.4-.8l1.6.8 1.6-1.6-.8-1.6a6 6 0 00.8-1.4l1.4-.4V7.6L15.6 7.2a6 6 0 00-.8-1.4l.8-1.6L13.9 2.7l-1.6.8a6 6 0 00-1.4-.8L9.6 1z" opacity="0.0"/>
        </svg>
      </button>
      <div class="ks-controls-popover" hidden>
        <div class="ks-controls-row">
          <label class="ks-controls-label">🔊 Âm lượng</label>
          <input type="range" min="0" max="1" step="0.05" id="ks-volume" class="ks-controls-range">
          <span id="ks-volume-val" class="ks-controls-val"></span>
        </div>
        <div class="ks-controls-row">
          <label class="ks-controls-label">⏩ Tốc độ</label>
          <div class="ks-controls-rates">
            <button type="button" data-rate="0.5">0.5×</button>
            <button type="button" data-rate="0.75">0.75×</button>
            <button type="button" data-rate="1">1×</button>
            <button type="button" data-rate="1.25">1.25×</button>
          </div>
        </div>
        <p class="ks-controls-hint">Phím <kbd>Space</kbd> để nghe lại từ cuối</p>
      </div>
    `;
    document.body.appendChild(panel);

    const toggle = panel.querySelector('.ks-controls-toggle');
    const popover = panel.querySelector('.ks-controls-popover');
    toggle.addEventListener('click', () => {
      popover.hidden = !popover.hidden;
    });
    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target)) popover.hidden = true;
    });

    // Volume
    const volInput = panel.querySelector('#ks-volume');
    const volVal = panel.querySelector('#ks-volume-val');
    volInput.value = settings.volume;
    volVal.textContent = Math.round(settings.volume * 100) + '%';
    volInput.addEventListener('input', () => {
      settings.volume = parseFloat(volInput.value);
      audio.volume = settings.volume;
      volVal.textContent = Math.round(settings.volume * 100) + '%';
      saveSettings();
    });

    // Playback rate
    const rateBtns = panel.querySelectorAll('.ks-controls-rates button');
    function updateRateUI() {
      rateBtns.forEach((b) => {
        b.classList.toggle('is-active', parseFloat(b.dataset.rate) === settings.rate);
      });
    }
    updateRateUI();
    rateBtns.forEach((b) => {
      b.addEventListener('click', () => {
        settings.rate = parseFloat(b.dataset.rate);
        audio.playbackRate = settings.rate;
        updateRateUI();
        saveSettings();
      });
    });
  }

  /* ─────────── Auto-classify blockquotes ─────────── */
  function classifyCallouts() {
    const TYPES = [
      { kw: /^[\s\S]*?(mẹo|tip|💡)/i, cls: 'callout-tip', emoji: '💡' },
      { kw: /^[\s\S]*?(lưu ý|chú ý|note|⚠)/i, cls: 'callout-warning', emoji: '⚠️' },
      { kw: /^[\s\S]*?(quan trọng|important|⭐)/i, cls: 'callout-important', emoji: '⭐' },
      { kw: /^[\s\S]*?(so sánh|compare)/i, cls: 'callout-compare', emoji: '⚖️' },
      { kw: /^[\s\S]*?(🔊|file audio)/i, cls: 'callout-audio', emoji: '🔊' },
      { kw: /^[\s\S]*?(ngoại lệ|exception|cảnh báo)/i, cls: 'callout-warning', emoji: '⚠️' },
    ];
    document.querySelectorAll('blockquote').forEach((bq) => {
      const text = bq.textContent.trim().slice(0, 60);
      for (const t of TYPES) {
        if (t.kw.test(text)) {
          bq.classList.add(t.cls);
          if (!bq.dataset.icon) bq.dataset.icon = t.emoji;
          break;
        }
      }
      if (!bq.classList.contains('callout-tip') &&
          !bq.classList.contains('callout-warning') &&
          !bq.classList.contains('callout-important') &&
          !bq.classList.contains('callout-compare') &&
          !bq.classList.contains('callout-audio')) {
        bq.classList.add('callout-info');
      }
    });
  }

  /* ─────────── Init ─────────── */
  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('[data-audio]')) createControlPanel();
    classifyCallouts();
  });
})();
