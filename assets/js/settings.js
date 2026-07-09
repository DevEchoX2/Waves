document.addEventListener('DOMContentLoaded', () => {
  const allPages = document.querySelectorAll('.settings-page');
  const allButtons = document.querySelectorAll('.settings-section');

  function switchSettingsPage(target) {
    allPages.forEach(page => {
      page.classList.toggle('settings-active', page.id === `settings-${target}`);
    });
    allButtons.forEach(button => {
      button.classList.toggle('settings-active', button.dataset.target === target);
    });
  }

  window.switchSettingsPage = switchSettingsPage;

  document.querySelectorAll('.settings-section').forEach(button => {
    button.addEventListener('click', () => {
      switchSettingsPage(button.dataset.target);
    });
  });
});
