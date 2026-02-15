import React, { useState, useCallback, useMemo } from 'react';
import './style.css';

const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

const NextQuestions = [
    { Pattern: ["🔴", "🔵", "🔴", "🔵", "🔴"], Options: ["🔵", "🔴", "🟡", "🟢"], Correct: "🔵", Difficulty: 1, Hint: "Czerwony i niebieski na zmianę" },
    { Pattern: ["⭐", "🌟", "⭐", "🌟", "⭐"], Options: ["🌟", "⭐", "💫", "✨"], Correct: "🌟", Difficulty: 1, Hint: "Dwie różne gwiazdki" },
    { Pattern: ["🍎", "🍎", "🍌", "🍎", "🍎"], Options: ["🍌", "🍎", "🍊", "🍇"], Correct: "🍌", Difficulty: 2, Hint: "Dwa jabłka, jeden banan" },
    { Pattern: ["🐶", "🐱", "🐭", "🐶", "🐱"], Options: ["🐭", "🐶", "🐰", "🐹"], Correct: "🐭", Difficulty: 2, Hint: "Pies, kot, mysz - powtórzenie" }
];

const ErrorQuestions = [
    { Pattern: ["🔴", "🔵", "🔴", "🟢", "🔴", "🔵"], ErrorIndex: 3, CorrectItem: "🔵", Difficulty: 1, Hint: "Powinno być: czerwony, niebieski, czerwony, niebieski..." },
    { Pattern: ["⭐", "⭐", "🌟", "⭐", "🌟", "🌟"], ErrorIndex: 4, CorrectItem: "⭐", Difficulty: 2, Hint: "Dwie gwiazdki, jedna inna" }
];

const CompleteQuestions = [
    { Pattern: ["🔴", null, "🔴", null, "🔴", null], CorrectAnswers: ["🔵", "🔵", "🔵"], AvailableItems: ["🔵", "🔴", "🟡", "🟢"], Difficulty: 1, Hint: "Czerwony i niebieski na zmianę" },
    { Pattern: ["⭐", "⭐", null, "⭐", "⭐", null], CorrectAnswers: ["🌟", "🌟"], AvailableItems: ["🌟", "⭐", "💫", "✨"], Difficulty: 2, Hint: "Dwie gwiazdki, jedna inna" }
];

const modeData = {
    next: { questions: NextQuestions, help: "Obserwuj wzorzec i wybierz, co powinno być dalej w sekwencji!", name: "Co jest dalej?" },
    error: { questions: ErrorQuestions, help: "Znajdź element, który nie pasuje do wzorca i kliknij na niego!", name: "Znajdź błąd" },
    complete: { questions: CompleteQuestions, help: "Kliknij puste miejsce, a potem wybierz co tam powinno być!", name: "Dokończ wzorzec" }
};

function Wzorce() {
    const [currentMode, setCurrentMode] = useState('next');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [stars, setStars] = useState(1);
    const [answered, setAnswered] = useState(false);
    const [isGameFinished, setIsGameFinished] = useState(false);
    const [isHelpVisible, setIsHelpVisible] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackClass, setFeedbackClass] = useState('');
    const [showCelebration, setShowCelebration] = useState(false);
    const [celebrationEmoji, setCelebrationEmoji] = useState('🎉');
    const [userAnswers, setUserAnswers] = useState({});
    const [selectedGap, setSelectedGap] = useState(null);

    const currentQuestions = useMemo(() => modeData[currentMode].questions, [currentMode]);
    const currentQuestion = useMemo(() => currentQuestions[currentQuestionIndex], [currentQuestions, currentQuestionIndex]);
    const currentOptions = useMemo(() => currentQuestion && currentQuestion.Options ? shuffle(currentQuestion.Options) : [], [currentQuestion]);

    const starDisplay = useMemo(() => '⭐'.repeat(Math.min(Math.floor(stars / 2), 5)) || '⭐', [stars]);
    const progress = (currentQuestionIndex + 1) / currentQuestions.length * 100;

    const runCelebration = useCallback(() => {
        const emojis = ["🎉", "✨", "🌟", "💫", "🎊"];
        setCelebrationEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 1000);
    }, []);

    const changeMode = (mode) => {
        setCurrentMode(mode);
        setCurrentQuestionIndex(0);
        setScore(0);
        setStars(1);
        setIsGameFinished(false);
        setAnswered(false);
        setUserAnswers({});
        setSelectedGap(null);
    };

    const handleAnswer = (correct) => {
        setAnswered(true);
        if (correct) {
            setFeedbackMessage('🎉 Doskonale!');
            setFeedbackClass('success');
            setScore(s => s + 10 + (currentQuestion.Difficulty * 5));
            setStars(s => s + 1);
            runCelebration();
        } else {
            setFeedbackMessage('💪 Następnym razem się uda!');
            setFeedbackClass('error');
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < currentQuestions.length - 1) {
            setCurrentQuestionIndex(i => i + 1);
            setAnswered(false);
            setUserAnswers({});
            setSelectedGap(null);
            setFeedbackMessage('');
        } else {
            setIsGameFinished(true);
        }
    };

    const checkComplete = () => {
        const correct = currentQuestion.CorrectAnswers.every((ans, i) => userAnswers[currentQuestion.Pattern.indexOf(null, i)] === ans);
        handleAnswer(correct);
    };

    const placeItemInGap = (item) => {
        if (selectedGap !== null) {
            setUserAnswers(ans => ({ ...ans, [selectedGap]: item }));
            setSelectedGap(null);
        }
    }

    const achievement = useMemo(() => {
        if (score >= 200) return "🏆 Mistrz Wzorców!";
        if (score >= 150) return "🌟 Ekspert Sekwencji!";
        if (score >= 100) return "⭐ Świetny Obserwator!";
        return "💪 Dobry Start!";
    }, [score]);

    if (isGameFinished) {
        return (
            <div className="patterns-container">
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <div style={{ fontSize: '5em', marginBottom: '30px' }}>🏆</div>
                    <h2 style={{ fontSize: '2.5em', color: '#f5576c', marginBottom: '20px' }}>Ukończyłeś tryb<br />{modeData[currentMode].name}!</h2>
                    <div style={{ fontSize: '2.5em', color: '#4CAF50', marginBottom: '20px', fontWeight: 'bold' }}>{achievement}</div>
                    <div style={{ fontSize: '2em', marginBottom: '20px' }}>Twoje punkty: <strong style={{ color: '#f5576c' }}>{score}</strong></div>
                    <div style={{ fontSize: '3em', marginBottom: '40px' }}>{starDisplay}</div>
                    <p style={{ fontSize: '1.3em', color: '#666', marginBottom: '30px' }}>Świetnie rozpoznajesz wzorce!<br />Spróbuj innych trybów! 🎨</p>
                    <button className="next-button" onClick={() => changeMode(currentMode)}>🔄 Zagraj ponownie</button>
                </div>
            </div>
        );
    }

    return (
        <div className="patterns-container">
                <div className="header">
                    <h1>🎨 Wzorce i Układy</h1>
                    <p>Odkryj magię powtarzających się sekwencji!</p>
                </div>
                <div className="mode-selector">
                    {Object.keys(modeData).map(mode => <button key={mode} className={`mode-button ${currentMode === mode ? 'active' : ''}`} onClick={() => changeMode(mode)}>{modeData[mode].name}</button>)}
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }}></div></div>
                <div className="score-container">
                    <div className="score-box">Punkty: <span>{score}</span></div>
                    <div className="score-box"><span>{starDisplay}</span></div>
                </div>
                <div className="game-area">
                    {currentQuestion && (
                        <>
                            <div className="difficulty-indicator">Poziom trudności: <span className="difficulty-stars">{'⭐'.repeat(currentQuestion.Difficulty)}</span></div>
                            <div className="question-text">{modeData[currentMode].name}</div>
                            <div className="pattern-hint">💡 {currentQuestion.Hint}</div>
                            <div className="pattern-display">
                                {currentQuestion.Pattern.map((item, i) => {
                                    if (item === null) {
                                        const userAnswer = userAnswers[i];
                                        return <div key={i} className={`pattern-item gap ${selectedGap === i ? 'selected' : ''} ${userAnswer ? 'filled' : ''}`} onClick={() => !answered && setSelectedGap(i)}>{userAnswer || '?'}</div>;
                                    }
                                    if (currentMode === 'error') {
                                        const isError = answered && i === currentQuestion.ErrorIndex;
                                        return <div key={i} className={`pattern-item clickable ${isError ? 'error' : ''}`} onClick={() => !answered && handleAnswer(i === currentQuestion.ErrorIndex)}>{item}</div>;
                                    }
                                    return <div key={i} className="pattern-item">{item}</div>;
                                })}
                                {currentMode === 'next' && <div className="pattern-item question-mark">?</div>}
                            </div>

                            {currentMode === 'next' && (
                                <div className="options-container">
                                    {currentOptions.map(opt => <div key={opt} className={`option-button ${answered ? (opt === currentQuestion.Correct ? 'correct' : 'disabled') : ''}`} onClick={() => !answered && handleAnswer(opt === currentQuestion.Correct)}>{opt}</div>)}
                                </div>
                            )}

                            {currentMode === 'complete' && (
                                <>
                                    <div className="available-items">
                                        {currentQuestion.AvailableItems.map(item => <div key={item} className={`available-item ${selectedGap !== null ? '' : 'used'}`} onClick={() => placeItemInGap(item)}>{item}</div>)}
                                    </div>
                                    <div className="button-group">
                                        <button className="reset-button" onClick={() => {setUserAnswers({}); setSelectedGap(null);}}>🔄 Zacznij od nowa</button>
                                        <button className="check-button" onClick={checkComplete} disabled={Object.keys(userAnswers).length !== currentQuestion.CorrectAnswers.length || answered}>✓ Sprawdź</button>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
                <div className={`feedback ${feedbackClass}`}>{feedbackMessage}</div>
                <button className="next-button" disabled={!answered || isGameFinished} onClick={handleNextQuestion}>Następne ➡️</button>
            <button className="help-button" onClick={() => setIsHelpVisible(v => !v)}>?</button>
            {isHelpVisible && <div className="tooltip show"><h3>Jak grać?</h3><p>{modeData[currentMode].help}</p></div>}
            {showCelebration && <div className="celebration show">{celebrationEmoji}</div>}
        </div>
    );
}

export default Wzorce;
