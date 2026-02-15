import React, { useState, useMemo, useCallback } from 'react';
import './style.css';

const questions = [
    { Symbol: "🍎", Correct: "Jabłko", Options: ["Jabłko", "Banan", "Pomarańcza", "Gruszka"] },
    { Symbol: "🐱", Correct: "Kot", Options: ["Pies", "Kot", "Królik", "Mysz"] },
    { Symbol: "🚗", Correct: "Samochód", Options: ["Rower", "Autobus", "Samochód", "Pociąg"] },
    { Symbol: "⚽", Correct: "Piłka", Options: ["Piłka", "Kostka", "Lalka", "Klocki"] },
    { Symbol: "🌞", Correct: "Słońce", Options: ["Księżyc", "Gwiazda", "Słońce", "Chmura"] },
    { Symbol: "🏠", Correct: "Dom", Options: ["Szkoła", "Dom", "Sklep", "Park"] },
    { Symbol: "📚", Correct: "Książka", Options: ["Książka", "Zeszyt", "Kredki", "Długopis"] },
    { Symbol: "🎈", Correct: "Balon", Options: ["Piłka", "Balon", "Bańka", "Kula"] },
    { Symbol: "🍕", Correct: "Pizza", Options: ["Burger", "Pizza", "Kanapka", "Hot dog"] },
    { Symbol: "🎵", Correct: "Muzyka", Options: ["Muzyka", "Taniec", "Śpiew", "Dźwięk"] }
];

const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

const getInitialState = (index = 0) => ({
    currentQuestionIndex: index,
    answered: false,
    feedbackMessage: '',
    feedbackClass: '',
    currentOptions: shuffle([...questions[index].Options]),
});


function Symbole() {
    const [gameState, setGameState] = useState(getInitialState(0));
    const [score, setScore] = useState(0);
    const [stars, setStars] = useState(1);
    const [isGameFinished, setIsGameFinished] = useState(false);
    const [showCelebrationClass, setShowCelebrationClass] = useState(false);
    const [celebrationEmoji, setCelebrationEmoji] = useState('🎉');

    const { currentQuestionIndex, answered, feedbackMessage, feedbackClass, currentOptions } = gameState;
    const currentQuestion = useMemo(() => questions[currentQuestionIndex], [currentQuestionIndex]);

    const starDisplay = useMemo(() => {
        const starCount = Math.min(Math.floor(stars / 2), 5);
        return '⭐'.repeat(starCount) || '⭐';
    }, [stars]);

    const showCelebration = useCallback(() => {
        const emojis = ["🎉", "🌟", "✨", "🎊", "🏆"];
        setCelebrationEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
        setShowCelebrationClass(true);
        setTimeout(() => setShowCelebrationClass(false), 1000);
    }, []);

    const checkAnswer = (selectedOption) => {
        if (answered) return;

        const isCorrect = selectedOption === currentQuestion.Correct;
        setGameState(prev => ({
            ...prev,
            answered: true,
            feedbackMessage: isCorrect ? "🎉 Wspaniale! Brawo!" : "💪 Spróbuj następne!",
            feedbackClass: isCorrect ? 'success' : 'error',
        }));
        
        if (isCorrect) {
            setScore(prev => prev + 10);
            setStars(prev => prev + 1);
            showCelebration();
        }
    };

    const nextQuestion = () => {
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < questions.length) {
            setGameState(getInitialState(nextIndex));
        } else {
            setIsGameFinished(true);
        }
    };

    const restartGame = () => {
        setScore(0);
        setStars(1);
        setIsGameFinished(false);
        setGameState(getInitialState(0));
    };

    const progress = useMemo(() => ((currentQuestionIndex + 1) / questions.length) * 100, [currentQuestionIndex]);

    if (isGameFinished) {
        return (
            <div className="container">
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <div style={{ fontSize: '4em', marginBottom: '30px' }}>🎉</div>
                    <h2 style={{ fontSize: '2.5em', color: '#f5576c', marginBottom: '20px' }}>
                        Ukończyłeś wszystkie zadania!
                    </h2>
                    <div style={{ fontSize: '2em', marginBottom: '20px' }}>
                        Twoje punkty: <strong style={{ color: '#4CAF50' }}>{score}</strong>
                    </div>
                    <div style={{ fontSize: '3em', marginBottom: '40px' }}>
                        {starDisplay}
                    </div>
                    <button className="next-button" onClick={restartGame}>
                        🔄 Zagraj ponownie
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="header">
                <h1>🎯 Rozpoznaj Symbol!</h1>
            </div>

            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="score-container">
                <div className="score-box">
                    Punkty: <span>{score}</span>
                </div>
                <div className="score-box stars">
                    <span>{starDisplay}</span>
                </div>
            </div>

            <div className="game-area">
                <div className="game-left">
                    <div className="symbol-display">
                        <div className="symbol-icon">{currentQuestion.Symbol}</div>
                        <div className="question">Co to jest?</div>
                    </div>
                </div>
                <div className="game-right">
                    <div className={`feedback ${feedbackClass}`}>{feedbackMessage}</div>
                    <div className="options-container">
                        {currentOptions.map((option, index) => (
                            <button key={index}
                                className={`option-button ${answered && (option === currentQuestion.Correct ? 'correct' : 'incorrect')}`}
                                onClick={() => checkAnswer(option)}
                                disabled={answered}>
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button className="next-button" onClick={nextQuestion} disabled={!answered || isGameFinished}>
                Następne ➡️
            </button>

            <div className={`celebration ${showCelebrationClass ? 'show' : ''}`}>{celebrationEmoji}</div>
        </div>
    );
}

export default Symbole;
