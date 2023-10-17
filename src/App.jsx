/* Hooks */
import { useState } from "react";

/* Components */
import { Square } from "./components/square/Square";
import { WinnerModal } from "./components/winner.js/WinnerModal";
import { Game } from "./components/game/Game";

/* Constants */
import { TURNS } from "./constants";

/* Logic */
import { checkWinnerFrom, checkEndGame } from "./logic/board";

/* Styles */
import "./App.css";
import confetti from "canvas-confetti";

const App = () => {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem("board");
    return boardFromStorage
      ? JSON.parse(boardFromStorage)
      : Array(9).fill(null);
  });

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem("turn");
    return turnFromStorage ?? TURNS.X;
  });
  //null es que no hay ganador, galse es que hay un empate
  const [winner, setWinner] = useState(null);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);
    window.localStorage.removeItem("board")
    window.localStorage.removeItem("turn")
  };

  const updateBoard = (index) => {
    if (board[index] || winner) return;

    //actualizar el tablero
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    //cambiar el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;

    //guardar aqui partida
    window.localStorage.setItem("board", JSON.stringify(newBoard));
    window.localStorage.setItem("turn", newTurn);
    setTurn(newTurn);

    //revisar si hay un ganador
    const newWinner = checkWinnerFrom(newBoard);
    if (newWinner) {
      confetti();
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false);
    }
  };

  return (
    <main className="board">
      <h1>Tic Tac Toe</h1>
      <button className="reset-game" onClick={resetGame}>
        Reset del juego
      </button>
      <Game board={board} updateBoard={updateBoard} />
      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>
      <WinnerModal winner={winner} resetGame={resetGame} />
    </main>
  );
};

export default App;
