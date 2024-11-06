// components/GridInput.jsx
import React from "react";

const SudokuGrid = ({ grid }) => (
  <table style={{ borderCollapse: "collapse", margin: "10px 0" }}>
    <tbody>
      {grid.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {row.map((cell, colIndex) => (
            <td
              key={colIndex}
              style={{
                width: "30px",
                height: "30px",
                textAlign: "center",
                border: "1px solid #333",
              }}
            >
              {cell || ""}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default SudokuGrid;
