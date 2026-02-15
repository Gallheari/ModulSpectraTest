import React, { useState, useMemo, useCallback } from 'react';
import './style.css';

const sequenceStories = [
    { Title: "Mycie rąk", Steps: [
        { Emoji: "🚰", Text: "Odkręć wodę", Order: 1 },
        { Emoji: "🧼", Text: "Weź mydło", Order: 2 },
        { Emoji: "🤲", Text: "Myj ręce", Order: 3 },
        { Emoji: "🧻", Text: "Wytrzyj ręce", Order: 4 }
    ]},
    { Title: "Sadzenie kwiatka", Steps: [
        { Emoji: "🌱", Text: "Weź nasiono", Order: 1 },
        { Emoji: "⛏️", Text: "Wykop dziurę", Order: 2 },
        { Emoji: "🪴", Text: "Posadź nasiono", Order: 3 },
        { Emoji: "💧", Text: "Podlej wodą", Order: 4 }
    ]},
    { Title: "Przygotowanie kanapki", Steps: [
        { Emoji: "🍞", Text: "Weź chleb", Order: 1 },
        { Emoji: "🧈", Text: "Posmaruj masłem", Order: 2 },
        { Emoji: "🧀", Text: "Dodaj ser", Order: 3 },
        { Emoji: "🥪", Text: "Przykryj chlebem", Order: 4 }
    ]},
    { Title: "Ubieranie się rano", Steps: [
        { Emoji: "🛏️", Text: "Wstań z łóżka", Order: 1 },
        { Emoji: "👕", Text: "Załóż koszulkę", Order: 2 },
        { Emoji: "👖", Text: "Załóż spodnie", Order: 3 },
        { Emoji: "👟", Text: "Załóż buty", Order: 4 }
    ]},
    { Title: "Piec ciasteczka", Steps: [
        { Emoji: "🥣", Text: "Przygotuj ciasto", Order: 1 },
        { Emoji: "🔪", Text: "Wykrój kształty", Order: 2 },
        { Emoji: "🔥", Text: "Piecz w piekarniku", Order: 3 },
        { Emoji: "🍪", Text: "Ciasteczka gotowe", Order: 4 }
    ] }
];

const predictionStories = [
    { Sequence: [{ Emoji: "☁️", Text: "Chmury na niebie" }, { Emoji: "⚡", Text: "Słychać grzmot" }], Question: "Co się teraz stanie?", Correct: "Zacznie padać", Options: [{ Emoji: "🌧️", Text: "Zacznie padać" }, { Emoji: "🌞", Text: "Wyjdzie słońce" }, { Emoji: "🌈", Text: "Pojawi się tęcza" }] },
    { Sequence: [{ Emoji: "🍎", Text: "Trzymasz jabłko" }, { Emoji: "😋", Text: "Jesteś głodny" }], Question: "Co zrobisz?", Correct: "Zjesz jabłko", Options: [{ Emoji: "🍽️", Text: "Zjesz jabłko" }, { Emoji: "🗑️", Text: "Wyrzucisz je" }, { Emoji: "🎨", Text: "Narysujesz je" }] },
    { Sequence: [{ Emoji: "⚽", Text: "Kopiesz piłkę" }, { Emoji: "🪟", Text: "Piłka leci w okno" }], Question: "Co się stanie?", Correct: "Okno się stłucze", Options: [{ Emoji: "💥", Text: "Okno się stłucze" }, { Emoji: "🎯", Text: "Trafisz w cel" }, { Emoji: "🏆", Text: "Wygrasz nagrodę" }] },
    { Sequence: [{ Emoji: "🌡️", Text: "Jest gorąco" }, { Emoji: "🍦", Text: "Kupiłeś loda" }], Question: "Co się stanie z lodem?", Correct: "Zacznie się topić", Options: [{ Emoji: "💧", Text: "Zacznie się topić" }, { Emoji: "❄️", Text: "Zamrozi się bardziej" }, { Emoji: "🍰", Text: "Zmieni się w ciasto" }] },
    { Sequence: [{ Emoji: "😴", Text: "Jest późno wieczorem" }, { Emoji: "🛏️", Text: "Idziesz do łóżka" }], Question: "Co zrobisz?", Correct: "Zaśniesz", Options: [{ Emoji: "💤", Text: "Zaśniesz" }, { Emoji: "🏃", Text: "Pójdziesz biegać" }, { Emoji: "🎮", Text: "Pograjesz w gry" }] }
];

const logicalStories = [
    { Scenario: "Jan nie odrobił pracy domowej", Emoji: "📚❌", Question: "Co się może stać?", Correct: "Dostanie uwagę w szkole", Options: [{ Emoji: "⚠️", Text: "Dostanie uwagę w szkole" }, { Emoji: "🏆", Text: "Dostanie nagrodę" }, { Emoji: "🎮", Text: "Będzie mógł grać" }] },
    { Scenario: "Maria codziennie ćwiczy na pianinie", Emoji: "🎹📅", Question: "Co się stanie po czasie?", Correct: "Będzie grać lepiej", Options: [{ Emoji: "🎵", Text: "Będzie grać lepiej" }, { Emoji: "😕", Text: "Będzie gorzej" }, { Emoji: "🤷", Text: "Nic się nie zmieni" }] },
    { Scenario: "Tomek zostawił rower na dworze w nocy", Emoji: "🚲🌙", Question: "Co może się stać?", Correct: "Rower może zostać skradziony", Options: [{ Emoji: "🚨", Text: "Rower może zostać skradziony" }, { Emoji: "✨", Text: "Rower będzie czystszy" }, { Emoji: "🎁", Text: "Dostanie nowy rower" }] },
    { Scenario: "Ania podzieliła się zabawkami z bratem", Emoji: "🤝🎁", Question: "Co czuje brat?", Correct: "Jest szczęśliwy", Options: [{ Emoji: "😊", Text: "Jest szczęśliwy" }, { Emoji: "😢", Text: "Jest smutny" }, { Emoji: "😠", Text: "Jest zły" }] },
    { Scenario: "Piotr jadł dużo słodyczy", Emoji: "🍬🍭🍫", Question: "Co się może stać?", Correct: "Zaboli go brzuch", Options: [{ Emoji: "🤢", Text: "Zaboli go brzuch" }, { Emoji: "💪", Text: "Będzie silniejszy" }, { Emoji: "🏃", Text: "Będzie szybszy" }] }
];

const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

const stories = {
    sequence: sequenceStories,
    prediction: predictionStories,
    logical: logicalStories
};

const getInitialGameState = (mode = 'sequence', questionIndex = 0) => {
    const currentStory = stories[mode][questionIndex];
    const baseState = {
        currentQuestionIndex: questionIndex,
        answered: false,
        feedbackMessage: '',
        feedbackClass: '',
    };

    switch (mode) {
        case 'sequence':
            return { ...baseState, userSequence: [], shuffledSequenceSteps: shuffle(currentStory.Steps) };
        case 'prediction':
            return { ...baseState, selectedPredictionText: '', currentPredictionOptions: shuffle(currentStory.Options) };
        case 'logical':
            return { ...baseState, selectedPredictionText: '', currentLogicalOptions: shuffle(currentStory.Options) };
        default:
            return baseState;
    }
};

function Sekwencje() {
    const [currentMode, setCurrentMode] = useState('sequence');
    const [gameState, setGameState] = useState(getInitialGameState('sequence', 0));
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [isGameFinished, setIsGameFinished] = useState(false);
    const [isHelpVisible, setIsHelpVisible] = useState(false);
    const [showCelebrationClass, setShowCelebrationClass] = useState(false);
    const [celebrationEmoji, setCelebrationEmoji] = useState('🎉');
    
    const { 
        currentQuestionIndex, 
        answered, 
        feedbackMessage, 
        feedbackClass, 
        userSequence, 
        shuffledSequenceSteps, 
        selectedPredictionText, 
        currentPredictionOptions, 
        currentLogicalOptions 
    } = gameState;

    const currentStory = useMemo(() => stories[currentMode][currentQuestionIndex], [currentMode, currentQuestionIndex]);
    const helpText = useMemo(() => ({
        sequence: "Kliknij karty w takiej kolejności, w jakiej wydarzenia się dzieją. Najpierw to co jest pierwsze, potem drugie, itd.",
        prediction: "Przeczytaj co się już stało i pomyśl, co może się stać dalej. Wybierz najbardziej logiczną odpowiedź.",
        logical: "Pomyśl o przyczynie i skutku. Jeśli ktoś coś zrobi, co może się przez to wydarzyć?"
    }[currentMode]), [currentMode]);

    const getModeName = (mode) => ({
        sequence: "Układania Historii",
        prediction: "Przewidywania",
        logical: "Logicznego Myślenia"
    }[mode] || mode);

    const showCelebration = useCallback(() => {
        const emojis = ["🎉", "⭐", "✨", "🏆", "🎊"];
        setCelebrationEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
        setShowCelebrationClass(true);
        setTimeout(() => setShowCelebrationClass(false), 1000);
    }, []);

    const changeMode = (mode) => {
        setCurrentMode(mode);
        setScore(0);
        setLevel(1);
        setIsGameFinished(false);
        setGameState(getInitialGameState(mode, 0));
    };

    const handleSelectCard = (step) => {
        if (answered || userSequence.includes(step.Order)) return;
        setGameState(prev => ({...prev, userSequence: [...prev.userSequence, step.Order]}));
    };

    const handleResetSequence = () => {
        setGameState(prev => ({...prev, userSequence: [], answered: false, feedbackMessage: '', feedbackClass: ''}));
    };

    const handleCheckSequenceAnswer = () => {
        if (answered || !currentStory) return;

        const isCorrect = userSequence.length === currentStory.Steps.length && userSequence.every((order, i) => order === i + 1);

        if (isCorrect) {
            setGameState(prev => ({...prev, answered: true, feedbackMessage: "🎉 Brawo! Ułożyłeś historię w dobrej kolejności!", feedbackClass: "success"}));
            setScore(prev => prev + 20);
            if (level < 10) setLevel(prev => prev + 1);
            showCelebration();
        } else {
            setGameState(prev => ({...prev, feedbackMessage: '💪 Spróbuj jeszcze raz! Kliknij \'Zacznij od nowa\'', feedbackClass: "error"}));
        }
    };

    const handleSelectPrediction = (selected, correctText) => {
        if (answered) return;
        
        const isCorrect = selected.Text === correctText;

        setGameState(prev => ({
            ...prev, 
            answered: true, 
            selectedPredictionText: selected.Text,
            feedbackMessage: isCorrect ? (currentMode === 'prediction' ? "🎉 Doskonale! Świetne myślenie logiczne!" : "🎉 Brawo! To jest poprawna odpowiedź!") : "💡 Zobacz, to jest poprawna odpowiedź!",
            feedbackClass: isCorrect ? 'success' : 'error'
        }));

        if (isCorrect) {
            setScore(prev => prev + 20);
            if (level < 10) setLevel(prev => prev + 1);
            showCelebration();
        }
    };

    const handleNextQuestion = () => {
        const max = stories[currentMode].length;
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < max) {
            setGameState(getInitialGameState(currentMode, nextIndex));
        } else {
            setIsGameFinished(true);
        }
    };

    const handleRestartGame = () => {
        changeMode(currentMode);
    };

    const progress = useMemo(() => ((currentQuestionIndex + 1) / stories[currentMode].length) * 100, [currentQuestionIndex, currentMode]);

    return (
        <div className="sequences-container">
                <div className="header">
                    <h1>🧩 Sekwencje i Następstwa</h1>
                    <p>Ułóż historię we właściwej kolejności!</p>
                </div>

                <div className="mode-selector">
                    <button className={`mode-button ${currentMode === 'sequence' ? 'active' : ''}`} onClick={() => changeMode('sequence')}>📝 Układanie historii</button>
                    <button className={`mode-button ${currentMode === 'prediction' ? 'active' : ''}`} onClick={() => changeMode('prediction')}>🔮 Co się stanie?</button>
                    <button className={`mode-button ${currentMode === 'logical' ? 'active' : ''}`} onClick={() => changeMode('logical')}>🧠 Logiczne myślenie</button>
                </div>

                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="score-container">
                    <div className="score-box">Punkty: <span>{score}</span></div>
                    <div className="score-box">Poziom: <span>{level}</span></div>
                </div>

                <div className="game-area">
                    {isGameFinished ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <div style={{ fontSize: '5em', marginBottom: '30px' }}>🏆</div>
                            <h2 style={{ fontSize: '2.5em', color: '#f5576c', marginBottom: '20px' }}>Ukończyłeś tryb<br />{getModeName(currentMode)}!</h2>
                            <div style={{ fontSize: '2em', marginBottom: '20px' }}>Twoje punkty: <strong style={{ color: '#4CAF50' }}>{score}</strong></div>
                            <div style={{ fontSize: '2em', marginBottom: '40px' }}>Poziom: <strong style={{ color: '#f5576c' }}>{level}</strong></div>
                            <p style={{ fontSize: '1.3em', color: '#666', marginBottom: '30px' }}>Świetnie Ci idzie myślenie sekwencyjne!<br />Spróbuj innych trybów, aby rozwinąć umiejętności! 🧩</p>
                            <button className="action-button" onClick={handleRestartGame}>🔄 Zagraj ponownie</button>
                        </div>
                    ) : (
                        currentStory && (
                            <>
                                {currentMode === 'sequence' && (
                                    <>
                                        <div className="instruction">📖 {currentStory.Title}<br /><small style={{ fontSize: '0.7em' }}>Kliknij karty w odpowiedniej kolejności</small></div>
                                        <div className="sequence-container">
                                            {Array.from({ length: currentStory.Steps.length }).map((_, i) => {
                                                const step = userSequence[i] ? currentStory.Steps.find(s => s.Order === userSequence[i]) : null;
                                                let slotClass = step ? 'filled' : '';
                                                if (answered) {
                                                    if (step && userSequence[i] === i + 1) slotClass += ' correct';
                                                    else if (step) slotClass += ' incorrect';
                                                }
                                                return (
                                                    <div key={i} className={`sequence-slot ${slotClass}`}>
                                                        <div className="slot-number">{i + 1}</div>
                                                        <div className="slot-content">
                                                            {step && <><div className="slot-emoji">{step.Emoji}</div><div className="slot-text">{step.Text}</div></>}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="cards-container">
                                            {shuffledSequenceSteps.map(step => (
                                                <div key={step.Order} className={`story-card ${userSequence.includes(step.Order) ? 'used' : ''}`} onClick={() => handleSelectCard(step)}>
                                                    <div className="card-emoji">{step.Emoji}</div>
                                                    <div className="card-text">{step.Text}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="reset-button" onClick={handleResetSequence}>🔄 Zacznij od nowa</button>
                                    </>
                                )}
                                {(currentMode === 'prediction' || currentMode === 'logical') && (
                                    <div className="prediction-area">
                                        <div className="instruction">{currentMode === 'prediction' ? '🔮 Co się stanie dalej?' : '🧠 Pomyśl logicznie!'}</div>
                                        {currentMode === 'prediction' ? (
                                            <div className="story-sequence">
                                                {currentStory.Sequence.map((step, i) => <React.Fragment key={i}>{i > 0 && <div className="arrow">→</div>}<div className="story-step"><div className="step-emoji">{step.Emoji}</div><div className="step-text">{step.Text}</div></div></React.Fragment>)}
                                                <div className="arrow">→</div>
                                                <div className="story-step" style={{ border: '4px dashed #ffc107', background: '#fff9e6' }}><div className="step-emoji">❓</div><div className="step-text">Co teraz?</div></div>
                                            </div>
                                        ) : (
                                            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                                <div style={{ fontSize: '5em', margin: '20px 0' }}>{currentStory.Emoji}</div>
                                                <div style={{ fontSize: '1.5em', color: '#333', fontWeight: 'bold', padding: '20px', background: 'white', borderRadius: '15px', border: '3px solid #f5576c' }}>{currentStory.Scenario}</div>
                                            </div>
                                        )}
                                        <div className="prediction-question">{currentStory.Question}</div>
                                        <div className="prediction-options">
                                            {(currentMode === 'prediction' ? currentPredictionOptions : currentLogicalOptions).map(option => {
                                                let optionClass = '';
                                                if (answered) {
                                                    if (option.Text === currentStory.Correct) optionClass = 'correct';
                                                    else if (option.Text === selectedPredictionText) optionClass = 'incorrect';
                                                }
                                                return (
                                                    <div key={option.Text} className={`prediction-option ${optionClass}`} onClick={() => handleSelectPrediction(option, currentStory.Correct)}>
                                                        <span className="emoji">{option.Emoji}</span>
                                                        <span className="text">{option.Text}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </>
                        )
                    )}
                </div>

                <div className={`feedback ${feedbackClass}`}>{feedbackMessage}</div>

                <div className="button-container">
                    {currentMode === 'sequence' && !isGameFinished && (
                        <button className="action-button" onClick={handleCheckSequenceAnswer} disabled={userSequence.length !== (currentStory?.Steps.length || 0) || answered}>
                            ✓ Sprawdź
                        </button>
                    )}
                    <button className="action-button secondary" onClick={handleNextQuestion} disabled={!answered || isGameFinished}>Następne ➡️</button>
                </div>

            <button className="help-button" onClick={() => setIsHelpVisible(prev => !prev)}>?</button>
            <div className={`tooltip ${isHelpVisible ? 'show' : ''}`}>{helpText}</div>
            <div className={`celebration ${showCelebrationClass ? 'show' : ''}`}>{celebrationEmoji}</div>
        </div>
    );
}

export default Sekwencje;
