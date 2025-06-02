import React, { useEffect, useState, useRef } from "react";
import SudokuBoard from "./SudokuBoard.jsx";
import useSocket from "../../hooks/useSocket.jsx";
import Button from "./Button.jsx";
import GameChat from "../ChatBox/GameChat.jsx";
import {
  INIT_GAME,
  SUDOKU_MOVE,
  SUDOKU_HINT,
  GAME_OVER,
  SUDOKU_CHECK,
  CHAT,
  SUDOKU_SOLVE,
} from "./constants.js";

export const GAME = "sudoku";

// Backend me hint, solve, generate, check ye sab individual game ke liye implement karenge aur 1v1 me ye sab nahi hoga
