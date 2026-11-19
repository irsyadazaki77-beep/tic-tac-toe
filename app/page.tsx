"use client";

import { useState } from "react";

type Player = "X" | "O";
type SquareValue = Player | null;

const themes = [
  { id: "classic", name: "Classic (X / O)", X: "X", O: "O" },
  { id: "emoji", name: "Cats vs Dogs (🐱 / 🐶)", X: "🐱", O: "🐶" },
  { id: "food", name: "Pizza vs Burger (🍕 / 🍔)", X: "🍕", O: "🍔" },
];

function calculateWinner(squares: SquareValue[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a] as Player,
        line: lines[i],
      };
    }
  }

  return null;
}

interface SquareProps {
  value: string;
  player: SquareValue;
  isWinning: boolean;
  disabled: boolean;
  onClick: () => void;
}

function Square({ value, player, isWinning, disabled, onClick }: SquareProps) {
  let colorClass = "";
  if (player === "X") colorClass = "text-blue-600";
  if (player === "O") colorClass = "text-red-500";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-24 h-24 text-4xl font-bold rounded-lg border-2 flex items-center justify-center transition-colors ${
        isWinning
          ? "bg-green-100 border-green-500"
          : "bg-white border-gray-300 hover:bg-gray-50"
      } ${colorClass} ${disabled ? "cursor-default" : "cursor-pointer"}`}
    >
      {value}
    </button>
  );
}

export default function Home() {
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [themeId, setThemeId] = useState("classic");
  const [xScore, setXScore] = useState(0);
  const [oScore, setOScore] = useState(0);
  const [drawScore, setDrawScore] = useState(0);

  const activeTheme = themes.find((t) => t.id === themeId) || themes[0];

  const result = calculateWinner(squares);
  const winner = result ? result.winner : null;
  const winningLine = result ? result.line : [];
  const isDraw = !winner && squares.every((sq) => sq !== null);

  function handleClick(index: number) {
    if (squares[index] || winner) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[index] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);

    const nextResult = calculateWinner(nextSquares);
    if (nextResult) {
      if (nextResult.winner === "X") {
        setXScore((prev) => prev + 1);
      } else {
        setOScore((prev) => prev + 1);
      }
    } else if (nextSquares.every((sq) => sq !== null)) {
      setDrawScore((prev) => prev + 1);
    }
  }

  function handleNewGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  function handleResetScore() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setXScore(0);
    setOScore(0);
    setDrawScore(0);
  }

  let status = `Next Player: ${xIsNext ? activeTheme.X : activeTheme.O}`;
  if (winner) {
    status = `Winner: ${activeTheme[winner]}!`;
  } else if (isDraw) {
    status = "It's a Draw!";
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Tic-Tac-Toe
        </h1>

        <div className="mb-4">
          <label
            htmlFor="theme-select"
            className="block text-xs font-medium text-gray-500 mb-1"
          >
            Theme
          </label>
          <select
            id="theme-select"
            value={themeId}
            onChange={(e) => setThemeId(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white text-gray-700"
          >
            {themes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-md py-2">
            <p className="text-xs text-blue-600 font-medium">
              Player {activeTheme.X}
            </p>
            <p className="text-lg font-bold text-blue-700">{xScore}</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-md py-2">
            <p className="text-xs text-gray-500 font-medium">Draw</p>
            <p className="text-lg font-bold text-gray-700">{drawScore}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-md py-2">
            <p className="text-xs text-red-500 font-medium">
              Player {activeTheme.O}
            </p>
            <p className="text-lg font-bold text-red-600">{oScore}</p>
          </div>
        </div>

        <p
          className={`text-center font-semibold text-base mb-4 py-1.5 rounded-md ${
            winner
              ? "bg-green-100 text-green-700"
              : isDraw
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {status}
        </p>

        <div className="grid grid-cols-3 gap-2 justify-items-center mb-5">
          {squares.map((sq, index) => (
            <Square
              key={index}
              value={sq ? activeTheme[sq] : ""}
              player={sq}
              isWinning={winningLine.includes(index)}
              disabled={Boolean(sq) || Boolean(winner) || isDraw}
              onClick={() => handleClick(index)}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleNewGame}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md text-sm cursor-pointer"
          >
            New Game
          </button>
          <button
            onClick={handleResetScore}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md text-sm cursor-pointer"
          >
            Reset Score
          </button>
        </div>
      </div>
    </main>
  );
}
