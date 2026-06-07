/* La Staffetta — theme toggle (light / dark).
   The no-flash <head> script already set data-theme before paint.
   This wires the toggle button(s), persists the choice, keeps aria in sync,
   follows the system when the user has not chosen, and broadcasts a
   'themechange' event so the 3D scene can recolour itself. */
(function () {
  var root = document.documentElement;
  var KEY = 'ls-theme';

  function current() { return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }

  function apply(theme, persist) {
    root.setAttribute('data-theme', theme);
    if (persist) { try { localStorage.setItem(KEY, theme); } catch (e) {} }
    var pressed = theme === 'dark' ? 'true' : 'false';
    var label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    document.querySelectorAll('.themetoggle').forEach(function (b) {
      b.setAttribute('aria-pressed', pressed);
      b.setAttribute('aria-label', label);
    });
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));
  }

  // Sync aria + broadcast the initial state (the attribute is already set).
  apply(current(), false);

  document.querySelectorAll('.themetoggle').forEach(function (b) {
    b.addEventListener('click', function () {
      apply(current() === 'dark' ? 'light' : 'dark', true);
    });
  });

  // If the user has not made an explicit choice, follow the OS live.
  try {
    var mq = matchMedia('(prefers-color-scheme: dark)');
    var onChange = function (e) {
      var chosen = null;
      try { chosen = localStorage.getItem(KEY); } catch (err) {}
      if (!chosen) { apply(e.matches ? 'dark' : 'light', false); }
    };
    if (mq.addEventListener) { mq.addEventListener('change', onChange); }
    else if (mq.addListener) { mq.addListener(onChange); }
  } catch (e) {}
})();
