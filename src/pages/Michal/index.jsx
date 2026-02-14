
import React, { useState, useEffect, useRef } from 'react';
import './style.css';

const SuccessCelebration = ({ emoji }) => (
    <div className="celebration-overlay">
        <div className="celebration-emoji">{emoji}</div>
    </div>
);

const PrzepisywanieComponent = () => {
    const [words, setWords] = useState([
        { word: "słońce", emoji: "☀️" },
        { word: "książka", emoji: "📚" },
        { word: "drzewo", emoji: "🌳" },
        { word: "komputer", emoji: "💻" },
        { word: "chmura", emoji: "☁️" },
        { word: "kwiat", emoji: "🌸" },
        { word: "muzyka", emoji: "🎶" },
        { word: "tęcza", emoji: "🌈" },
        { word: "czekolada", emoji: "🍫" },
        { word: "przyjaciel", emoji: "😊" }
    ]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentAttempt, setCurrentAttempt] = useState('');
    const [score, setScore] = useState(0);
    const [isShaking, setIsShaking] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const inputRef = useRef(null);

    const currentWordData = words[currentIndex];
    const currentWord = currentWordData.word;
    const progress = (currentIndex / words.length) * 100;

    const handleInputChange = (e) => {
        const typedValue = e.target.value;
        if (currentWord.toLowerCase().startsWith(typedValue.toLowerCase())) {
            setCurrentAttempt(typedValue);
        } else {
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 400);
        }
    };

    const focusInput = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    useEffect(() => {
        if (!showSuccess) {
            focusInput();
        }
    }, [showSuccess, currentIndex]); // Re-focus when word changes too

    useEffect(() => {
        if (currentAttempt.toLowerCase() === currentWord.toLowerCase() && currentAttempt !== '') {
            setShowSuccess(true);
            setScore(prevScore => prevScore + 1);

            setTimeout(() => {
                setShowSuccess(false);
                if (currentIndex < words.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                    setCurrentAttempt('');
                } else {
                    setIsFinished(true);
                }
            }, 1500);
        }
    }, [currentAttempt, currentWord, currentIndex, words.length]);

    const restartGame = () => {
        const shuffledWords = [...words].sort(() => Math.random() - 0.5);
        setWords(shuffledWords);
        setCurrentIndex(0);
        setScore(0);
        setCurrentAttempt('');
        setShowSuccess(false);
        setIsFinished(false);
    };

    if (isFinished) {
        return (
            <div className="container final-screen">
                <h1>Gratulacje!</h1>
                <p className="final-score">Twój wynik: {score} / {words.length}</p>
                <div className="trophy">🏆</div>
                <button className="btn-restart" onClick={restartGame}>
                    Zagraj jeszcze raz
                </button>
            </div>
        );
    }

    return (
        <div className="container" onClick={focusInput}> {/* Kliknięcie gdziekolwiek skupia input */}
            {showSuccess && <SuccessCelebration emoji={currentWordData.emoji} />}
            <header>
                <h1>Przepisz Słowo!</h1>
                <div className="score">Punkty: <strong>{score}</strong></div>
            </header>

            <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="game-area">
                <p className="instruction-text">Przepisz słowo, które widzisz poniżej:</p>
                <div className={`word-to-copy ${isShaking ? 'shake-word' : ''}`}>
                    {currentWord.split('').map((char, index) => (
                        <span key={index} className={index < currentAttempt.length ? 'correct-char' : ''}>
                            {char}
                        </span>
                    ))}
                </div>

                {/* Nowy kontener na kratki */}
                <div className="char-input-container">
                    {currentWord.split('').map((char, index) => (
                        <div 
                            key={index} 
                            className={`char-box ${index === currentAttempt.length ? 'active' : ''} ${index < currentAttempt.length ? 'filled' : ''}`}>
                            {currentAttempt[index] || ''}
                        </div>
                    ))}
                </div>

                {/* Ukryty, ale wciąż działający input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={currentAttempt}
                    onChange={handleInputChange}
                    className="hidden-input"
                    autoFocus
                    disabled={showSuccess}
                    // Opcjonalne: dla lepszej obsługi na urządzeniach mobilnych
                    onBlur={() => { if (!showSuccess) focusInput(); }}
                />
            </div>
        </div>
    );
};

export default PrzepisywanieComponent;
