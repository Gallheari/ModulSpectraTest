import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import './style.css';

const emotions = [
    { name: 'Radość', emoji: '😊' },
    { name: 'Smutek', emoji: '😢' },
    { name: 'Złość', emoji: '😠' },
    { name: 'Strach', emoji: '😨' },
    { name: 'Zaskoczenie', emoji: '😮' },
    { name: 'Wstyd', emoji: '😳' },
    { name: 'Zazdrość', emoji: '😏' },
    { name: 'Duma', emoji: '😎' },
    { name: 'Zmęczenie', emoji: '😴' },
    { name: 'Nuda', emoji: '😑' },
    { name: 'Ciekawość', emoji: '🤔' },
    { name: 'Miłość', emoji: '🥰' },
    { name: 'Spokój', emoji: '😌' },
    { name: 'Wstręt', emoji: '🤢' },
  ];

const Uczucia = () => {
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [options, setOptions] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const startGame = () => {
    setIsAnimating(false);
    const correctEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    let randomOptions = [correctEmotion];

    while (randomOptions.length < 4) {
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      if (!randomOptions.find(e => e.name === randomEmotion.name)) {
        randomOptions.push(randomEmotion);
      }
    }

    randomOptions = randomOptions.sort(() => Math.random() - 0.5);
    setCurrentEmotion(correctEmotion);
    setOptions(randomOptions);
    setMessage({ text: '', type: '' });
    setShowConfetti(false);
    setTimeout(() => setIsAnimating(true), 100); 
  };

  useEffect(() => {
    startGame();
  }, []);

  const checkAnswer = (emotionName) => {
    if (emotionName === currentEmotion.name) {
      setScore(prevScore => prevScore + 1);
      setMessage({ text: '💖 Doskonale! 💖', type: 'success' });
      setShowConfetti(true);
      setTimeout(() => {
        startGame();
      }, 2000);
    } else {
      setMessage({ text: 'Spróbuj jeszcze raz.', type: 'error' });
    }
  };

  return (
    <div className="uczuciacontainer">
        {showConfetti && <Confetti />}
      <div className="score-board">Punkty: {score}</div>
      <h1>Jaką emocję czujesz?</h1>
      {currentEmotion ? (
        <div className="game-container">
          <div className={`emoji ${isAnimating ? 'show' : ''}`}>{currentEmotion.emoji}</div>
          <div className="options">
            {options.map((emotion) => (
              <button key={emotion.name} onClick={() => checkAnswer(emotion.name)} className="option-button">
                {emotion.name}
              </button>
            ))}
          </div>
          {message.text && <p className={`message ${message.type}`}>{message.text}</p>}
        </div>
      ) : (
        <button onClick={startGame} className="start-button">Zacznij grę</button>
      )}
    </div>
  );
};

export default Uczucia;
