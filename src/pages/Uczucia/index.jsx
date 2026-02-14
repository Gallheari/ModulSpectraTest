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

// Helper function to generate a new round's data
const generateNewRound = () => {
  const correctEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  let options = [correctEmotion];

  while (options.length < 4) {
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    if (!options.find(e => e.name === randomEmotion.name)) {
      options.push(randomEmotion);
    }
  }

  options = options.sort(() => Math.random() - 0.5);
  return { correctEmotion, options };
};


const Uczucia = () => {
  const [roundData, setRoundData] = useState(generateNewRound); // Lazy initialization
  const { correctEmotion, options } = roundData;
  const [message, setMessage] = useState({ text: '', type: '' });
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // This function is now used only to advance to the next round
  const startNewRound = () => {
    setIsAnimating(false);
    setRoundData(generateNewRound());
    setMessage({ text: '', type: '' });
    setShowConfetti(false);
    setTimeout(() => setIsAnimating(true), 100); 
  };

  // On initial mount, trigger the animation for the first emoji
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const checkAnswer = (emotionName) => {
    if (showConfetti) return; // Prevent multiple clicks after a correct answer

    if (emotionName === correctEmotion.name) {
      setScore(prevScore => prevScore + 1);
      setMessage({ text: '💖 Doskonale! 💖', type: 'success' });
      setShowConfetti(true);
      setTimeout(() => {
        startNewRound();
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
      {correctEmotion ? (
        <div className="game-container">
          <div className={`emoji ${isAnimating ? 'show' : ''}`}>{correctEmotion.emoji}</div>
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
        <p>Ładowanie gry...</p>
      )}
    </div>
  );
};

export default Uczucia;
