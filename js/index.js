'use strict';

(function() {
  const fps = new FPSMeter({
    // decimals: 2,
    heat: true,
    graph: true,
    theme: 'colorful',
  });
  const canvas = document.getElementById('board');
  const ctx = canvas.getContext('2d');
  // const ctx = canvas.getContext('2d', { alpha: false });

  const game = new GameOfLife(50, 50);
  const cellLength = 10;   // In pixels at scale 1
  const center = [];

  window.game = game;

  // Ensure canvas stays full screen
  // May need to debounce this
  window.addEventListener('resize', fullScreenCanvas);
  function fullScreenCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    center[0] = Math.round(window.innerWidth / 2);
    center[1] = Math.round(window.innerHeight / 2);
  }
  fullScreenCanvas();

  function drawGrid() {
    // const center = [window.innerWidth / 2, window.innerHeight / 2];
    const centerOffset = [0, 0];

    if (game.cols % 2 !== 0) {
      centerOffset[0] = cellLength / 2;
    }

    if (game.rows % 2 !== 0) {
      centerOffset[1] = cellLength / 2;
    }

    ctx.beginPath();

    // Columns
    for (let i = 0; i <= game.cols; ++i) {
      const xOffset = i * cellLength - (game.cols * cellLength) / 2;
      const yOffset = (game.rows * cellLength) / 2;

      ctx.moveTo(center[0] + xOffset, center[1] - yOffset);
      ctx.lineTo(center[0] + xOffset, center[1] + yOffset);
    }

    // Rows
    for (let i = 0; i <= game.rows; ++i) {
      const xOffset = (game.cols * cellLength) / 2;
      const yOffset = i * cellLength - (game.rows * cellLength) / 2;

      ctx.moveTo(center[0] - xOffset, center[1] + yOffset);
      ctx.lineTo(center[0] + xOffset, center[1] + yOffset);
    }

    ctx.stroke();
  }

  function drawCells() {
    for (let row = 0; row < game.rows; ++row) {
      for (let col = 0; col < game.cols; ++col) {
        const x = center[0] - (game.cols * cellLength) / 2 + col * cellLength;
        const y = center[1] - (game.rows * cellLength) / 2 + row * cellLength;

        if (game.board[row][col]) {
          ctx.fillRect(x, y, cellLength, cellLength);
        }
      }
    }
  }

  let timer;
  window.pause = function() {
    clearInterval(timer);
  }

  window.speed = 200;

  window.start = function() {
    timer = setInterval(() => {
      game.tick();
    }, window.speed);
  }

  let lastRender = performance.now();
  function render(timestamp) {
    fps.tickStart();
    const delta = timestamp - lastRender;
    lastRender = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCells();
    drawGrid();
    fps.tick();
    window.requestAnimationFrame(render);
  }
  window.requestAnimationFrame(render);
})();

