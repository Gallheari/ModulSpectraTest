import React, { useState, useMemo, useCallback } from 'react';
import './style.css';

const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

const BelongsQuestions = [
    { Category: "Owoce", Icon: "🍎", Group: [{ Emoji: "🍎", Label: "Jabłko" }, { Emoji: "🍌", Label: "Banan" }, { Emoji: "🍊", Label: "Pomarańcza" }], Options: [{ Emoji: "🍇", Label: "Winogrona", Correct: true }, { Emoji: "🚗", Label: "Samochód", Correct: false }, { Emoji: "🏠", Label: "Dom", Correct: false }, { Emoji: "🍓", Label: "Truskawka", Correct: true }] },
    { Category: "Zwierzęta", Icon: "🐾", Group: [{ Emoji: "🐶", Label: "Pies" }, { Emoji: "🐱", Label: "Kot" }, { Emoji: "🐰", Label: "Królik" }], Options: [{ Emoji: "🐹", Label: "Chomik", Correct: true }, { Emoji: "🍎", Label: "Jabłko", Correct: false }, { Emoji: "⚽", Label: "Piłka", Correct: false }, { Emoji: "🐦", Label: "Ptak", Correct: true }] },
    { Category: "Pojazdy", Icon: "🚗", Group: [{ Emoji: "🚗", Label: "Samochód" }, { Emoji: "🚌", Label: "Autobus" }, { Emoji: "✈️", Label: "Samolot" }], Options: [{ Emoji: "🚂", Label: "Pociąg", Correct: true }, { Emoji: "🍕", Label: "Pizza", Correct: false }, { Emoji: "📚", Label: "Książka", Correct: false }, { Emoji: "🚁", Label: "Helikopter", Correct: true }] }
];

const IntruderQuestions = [
    { Category: "Owoce", Hint: "Jedno z nich nie jest owocem!", IntruderItems: [{ Emoji: "🍎", Label: "Jabłko", Intruder: false }, { Emoji: "🍌", Label: "Banan", Intruder: false }, { Emoji: "🚗", Label: "Samochód", Intruder: true }, { Emoji: "🍊", Label: "Pomarańcza", Intruder: false }] },
    { Category: "Zwierzęta", Hint: "Jedno nie jest zwierzęciem!", IntruderItems: [{ Emoji: "🐶", Label: "Pies", Intruder: false }, { Emoji: "🐱", Label: "Kot", Intruder: false }, { Emoji: "🍎", Label: "Jabłko", Intruder: true }, { Emoji: "🐰", Label: "Królik", Intruder: false }] },
    { Category: "Pojazdy", Hint: "Jedno nie jest pojazdem!", IntruderItems: [{ Emoji: "🚗", Label: "Samochód", Intruder: false }, { Emoji: "✈️", Label: "Samolot", Intruder: false }, { Emoji: "🌳", Label: "Drzewo", Intruder: true }, { Emoji: "🚂", Label: "Pociąg", Intruder: false }] }
];

const SortQuestions = [
    { QuestionText: "Posortuj według koloru", Categories: [{ Name: "Czerwone", Icon: "🔴", Color: "red" }, { Name: "Żółte", Icon: "🟡", Color: "yellow" }], SortItems: [{ Emoji: "🍎", Label: "Jabłko", Category: "red" }, { Emoji: "🍌", Label: "Banan", Category: "yellow" }, { Emoji: "🍓", Label: "Truskawka", Category: "red" }, { Emoji: "🌻", Label: "Słonecznik", Category: "yellow" }, { Emoji: "🌹", Label: "Róża", Category: "red" }, { Emoji: "🍋", Label: "Cytryna", Category: "yellow" }] },
    { QuestionText: "Posortuj według miejsca", Categories: [{ Name: "W domu", Icon: "🏠", Color: "home" }, { Name: "Na dworze", Icon: "🌳", Color: "outside" }], SortItems: [{ Emoji: "🛋️", Label: "Kanapa", Category: "home" }, { Emoji: "🌳", Label: "Drzewo", Category: "outside" }, { Emoji: "🛏️", Label: "Łóżko", Category: "home" }, { Emoji: "🌺", Label: "Kwiat", Category: "outside" }, { Emoji: "📺", Label: "Telewizor", Category: "home" }, { Emoji: "☀️", Label: "Słońce", Category: "outside" }] }
];

const modeConfig = {
    belongs: { questions: BelongsQuestions, name: "Co pasuje?", help: "Wybierz przedmioty, które pasują do pokazanej grupy. Kliknij na odpowiedzi!" },
    intruder: { questions: IntruderQuestions, name: "Znajdź intruza", help: "Znajdź przedmiot, który nie pasuje do pozostałych w grupie!" },
    sort: { questions: SortQuestions, name: "Sortuj według...", help: "Kliknij na przedmiot, a potem na kategorię, do której powinien należeć!" }
};


const getInitialGameState = (mode = 'belongs', questionIndex = 0) => {
    const questionData = modeConfig[mode].questions[questionIndex];
    const baseState = {
        currentQuestionIndex: questionIndex,
        answered: false,
        feedback: { message: '', type: '' },
    };

    switch (mode) {
        case 'belongs':
            return { ...baseState, selectedOptions: [] };
        case 'intruder':
            return { ...baseState, intruderItems: shuffle(questionData.IntruderItems) };
        case 'sort':
            return {
                ...baseState,
                sortableItems: shuffle(questionData.SortItems).map(item => ({ ...item, isPlaced: false })),
                selectedItem: null,
                sortedItems: [[], []],
            };
        default:
            return baseState;
    }
};


function Kategoryzacja() {
    const [currentMode, setCurrentMode] = useState('belongs');
    const [gameState, setGameState] = useState(getInitialGameState('belongs', 0));
    const [score, setScore] = useState(0);
    const [stars, setStars] = useState(1);
    const [isGameFinished, setIsGameFinished] = useState(false);
    const [isHelpVisible, setIsHelpVisible] = useState(false);
    const [celebration, setCelebration] = useState({ show: false, emoji: '🎉' });

    const { 
        currentQuestionIndex, 
        answered, 
        feedback, 
        selectedOptions, 
        intruderItems, 
        sortableItems, 
        selectedItem, 
        sortedItems 
    } = gameState;

    const currentQuestion = useMemo(() => modeConfig[currentMode].questions[currentQuestionIndex], [currentMode, currentQuestionIndex]);

    const runCelebration = useCallback(() => {
        const emojis = ["🎉", "✨", "🌟", "🎊", "💫"];
        setCelebration({ show: true, emoji: emojis[Math.floor(Math.random() * emojis.length)] });
        setTimeout(() => setCelebration({ show: false, emoji: '' }), 1000);
    }, []);

    const changeMode = (mode) => {
        setCurrentMode(mode);
        setScore(0);
        setStars(1);
        setIsGameFinished(false);
        setGameState(getInitialGameState(mode, 0));
    };

    const handleNextQuestion = () => {
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < modeConfig[currentMode].questions.length) {
            setGameState(getInitialGameState(currentMode, nextIndex));
        } else {
            setIsGameFinished(true);
        }
    };

    const checkBelongs = (option) => {
        if (selectedOptions.find(o => o.Label === option.Label)) return;

        const newSelected = [...selectedOptions, option];
        const isCorrect = option.Correct;
        
        let newFeedback = { message: isCorrect ? "✨ Dobrze! Znajdź jeszcze więcej!" : "💪 Spróbuj innego!", type: isCorrect ? 'success' : 'error' };
        
        setGameState(prev => ({ ...prev, selectedOptions: newSelected, feedback: newFeedback }));

        if (isCorrect) {
            setScore(s => s + 10);
            setStars(s => s + 1);
            runCelebration();

            const allCorrect = currentQuestion.Options.filter(o => o.Correct);
            if (newSelected.filter(o => o.Correct).length === allCorrect.length) {
                setGameState(prev => ({ ...prev, answered: true, feedback: { message: "🎉 Świetnie! Znalazłeś wszystkie!", type: 'success' } }));
            }
        }
    };

    const checkIntruder = (item) => {
        if (answered) return;
        const isCorrect = item.Intruder;

        setGameState(prev => ({
            ...prev,
            answered: true,
            feedback: { 
                message: isCorrect ? "🎉 Brawo! To właśnie intruz!" : "💪 Spróbuj jeszcze raz następnym razem!", 
                type: isCorrect ? 'success' : 'error' 
            }
        }));

        if (isCorrect) {
            setScore(s => s + 15);
            setStars(s => s + 1);
            runCelebration();
        } 
    };

    const checkSorting = () => {
        if (answered) return;

        const cat1Correct = sortedItems[0].every(item => item.Category === currentQuestion.Categories[0].Color);
        const cat2Correct = sortedItems[1].every(item => item.Category === currentQuestion.Categories[1].Color);
        const isCorrect = cat1Correct && cat2Correct;

        setGameState(prev => ({
            ...prev,
            answered: true,
            feedback: { 
                message: isCorrect ? "🎉 Perfekcyjnie! Wszystko posortowane!" : "💪 Spróbuj następnym razem!", 
                type: isCorrect ? 'success' : 'error' 
            }
        }));
        
        if (isCorrect) {
            setScore(s => s + 20);
            setStars(s => s + 2);
            runCelebration();
        } 
    };

    const selectSortItem = (item) => {
        if (answered || item.isPlaced) return;
        setGameState(prev => ({ ...prev, selectedItem: item }));
    };

    const placeInSortCategory = (catIndex) => {
        if (!selectedItem || answered) return;

        setGameState(prev => ({
            ...prev,
            sortedItems: prev.sortedItems.map((items, index) => index === catIndex ? [...items, selectedItem] : items),
            sortableItems: prev.sortableItems.map(i => i.Label === selectedItem.Label ? { ...i, isPlaced: true } : i),
            selectedItem: null,
        }));
    };    
    
    const progress = useMemo(() => ((currentQuestionIndex + 1) / modeConfig[currentMode].questions.length) * 100, [currentQuestionIndex, currentMode]);
    const starDisplay = useMemo(() => '⭐'.repeat(Math.min(Math.floor(stars / 2), 5)) || '⭐', [stars]);

    if (isGameFinished) return (
        <div className="kategoryzacja-container">
             <div style={{ textAlign: 'center', padding: '50px' }}>
                <div style={{ fontSize: '5em', marginBottom: '30px' }}>🏆</div>
                <h2 style={{ fontSize: '2.5em', color: '#f5576c', marginBottom: '20px' }}>Ukończyłeś tryb<br />{modeConfig[currentMode].name}!</h2>
                <div style={{ fontSize: '2em', marginBottom: '20px' }}>Twoje punkty: <strong style={{ color: '#4CAF50' }}>{score}</strong></div>
                <div style={{ fontSize: '3em', marginBottom: '40px' }}>{starDisplay}</div>
                <p style={{ fontSize: '1.3em', color: '#666', marginBottom: '30px' }}>Świetnie Ci idzie kategoryzowanie!<br />Spróbuj innych trybów! 🗂️</p>
                <button className="next-button" onClick={() => changeMode(currentMode)}>🔄 Zagraj ponownie</button>
            </div>
        </div>
    )

    return (
        <div className="kategoryzacja-container">
                <div className="header">
                    <h1>🗂️ Kategoryzacja i Sortowanie</h1>
                    <p>Ucz się grupować i porządkować!</p>
                </div>
                <div className="mode-selector">
                    {Object.keys(modeConfig).map(mode => <button key={mode} className={`mode-button ${currentMode === mode ? 'active' : ''}`} onClick={() => changeMode(mode)}>{modeConfig[mode].name}</button>)}
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }}></div></div>
                <div className="score-container"><div className="score-box">Punkty: <span>{score}</span></div><div className="score-box"><span>{starDisplay}</span></div></div>

                <div className="game-area">
                    {currentMode === 'belongs' && (
                        <>
                            <div className="question-text">Co jeszcze pasuje do grupy: {currentQuestion.Category}?</div>
                            <div className="category-hint">{currentQuestion.Icon} Kategoria: <strong>{currentQuestion.Category}</strong></div>
                            <div className="items-display">{currentQuestion.Group.map(item => <div key={item.Label} className="item-card highlight"><span className="emoji">{item.Emoji}</span><span className="label">{item.Label}</span></div>)}</div>
                            <div className="question-text" style={{ fontSize: '1.5em', marginTop: '20px' }}>Wybierz wszystkie, które pasują:</div>
                            <div className="options-container">
                                {currentQuestion.Options.map(opt => {
                                    const isSelected = selectedOptions.find(o => o.Label === opt.Label);
                                    let cardClass = 'option-card';
                                    if (isSelected) cardClass += isSelected.Correct ? ' correct disabled' : ' incorrect disabled';

                                    return <div key={opt.Label} className={cardClass} onClick={() => checkBelongs(opt)}><span className="emoji">{opt.Emoji}</span><span className="label">{opt.Label}</span></div>
                                })}
                            </div>
                        </>
                    )}
                    {currentMode === 'intruder' && (
                        <>
                            <div className="question-text">Znajdź intruza!</div>
                            <div className="category-hint">💡 {currentQuestion.Hint}</div>
                            <div className="options-container">
                                {intruderItems.map(item => <div key={item.Label} className={`option-card ${answered ? (item.Intruder ? 'correct' : 'incorrect') : ''}`} onClick={() => checkIntruder(item)}><span className="emoji">{item.Emoji}</span><span className="label">{item.Label}</span></div>)}
                            </div>
                        </>
                    )}
                    {currentMode === 'sort' && (
                        <>
                            <div className="question-text">{currentQuestion.QuestionText}</div>
                            <div className="sorting-area">
                                {currentQuestion.Categories.map((cat, i) => (
                                    <div key={cat.Name} className="sort-category" onClick={() => placeInSortCategory(i)}>
                                        <div className="category-icon">{cat.Icon}</div>
                                        <div className="category-title">{cat.Name}</div>
                                        <div className="items-zone">{sortedItems[i].map(item => <div key={item.Label} className="sortable-item placed"><span className="emoji">{item.Emoji}</span><span className="label">{item.Label}</span></div>)}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="sortable-items">{sortableItems.map(item => <div key={item.Label} className={`sortable-item ${selectedItem?.Label === item.Label ? 'selected' : ''} ${item.isPlaced ? 'placed' : ''}`} onClick={() => selectSortItem(item)}><span className="emoji">{item.Emoji}</span><span className="label">{item.Label}</span></div>)}</div>
                            <button className="check-button" onClick={checkSorting} disabled={sortableItems.some(i => !i.isPlaced) || answered}>✓ Sprawdź odpowiedź</button>
                        </>
                    )}
                </div>

                <div className={`feedback ${feedback.type}`}>{feedback.message}</div>
                <button className="next-button" disabled={!answered || isGameFinished} onClick={handleNextQuestion}>Następne ➡️</button>
            <button className="help-button" onClick={() => setIsHelpVisible(v => !v)}>?</button>
            {isHelpVisible && <div className="tooltip show"><h3>Jak grać?</h3><p>{modeConfig[currentMode].help}</p></div>}
            {celebration.show && <div className="celebration show">{celebration.emoji}</div>}
        </div>
    );
}

export default Kategoryzacja;
