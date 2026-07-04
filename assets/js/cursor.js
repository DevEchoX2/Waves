const customCursor = document.createElement('div');
customCursor.className = 'custom-cursor cursor--idle';
document.body.appendChild(customCursor);

let lastX = 0;
let lastY = 0;
let isPointerDown = false;

function updateCursorPosition(x, y) {
  customCursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
}

function updateCursorState(isClickable) {
  if (isClickable) {
    customCursor.classList.add('cursor--clickable');
    customCursor.classList.remove('cursor--idle');
  } else {
    customCursor.classList.remove('cursor--clickable');
    customCursor.classList.add('cursor--idle');
  }
}

window.addEventListener('mousemove', (event) => {
  lastX = event.clientX;
  lastY = event.clientY;
  updateCursorPosition(lastX, lastY);
});

window.addEventListener('mousedown', () => {
  isPointerDown = true;
  customCursor.style.transform = `translate(${lastX}px, ${lastY}px) translate(-50%, -50%) scale(0.93)`;
});

window.addEventListener('mouseup', () => {
  isPointerDown = false;
  updateCursorPosition(lastX, lastY);
});

const pointerTargets = ['button', 'a', 'input', 'textarea', 'select', '[role="button"]'];

function handlePointerTarget(event) {
  let target = event.target;
  const isClickable = pointerTargets.some((selector) => target.closest(selector));
  updateCursorState(isClickable);
}

window.addEventListener('mousemove', handlePointerTarget);
window.addEventListener('mouseover', handlePointerTarget);
window.addEventListener('mouseout', handlePointerTarget);

window.addEventListener('mouseleave', () => {
  customCursor.style.opacity = '0';
});

window.addEventListener('mouseenter', () => {
  customCursor.style.opacity = '0.98';
});
