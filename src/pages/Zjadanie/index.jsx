import React, { useState, useEffect, useCallback } from 'react';
import './style.css';

const GameBoard = ({ board, pacman, ghosts, powerUp }) => (
  <div className="board">
    {board.flatMap((row, y) => 
      row.map((cell, x) => {
        const isPacman = pacman.x === x && pacman.y === y;
        const ghost = ghosts.find(g => g.x === x && g.y === y);
        return (
          <div
            key={`${y}-${x}`}
            className={`cell ${cell === 1 ? 'wall' : ''}`}>
            {isPacman ? (
              <div className={`pacman ${pacman.direction}`}></div>
            ) : ghost ? (
              <div className={`ghost ${powerUp ? 'scared' : ghost.color}`}>
                <div className="eyes">
                  <div className="eye"><div className="pupil"></div></div>
                  <div className="eye"><div className="pupil"></div></div>
                </div>
              </div>
            ) : cell === 0 ? (
              <div className="dot"></div>
            ) : cell === 3 ? (
              <div className="power-pellet"></div>
            ) : null}
          </div>
        );
      })
    )}
  </div>
);

const Zjadanie = () => {
  const [pacman, setPacman] = useState({ x: 1, y: 1, direction: 'right' });
  const [ghosts, setGhosts] = useState([
    { id: 1, x: 8, y: 8, color: 'red' },
    { id: 2, x: 1, y: 8, color: 'pink' },
    { id: 3, x: 8, y: 1, color: 'cyan' },
  ]);
  const [board, setBoard] = useState([
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 1, 0, 0, 3, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 3, 0, 0, 0, 0, 0, 0, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ]);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'gameOver'
  const [powerUp, setPowerUp] = useState(false);

  const resetGame = () => {
    setPacman({ x: 1, y: 1, direction: 'right' });
    setGhosts([
        { id: 1, x: 8, y: 8, color: 'red' },
        { id: 2, x: 1, y: 8, color: 'pink' },
        { id: 3, x: 8, y: 1, color: 'cyan' },
    ]);
    setBoard([
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 1, 0, 0, 3, 1],
      [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
      [1, 3, 0, 0, 0, 0, 0, 0, 3, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]);
    setScore(0);
    setGameState('start');
    setPowerUp(false);
  };

  const handleKeyDown = useCallback((e) => {
    if (gameState !== 'playing') return;

    let newX = pacman.x;
    let newY = pacman.y;
    let newDirection = pacman.direction;

    if (e.key === 'ArrowUp') { newY--; newDirection = 'up'; }
    if (e.key === 'ArrowDown') { newY++; newDirection = 'down'; }
    if (e.key === 'ArrowLeft') { newX--; newDirection = 'left'; }
    if (e.key === 'ArrowRight') { newX++; newDirection = 'right'; }

    if (board[newY] && board[newY][newX] !== 1) {
      let newScore = score;
      const newBoard = [...board];
      if (newBoard[newY][newX] === 0) {
        newScore += 10;
        newBoard[newY][newX] = 2;
      } else if (newBoard[newY][newX] === 3) {
        newScore += 50;
        newBoard[newY][newX] = 2;
        setPowerUp(true);
        setTimeout(() => setPowerUp(false), 5000);
      }
      setScore(newScore);
      setBoard(newBoard);
      setPacman({ x: newX, y: newY, direction: newDirection });

      // Sprawdź kolizję z duchami zaraz po ruchu Pac-Mana
      const collision = ghosts.some(ghost => ghost.x === newX && ghost.y === newY);
      if (collision && !powerUp) {
        setGameState('gameOver');
        return;
      }

      if (!newBoard.flat().some(cell => cell === 0 || cell === 3)) {
        setGameState('gameOver');
      }
    }
  }, [pacman, board, score, gameState, ghosts, powerUp]);

  useEffect(() => {
    if (gameState === 'playing') {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleKeyDown]);

  // Ghost Movement - ścigają Pac-Mana
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
        setGhosts(prevGhosts =>
            prevGhosts.map(ghost => {
                let newX = ghost.x;
                let newY = ghost.y;
                
                // Oblicz różnicę pozycji
                const dx = pacman.x - ghost.x;
                const dy = pacman.y - ghost.y;
                
                // Jeśli jest power-up, duchy uciekają
                if (powerUp) {
                    // Uciekaj w przeciwnym kierunku
                    if (Math.abs(dx) > Math.abs(dy)) {
                        if (dx > 0 && board[newY]?.[newX - 1] !== 1) newX--; // Uciekaj w lewo
                        else if (dx < 0 && board[newY]?.[newX + 1] !== 1) newX++; // Uciekaj w prawo
                        else if (dy > 0 && board[newY - 1]?.[newX] !== 1) newY--; // Uciekaj w górę
                        else if (dy < 0 && board[newY + 1]?.[newX] !== 1) newY++; // Uciekaj w dół
                    } else {
                        if (dy > 0 && board[newY - 1]?.[newX] !== 1) newY--; // Uciekaj w górę
                        else if (dy < 0 && board[newY + 1]?.[newX] !== 1) newY++; // Uciekaj w dół
                        else if (dx > 0 && board[newY]?.[newX - 1] !== 1) newX--; // Uciekaj w lewo
                        else if (dx < 0 && board[newY]?.[newX + 1] !== 1) newX++; // Uciekaj w prawo
                    }
                } else {
                    // Normalnie: ścigaj Pac-Mana
                    if (Math.abs(dx) > Math.abs(dy)) {
                        // Poruszaj się poziomo w stronę Pac-Mana
                        if (dx > 0 && board[newY]?.[newX + 1] !== 1) newX++;
                        else if (dx < 0 && board[newY]?.[newX - 1] !== 1) newX--;
                        else if (dy > 0 && board[newY + 1]?.[newX] !== 1) newY++;
                        else if (dy < 0 && board[newY - 1]?.[newX] !== 1) newY--;
                    } else {
                        // Poruszaj się pionowo w stronę Pac-Mana
                        if (dy > 0 && board[newY + 1]?.[newX] !== 1) newY++;
                        else if (dy < 0 && board[newY - 1]?.[newX] !== 1) newY--;
                        else if (dx > 0 && board[newY]?.[newX + 1] !== 1) newX++;
                        else if (dx < 0 && board[newY]?.[newX - 1] !== 1) newX--;
                    }
                }

                return { ...ghost, x: newX, y: newY };
            })
        );
    }, 400);

    return () => clearInterval(gameLoop);
  }, [gameState, board, pacman, powerUp]);

  // Collision Detection
  useEffect(() => {
    if (gameState !== 'playing') return;

    let collided = false;
    ghosts.forEach(ghost => {
        if (ghost.x === pacman.x && ghost.y === pacman.y) {
            if (powerUp) {
                setScore(s => s + 100);
                setGhosts(gs => gs.filter(g => g.id !== ghost.id));
            } else {
                collided = true;
            }
        }
    });

    if (collided) {
        setGameState('gameOver');
    }
  }, [pacman, ghosts, powerUp, gameState]);

  return (
    <div className="zjadanie-container">
      <h1>Zjadanie (Pac-Man)</h1>
      {gameState === 'start' && (
        <button className="start-button" onClick={() => setGameState('playing')}>
          Start Gry
        </button>
      )}
      {gameState === 'playing' && (
        <>
          <div className="score">Punkty: {score}</div>
          <GameBoard board={board} pacman={pacman} ghosts={ghosts} powerUp={powerUp} />
        </>
      )}
      {gameState === 'gameOver' && (
        <>
          <div className="game-over">Koniec Gry</div>
          <div className="score">Ostateczny wynik: {score}</div>
          <button className="start-button" onClick={resetGame}>
            Zagraj Ponownie
          </button>
        </>
      )}
    </div>
  );
};

export default Zjadanie;