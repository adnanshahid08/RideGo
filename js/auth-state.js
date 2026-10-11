// RideGo shared navbar state and mobile menu. Loaded once per page.
(function () {
  function initRideGoNavbar() {
    const nav = document.getElementById('mainNavLinks') || document.querySelector('.nav-links');
    const button = document.getElementById('mobileMenuBtn');
    if (!nav) return;

    let user = null;
    try { user = JSON.parse(localStorage.getItem('rideGoLoggedInUser') || 'null'); } catch (_) {}
    const loggedIn = Boolean(user && (user.id || user.email || user.fullName));
    nav.querySelectorAll('[data-auth="logged-out"]').forEach(el => { el.hidden = loggedIn; el.style.setProperty('display', loggedIn ? 'none' : '', loggedIn ? 'important' : ''); });
    nav.querySelectorAll('[data-auth="logged-in"]').forEach(el => { el.hidden = !loggedIn; el.style.setProperty('display', loggedIn ? '' : 'none', !loggedIn ? 'important' : ''); });
    const dashboard = nav.querySelector('[data-page="dashboard.html"]');
    if (dashboard) { dashboard.hidden = !loggedIn; dashboard.style.setProperty('display', loggedIn ? '' : 'none', !loggedIn ? 'important' : ''); }

    const currentFile = location.pathname.split('/').pop() || 'index.html';
    nav.querySelectorAll('a[data-page]').forEach(a => { if (a.dataset.page === currentFile) a.classList.add('active'); });
    const logout = nav.querySelector('#logoutBtn');
    if (logout && !logout.dataset.bound) {
      logout.dataset.bound = '1';
      logout.addEventListener('click', function (e) { e.preventDefault(); localStorage.removeItem('rideGoLoggedInUser'); location.href = 'index.html'; });
    }
    if (!button || button.dataset.bound) return;
    button.dataset.bound = '1';
    button.type = 'button';
    button.setAttribute('aria-controls', nav.id || 'mainNavLinks');
    const close = () => { nav.classList.remove('show'); button.setAttribute('aria-expanded', 'false'); };
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const open = !nav.classList.contains('show');
      nav.classList.toggle('show', open);
      button.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('click', e => { if (!nav.contains(e.target) && !button.contains(e.target)) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 900) close(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initRideGoNavbar, { once: true });
  else initRideGoNavbar();
})();
