import React, { useState, useEffect } from 'react';
import './style.css';

const Zjadanie = () => {
  const [pacman, setPacman] = useState({ x: 1, y: 1 });
  const [board, setBoard] = useState([
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      let newX = pacman.x;
      let newY = pacman.y;

      if (e.key === 'ArrowUp') newY--;
      if (e.key === 'ArrowDown') newY++;
      if (e.key === 'ArrowLeft') newX--;
      if (e.key === 'ArrowRight') newX++;

      if (board[newY] && board[newY][newX] !== 1) {
        if (board[newY][newX] === 0) {
          setScore(score + 1);
          const newBoard = [...board];
          newBoard[newY][newX] = 2; // Mark as eaten
          setBoard(newBoard);
        }
        setPacman({ x: newX, y: newY });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pacman, board, score]);

  return (
    <div className="zjadanie-container">
      <h1>Zjadanie (Pac-Man)</h1>
      <div className="score">Punkty: {score}</div>
      <div className="board">
        {board.map((row, y) => (
          <div key={y} className="row">
            {row.map((cell, x) => (
              <div
                key={x}
                className={`cell ${cell === 1 ? 'wall' : ''} ${
                  pacman.x === x && pacman.y === y ? 'pacman' : ''
                } ${cell === 0 ? 'dot' : ''}`}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Zjadanie;