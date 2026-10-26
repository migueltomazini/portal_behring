/* Substitui <i data-i="nome"></i> por ícones SVG (mesmo conjunto do protótipo). */
(() => {
  const P = {
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    hourglass: '<path d="M7 3h10M7 21h10M8 3v3a4 4 0 0 0 8 0V3M8 21v-3a4 4 0 0 1 8 0v3"/>',
    alert: '<path d="M12 3.5l9 16H3z"/><path d="M12 10v4M12 17v.5"/>',
    upload: '<path d="M12 16V4M7 9l5-5 5 5M4 16v4h16v-4"/>',
    home: '<path d="M3 11l9-8 9 8M5 10v10h14V10"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    folder: '<path d="M3 6h6l2 2h10v11H3z"/>',
    bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
    right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    megaphone: '<path d="M3 10v4h4l7 5V5l-7 5z"/><path d="M18 9a4 4 0 0 1 0 6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    flag: '<path d="M5 21V4h11l-2 4 2 4H5"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  };
  document.querySelectorAll('i[data-i]').forEach(el => {
    el.outerHTML = `<svg class="${el.className || 'ico'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${P[el.dataset.i]}</svg>`;
  });
})();
