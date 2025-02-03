// utils/parseOCRText.jsx
const parseOCRText = (text) => {
  const lines = text.split("\n").filter((line) => line.length > 0);
  const grid = Array.from({ length: 9 }, () => Array(9).fill(0));

  lines.forEach((line, rowIndex) => {
    const numbers = line
      .split("")
      .map((char) => (isNaN(char) ? 0 : parseInt(char)));
    numbers.forEach((num, colIndex) => {
      if (rowIndex < 9 && colIndex < 9) grid[rowIndex][colIndex] = num;
    });
  });

  return grid;
};

export default parseOCRText;
