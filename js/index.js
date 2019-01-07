'use strict';

(function() {
  const boardCanvas = document.getElementById('board');
  const board = new Board(boardCanvas, gameEngine.game);

  let moved;

  // Enable dragging the board
  function dragBoard(event) {
    board.pan(event.movementX, event.movementY);
    moved = true;
  }

  boardCanvas.addEventListener('mousedown', (event) => {
    // Trigger panning on right click
    if (event.button === 2) {
      boardCanvas.addEventListener('mousemove', dragBoard);
    }
  });

  boardCanvas.addEventListener('mouseup', (event) => {
    if (event.button === 2) {
      boardCanvas.removeEventListener('mousemove', dragBoard);
    }
  });

  // Only display context menu if right click wasn't used for panning
  boardCanvas.addEventListener('contextmenu', (event) => {
    if (moved) {
      event.preventDefault();
      moved = false;
    }
  });

  // Ensure canvas stays full screen
  // May need to debounce this
  window.addEventListener('resize', fullScreenCanvas);
  function fullScreenCanvas() {
    boardCanvas.width = window.innerWidth;
    boardCanvas.height = window.innerHeight;
    board.center = [Math.round(window.innerWidth / 2), Math.round(window.innerHeight / 2)];
  }
  fullScreenCanvas();

  board.init();
  gameEngine.addScene(board);
  // gameEngine.addScene(ui);
})();
