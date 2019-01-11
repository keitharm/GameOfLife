'use strict';

class Board {
  constructor(canvas, game, styles = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.game = game;
    this.center = [];
    this.panOffset = [0, 0];

    // Set default styles
    this.styles = Object.assign({
      color: '#BFBFBF',
      background: '#FFFFFF',
      lineWidth: 1,   // In pixels
      cellLength: 10,  // In pixels
    }, styles);
  }

  drawBackground() {
    const { cellLength, background } = this.styles;

    this.ctx.save();
    this.ctx.fillStyle = background;
    this.ctx.fillRect(this.center[0] - (this.game.cols * cellLength) / 2 + this.panOffset[0],
      this.center[1] - (this.game.rows * cellLength) / 2 + this.panOffset[1],
      this.game.cols * cellLength, this.game.rows * cellLength);

    this.ctx.restore();
  }

  /**
   * Draws the board itself
   */
  drawGrid() {
    const { cellLength, color, lineWidth } = this.styles;
    const center = this.center;

    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();

    // Columns
    for (let i = 0; i <= this.game.cols; ++i) {
      const xOffset = i * cellLength - (this.game.cols * cellLength) / 2 + this.panOffset[0];
      const yOffset = (this.game.rows * cellLength) / 2 + this.panOffset[1];

      this.ctx.moveTo(center[0] + xOffset, center[1] - yOffset);
      this.ctx.lineTo(center[0] + xOffset, center[1] + yOffset);
    }

    // Rows
    for (let i = 0; i <= this.game.rows; ++i) {
      const xOffset = (this.game.cols * cellLength) / 2 + this.panOffset[0];
      const yOffset = i * cellLength - (this.game.rows * cellLength) / 2 + this.panOffset[1];

      this.ctx.moveTo(center[0] - xOffset, center[1] + yOffset);
      this.ctx.lineTo(center[0] + xOffset, center[1] + yOffset);
    }

    this.ctx.stroke();
    this.ctx.restore();
  }

  /**
   * Draws all cells on the board.
   */
  drawCells() {
    const { cellLength, background, color, lineWidth } = this.styles;
    const center = this.center;

    this.ctx.save();

    // Fill in live cells
    for (let row = 0; row < this.game.rows; ++row) {
      for (let col = 0; col < this.game.cols; ++col) {
        const x = center[0] - (this.game.cols * cellLength) / 2 + col * cellLength + this.panOffset[0];
        const y = center[1] - (this.game.rows * cellLength) / 2 + row * cellLength + this.panOffset[1];

        if (this.game.board[row][col]) {
          this.ctx.fillRect(x + lineWidth, y + lineWidth, cellLength - 2 * lineWidth,
            cellLength - 2 * lineWidth);
        }
      }
    }

    this.ctx.restore();
  }

  // Move the grid by the specified amount
  pan(x, y) {
    this.panOffset[0] += x;
    this.panOffset[1] += y;
  }

  fillCell(x, y) {
    // const x = center[0] - (this.game.cols * cellLength) / 2 + col * cellLength + this.panOffset[0];
    // const y = center[1] - (this.game.rows * cellLength) / 2 + row * cellLength + this.panOffset[1];

    // this.game.fillCell(row, col);
  }

  // Draws the initial state of the board
  init() {
    this.drawBackground();
    this.drawGrid();
  }

  render() {
    this.drawBackground();
    this.drawCells();
    this.drawGrid();
  }
}
