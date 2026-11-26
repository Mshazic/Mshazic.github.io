(function () {
  'use strict';

  var root = document.documentElement;

  /* Theme toggle. The saved choice is applied in <head> before first paint; this keeps the button in sync. */
  var toggle = document.getElementById('themeToggle');

  function currentTheme() {
    return root.getAttribute('data-bs-theme') === 'light' ? 'light' : 'dark';
  }

  function syncToggle() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    toggle.setAttribute('aria-label', 'Switch to ' + next + ' theme');
    toggle.setAttribute('title', 'Switch to ' + next + ' theme');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', currentTheme() === 'dark' ? '#0d1520' : '#f4f6f9');
  }

  toggle.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-bs-theme', next);
    try { localStorage.setItem('sn-theme', next); } catch (e) { /* storage unavailable */ }
    syncToggle();
  });
  syncToggle();

  /* Navbar gets a divider line once the page has scrolled. */
  var nav = document.getElementById('mainNav');
  function onScroll() {
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Close the mobile menu after choosing a link. */
  var menu = document.getElementById('navLinks');
  menu.addEventListener('click', function (event) {
    if (event.target.closest('a') && menu.classList.contains('show')) {
      bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }
  });

  /* Copy buttons for email and phone, with a fallback when the Clipboard API is refused. */
  var status = document.getElementById('copyStatus');

  function fallbackCopy(text) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(area);
    return ok;
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return fallbackCopy(text); });
    }
    return Promise.resolve(fallbackCopy(text));
  }

  document.querySelectorAll('[data-copy]').forEach(function (button) {
    var original = button.textContent;
    button.addEventListener('click', function () {
      copyText(button.getAttribute('data-copy')).then(function (ok) {
        button.textContent = ok ? 'Copied' : 'Press Ctrl+C';
        status.textContent = ok ? 'Copied to clipboard' : 'Copy failed. Select the text and copy it manually.';
        setTimeout(function () { button.textContent = original; }, 1800);
      });
    });
  });

  /* Footer year. */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
