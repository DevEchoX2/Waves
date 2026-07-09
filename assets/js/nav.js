function initNav() {
 
  let leftPanel = document.getElementById('leftPanel');
  if (!leftPanel) {
    leftPanel = document.createElement('div');
    leftPanel.className = 'bottom-left';
    leftPanel.id = 'leftPanel';
    
    leftPanel.innerHTML = `
      <div class="nav-modal" id="navModal">
        <button class="home-toggle" id="navToggle" type="button">
          <span class="home-icon"><i class="fas fa-home"></i></span>
          <span class="home-label">Home</span>
        </button>
        <div class="nav-items">
          <a class="nav-item" href="/index.html"><i class="fas fa-home"></i><span>Home</span></a>
          <a class="nav-item" href="/pages/ai.html"><i class="fas fa-brain"></i><span>AI</span></a>
          <a class="nav-item" href="/pages/chat.html"><i class="fas fa-comments"></i><span>Chat</span></a>
          <a class="nav-item" href="/pages/watch.html"><i class="fas fa-eye"></i><span>Watch</span></a>
          <a class="nav-item" href="/pages/music.html"><i class="fas fa-music"></i><span>Music</span></a>
          <a class="nav-item" href="/pages/browser.html"><i class="fas fa-compass"></i><span>Browse</span></a>
          <div class="nav-item"><i class="fas fa-gamepad"></i><span>Games</span></div>
        </div>
      </div>
      <div class="utility-buttons">
        <button class="util-btn" title="Settings"><i class="fas fa-sliders-h"></i></button>
        <button class="util-btn" title="Magic"><i class="fas fa-wand-magic-sparkles"></i></button>
        <button class="util-btn" title="Trophy"><i class="fas fa-trophy"></i></button>
        <button class="util-btn" title="Users"><i class="fas fa-users-gear"></i></button>
      </div>
    `;
    document.body.appendChild(leftPanel);
  }

  // 2. Ensure the Premium monetization banner layout exists
  let premiumBtn = document.querySelector('.bottom-right');
  if (!premiumBtn) {
    premiumBtn = document.createElement('div');
    premiumBtn.className = 'bottom-right';
    premiumBtn.innerHTML = `
      <button class="premium-btn">
        <i class="fas fa-crown"></i>
        <span>Premium</span>
      </button>
    `;
    document.body.appendChild(premiumBtn);
  }

  const navToggle = document.getElementById('navToggle');
  const navModal = document.getElementById('navModal');

  if (!navToggle || !navModal) return;

  // 3. UI Slide-out toggle listeners
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

  // 4. Highlight path matches via active-nav class
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
