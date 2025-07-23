const game = document.getElementById('game');
const player = document.getElementById('player');
const result = document.getElementById('result');

let x = 50;
let y = window.innerHeight / 2;
let vy = 0;
let speed = 2;
let isAlive = true;

const colors = ['red', 'blue', 'green', 'purple'];
const portals = [];
const walls = [];

function createPortalPair(color, id) {
  const y1 = Math.random() * (window.innerHeight - 60);
  const y2 = Math.random() * (window.innerHeight - 60);
  const x1 = Math.random() * (window.innerWidth - 200) + 300;
  const x2 = Math.random() * (window.innerWidth - 200) + 800;

  const p1 = document.createElement('div');
  p1.className = `portal ${color}`;
  p1.dataset.color = color;
  p1.dataset.id = id;
  p1.style.left = `${x1}px`;
  p1.style.top = `${y1}px`;

  const p2 = document.createElement('div');
  p2.className = `portal ${color}`;
  p2.dataset.color = color;
  p2.dataset.id = id;
  p2.style.left = `${x2}px`;
  p2.style.top = `${y2}px`;

  game.appendChild(p1);
  game.appendChild(p2);
  portals.push(p1, p2);
}

function createWall(x, y) {
  const wall = document.createElement('div');
  wall.className = 'wall';
  wall.style.left = `${x}px`;
  wall.style.top = `${y}px`;
  game.appendChild(wall);
  walls.push(wall);
}

function randomizeLevel() {
  for (let i = 0; i < 4; i++) {
    createPortalPair(colors[i], i + 1);
  }

  for (let i = 0; i < 6; i++) {
    const wx = Math.random() * (window.innerWidth - 100) + 300;
    const wy = Math.random() * (window.innerHeight - 200);
    createWall(wx, wy);
  }
}

function checkCollision(rect1, rect2) {
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

function teleport(color, id) {
  const currentPortal = portals.find(
    portal =>
      portal.dataset.color === color &&
      portal.dataset.id === id &&
      checkCollision(player.getBoundingClientRect(), portal.getBoundingClientRect())
  );

  if (currentPortal) {
    const pair = portals.find(
      portal =>
        portal.dataset.color === color &&
        portal.dataset.id === id &&
        portal !== currentPortal
    );
    if (pair) {
      x = pair.offsetLeft + 40;
      y = pair.offsetTop;
    }
  }
}

function gameLoop() {
  if (!isAlive) return;

  x += speed;
  y += vy;

  // Keep player on screen
  y = Math.max(0, Math.min(window.innerHeight - 40, y));

  player.style.left = x + 'px';
  player.style.top = y + 'px';

  // Portal check
  portals.forEach(portal => {
    teleport(portal.dataset.color, portal.dataset.id);
  });

  // Wall check
  walls.forEach(wall => {
    if (checkCollision(player.getBoundingClientRect(), wall.getBoundingClientRect())) {
      result.textContent = "💥 You hit a wall!";
      isAlive = false;
    }
  });

  requestAnimationFrame(gameLoop);
}

// Keyboard controls
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp') vy = -5;
  if (e.key === 'ArrowDown') vy = 5;
});

document.addEventListener('keyup', e => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') vy = 0;
});

randomizeLevel();
gameLoop();
