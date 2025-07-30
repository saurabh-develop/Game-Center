const createEmptyBoard = () => {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
};

// Check if placing a number is valid in the specified row and column
const isValidMove = (board, row, col, num) => {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) return false;
    }
  }
  return true;
};

// Suffuling the numbers
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Backtracking algorithm to solve the board
const fillBoard = (board) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        let numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (let num of numbers) {
          if (isValidMove(board, row, col, num)) {
            board[row][col] = num;
            if (fillBoard(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

const generateSolution = (board) => {
  if (!board || board.length !== 9 || board.some((row) => row.length !== 9)) {
    throw new Error("Invalid board passed to generateSolution");
  }

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValidMove(board, row, col, num)) {
            board[row][col] = num;
            if (generateSolution(board)) return true;
            board[row][col] = 0; // Backtrack
          }
        }
        return false; // No valid number found, backtrack
      }
    }
  }
  return true; // All cells filled
};

// Remove cells based on difficulty level to create the puzzle
const removeCells = (board, level) => {
  const newBoard = board.map((row) => [...row]);
  const attempts = level === "easy" ? 20 : level === "medium" ? 35 : 50;

  for (let i = 0; i < attempts; i++) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (newBoard[row][col] !== 0) {
      newBoard[row][col] = 0;
    }
  }
  return newBoard;
};

// Generate a new Sudoku puzzle based on difficulty level
const generateSudoku = (level) => {
  const board = createEmptyBoard();
  fillBoard(board);
  return removeCells(board, level);
};

export { generateSudoku, fillBoard, isValidMove, generateSolution };
