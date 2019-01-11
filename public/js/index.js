'use strict';

(function() {
  const boardCanvas = document.getElementById('board');
  const board = new Board(boardCanvas, gameEngine.game);

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
  // // gameEngine.addScene(ui);

  // // Set the active region for gesture registrations
  gestureEngine.setRegion(boardCanvas);

  // Pan the board (move it horizontally/vertically)
  gestureEngine.on('pan', (xDiff, yDiff) => {
    board.pan(xDiff, yDiff);
  });

  // Zoom in/out on the board
  // gestureEngine.on('pinch', (event) => {

  // });

  // Place Live Cell
  // gestureEngine.on('tap', (x, y) => {
  //   board.fillCell(x, y);
  // });
})();
