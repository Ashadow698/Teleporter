const player = document.getElementById('player');
const portals = document.querySelectorAll('.portal');
const walls = document.querySelectorAll('.wall');
const result = document.getElementById('result');

let x = 50;
let speed = 2;
let isAlive = true;

function checkCollision(rect1, rect2) {
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

function teleport(color, id) {
  portals.forEach(portal => {
    if (
      portal.dataset.color === color &&
      portal.dataset.id === id &&
      portal.getBoundingClientRect().left > player.getBoundingClientRect().right
    ) {
      x = portal.offsetLeft + 40; // just past the second portal
    }
  });
}

function gameLoop() {
  if (!isAlive) return;

  x += speed;
  player.style.left = x + 'px';

  // Check portal collision
  portals.forEach(portal => {
    if (checkCollision(player.getBoundingClientRect(), portal.getBoundingClientRect())) {
      teleport(portal.dataset.color, portal.dataset.id);
    }
  });

  // Check wall collision
  walls.forEach(wall => {
    if (checkCollision(player.getBoundingClientRect(), wall.getBoundingClientRect())) {
      result.textContent = "💥 You crashed!";
      isAlive = false;
    }
  });

  requestAnimationFrame(gameLoop);
}

gameLoop();
