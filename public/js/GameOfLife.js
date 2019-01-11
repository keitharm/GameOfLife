'use strict';

/**
 * Conway's Game of Life (https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)
 * 
 * Grid is zero-indexed. Rows start from the top and go down. Columns from left to right.
 * E.g.
 *    0 1 2
 * 0 |_|_|_|
 * 1 |_|_|_| 
 * 2 |_|_|_| 
 * 3 |_|_|_| 
 */
class GameOfLife {
  constructor(rows = 1, cols = 1) {
    this.rows = rows;
    this.cols = cols;

    this.reset();
  }

  reset() {
    this.board = [];
    for (let i = 0; i < this.rows; ++i) {
      this.board.push([]);
    }
  }

  /**
   * Helper function that determines whether the provided row and column are valid for this game board.
   * @param {Number} row 
   * @param {Number} col 
   * @returns {Boolean}
   */
  withinBounds(row, col) {
    return Number.isInteger(row) && Number.isInteger(col) &&
      row >= 0 && row < this.rows &&
      col >= 0 && col < this.cols;
  }

  /**
   * Sets a cell's status as alive.
   * @param {Integer} row 
   * @param {Integer} col 
   */
  fillCell(row, col) {
    if (this.withinBounds(row, col)) {
      this.board[row][col] = true;
    }
  }

  /**
   * Returns the number of live cells that neighbor the designated row/col.
   * @returns {Number}
   */
  getNeighbors(row, col) {
    let neighbors = 0;

    for (let i = row - 1; i <= row + 1; ++i) {
      for (let j = col - 1; j <= col + 1; ++j) {
        if ((i !== row || j !== col) && this.withinBounds(i, j) && this.board[i][j]) {
          ++neighbors;
        }
      }
    }

    return neighbors;
  }

  /**
   * Runs the ruleset on all cells
   * 
   * Ruleset (https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#Rules):
   *   - Any live cell with fewer than two live neighbors dies, as if by underpopulation.
   *   - Any live cell with two or three live neighbors lives on to the next generation.
   *   - Any live cell with more than three live neighbors dies, as if by overpopulation.
   *   - Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
   */
  tick() {
    const delta = [];
    for (let i = 0; i < this.rows; ++i) {
      delta.push([]);
    }

    // Calculate delta
    for (let row = 0; row < this.rows; ++row) {
      for (let col = 0; col < this.cols; ++col) {
        const neighbors = this.getNeighbors(row, col);

        if (this.board[row][col]) {
          if (neighbors < 2 || neighbors > 3) {
            delta[row][col] = false;
          }
        } else if (neighbors === 3) {
          delta[row][col] = true;
        }
      }
    }

    // Apply delta
    delta.forEach((row, rowIdx) =>
      row.forEach((cell, colIdx) =>
        cell !== undefined && (this.board[rowIdx][colIdx] = cell)));
  }
}
