(function() {
  const THEMES = {
    sand: {
      id: 'sand',
      name: 'Теплий пісок (Ivory Sand)',
      pageBg: '#f6f4ee',
      headerBg: 'linear-gradient(135deg, #173d33 0%, #1e4a3e 100%)',
      headerText: '#ffffff',
      accentPill: '#d9ef9f',
      cardBg: '#ffffff',
      cardBorder: '#e6e3d8',
      subtext: '#6d756e',
      priceColor: '#173d33',
      bottomBarBg: 'rgba(246, 244, 238, 0.96)',
      bottomBarBorder: '#e2dfd4'
    },
    glass: {
      id: 'glass',
      name: 'Курортний Glassmorphism',
      pageBg: 'linear-gradient(180deg, #0b1f1a 0%, #132e26 100%)',
      headerBg: 'transparent',
      headerText: '#ffffff',
      accentPill: '#a7f3d0',
      cardBg: 'rgba(255, 255, 255, 0.95)',
      cardBorder: 'rgba(255, 255, 255, 0.3)',
      subtext: '#556961',
      priceColor: '#0b5c42',
      bottomBarBg: 'rgba(15, 34, 28, 0.95)',
      bottomBarBorder: 'rgba(255, 255, 255, 0.15)'
    },
    coastal: {
      id: 'coastal',
      name: 'Морський бриз (Coastal Azure)',
      pageBg: 'radial-gradient(circle at 50% 0%, #eef6f8 0%, #e7f0f3 100%)',
      headerBg: 'linear-gradient(135deg, #0d3844 0%, #175464 100%)',
      headerText: '#ffffff',
      accentPill: '#a7e8f5',
      cardBg: '#ffffff',
      cardBorder: '#d2e4ea',
      subtext: '#556f77',
      priceColor: '#0d3844',
      bottomBarBg: 'rgba(238, 246, 248, 0.96)',
      bottomBarBorder: '#cce1e8'
    },
    dark: {
      id: 'dark',
      name: 'Глибокий смарагд (Emerald Velvet)',
      pageBg: '#0d1614',
      headerBg: '#13221e',
      headerText: '#f3f6f4',
      accentPill: '#6ee7b7',
      cardBg: '#152420',
      cardBorder: '#233832',
      subtext: '#98aba2',
      priceColor: '#6ee7b7',
      bottomBarBg: 'rgba(19, 34, 30, 0.96)',
      bottomBarBorder: '#233832'
    },
    sunset: {
      id: 'sunset',
      name: 'Сансет & Теракота (Sunset Warm)',
      pageBg: '#fbf7f4',
      headerBg: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 100%)',
      headerText: '#ffffff',
      accentPill: '#fed7aa',
      cardBg: '#ffffff',
      cardBorder: '#f0ded4',
      subtext: '#785b51',
      priceColor: '#9a3412',
      bottomBarBg: 'rgba(251, 247, 244, 0.96)',
      bottomBarBorder: '#ecd8ce'
    }
  };

  let state = {
    data: null,
    currentTheme: 'sand',
    selectedOptions: {},
    chosenHotel: null,
    activeFlightModal: null,
    galleryIdx: {},
    draft: null,
    bIdx: -1,
    activeScenario: null,
    compare: [],
    compareOpen: false,
    bFocus: 'kids'
  };

  function normalizeDateStr(dateStr) {
    if (!dateStr) return '';
    let res = dateStr;
    const replacements = [
      [/(?:\b|(?<=\d))січ(?:\.|\b|ня|ень)?(?=[^\wа-яА-ЯіІїЇєЄ]|$)/gi, 'січня'],
      [/(?:\b|(?<=\d))лют(?:\.|\b|ого|ий)?(?=[^\wа-яА-ЯіІїЇєЄ]|$)/gi, 'лютого'],
      [/(?:\b|(?<=\d))бер(?:\.|\b|езня|езень)?(?=[^\wа-яА-ЯіІїЇєЄ]|$)/gi, 'березня'],
      [/(?:\b|(?<=\d))кві(?:\.|\b|тня|тень)?(?=[^\wа-яА-ЯіІїЇєЄ]|$)/gi, 'квітня'],
      [/(?:\b|(?<=\d))тра(?:\.|\b|вня|вень)?(?=[^\wа-яА-ЯіІїЇєЄ]|$)/gi, 'травня'],
      [/(?:\b|(?<=\d))чер(?:\.|\b|вня|вень)?(?=[^\wа-яА-ЯіІїЇєЄ]|$)/gi, 'червня'],
      [/(?:\b|(?<=\d))лип(?:\.|\b|ня|ень)?(?=[^\wа-яА-ЯіІїЇєЄ]|$)/gi, 'липня'],
      [/(?:\b|(?<=\d))сер(?:\.|\b|пня|пень)?(?=[^\wа-яА-ЯіІїЇєЄ]|$)/gi, 'серпня'],
      [/(?:\b|(?<=\d))вер(?:\.|\b|есня|есень)?(?=[^\wа-яА-ЯіІїЇєЄ]|$)/gi, 'вересня'],
      [/(?:\b|(?<=\d))жов(?:\.|\b|тня|тень)?(?=[^\wа-яА-ЯіІїЇєЄ]|$)/gi, 'жовтня'],
      [/(?:\b|(?<=\d))лис(?:\.|\b|топада|топад)?(?=[^\wа-яА-ЯіІїЇєЄ]|$)/gi, 'листопада'],
      [/(?:\b|(?<=\d))гру(?:\.|\b|дня|день)?(?=[^\wа-яА-ЯіІїЇєЄ]|$)/gi, 'грудня'],
    ];
    for (const [pat, full] of replacements) {
      res = res.replace(pat, full);
    }
    return res;
  }

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function formatTouristsPriceLabel(touristsStr) {
    if (!touristsStr) return 'Вартість:';
    let t = touristsStr.trim();
    t = t.replace(/1 дитина/gi, '1 дитину');
    t = t.replace(/одна дитина/gi, 'одну дитину');
    t = t.replace(/2 дитини/gi, '2 дітей');
    t = t.replace(/двоє дітей/gi, 'двох дітей');
    return `Вартість за ${t}:`;
  }

  function formatFlightTimeline(flight, isOutbound) {
    const fromCity = flight.from || '';
    const toCity = flight.to || '';
    const mDep = flight.departure ? flight.departure.match(/(\d{4})-(\d{2})-(\d{2})\s+(\d{2}:\d{2})/) : null;
    const mArr = flight.arrival ? flight.arrival.match(/(\d{4})-(\d{2})-(\d{2})\s+(\d{2}:\d{2})/) : null;
    const depStr = mDep ? `${mDep[3]}.${mDep[2]} о ${mDep[4]}` : '';
    const arrStr = mArr ? `${mArr[4]}` : '';
    if (depStr && arrStr) {
      return `Виліт з ${fromCity} ${depStr} ➔ ${toCity} ${arrStr}`;
    } else if (depStr) {
      return `Виліт з ${fromCity} ${depStr}`;
    }
    return `${fromCity} ➔ ${toCity}`;
  }

  async function loadData() {
    try {
      const res = await fetch('/api/selection');
      state.data = await res.json();
      state.currentTheme = state.data.lead.chosenTheme || 'sand';
      state.chosenHotel = state.data.lead.chosenHotel || null;
      document.getElementById('themeSelector').value = state.currentTheme;
      if (/[?&]view=tourist/.test(location.search)) document.body.classList.add('tourist-clean');
      render();
    } catch (e) {
      console.error('Failed to load selection data:', e);
    }
  }

  window.switchTheme = function(themeId) {
    state.currentTheme = themeId;
    fetch('/api/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead: { chosenTheme: themeId } })
    });
    render();
  };

  window.handleOptionSelect = function(hotelId, optId) {
    state.selectedOptions[hotelId] = optId;
    render();
    document.querySelectorAll(`[data-flash="${CSS.escape(hotelId)}"]`).forEach(el => {
      el.classList.remove('flash');
      void el.offsetWidth;
      el.classList.add('flash');
    });
  };

  window.chooseHotel = async function(hotelId) {
    const hotel = (state.data.lead.selection || []).find(h => h.id === hotelId);
    if (!hotel) return;
    const opt = getActiveOpt(hotel);
    const optionDetails = opt ? `${opt.duration} (${normalizeDateStr(opt.dates || '')}) · ${opt.price} ${curLabel(opt.currency)}` : '';
    state.chosenHotel = hotel.name;
    render();
    try {
      await fetch('/api/choose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hotelName: hotel.name, optionDetails })
      });
    } catch (e) {
      console.error(e);
    }
  };

  window.openFlightModal = function(hotelId) {
    const hotel = (state.data.lead.selection || []).find(h => h.id === hotelId);
    const opt = hotel && getActiveOpt(hotel);
    if (!opt || !opt.flights) return;
    state.activeFlightModal = { hotelName: hotel.name, duration: opt.duration, flights: opt.flights };
    render();
  };

  window.closeFlightModal = function() {
    state.activeFlightModal = null;
    render();
  };

  window.openQuickEditor = function() {
    if (!state.data) return;
    const l = state.data.lead;
    const m = state.data.manager;
    document.getElementById('editName').value = l.greetingName || l.name || '';
    document.getElementById('editDest').value = l.destination || '';
    document.getElementById('editDep').value = l.departureOrigin || '';
    document.getElementById('editTourists').value = l.tourists || '';
    document.getElementById('editMgrName').value = m.name || '';
    document.getElementById('editMgrTg').value = m.telegram || '';
    document.getElementById('quickEditModal').style.display = 'flex';
  };

  window.closeQuickEditor = function() {
    document.getElementById('quickEditModal').style.display = 'none';
  };

  window.saveQuickEditor = async function() {
    const lead = {
      greetingName: document.getElementById('editName').value.trim(),
      destination: document.getElementById('editDest').value.trim(),
      departureOrigin: document.getElementById('editDep').value.trim(),
      tourists: document.getElementById('editTourists').value.trim()
    };
    const manager = {
      name: document.getElementById('editMgrName').value.trim(),
      telegram: document.getElementById('editMgrTg').value.trim()
    };
    window.closeQuickEditor();
    const st = document.getElementById('saveStatus');
    st.textContent = '⏳ Збереження...';
    try {
      const res = await fetch('/api/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead, manager })
      });
      const resData = await res.json();
      state.data = resData.data;
      st.textContent = '✅ Збережено';
      setTimeout(() => st.textContent = '● Готово до правок', 2000);
      render();
    } catch (e) {
      st.textContent = '❌ Помилка';
    }
  };

  /* ================= Helpers: ціни, варіанти, галерея ================= */
  const MONTH_GROUPS = [
    ['січ', 'янв', 'jan'], ['лют', 'фев', 'feb'], ['бер', 'мар', 'mar'], ['кві', 'апр', 'apr'],
    ['тра', 'мая', 'май', 'may'], ['чер', 'июн', 'jun'], ['лип', 'июл', 'jul'], ['сер', 'авг', 'aug'],
    ['вер', 'сен', 'sep'], ['жов', 'окт', 'oct'], ['лис', 'ноя', 'nov'], ['гру', 'дек', 'dec']
  ];
  const MONTH_SHORT = ['січ', 'лют', 'бер', 'кві', 'тра', 'чер', 'лип', 'сер', 'вер', 'жов', 'лис', 'гру'];
  const MONTH_RE = '(?:' + MONTH_GROUPS.map(g => g.join('|')).join('|') + ')[а-яіїєa-z]*\\.?';

  function monthIdx(s) {
    s = String(s || '').toLowerCase();
    return MONTH_GROUPS.findIndex(g => g.some(p => s.startsWith(p)));
  }

  function fmtPrice(n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function curLabel(c) {
    return c === 'USD' ? '$' : c === 'EUR' ? '€' : 'грн';
  }

  function priceOf(o) {
    return parseInt(String((o && o.price) || '').replace(/\D/g, ''), 10) || 0;
  }

  function nightsOf(o) {
    const m = String((o && o.duration) || '').match(/(\d+)/);
    return m ? +m[1] : 0;
  }

  function optPrice(o) {
    return o ? `${esc(o.price)} ${curLabel(o.currency)}` : '—';
  }

  // Найнижча ціна (за однакової ціни — довший відпочинок). Бейдж має сенс від 2 варіантів.
  function bestOptionId(hotel) {
    const opts = (hotel.options || []).filter(o => priceOf(o) > 0);
    if (opts.length < 2) return null;
    let best = opts[0];
    opts.forEach(o => {
      if (priceOf(o) < priceOf(best) || (priceOf(o) === priceOf(best) && nightsOf(o) > nightsOf(best))) best = o;
    });
    return best.id;
  }

  function flightDepartLabel(opt) {
    if (!opt) return '';
    const f = opt.flights && opt.flights[0];
    const m = f && f.departure ? f.departure.match(/\d{4}-(\d{2})-(\d{2})\s+(\d{2}:\d{2})/) : null;
    const dates = normalizeDateStr(opt.dates || '');
    if (m) return `${dates ? dates.split(/[–-]/)[0].trim() : m[2] + '.' + m[1]} о ${m[3]}`;
    return dates;
  }

  function hotelPhotos(hotel) {
    const list = Array.isArray(hotel.photos) && hotel.photos.length ? hotel.photos : (hotel.photo ? [hotel.photo] : []);
    return list.filter(Boolean);
  }

  /* Галерея: scroll-snap (свайп пальцем) + стрілки + точки + лічильник.
     Захист від водяних знаків (aspect-ratio 16/10, overflow hidden, translateY(-9%) scale(1.12))
     збережений: обгортка .hotel-img-wrap + кожне фото .hotel-img-zoom у власному слайді. */
  function renderGallery(hotel) {
    const photos = hotelPhotos(hotel);
    const n = photos.length;
    const cur = Math.min(state.galleryIdx[hotel.id] || 0, Math.max(n - 1, 0));
    const slides = n
      ? photos.map((p, i) => `
          <div class="g-slide"><img class="hotel-img-zoom" src="${esc(p)}" alt="${esc(hotel.name)} — фото ${i + 1}" loading="${i === 0 ? 'eager' : 'lazy'}" decoding="async" draggable="false" /></div>`).join('')
      : `<div class="g-slide g-empty">🏨</div>`;
    return `
      <div class="hotel-img-wrap" style="position:relative; width:100%; aspect-ratio:16/10; background:#0f172a; overflow:hidden;">
        <div class="g-track" data-hid="${esc(hotel.id)}">${slides}</div>
        <div class="g-badges">
          <span style="background:rgba(15, 23, 42, 0.75); color:#fef08a; padding:4px 8px; border-radius:6px; font-size:11px; font-weight:800;">${'★'.repeat(Math.min(+hotel.stars || 4, 5))}</span>
          <span style="background:rgba(15, 23, 42, 0.75); color:#fff; padding:4px 8px; border-radius:6px; font-size:11px; font-weight:600;">📍 ${esc(hotel.resort)}</span>
        </div>
        ${n > 1 ? `
          <button type="button" class="g-arrow g-prev" aria-label="Попереднє фото" onclick="window.galleryStep('${esc(hotel.id)}', -1)">‹</button>
          <button type="button" class="g-arrow g-next" aria-label="Наступне фото" onclick="window.galleryStep('${esc(hotel.id)}', 1)">›</button>
          <div class="g-dots" data-dots="${esc(hotel.id)}">${photos.map((_, i) => `<i class="g-dot${i === cur ? ' on' : ''}"></i>`).join('')}</div>
          <span class="g-count" data-count="${esc(hotel.id)}">${cur + 1}/${n}</span>
        ` : ''}
      </div>`;
  }

  window.galleryStep = function(hotelId, step) {
    const track = document.querySelector(`.g-track[data-hid="${CSS.escape(hotelId)}"]`);
    if (!track) return;
    const n = track.children.length;
    const idx = Math.round(track.scrollLeft / track.clientWidth);
    const next = (idx + step + n) % n;
    track.scrollTo({ left: next * track.clientWidth, behavior: 'smooth' });
  };

  // scroll не спливає — слухаємо у фазі capture, без перерендеру сторінки
  document.addEventListener('scroll', function(e) {
    const t = e.target;
    if (!t || !t.classList || !t.classList.contains('g-track') || !t.clientWidth) return;
    const id = t.dataset.hid;
    const idx = Math.round(t.scrollLeft / t.clientWidth);
    state.galleryIdx[id] = idx;
    const sel = CSS.escape(id);
    document.querySelectorAll(`[data-dots="${sel}"] .g-dot`).forEach((d, i) => d.classList.toggle('on', i === idx));
    const c = document.querySelector(`[data-count="${sel}"]`);
    if (c) c.textContent = `${idx + 1}/${t.children.length}`;
  }, true);

  function restoreGalleries() {
    document.querySelectorAll('.g-track').forEach(t => {
      const idx = state.galleryIdx[t.dataset.hid] || 0;
      if (idx) t.scrollLeft = idx * t.clientWidth;
    });
  }

  /* ================= Варіанти: картки (<=2) або матриця (>=3) ================= */
  function flightButton(hotel, activeOpt, isDark) {
    if (!(activeOpt && activeOpt.flights && activeOpt.flights.length)) return '';
    return `
      <div style="margin-top:8px; text-align:center;">
        <button type="button" onclick="window.openFlightModal('${esc(hotel.id)}')"
          style="background:${isDark ? '#1a2e26' : '#f1f5f9'}; border:${isDark ? '1px solid #2d4a3e' : '1px solid #e2e8f0'}; border-radius:8px; padding:5px 12px; color:${isDark ? '#6ee7b7' : '#065f46'}; font-size:11px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
          <span>✈️ Програма перельоту: ${esc(activeOpt.duration)} (${esc(normalizeDateStr(activeOpt.dates || ''))})</span>
          <span style="font-size:12px; font-weight:900;">↓</span>
        </button>
      </div>`;
  }

  function renderOptions(hotel, activeOpt, theme, isDark) {
    const opts = hotel.options || [];
    if (!opts.length) return '';
    const bestId = bestOptionId(hotel);
    const title = `<div style="font-size:11px; font-weight:800; color:${theme.subtext}; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:8px;">${opts.length > 2 ? 'Оберіть дату вильоту та тривалість:' : 'Оберіть тривалість відпочинку:'}</div>`;
    const vars = `--bd:${theme.cardBorder}; --sub:${theme.subtext}; --pr:${theme.priceColor}; --cell:${isDark ? '#1a2e26' : '#ffffff'}; --txt:${isDark ? '#e2e8f0' : '#1e293b'}; --selbg:${isDark ? '#16382b' : '#e8f4ed'}; --selbd:${isDark ? '#6ee7b7' : '#1b4d3e'};`;

    if (opts.length <= 2) {
      return `
        <div style="margin-bottom:16px;">
          ${title}
          <div style="display:grid; grid-template-columns:repeat(${opts.length}, 1fr); gap:8px; ${vars}">
            ${opts.map(opt => {
              const sel = activeOpt && activeOpt.id === opt.id;
              return `
                <button type="button" class="opt-card${sel ? ' sel' : ''}" aria-pressed="${sel}" onclick="window.handleOptionSelect('${esc(hotel.id)}', '${esc(opt.id)}')">
                  ${opt.id === bestId ? '<span class="best-badge">🔥 Найкраща ціна</span>' : ''}
                  <div style="font-size:12px; font-weight:800;">🌙 ${esc(opt.duration)}</div>
                  ${opt.dates ? `<div style="font-size:11px; margin-top:3px; font-weight:600; opacity:0.8;">${esc(normalizeDateStr(opt.dates))}</div>` : ''}
                  <div class="opt-price">${optPrice(opt)}</div>
                </button>`;
            }).join('')}
          </div>
          ${flightButton(hotel, activeOpt, isDark)}
        </div>`;
    }

    const dates = [...new Set(opts.map(o => o.dates || '—'))];
    const durs = [...new Set(opts.map(o => o.duration || '—'))]
      .sort((a, b) => nightsOf({ duration: a }) - nightsOf({ duration: b }) || a.localeCompare(b));
    return `
      <div style="margin-bottom:16px;">
        ${title}
        <div class="mx-scroll" style="${vars}">
          <table class="mx">
            <thead><tr><th class="mx-corner">Ночей ╲ Виліт</th>${dates.map(d => `<th>${esc(normalizeDateStr(d))}</th>`).join('')}</tr></thead>
            <tbody>
              ${durs.map(du => `
                <tr><th scope="row">🌙 ${esc(du)}</th>
                  ${dates.map(da => {
                    const o = opts.find(x => (x.duration || '—') === du && (x.dates || '—') === da);
                    if (!o) return '<td class="mx-empty">—</td>';
                    const sel = activeOpt && activeOpt.id === o.id;
                    return `<td><button type="button" class="mx-cell${sel ? ' sel' : ''}" aria-pressed="${sel}" onclick="window.handleOptionSelect('${esc(hotel.id)}', '${esc(o.id)}')">
                      ${o.id === bestId ? '<span class="best-badge sm">🔥 Найкраща ціна</span>' : ''}${esc(o.price)}<small>${curLabel(o.currency)}</small></button></td>`;
                  }).join('')}
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
        ${flightButton(hotel, activeOpt, isDark)}
      </div>`;
  }

  function renderBullets(hotel, theme, isDark) {
    const b = hotel.bulletPoints || {};
    const lines = ['beach', 'wind', 'seaEntry', 'aquapark'].map(k => b[k]).filter(v => v && String(v).trim());
    if (!lines.length) return '';
    return `
      <div style="background:${isDark ? '#1a2c26' : '#f8faf9'}; border:1px solid ${theme.cardBorder}; border-radius:12px; padding:12px; margin-bottom:14px;">
        <div style="font-size:11px; font-weight:800; color:${theme.priceColor}; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:8px;">Чому рекомендуємо цей готель:</div>
        <div style="font-size:12px; line-height:1.45; display:flex; flex-direction:column; gap:6px;">
          ${lines.map(l => `<div>${esc(l)}</div>`).join('')}
        </div>
      </div>`;
  }

  function renderExtra(hotel, manager, theme, isDark) {
    let out = '';
    if (hotel.surcharges && hotel.surcharges.trim()) {
      out += `<div style="font-size:12px; line-height:1.45; background:${isDark ? 'rgba(251,191,36,0.1)' : '#fffbeb'}; border:1px solid ${isDark ? 'rgba(251,191,36,0.35)' : '#fde68a'}; color:${isDark ? '#fde68a' : '#78350f'}; border-radius:12px; padding:10px 12px; margin-bottom:14px;"><b>💳 Доплати на місці:</b> ${esc(hotel.surcharges)}</div>`;
    }
    if (hotel.expertNote && hotel.expertNote.trim()) {
      out += `<div style="font-size:12px; line-height:1.5; background:${isDark ? 'rgba(255,255,255,0.05)' : '#f4f1ea'}; border-left:3px solid ${theme.priceColor}; border-radius:8px; padding:10px 12px; margin-bottom:14px;"><b>💬 Особиста порада · ${esc(manager.name)}:</b><br>${esc(hotel.expertNote)}</div>`;
    }
    return out;
  }

  /* ================= Поділитися, тост, режим туриста ================= */
  function showToast(msg) {
    const old = document.querySelector('.toast');
    if (old) old.remove();
    const t = document.createElement('div');
    t.className = 'toast';
    t.setAttribute('role', 'status');
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('hide'), 2200);
    setTimeout(() => t.remove(), 2600);
  }
  window.showToast = showToast;

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed; opacity:0; top:0;';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        ta.remove();
        return ok;
      } catch (e2) {
        return false;
      }
    }
  }

  window.shareSelection = async function(hotelId) {
    const { lead } = state.data;
    const url = `${location.origin}${location.pathname}?view=tourist`;
    let text = `Подивіться підбірку турів: ${lead.destination || ''}`;
    const hotel = hotelId && (lead.selection || []).find(h => h.id === hotelId);
    if (hotel) {
      const opt = getActiveOpt(hotel);
      text = `Ми обрали «${hotel.name}»` + (opt ? ` — ${opt.duration}, ${normalizeDateStr(opt.dates || '')}, ${opt.price} ${curLabel(opt.currency)}` : '') + '. Що скажете?';
    }
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Підбірка турів від XO Travel', text, url });
        return;
      } catch (e) {
        if (e && e.name === 'AbortError') return;
      }
    }
    const ok = await copyText(url);
    showToast(ok ? 'Посилання скопійовано!' : 'Не вдалося скопіювати. Скопіюйте адресу з рядка браузера');
  };

  window.toggleTouristMode = function(force) {
    const on = typeof force === 'boolean' ? force : !document.body.classList.contains('tourist-mode');
    document.body.classList.toggle('tourist-mode', on);
    const cb = document.getElementById('touristToggle');
    if (cb) cb.checked = on;
    window.scrollTo({ top: 0 });
  };
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (state.compareOpen) window.closeCompare();
      else if (document.body.classList.contains('tourist-mode')) window.toggleTouristMode(false);
    }
  });

  function getActiveOpt(hotel) {
    const opts = hotel.options || [];
    const id = state.selectedOptions[hotel.id];
    return opts.find(o => o.id === id) || opts[0];
  }



  /* ================= Порівняння готелів («Битва готелів») ================= */
  const CMP_MAX = 3;

  function compareHotels() {
    const all = (state.data && state.data.lead.selection) || [];
    state.compare = state.compare.filter(id => all.some(h => h.id === id));
    return state.compare.map(id => all.find(h => h.id === id));
  }

  window.toggleCompare = function(id) {
    const i = state.compare.indexOf(id);
    if (i >= 0) state.compare.splice(i, 1);
    else if (state.compare.length >= CMP_MAX) { showToast(`Можна порівняти до ${CMP_MAX} готелів. Приберіть один, щоб додати інший`); return; }
    else state.compare.push(id);
    if (state.compareOpen && state.compare.length < 2) state.compareOpen = false;
    render();
    document.body.classList.toggle('no-scroll', state.compareOpen);
  };

  window.clearCompare = function() {
    state.compare = [];
    state.compareOpen = false;
    document.body.classList.remove('no-scroll');
    render();
  };

  window.openCompare = function() {
    if (compareHotels().length < 2) return;
    state.compareOpen = true;
    document.body.classList.add('no-scroll');
    render();
  };

  window.closeCompare = function() {
    state.compareOpen = false;
    document.body.classList.remove('no-scroll');
    render();
  };

  window.chooseFromCompare = async function(id) {
    const hotel = state.data.lead.selection.find(h => h.id === id);
    state.compareOpen = false;
    document.body.classList.remove('no-scroll');
    if (hotel && hotel.scenario && currentScenario(state.data.lead) && hotel.scenario !== state.activeScenario) state.activeScenario = hotel.scenario;
    await window.chooseHotel(id);
    const card = document.getElementById('card_' + id);
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  function renderCompareBar() {
    const n = compareHotels().length;
    if (!n || state.compareOpen) return '';
    const word = n === 1 ? 'готель' : 'готелі';
    return `
      <div class="cmp-bar" role="region" aria-label="Порівняння готелів">
        <span class="cmp-bar-txt">Обрано для порівняння: <b>${n} ${word}</b>${n < 2 ? '<small> · додайте ще один</small>' : ''}</span>
        <button type="button" class="cmp-go" ${n < 2 ? 'disabled' : ''} onclick="window.openCompare()">⚖️ Порівняти зараз</button>
        <button type="button" class="cmp-clear" onclick="window.clearCompare()" aria-label="Очистити список порівняння">✕ Очистити</button>
      </div>`;
  }

  function renderCompareModal(lead, manager) {
    if (!state.compareOpen) return '';
    const hs = compareHotels();
    if (hs.length < 2) return '';

    // Calculate dynamic winners strictly among the currently compared hotels
    const parseNum = s => parseFloat(String(s || '').replace(/[^\d.]/g, '')) || 0;
    const prices = hs.map(h => {
      const o = getActiveOpt(h);
      return o ? parseNum(o.price) : Infinity;
    });
    const minPrice = Math.min(...prices);

    const rows = [
      ['🏖️ Пляж та лінія', h => (h.bulletPoints || {}).beach],
      ['🛡️ Вітер та бухта', h => (h.bulletPoints || {}).wind],
      ['🤿 Захід у море', h => (h.bulletPoints || {}).seaEntry],
      ['🎢 Басейни та аквапарк', h => (h.bulletPoints || {}).aquapark],
      ['💬 Вердикт експерта', h => h.expertNote]
    ];
    const strip = s => String(s || '').replace(/^[^\p{L}\p{N}]+/u, '').trim();
    const cells = [];
    hs.forEach(h => {
      const photo = hotelPhotos(h)[0];
      const opt = getActiveOpt(h);
      const isBestPrice = opt && parseNum(opt.price) === minPrice && minPrice < Infinity;
      const aquaText = ((h.bulletPoints || {}).aquapark || '').toLowerCase();
      const hasKidsAqua = aquaText.includes('аквапарк') || aquaText.includes('гір') || aquaText.includes('підігрів');

      cells.push(`
        <div class="cmp-cell cmp-head">
          ${photo ? `<div class="cmp-photo"><img src="${esc(photo)}" alt="${esc(h.name)}" loading="lazy" /></div>` : ''}
          <div class="cmp-stars">${'★'.repeat(Math.min(+h.stars || 4, 5))}</div>
          <div class="cmp-name">${esc(h.name)}</div>
          <div class="cmp-resort">📍 ${esc(h.resort)}</div>
          ${h.expertBadge ? `<div class="verdict" style="--vc:#133329;">${esc(h.expertBadge)}</div>` : ''}
          <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:6px;">
            ${isBestPrice ? `<span style="background:#ecfdf5; color:#047857; border:1px solid #a7f3d0; font-size:10px; font-weight:800; padding:2px 6px; border-radius:6px;">💰 Найвигідніша ціна</span>` : ''}
            ${hasKidsAqua ? `<span style="background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; font-size:10px; font-weight:800; padding:2px 6px; border-radius:6px;">🎢 Розваги для дітей</span>` : ''}
          </div>
          <button type="button" class="cmp-rm" onclick="window.toggleCompare('${esc(h.id)}')">Прибрати</button>
        </div>`);
    });
    rows.forEach(([label, get]) => {
      hs.forEach(h => {
        const v = strip(get(h));
        cells.push(`<div class="cmp-cell"><div class="cmp-lab">${label}</div><div class="cmp-val${label.startsWith('💬') ? ' note' : ''}">${v ? esc(v) : '<span class="cmp-na">Уточнюємо в менеджера</span>'}</div></div>`);
      });
    });
    hs.forEach(h => {
      const o = getActiveOpt(h);
      cells.push(`<div class="cmp-cell"><div class="cmp-lab">💰 Вартість туру</div>
        <div class="cmp-price">${optPrice(o)}</div>
        <div class="cmp-val" style="font-size:12px; opacity:.8;">${o ? `🌙 ${esc(o.duration)} · ${esc(normalizeDateStr(o.dates || ''))}` : ''}</div>
        <div class="cmp-val" style="font-size:11px; opacity:.7;">${esc(formatTouristsPriceLabel(lead.tourists).replace(/:$/, ''))}</div></div>`);
    });
    hs.forEach(h => {
      cells.push(`<div class="cmp-cell cmp-act"><button type="button" class="cmp-choose" onclick="window.chooseFromCompare('${esc(h.id)}')">Обрати цей готель ➔</button></div>`);
    });
    return `
      <div class="cmp-modal" role="dialog" aria-modal="true" aria-label="Битва готелів">
        <div class="cmp-top">
          <div><b>⚖️ Битва готелів</b><small>Гортайте вбік, щоб побачити всі готелі</small></div>
          <button type="button" class="cmp-x" onclick="window.closeCompare()" aria-label="Закрити (Esc)">✕</button>
        </div>
        <div class="cmp-scroll"><div class="cmp-grid" style="--n:${hs.length};">${cells.join('')}</div></div>
      </div>`;
  }

  /* ================= Сценарії (вкладки) та підтвердження вибору ================= */
  function scenarios(lead) {
    const list = Array.isArray(lead.scenarios) ? lead.scenarios.filter(s => s && s.id) : [];
    return list.filter(s => (lead.selection || []).some(h => h.scenario === s.id));
  }

  function currentScenario(lead) {
    const list = scenarios(lead);
    if (list.length < 2) return null;
    if (!list.some(s => s.id === state.activeScenario)) {
      const chosen = (lead.selection || []).find(h => h.name === state.chosenHotel);
      state.activeScenario = (chosen && list.some(s => s.id === chosen.scenario)) ? chosen.scenario : list[0].id;
    }
    return state.activeScenario;
  }

  // Готелі без сценарію показуємо в усіх вкладках
  function visibleHotels(lead) {
    const sc = currentScenario(lead);
    const all = lead.selection || [];
    return sc ? all.filter(h => !h.scenario || h.scenario === sc) : all;
  }

  function renderScenarioTabs(lead) {
    const list = scenarios(lead);
    if (list.length < 2) return '';
    const sc = currentScenario(lead);
    return `
      <div class="sc-tabs" role="tablist" aria-label="Варіанти прорахунку">
        ${list.map(s => {
          const n = (lead.selection || []).filter(h => !h.scenario || h.scenario === s.id).length;
          const on = s.id === sc;
          return `<button type="button" role="tab" aria-selected="${on}" class="sc-tab${on ? ' on' : ''}" onclick="window.switchScenario('${esc(s.id)}')">
            <b>${esc(s.title)}</b><small>${s.subtitle ? esc(s.subtitle) + ' · ' : ''}${n} ${n === 1 ? 'готель' : n < 5 ? 'готелі' : 'готелів'}</small></button>`;
        }).join('')}
      </div>`;
  }

  window.switchScenario = function(id) {
    state.activeScenario = id;
    render();
    const main = document.querySelector('main');
    if (main && main.getBoundingClientRect().top < 0) main.scrollIntoView({ behavior: 'smooth' });
  };

  // Прості відмінки для жіночих імен на -а/-я (Анастасія, Таня, Рита, Ольга)
  function nameVoc(n) {
    n = String(n || '').trim();
    return n.replace(/ія$/, 'іє').replace(/([^і])я$/, '$1ю').replace(/а$/, 'о');
  }
  function nameDat(n) {
    n = String(n || '').trim();
    return n.replace(/ія$/, 'ії').replace(/га$/, 'зі').replace(/ка$/, 'ці').replace(/[ая]$/, 'і');
  }

  function tgLink(manager, text) {
    const u = String(manager.telegram || '').replace(/^@/, '').replace(/^https?:\/\/t\.me\//, '');
    return `https://t.me/${encodeURIComponent(u)}?text=${encodeURIComponent(text)}`;
  }

  function renderConfirm(hotel, opt, manager, theme, isDark) {
    const when = opt ? [normalizeDateStr(opt.dates || ''), opt.duration].filter(Boolean).join(', ') : '';
    const price = opt ? `${opt.price} ${curLabel(opt.currency)}` : '';
    const msg = `Доброго дня, ${nameVoc(manager.name)}! Мені сподобався готель ${hotel.name}` +
      (when ? ` на ${when}` : '') + (price ? ` за ${price}` : '') + '. Підкажіть, чи актуальні ще місця на рейсі?';
    return `
      <div class="confirm-card" style="background:${isDark ? 'rgba(22,163,74,0.12)' : '#f0fdf4'}; border-color:${isDark ? 'rgba(134,239,172,0.35)' : '#bbf7d0'};">
        <div style="display:flex; gap:10px; align-items:center;">
          <img src="${esc(manager.avatar)}" alt="" style="width:40px; height:40px; border-radius:50%; object-fit:cover; flex:none;" />
          <div>
            <div style="font-size:13px; font-weight:800;">Чудовий вибір! 🎉</div>
            <div style="font-size:12px; opacity:.85; line-height:1.4;">Ціни на рейси змінюються щодня, тож напишіть ${esc(nameDat(manager.name))}: вона перевірить місця й зафіксує ціну.</div>
          </div>
        </div>
        <div class="confirm-msg">«${esc(msg)}»</div>
        <a class="confirm-tg" href="${esc(tgLink(manager, msg))}" target="_blank" rel="noopener noreferrer">✈️ Написати ${esc(nameDat(manager.name))} в Telegram</a>
        <button type="button" class="share-btn" onclick="window.shareSelection('${esc(hotel.id)}')">📤 Надіслати чоловіку / друзям</button>
      </div>`;
  }

  /* ================= ✨ Генератор фішок XO Travel =================
     Правила та шаблони, а не нейромережа: працює миттєво й офлайн.
     KB — короткі профілі відомих готелів. Дані треба вивіряти менеджеру,
     особливо line / bay / entry / aqua після реновацій. */
  const XO_KB = [
    { re: /concorde.*salam.*sport/i, area: 'Шаркс-Бей', line: 2, shuttle: true, bay: 'protected', entry: 'reef-sand', aqua: 3, tier: 'value', perk: 'спільний пляж із Concorde El Salam Front' },
    { re: /concorde.*salam/i, area: 'Шаркс-Бей', line: 1, bay: 'protected', entry: 'reef-sand', aqua: 2, tier: 'value' },
    { re: /double\s*tree.*(sharks|sharm)/i, area: 'Шаркс-Бей', line: 1, bay: 'protected', entry: 'reef', aqua: 2, tier: 'premium', perk: 'сервісні стандарти мережі Hilton', terraces: true },
    { re: /grand\s*oasis/i, line: 1, bay: 'protected', entry: 'reef', aqua: 1, tier: 'value', terraces: true },
    { re: /aqua\s*blu/i, line: 2, shuttle: true, bay: 'open', entry: 'sand', aqua: 3, tier: 'family', perk: 'великий аквапарк Albatros' },
    { re: /aqua\s*vista/i, line: 2, shuttle: true, bay: 'open', entry: 'sand', aqua: 2, tier: 'family' },
    { re: /laguna\s*vista/i, line: 1, bay: 'open', entry: 'sand', aqua: 2, tier: 'family' },
    { re: /dana\s*beach/i, line: 1, bay: 'open', entry: 'sand', aqua: 3, tier: 'family', perk: 'один із найбільших аквапарків серед готелів Хургади' },
    { re: /moderna/i, line: 1, bay: 'open', entry: 'sand', aqua: 2, tier: 'family' },
    { re: /rixos.*(seagate|premium)/i, area: 'Набк', line: 1, bay: 'open', entry: 'reef-sand', aqua: 3, tier: 'premium', perk: 'ультра все включено з рестораном а-ля карт' },
    { re: /rixos/i, line: 1, bay: 'open', entry: 'reef-sand', aqua: 3, tier: 'premium', perk: 'ультра все включено з рестораном а-ля карт' },
    { re: /jaz\s*mirabel/i, area: 'Набк', line: 1, bay: 'open', entry: 'reef-sand', aqua: 3, tier: 'family' },
    { re: /\bjaz\b/i, line: 1, bay: 'open', entry: 'reef-sand', aqua: 2, tier: 'value' },
    { re: /sunrise/i, line: 1, bay: 'open', entry: 'sand', aqua: 2, tier: 'value' },
    { re: /pickalbatros|albatros/i, line: 1, bay: 'open', entry: 'sand', aqua: 2, tier: 'family' },
    { re: /sindbad/i, line: 2, shuttle: true, bay: 'open', entry: 'sand', aqua: 2, tier: 'budget' }
  ];

  const AREA_DEFAULTS = [
    { re: /шаркс|sharks/i, area: 'Шаркс-Бей', bay: 'protected', entry: 'reef' },
    { re: /набк|nabq/i, area: 'Набк', bay: 'open', entry: 'reef-sand' },
    { re: /наама|naama/i, area: 'Наама-Бей', bay: 'protected', entry: 'sand' },
    { re: /хадаба|hadaba|um\s*el\s*sid/i, area: 'Хадаба', bay: 'open', entry: 'reef' },
    { re: /макаді|makadi|сахл|sahl/i, area: '', bay: 'protected', entry: 'sand' },
    { re: /марса|marsa\s*alam/i, area: 'Марса-Алам', bay: 'open', entry: 'reef' },
    { re: /хургад|hurghad/i, area: 'Хургада', bay: 'open', entry: 'sand' },
    { re: /шарм|sharm/i, area: '', bay: 'open', entry: 'reef-sand' }
  ];

  function hotelProfile(h) {
    const kb = XO_KB.find(k => k.re.test(h.name || '')) || {};
    const ar = AREA_DEFAULTS.find(a => a.re.test(`${h.resort || ''} ${h.name || ''}`)) || {};
    const am = (h.amenities || []).join(' ').toLowerCase();
    const nm = (h.name || '').toLowerCase();
    const stars = +h.stars || 4;
    const p = {
      known: !!kb.re,
      area: kb.area || ar.area || '',
      line: kb.line || (/перша лінія/.test(am) || /beach/.test(nm) ? 1 : /друга лінія/.test(am) ? 2 : 0),
      shuttle: kb.shuttle != null ? kb.shuttle : /друга лінія/.test(am),
      bay: kb.bay || (/безвітрян/.test(am) ? 'protected' : ar.bay || 'open'),
      entry: kb.entry || (/риф/.test(am) && /піщан/.test(am) ? 'reef-sand' : /риф/.test(am) ? 'reef' : /піщан/.test(am) ? 'sand' : ar.entry || 'sand'),
      aqua: kb.aqua != null ? kb.aqua : (/аквапарк/.test(am) || /aqua/.test(nm) ? 2 : 1),
      tier: kb.tier || (stars >= 5 ? 'premium' : 'value'),
      perk: kb.perk || '',
      terraces: !!kb.terraces,
      stars
    };
    return p;
  }

  function childInfo(tourists) {
    const t = String(tourists || '');
    const ages = (t.match(/(\d{1,2})\s*(?:р|рок|років|year)/gi) || []).map(s => parseInt(s, 10));
    return { has: /дит|діт|child|kid/i.test(t), ages };
  }

  function generateXoPerks(h, focus) {
    const p = hotelProfile(h);
    const lead = state.data.lead;
    const mgr = state.data.manager;
    const guest = nameVoc(lead.greetingName || lead.name || '');
    const kid = childInfo(lead.tourists);
    const kidStr = kid.ages.length ? `дитині ${kid.ages.join(' та ')} р.` : 'дитині';
    const where = p.area ? ` (${p.area})` : '';

    const badges = {
      kids: p.aqua >= 3 ? '👨‍👩‍👧 Топ-вибір для сімей: великий аквапарк і теплі басейни'
        : p.entry === 'sand' ? '👨‍👩‍👧 Для сімей: м’який піщаний захід без коралів під ногами'
        : '👨‍👩‍👧 З дітьми комфортно: спокійна бухта й дитячі басейни',
      couple: p.tier === 'premium' ? '💑 Для пари: преміум-сервіс і тиша без натовпів'
        : '💑 Для пари: спокійний відпочинок і море поруч',
      reef: p.entry === 'sand' ? '🤿 Для снорклінгу краще брати катер на риф: біля берега пісок'
        : `🤿 Живий риф біля берега${p.bay === 'protected' ? ' та безвітряна бухта' : ''}`,
      budget: p.stars >= 5 ? '💰 Бюджетний хіт: 5★ за ціною хорошої «четвірки»' : '💰 Бюджетний хіт: все потрібне без переплати'
    };

    // Пляж
    let beach = p.line === 1 ? `🏖️ Перша лінія${where}: з номера до моря пішки, без шатлів і дороги`
      : p.line === 2 ? `🏖️ Друга лінія${where}: до пляжу ${p.shuttle ? 'возить безкоштовний шатл' : 'кілька хвилин пішки'}`
      : `🏖️ Свій пляж${where}: лінію й відстань до моря уточню перед бронюванням`;
    if (p.perk && /пляж/.test(p.perk)) beach += `, ${p.perk}`;
    beach += focus === 'couple' ? '. Порада: найтихіші лежаки зазвичай подалі від бару та анімації'
      : focus === 'kids' ? `. Візьміть парасольку-тент для ${kid.ages.length ? 'малечі' : 'дитини'}: опівдні сонце пече навіть у листопаді`
      : '.';
    if (p.terraces) beach += ' Територія терасами, тож з візочком буде незручно.';

    // Вітер
    const wind = p.bay === 'protected'
      ? `🛡️ Бухта прикрита від вітру${p.area ? ` (${p.area})` : ''}: навіть узимку, коли дме, хвиль майже немає${focus === 'kids' ? ', тож дітям купатися спокійно' : ''}`
      : `🌬️ Пляж відкритий${p.area ? ` (${p.area})` : ''}: у вітряні дні, особливо з грудня по лютий, буває хвиля. Тоді рятують басейни${p.aqua >= 2 ? ' з підігрівом' : ''}`;

    // Захід у море
    const seaMap = {
      sand: `👣 Піщаний пологий захід без коралів під ногами: ${focus === 'kids' ? `найкомфортніше для ${kid.has ? kidStr.replace('дитині', 'дитини').replace(' р.', ' років') : 'дітей'}` : 'можна без аквашузів'}${focus === 'reef' ? '. За рифами краще на катерну екскурсію' : ''}`,
      reef: `🤿 Захід через понтон просто до коралового рифу: рибки видно з поверхні.${focus === 'kids' ? ' Дитині обов’язково жилет і аквашузи' : ' Беріть свою маску: так і гігієнічніше, і видно краще'}`,
      'reef-sand': `🤿 Біля берега пісок, а з понтону починається риф: дорослі пірнають, діти плескаються на мілині.${focus === 'reef' ? ' Найкращі рибки зранку, поки вода прозора' : ''}`
    };
    const seaEntry = seaMap[p.entry] || seaMap.sand;

    // Басейни
    const aquaMap = [
      '🏊 Аквапарку немає, тільки басейни. Розраховувати варто на море, а не на атракціони',
      '🏊 Кілька басейнів і невеликі гірки. Підігрів узимку уточню для ваших дат',
      `🎢 Гірки для дітей і дорослих та підігріті басейни: ${focus === 'kids' ? 'дитина не занудьгує навіть у прохолодний день' : 'є чим зайнятися, коли на морі вітер'}`,
      `🎢 ${p.perk && /аквапарк/.test(p.perk) ? p.perk[0].toUpperCase() + p.perk.slice(1) : 'Великий аквапарк'}: десятки гірок, дитяча зона, частина басейнів із підігрівом`
    ];
    let aquapark = aquaMap[Math.max(0, Math.min(3, p.aqua))];
    if (focus === 'couple' && p.aqua >= 2) aquapark += '. Для тиші шукайте дорослий басейн або спа';

    // Нотатка
    const opener = guest ? `${guest}, ` : '';
    const notes = {
      kids: p.aqua >= 2 || p.entry === 'sand'
        ? `${opener}для відпочинку з ${kid.ages.length ? `дитиною ${kid.ages.join(' та ')} років` : 'дітьми'} цей готель один із найзручніших у підбірці: ${p.entry === 'sand' ? 'м’який захід у море' : 'спокійна вода біля берега'}${p.aqua >= 2 ? ' і гірки, з яких дитину не витягнеш' : ''}. ${p.line === 2 ? 'Друга лінія тут не страшна, бо шатл ходить регулярно.' : 'Перша лінія: на обід і з пляжу кілька хвилин.'}`
        : `${opener}з дітьми тут добре, якщо ваша родина любить море більше за атракціони. Гірок мало, зате ${p.entry !== 'sand' ? 'риф поруч, і дитина в масці буде в захваті від рибок' : 'спокійно й без натовпу'}.`,
      couple: `${opener}це варіант для тих, хто хоче видихнути: ${p.tier === 'premium' ? 'рівний сервіс і продумана кухня' : 'без зайвого шуму'}${p.bay === 'protected' ? ', спокійне море' : ''}. Попрошу в примітці тихий номер подалі від анімації.`,
      reef: p.entry === 'sand'
        ? `${opener}чесно: заради снорклінгу біля берега цей готель не найкращий, тут пісок. Але катерна екскурсія на риф легко це компенсує, підкажу перевіреного гіда.`
        : `${opener}якщо ви любите маску з трубкою, ви оціните цей готель: риф у кількох кроках від лежака, і щоранку там своє шоу.${p.bay === 'protected' ? ' Бухта захищена, тож вода частіше прозора.' : ''}`,
      budget: `${opener}тут найкраще співвідношення ціни й того, що ви отримуєте. ${p.stars >= 5 ? 'П’ять зірок за ціною хорошої «четвірки».' : 'Без розкоші, але все потрібне є.'} Ціни на такі варіанти швидко ростуть, тож якщо подобається, краще не затягувати.`
    };

    return {
      known: p.known,
      expertBadge: badges[focus] || badges.kids,
      bulletPoints: { beach, wind, seaEntry, aquapark },
      expertNote: notes[focus] || notes.kids
    };
  }

  window.builderSetFocus = function(f) {
    state.bFocus = f;
    document.querySelectorAll('.gen-focus button').forEach(b => b.classList.toggle('on', b.dataset.f === f));
  };

  window.builderGenerate = function() {
    collectForm();
    const h = state.draft[state.bIdx];
    if (!h) return;
    if (!h.name) { showToast('Спочатку вкажіть назву готелю'); return; }
    const filled = (h.expertNote || '') + Object.values(h.bulletPoints || {}).join('');
    if (filled.trim().length > 40 && !confirm('Замінити поточні фішки та нотатку згенерованими?')) return;
    const g = generateXoPerks(h, state.bFocus || 'kids');
    h.expertBadge = g.expertBadge;
    h.bulletPoints = g.bulletPoints;
    h.expertNote = g.expertNote;
    renderBuilder();
    document.querySelectorAll('#bBadge, #bBeach, #bWind, #bSea, #bAqua, #bNote').forEach(el => {
      el.classList.remove('gen-flash'); void el.offsetWidth; el.classList.add('gen-flash');
    });
    showToast(g.known ? '✨ Готово! Готель є в базі XO. Перевірте й підправте під себе' : '✨ Готово за курортом і зірками. Готелю немає в базі, тож обов’язково перевірте факти');
  };

  /* ================= Конструктор готелів (для менеджера) ================= */
  function dateFromDM(d, m, year) {
    return new Date(year, m, d);
  }

  function fmtRange(a, b) {
    const da = a.getDate(), db = b.getDate();
    if (a.getMonth() === b.getMonth()) return `${da}–${db} ${MONTH_SHORT[a.getMonth()]}`;
    return `${da} ${MONTH_SHORT[a.getMonth()]}–${db} ${MONTH_SHORT[b.getMonth()]}`;
  }

  // Повертає {start: Date, end: Date|null} або null
  function extractDates(line) {
    const y = new Date().getFullYear();
    let m;
    const mk = (d1, m1, d2, m2) => {
      const s = dateFromDM(+d1, +m1 - 1, y);
      let e = d2 ? dateFromDM(+d2, +m2 - 1, y) : null;
      if (e && e < s) e = dateFromDM(+d2, +m2 - 1, y + 1);
      return { start: s, end: e };
    };
    if ((m = line.match(/(\d{1,2})[.\/](\d{1,2})(?:[.\/]\d{2,4})?\s*[-–—]\s*(\d{1,2})[.\/](\d{1,2})(?:[.\/]\d{2,4})?/))) return mk(m[1], m[2], m[3], m[4]);
    if ((m = line.match(/(\d{1,2})\s*[-–—]\s*(\d{1,2})[.\/](\d{1,2})(?!\d)/))) return mk(m[1], m[3], m[2], m[3]);
    const tr = new RegExp(`(\\d{1,2})\\s*(${MONTH_RE})?\\s*[-–—]\\s*(\\d{1,2})\\s*(${MONTH_RE})`, 'i');
    if ((m = line.match(tr))) {
      const m2 = monthIdx(m[4]) + 1;
      const m1 = m[2] ? monthIdx(m[2]) + 1 : m2;
      if (m2 > 0 && m1 > 0) return mk(m[1], m1, m[3], m2);
    }
    if ((m = line.match(/(\d{1,2})[.\/](\d{1,2})(?:[.\/]\d{2,4})?(?!\d)/)) && +m[1] <= 31 && +m[2] <= 12) return mk(m[1], m[2]);
    const ts = new RegExp(`(\\d{1,2})\\s*(${MONTH_RE})`, 'i');
    if ((m = line.match(ts)) && monthIdx(m[2]) >= 0) return mk(m[1], monthIdx(m[2]) + 1);
    return null;
  }

  function extractNights(line) {
    const m = line.match(/(\d{1,2})(\s*\+\s*(\d))?\s*(?:ноч|ніч|night|н\.)/i);
    if (!m) return null;
    return { n: +m[1], extra: m[3] ? +m[3] : 0 };
  }

  function extractPrice(line) {
    let m = line.match(/(\d{1,3}(?:[\s\u00a0.,]\d{3})+|\d{3,7})\s*(грн|uah|₴|usd|\$|€|eur|у\.?\s?е\.?)/i);
    if (!m) m = line.match(/(?:uah|usd|eur|\$|€|₴)\s*(\d{1,3}(?:[\s\u00a0.,]\d{3})+|\d{3,7})/i) && [null, RegExp.$1, line.match(/uah|usd|eur|\$|€|₴/i)[0]];
    if (m) {
      const cur = /usd|\$|у\.?\s?е/i.test(m[2]) ? 'USD' : /eur|€/i.test(m[2]) ? 'EUR' : 'UAH';
      return { value: parseInt(m[1].replace(/\D/g, ''), 10), currency: cur };
    }
    // без валюти: найбільше число >= 1000 після прибирання дат та років
    const clean = line.replace(/\d{1,2}[.\/]\d{1,2}(?:[.\/]\d{2,4})?/g, ' ').replace(/\b20\d\d\b/g, ' ');
    const nums = (clean.match(/\d{1,3}(?:[\s\u00a0]\d{3})+|\d{4,7}/g) || []).map(s => parseInt(s.replace(/\D/g, ''), 10)).filter(v => v >= 1000);
    return nums.length ? { value: Math.max(...nums), currency: 'UAH' } : null;
  }

  function parseTourText(raw) {
    const lines = String(raw || '').split(/\r?\n|;/).map(s => s.trim()).filter(Boolean);
    const text = lines.join('\n');
    const hotel = {
      id: 'h_' + Date.now(), name: '', stars: 4, resort: '', meal: '', room: '', flight: '',
      photo: '', photos: [], bookingUrl: '', amenities: [],
      bulletPoints: { beach: '', wind: '', seaEntry: '', aquapark: '' },
      surcharges: '', expertNote: '', options: []
    };
    const label = (re) => { for (const l of lines) { const m = l.match(re); if (m) return m[1].trim(); } return ''; };

    // назва + зірки
    let name = label(/^(?:готель|отель|hotel|назва)\s*[:\-–]\s*(.+)$/i);
    if (!name) name = lines.find(l => /[A-Za-zА-Яа-яІіЇїЄє]{3}/.test(l) && !extractPrice(l) && !/^(?:курорт|resort|харчування|питание|номер|room)/i.test(l)) || '';
    const starRe = /\s*(\d)\s*(?:\*|★|зірок|зірки|зірка|звезд\S*|зв\.?|stars?)/i;
    const sm = (name.match(starRe) || text.match(/(\d)\s*(?:\*|★)/));
    if (sm) hotel.stars = Math.min(Math.max(+sm[1], 1), 5);
    hotel.name = name.replace(starRe, '').replace(/[★*]+/g, '').replace(/^[\s,\-–|]+|[\s,\-–|]+$/g, '');

    // курорт
    let resort = label(/^(?:курорт|resort|регіон|регион|місто|город)\s*[:\-–]\s*(.+)$/i);
    if (!resort) {
      const cl = lines.find(l => /^[^\d:]{3,50},[^\d:]{3,50}$/.test(l) && l !== name);
      if (cl) resort = cl.split(',').pop().trim();
    }
    if (!resort) {
      const dest = (state.data && state.data.lead.destination) || '';
      resort = dest.includes(',') ? dest.split(',').pop().trim() : dest;
    }
    hotel.resort = resort;

    // харчування
    const meals = [
      [/ultra\s*all|\buai\b|ультра/i, 'Ультра все включено'],
      [/all\s*incl|\bai\b|все\s*включено|усе\s*включено/i, 'Все включено'],
      [/\bfb\b|повний\s*пансіон|полный\s*пансион/i, 'Повний пансіон'],
      [/\bhb\b|напівпансіон|полупансион/i, 'Напівпансіон'],
      [/\bbb\b|сніданк|завтрак/i, 'Сніданки'],
      [/\bro\b|без\s*харч|без\s*питания/i, 'Без харчування']
    ];
    const mealSrc = label(/^(?:харчування|питание|meal|тип\s*харчування)\s*[:\-–]\s*(.+)$/i) || text;
    const mm = meals.find(([re]) => re.test(mealSrc));
    hotel.meal = mm ? mm[1] : '';

    hotel.room = label(/^(?:номер|room|тип\s*номеру|категорія)\s*[:\-–]\s*(.+)$/i);
    const bk = text.match(/https?:\/\/[^\s]*booking\.com[^\s]*/i);
    if (bk) hotel.bookingUrl = bk[0];
    hotel.photos = (text.match(/https?:\/\/[^\s]+\.(?:jpe?g|png|webp)(?:\?[^\s]*)?/gi) || []);
    hotel.photo = hotel.photos[0] || '';
    const origin = (state.data && state.data.lead.departureOrigin) || '';
    hotel.flight = origin ? `Переліт із ${origin}` : '';

    // варіанти: контекст (дати/ночі) тягнеться вниз до рядка з ціною
    let ctx = { start: null, end: null, nights: null };
    lines.forEach(l => {
      const price = extractPrice(l);
      const stripped = l.replace(/\d{1,3}(?:[\s\u00a0.,]\d{3})+\s*(?:грн|uah|₴|usd|\$|€|eur)?|\d{3,7}\s*(?:грн|uah|₴|usd|\$|€|eur)/gi, ' ');
      const nights = extractNights(stripped);
      const dates = extractDates(stripped);
      if (nights) ctx.nights = nights;
      if (dates) { ctx.start = dates.start; ctx.end = dates.end; if (dates.end && !nights) ctx.nights = null; }
      if (!price || (!nights && !dates && !ctx.nights && !ctx.start)) return;
      let n = ctx.nights, start = ctx.start, end = ctx.end;
      if (!n && start && end) n = { n: Math.round((end - start) / 864e5), extra: 0 };
      if (!end && start && n) end = new Date(start.getTime() + (n.n + n.extra) * 864e5);
      const duration = n ? `${n.n} ночей${n.extra ? ' + ' + n.extra : ''}` : '';
      const dateStr = start && end ? fmtRange(start, end) : '';
      hotel.options.push({
        id: 'opt_' + (hotel.options.length + 1), duration, dates: dateStr,
        price: fmtPrice(price.value), currency: price.currency
      });
    });
    return hotel;
  }

  function parseOptionLines(txt, old) {
    return String(txt || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean).map((l, i) => {
      const [duration = '', dates = '', price = ''] = l.split('|').map(s => s.trim());
      const pv = parseInt(price.replace(/\D/g, ''), 10) || 0;
      const prev = (old || [])[i];
      const o = {
        id: (prev && prev.id) || 'opt_' + (i + 1), duration, dates,
        price: pv ? fmtPrice(pv) : price, currency: /\$|usd/i.test(price) ? 'USD' : /€|eur/i.test(price) ? 'EUR' : 'UAH'
      };
      if (prev && prev.flights && prev.dates === dates) o.flights = prev.flights;
      return o;
    });
  }

  const $id = id => document.getElementById(id);
  const fld = (id, label, val, extra = '') => `
    <label class="b-lab">${label}<input id="${id}" type="text" class="b-inp" value="${esc(val)}" ${extra} /></label>`;
  const area = (id, label, val, rows = 2, ph = '') => `
    <label class="b-lab">${label}<textarea id="${id}" class="b-inp" rows="${rows}" placeholder="${esc(ph)}">${esc(val)}</textarea></label>`;

  function renderBuilder() {
    const list = state.draft;
    const h = list[state.bIdx];
    const b = (h && h.bulletPoints) || {};
    const optTxt = h ? (h.options || []).map(o => `${o.duration} | ${o.dates} | ${o.price}${o.currency === 'USD' ? ' $' : o.currency === 'EUR' ? ' €' : ''}`).join('\n') : '';
    $id('builderModal').innerHTML = `
      <div class="b-box" onclick="event.stopPropagation()">
        <div class="b-head">
          <h3>➕ Конструктор підбірки</h3>
          <button type="button" class="b-x" onclick="window.closeBuilder()" aria-label="Закрити">✕</button>
        </div>
        <div class="b-grid">
          <aside class="b-side">
            <div class="b-title">Готелі в підбірці (${list.length})</div>
            ${list.map((x, i) => `
              <div class="b-item${i === state.bIdx ? ' on' : ''}" onclick="window.builderSelect(${i})">
                <span class="b-item-name">${i + 1}. ${esc(x.name || 'Без назви')}</span>
                <span class="b-item-ctl">
                  <button type="button" title="Вгору" ${i === 0 ? 'disabled' : ''} onclick="event.stopPropagation(); window.builderMove(${i}, -1)">▲</button>
                  <button type="button" title="Вниз" ${i === list.length - 1 ? 'disabled' : ''} onclick="event.stopPropagation(); window.builderMove(${i}, 1)">▼</button>
                  <button type="button" title="Видалити" onclick="event.stopPropagation(); window.builderDelete(${i})">🗑</button>
                </span>
              </div>`).join('') || '<div class="b-muted">Поки порожньо. Вставте прорахунок або додайте готель вручну.</div>'}
            <button type="button" class="b-btn ghost" onclick="window.builderAddEmpty()">＋ Порожній готель</button>
          </aside>
          <section class="b-main">
            <div class="b-paste">
              <div class="b-title">📋 Вставте текст прорахунку з Otpusk / ITour</div>
              <textarea id="bPaste" class="b-inp" rows="4" placeholder="Concorde El Salam 5*&#10;Єгипет, Шарм-ель-Шейх · Все включено&#10;05.11–12.11 · 6 ночей · 70 430 грн&#10;06.11–13.11 · 7 ночей · 77 041 грн"></textarea>
              <button type="button" class="b-btn" onclick="window.builderParse()">✨ Розпізнати та додати</button>
            </div>
            ${h ? `
              <div class="b-title" style="margin-top:14px;">✏️ Редагування: ${esc(h.name || 'новий готель')}</div>
              <div class="b-row2">${fld('bName', 'Назва готелю', h.name)}${fld('bStars', 'Зірки (1–5)', h.stars, 'inputmode="numeric"')}</div>
              <div class="b-row2">${fld('bResort', 'Курорт', h.resort)}${fld('bMeal', 'Харчування', h.meal)}</div>
              <div class="b-row2">${fld('bRoom', 'Номер', h.room)}${fld('bFlight', 'Переліт (текст)', h.flight)}</div>
              ${fld('bBadge', '🏷️ Вердикт експерта (плашка над назвою)', h.expertBadge || '', 'placeholder="🏆 Фаворит XO Travel: ціна / якість"')}
              <label class="b-lab">🗂️ Вкладка-сценарій
                <select id="bScen" class="b-inp">
                  <option value="">Показувати в усіх вкладках</option>
                  ${((state.data.lead.scenarios) || []).map(s => `<option value="${esc(s.id)}" ${h.scenario === s.id ? 'selected' : ''}>${esc(s.title)}</option>`).join('')}
                </select>
              </label>
              ${fld('bBooking', 'Посилання на Booking.com', h.bookingUrl)}
              ${area('bPhotos', 'Фото (посилання, по одному в рядку)', (h.photos || []).join('\n'), 3)}
              ${area('bOpts', 'Варіанти: «тривалість | дати | ціна», по одному в рядку', optTxt, 4, '7 ночей | 6–13 лис | 77 041')}
              <div class="gen-box">
                <div class="b-title">✨ Генератор фішок XO</div>
                <div class="gen-focus" role="group" aria-label="Фокус туриста">
                  ${[['kids', '👨‍👩‍👧 З дітьми'], ['couple', '💑 Для пари / Релакс'], ['reef', '🤿 Корали і снорклінг'], ['budget', '💰 Бюджетний хіт']].map(([f, l]) =>
                    `<button type="button" data-f="${f}" class="${(state.bFocus || 'kids') === f ? 'on' : ''}" onclick="window.builderSetFocus('${f}')">${l}</button>`).join('')}
                </div>
                <button type="button" class="gen-btn" onclick="window.builderGenerate()">✨ Сформувати експертні фішки XO в 1 клік</button>
                <div class="b-muted" style="font-size:11px;">Заповнить вердикт, 4 пункти й нотатку. Звернення до туриста підставиться автоматично, а факти про готель перевірте перед відправкою.</div>
              </div>
              <div class="b-title" style="margin-top:6px;">⭐ 4 експертні пункти</div>
              ${fld('bBeach', '🏖️ Пляж', b.beach || '')}
              ${fld('bWind', '🛡️ Вітер / бухта', b.wind || '')}
              ${fld('bSea', '🤿 Захід у море', b.seaEntry || '')}
              ${fld('bAqua', '🎢 Аквапарк', b.aquapark || '')}
              ${fld('bSur', '💳 Доплати', h.surcharges || '')}
              ${area('bNote', '💬 Особиста нотатка експерта (бачить клієнт)', h.expertNote || '', 3)}
            ` : ''}
          </section>
        </div>
        <div class="b-foot">
          <span class="b-muted">Зміни застосуються після «Зберегти підбірку».</span>
          <span>
            <button type="button" class="b-btn ghost" onclick="window.closeBuilder()">Скасувати</button>
            <button type="button" class="b-btn" onclick="window.builderSave()">💾 Зберегти підбірку</button>
          </span>
        </div>
      </div>`;
  }

  function collectForm() {
    const h = state.draft && state.draft[state.bIdx];
    if (!h || !$id('bName')) return;
    h.name = $id('bName').value.trim();
    h.stars = Math.min(Math.max(parseInt($id('bStars').value, 10) || 4, 1), 5);
    h.resort = $id('bResort').value.trim();
    h.meal = $id('bMeal').value.trim();
    h.room = $id('bRoom').value.trim();
    h.flight = $id('bFlight').value.trim();
    h.bookingUrl = $id('bBooking').value.trim();
    h.photos = $id('bPhotos').value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    h.photo = h.photos[0] || '';
    h.options = parseOptionLines($id('bOpts').value, h.options);
    h.bulletPoints = {
      beach: $id('bBeach').value.trim(), wind: $id('bWind').value.trim(),
      seaEntry: $id('bSea').value.trim(), aquapark: $id('bAqua').value.trim()
    };
    h.surcharges = $id('bSur').value.trim();
    h.expertNote = $id('bNote').value.trim();
    h.expertBadge = $id('bBadge').value.trim();
    h.scenario = $id('bScen').value;
  }

  window.openBuilder = function() {
    if (!state.data) return;
    state.draft = JSON.parse(JSON.stringify(state.data.lead.selection || []));
    state.bIdx = state.draft.length ? 0 : -1;
    renderBuilder();
    $id('builderModal').style.display = 'flex';
  };
  window.closeBuilder = function() {
    $id('builderModal').style.display = 'none';
    state.draft = null;
  };
  window.builderSelect = function(i) { collectForm(); state.bIdx = i; renderBuilder(); };
  window.builderMove = function(i, d) {
    collectForm();
    const j = i + d;
    if (j < 0 || j >= state.draft.length) return;
    [state.draft[i], state.draft[j]] = [state.draft[j], state.draft[i]];
    if (state.bIdx === i) state.bIdx = j; else if (state.bIdx === j) state.bIdx = i;
    renderBuilder();
  };
  window.builderDelete = function(i) {
    collectForm();
    const nm = state.draft[i].name || 'цей готель';
    if (!confirm(`Видалити «${nm}» з підбірки?`)) return;
    state.draft.splice(i, 1);
    state.bIdx = Math.min(state.bIdx, state.draft.length - 1);
    if (i < state.bIdx) state.bIdx--;
    renderBuilder();
  };
  window.builderAddEmpty = function() {
    collectForm();
    state.draft.push({
      id: 'h_' + Date.now(), name: '', stars: 4, resort: '', meal: '', room: '', flight: '', photo: '', photos: [],
      bookingUrl: '', amenities: [], bulletPoints: { beach: '', wind: '', seaEntry: '', aquapark: '' },
      surcharges: '', expertNote: '', options: []
    });
    state.bIdx = state.draft.length - 1;
    renderBuilder();
  };
  window.builderParse = function() {
    const raw = $id('bPaste').value;
    if (!raw.trim()) { showToast('Спочатку вставте текст прорахунку'); return; }
    collectForm();
    const h = parseTourText(raw);
    if (!h.name) { showToast('Не вдалося знайти назву готелю'); return; }
    state.draft.push(h);
    state.bIdx = state.draft.length - 1;
    renderBuilder();
    showToast(h.options.length ? `Розпізнано: ${h.name}, варіантів: ${h.options.length}. Перевірте дані` : 'Готель додано, але ціни не знайдено — додайте варіанти вручну');
  };
  window.builderSave = async function() {
    collectForm();
    const bad = state.draft.findIndex(h => !h.name);
    if (bad >= 0) { state.bIdx = bad; renderBuilder(); showToast('Вкажіть назву готелю'); return; }
    const st = $id('saveStatus');
    st.textContent = '⏳ Збереження...';
    try {
      const res = await fetch('/api/update', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead: { selection: state.draft } })
      });
      const r = await res.json();
      state.data = r.data;
      st.textContent = '✅ Збережено';
      setTimeout(() => st.textContent = '● Готово до правок', 2000);
      window.closeBuilder();
      render();
    } catch (e) {
      st.textContent = '❌ Помилка';
      showToast('Не вдалося зберегти підбірку');
    }
  };

  function render() {
    if (!state.data) return;
    const { lead, manager } = state.data;
    const theme = THEMES[state.currentTheme] || THEMES.sand;
    const isDark = state.currentTheme === 'dark';
    document.body.style.background = theme.pageBg;
    document.body.style.color = isDark ? '#e6f0eb' : '#1c2420';

    const displayName = lead.greetingName?.trim() || lead.name || 'Ольга';

    let html = `
      <div style="min-height:100vh;">
        <!-- Header -->
        <header style="background:${theme.headerBg}; color:${theme.headerText}; padding:24px 16px 20px;">
          <div style="maxWidth:640px; margin:0 auto; max-width:640px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="background:${theme.accentPill}; color:#133329; font-weight:900; font-size:12px; padding:4px 8px; border-radius:6px;">XO</span>
                <span style="font-size:14px; font-weight:800; letter-spacing:0.04em;">XO TRAVEL</span>
              </div>
              <div style="display:flex; gap:6px;">
                <a href="https://t.me/xostock" target="_blank" rel="noopener noreferrer" style="font-size:11px; font-weight:700; background:rgba(255,255,255,0.18); color:#fff; padding:4px 8px; border-radius:6px; text-decoration:none;">
                  ✈️ Гарячі тури
                </a>
                <a href="https://instagram.com/xo.travel" target="_blank" rel="noopener noreferrer" style="font-size:11px; font-weight:700; background:rgba(255,255,255,0.18); color:#fff; padding:4px 8px; border-radius:6px; text-decoration:none;">
                  📸 Instagram
                </a>
              </div>
            </div>

            <h1 style="font-size:22px; font-weight:800; margin:0 0 6px; line-height:1.25;">
              ${esc(nameVoc(displayName))}, ваша персональна добірка
            </h1>
            <div style="font-size:13px; opacity:0.9; line-height:1.4;">
              📍 ${esc(lead.destination)} · 🛫 Виліт з: ${esc(lead.departureOrigin)} · 👥 ${esc(lead.tourists)}
            </div>
            <button type="button" class="share-btn hdr" onclick="window.shareSelection()">📤 Надіслати чоловіку / друзям</button>

            <!-- Manager chip -->
            <div style="display:flex; align-items:center; gap:10px; margin-top:14px; background:rgba(255,255,255,0.12); padding:8px 12px; border-radius:12px;">
              <img src="${esc(manager.avatar)}" alt="${esc(manager.name)}" style="width:38px; height:38px; border-radius:50%; object-fit:cover; border:2px solid rgba(255,255,255,0.6);" />
              <div style="flex:1;">
                <div style="font-size:12px; font-weight:700;">${esc(manager.name)} · ${esc(manager.role)}</div>
                <div style="font-size:11px; opacity:0.85;">Особисто відібрала готелі під вашу родину</div>
              </div>
              <a href="https://t.me/${esc(manager.telegram.replace('@', ''))}" target="_blank" rel="noopener noreferrer" style="background:${theme.accentPill}; color:#143329; padding:6px 12px; border-radius:8px; font-size:11px; font-weight:800; text-decoration:none;">
                Написати
              </a>
            </div>
            ${renderScenarioTabs(lead, theme)}
          </div>
        </header>

        <!-- Main Content: Hotels -->
        <main style="max-width:640px; margin:0 auto; padding:16px;">
    `;

    visibleHotels(lead).forEach((hotel, hIdx) => {
      const activeOptId = state.selectedOptions[hotel.id] || (hotel.options && hotel.options[0]?.id);
      const activeOpt = (hotel.options || []).find(o => o.id === activeOptId) || hotel.options?.[0];
      const isChosenThis = state.chosenHotel === hotel.name;
      const hasFlights = Boolean(activeOpt?.flights && activeOpt.flights.length > 0);

      html += `
        <article id="card_${esc(hotel.id)}" style="background:${theme.cardBg}; border:1px solid ${theme.cardBorder}; border-radius:16px; overflow:hidden; margin-bottom:20px; box-shadow:${isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.04)'};">
          <!-- Photo gallery -->
          ${renderGallery(hotel)}

          <!-- Body -->
          <div style="padding:16px;">
            ${hotel.expertBadge ? `<div class="verdict" style="--vc:${theme.priceColor};">${esc(hotel.expertBadge)}</div>` : ''}
            <h2 style="font-size:18px; font-weight:800; margin:0 0 6px; color:${isDark ? '#fff' : '#0f172a'};">
              ${esc(hotel.name)}
            </h2>
            <button type="button" class="cmp-btn${state.compare.includes(hotel.id) ? ' on' : ''}" aria-pressed="${state.compare.includes(hotel.id)}" onclick="window.toggleCompare('${esc(hotel.id)}')">${state.compare.includes(hotel.id) ? '✓ У порівнянні' : '⚖️ Порівняти'}</button>

            <!-- Flight & Meal -->
            <div style="font-size:12px; color:${theme.subtext}; margin-bottom:10px; line-height:1.4;">
              ${hotel.meal ? `🍽️ ${esc(hotel.meal)}` : ''}${hotel.room ? ` · 🛏️ ${esc(hotel.room)}` : ''}${hotel.flight ? ` · ✈️ ${esc(hotel.flight.replace(/із:\s*/gi, 'із '))}` : ''}
            </div>
            ${activeOpt && activeOpt.dates ? `<div style="margin-bottom:10px;"><span class="flight-badge flash-target" data-flash="${esc(hotel.id)}">✈️ Виліт: ${esc(flightDepartLabel(activeOpt))}</span></div>` : ''}

            <!-- Booking.com Link -->
            ${hotel.bookingUrl ? `
              <div style="margin-bottom:14px;">
                <a href="${esc(hotel.bookingUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:700; color:${isDark ? '#93c5fd' : '#1e40af'}; text-decoration:none; background:${isDark ? 'rgba(30, 58, 138, 0.2)' : '#f0f4fa'}; border:${isDark ? '1px solid rgba(30, 58, 138, 0.4)' : '1px solid #dbeafe'}; padding:4px 10px; border-radius:6px;">
                  <span style="font-weight:900; color:#003580;">B.</span>
                  <span>Відгуки на Booking.com</span>
                  <span style="opacity:0.7;">↗</span>
                </a>
              </div>
            ` : ''}

            ${renderOptions(hotel, activeOpt, theme, isDark)}

            ${renderBullets(hotel, theme, isDark)}
            ${renderExtra(hotel, manager, theme, isDark)}

            <!-- Price and Choose Action Button -->
            <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; padding-top:12px; border-top:1px solid ${theme.cardBorder};">
              <div>
                <div style="font-size:11px; color:${theme.subtext};">${formatTouristsPriceLabel(lead.tourists)}</div>
                <div class="flash-target" data-flash="${esc(hotel.id)}" style="font-size:22px; font-weight:900; color:${theme.priceColor};">${optPrice(activeOpt)}</div>
              </div>
              <button type="button" class="choose-btn flash-target" data-flash="${esc(hotel.id)}"
                onclick="window.chooseHotel('${esc(hotel.id)}')"
                style="background:${isChosenThis ? '#15803d' : theme.priceColor}; color:${isChosenThis ? '#ffffff' : (isDark ? '#13221e' : '#ffffff')};">
                ${isChosenThis
                  ? `✅ Ви обрали цей готель<small>${esc(manager.name)} вже бачить ваш вибір</small>`
                  : `Обрати цей варіант ➔<small>${esc(activeOpt?.duration || '')} · ${esc(normalizeDateStr(activeOpt?.dates || ''))}</small>`}
              </button>
            </div>
            ${isChosenThis ? renderConfirm(hotel, activeOpt, manager, theme, isDark) : ''}
          </div>
        </article>
      `;
    });

    html += `
        </main>

        <!-- Sticky Bottom Bar -->
        <footer style="position:fixed; bottom:0; left:0; right:0; background:${theme.bottomBarBg}; backdrop-filter:blur(12px); border-top:1px solid ${theme.bottomBarBorder}; padding:12px 16px; z-index:100;">
          <div style="max-width:640px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; gap:10px;">
            <div>
              <div style="font-size:11px; color:${theme.subtext};">Є питання щодо готелю?</div>
              <div style="font-size:13px; font-weight:800; color:${isDark ? '#fff' : '#0f172a'};">${esc(manager.name)} на зв'язку</div>
            </div>
            <div style="display:flex; gap:8px;">
              <a href="https://t.me/${esc(manager.telegram.replace('@', ''))}" target="_blank" rel="noopener noreferrer" style="background:#229ed9; color:#fff; padding:9px 14px; border-radius:10px; font-size:12px; font-weight:800; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
                <span>Telegram</span>
              </a>
              <a href="tel:${esc(manager.phone.replace(/\\s+/g, ''))}" style="background:${theme.priceColor}; color:${isDark ? '#13221e' : '#fff'}; padding:9px 14px; border-radius:10px; font-size:12px; font-weight:800; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
                <span>📞 Подзвонити</span>
              </a>
            </div>
          </div>
        </footer>

        ${renderCompareBar()}
        ${renderCompareModal(lead, manager)}

        <!-- Flight Modal -->
        ${state.activeFlightModal ? `
          <div class="modal-backdrop" onclick="window.closeFlightModal()">
            <div style="background:#ffffff; color:#0f172a; border-radius:18px; max-width:460px; width:100%; padding:20px; box-shadow:0 20px 40px rgba(0,0,0,0.2);" onclick="event.stopPropagation()">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px; border-bottom:1px solid #e2e8f0; padding-bottom:10px;">
                <div>
                  <h3 style="font-size:16px; font-weight:800; margin:0 0 2px; color:#133329;">
                    ✈️ Програма перельоту
                  </h3>
                  <div style="font-size:12px; color:#64748b;">
                    ${esc(state.activeFlightModal.hotelName)} · ${esc(state.activeFlightModal.duration)}
                  </div>
                </div>
                <button type="button" onclick="window.closeFlightModal()" style="background:#f1f5f9; border:none; border-radius:50%; width:28px; height:28px; cursor:pointer; font-weight:bold;">
                  ✕
                </button>
              </div>

              <div style="display:flex; flex-direction:column; gap:10px;">
                ${state.activeFlightModal.flights.map((f, idx) => `
                  <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:10px 12px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                      <span style="font-size:10px; font-weight:800; background:${idx === 0 ? '#dbeafe' : '#fef3c7'}; color:${idx === 0 ? '#1e40af' : '#92400e'}; padding:2px 6px; border-radius:4px; text-transform:uppercase;">
                        ${idx === 0 ? '🛫 Рейс туди' : '🛬 Рейс назад'}
                      </span>
                      <span style="font-size:11px; font-weight:700; color:#475569;">
                        ⏳ ${esc(f.duration)}
                      </span>
                    </div>
                    <div style="font-size:13px; font-weight:800; color:#0f172a; line-height:1.4;">
                      ${formatFlightTimeline(f, idx === 0)}
                    </div>
                  </div>
                `).join('')}
              </div>

              <button type="button" onclick="window.closeFlightModal()" style="width:100%; marginTop:16px; margin-top:16px; background:#133329; color:#d9ef9f; padding:10px; border-radius:10px; border:none; font-weight:800; font-size:12px; cursor:pointer;">
                Зрозуміло
              </button>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    document.getElementById('selectionApp').innerHTML = html;
    restoreGalleries();
  }

  loadData();
})();
