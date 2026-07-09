document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.settings-card');
  const buttons = document.querySelectorAll('.settings-item');

  function switchSettingsPage(target) {
    cards.forEach((card) => {
      const isActive = card.id === `settings-${target}`;
      card.classList.toggle('hidden', !isActive);
    });

    buttons.forEach((button) => {
      button.classList.toggle('active', button.dataset.target === target);
    });
  }

  window.switchSettingsPage = switchSettingsPage;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      switchSettingsPage(button.dataset.target);
    });
  });
});
