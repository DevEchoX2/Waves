function initNav() {
  const navToggle = document.getElementById('navToggle');
  const navModal = document.getElementById('navModal');
  const leftPanel = document.getElementById('leftPanel');

  if (!navToggle || !navModal || !leftPanel) return;

  navToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    const isActive = navModal.classList.toggle('active');
    leftPanel.classList.toggle('open', isActive);
  });

  document.addEventListener('click', (event) => {
    const clickInside = navToggle.contains(event.target) || navModal.contains(event.target);
    if (!clickInside) {
      navModal.classList.remove('active');
      leftPanel.classList.remove('open');
    }
  });

  document.querySelectorAll('.nav-item').forEach((item) => {
    const href = item.getAttribute('href');
    if (!href) return;
    const hrefPath = href.startsWith('http') ? new URL(href, window.location.origin).pathname : href;
    const currentPath = window.location.pathname === '/' ? '/index.html' : window.location.pathname;
    if (hrefPath === currentPath) {
      item.classList.add('active-nav');
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNav);
} else {
  initNav();
}
