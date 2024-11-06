import React from "react";

const parseOCRText = (text) => {
  const lines = text.split("\n").filter((line) => line.trim() !== "");
  const grid = lines.map((line) =>
    line.split(/\s+/).map((num) => parseInt(num, 10) || 0)
  );
  return grid;
};

export default parseOCRText;
