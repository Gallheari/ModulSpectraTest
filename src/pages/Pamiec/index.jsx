import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './style.css';

const allEmojis = [
    "🍎", "🍌", "🍊", "🍇", "🍓", "🍒", "🍑", "🍐",
    "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼",
    "⚽", "🏀", "🎾", "🎱", "🎯", "🎮", "🎲", "🎪",
    "🌟", "⭐", "✨", "💫", "🌙", "☀️", "🌈", "⚡",
    "🚗", "🚌", "🚂", "✈️", "🚁", "🚀", "🚲", "🛴",
    "🏠", "🏫", "🏥", "🏪", "🏰", "🗼", "🌉", "⛪",
    "🎨", "🎭", "🎪", "🎬", "🎤", "🎧", "🎼", "🎹",
    "💖", "💙", "💚", "💛", "🧡", "💜", "🤍", "🖤"
];

const getTotalRounds = (mode) => mode === 'memory' ? 1 : 10;

const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);
const getRandomEmojis = (count) => shuffle(allEmojis).slice(0, count);

const modeHelpTexts = {
    remember: "Zapamiętaj sekwencję emoji i odtwórz ją w tej samej kolejności!",
    missing: "Zapamiętaj wszystkie przedmioty. Jeden zniknie - wskaż który!",
    memory: "Znajdź wszystkie pary identycznych emoji. Kliknij dwie karty!",
};

function MemoryGame() {
    const [currentMode, setCurrentMode] = useState('remember');
    const [gameState, setGameState] = useState('initial');
    const [currentRound, setCurrentRound] = useState(0);
    const [score, setScore] = useState(0);
    const [stars, setStars] = useState(1);
    const [isGameFinished, setIsGameFinished] = useState(false);
    const [answered, setAnswered] = useState(false);
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [celebration, setCelebration] = useState({ show: false, emoji: '🎉' });
    const [isHelpVisible, setIsHelpVisible] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // Mode-specific state
    const [sequence, setSequence] = useState([]);
    const [userSequence, setUserSequence] = useState([]);
    const [selectable, setSelectable] = useState([]);
    const [sequenceLength, setSequenceLength] = useState(3);
    const [missingItem, setMissingItem] = useState(null);
    const [memoryCards, setMemoryCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [moves, setMoves] = useState(0);
    const [memoryDifficulty, setMemoryDifficulty] = useState('easy');

    const totalRounds = useMemo(() => getTotalRounds(currentMode), [currentMode]);
    const progress = useMemo(() => (currentRound / totalRounds) * 100, [currentRound, totalRounds]);
    const starDisplay = useMemo(() => '⭐'.repeat(Math.min(Math.floor(stars / 2), 5)) || '⭐', [stars]);

    const runCelebration = useCallback(() => {
        const emojis = ["🎉", "✨", "🌟", "💫", "🎊", "⭐", "🏆"];
        setCelebration({ show: true, emoji: emojis[Math.floor(Math.random() * emojis.length)] });
        setTimeout(() => setCelebration(c => ({ ...c, show: false })), 1000);
    }, []);

    const changeMode = (mode) => {
        setCurrentMode(mode);
        setCurrentRound(0);
        setScore(0);
        setStars(1);
        setIsGameFinished(false);
        setGameState('initial');
        if (mode === 'remember') setSequenceLength(3);
        if (mode === 'memory') setMoves(0);
    };

    const startCountdown = useCallback((seconds, onFinished) => {
        let count = seconds;
        setCountdown(count);
        const timer = setInterval(() => {
            count--;
            setCountdown(count);
            if (count === 0) {
                clearInterval(timer);
                onFinished();
            }
        }, 1000);
    }, []);

    // Load round logic
    useEffect(() => {
        setFeedback({ message: '', type: '' });
        setAnswered(false);
        setGameState('initial');
        
        if (currentMode === 'remember') {
            if (currentRound > 0 && currentRound % 2 === 0) {
                setSequenceLength(len => Math.min(len + 1, 7));
            }
        } else if (currentMode === 'missing') {
            const itemCount = Math.min(5 + Math.floor(currentRound / 2), 9);
            const newSequence = getRandomEmojis(itemCount);
            setSequence(newSequence);
            startCountdown(5, () => {
              const missing = newSequence[Math.floor(Math.random() * newSequence.length)];
              setMissingItem(missing);
              setSelectable(shuffle(newSequence));
              setGameState('input');
            });
        } else if (currentMode === 'memory') {
            const pairCount = { easy: 4, medium: 6, hard: 10 }[memoryDifficulty];
            const emojis = getRandomEmojis(pairCount);
            setMemoryCards(shuffle([...emojis, ...emojis]).map(emoji => ({ emoji, state: '' })));
            setFlippedCards([]);
            setMoves(0);
            setGameState('playing'); // Memory doesn't have an 'initial' screen per se
        }
    }, [currentMode, currentRound, memoryDifficulty, startCountdown]);

    const showRememberSequence = async () => {
        setGameState('showing');
        const newSequence = getRandomEmojis(sequenceLength);
        setSequence(newSequence);
        setUserSequence([]);
        await new Promise(res => setTimeout(res, sequenceLength * 800));
        startCountdown(3, () => {
            setGameState('input');
            setSelectable(shuffle([...new Set([...newSequence, ...getRandomEmojis(6)])]));
        });
    };

    const handleSelectEmoji = (emoji) => {
        if (userSequence.length >= sequence.length || answered) return;
        const newSeq = [...userSequence, emoji];
        setUserSequence(newSeq);

        if (newSeq.length === sequence.length) {
            setAnswered(true);
            const isCorrect = newSeq.every((e, i) => e === sequence[i]);
            if (isCorrect) {
                setFeedback({ message: "🎉 Perfekcyjnie! Zapamiętałeś wszystko!", type: 'success' });
                setScore(s => s + 15 + (sequenceLength * 5));
                setStars(s => s + 1);
                runCelebration();
            } else {
                setFeedback({ message: "💪 Spróbuj jeszcze raz! Prawie ci wyszło!", type: 'error' });
            }
        }
    };

    const checkMissing = (selected) => {
        if (answered) return;
        setAnswered(true);
        if (selected === missingItem) {
            setFeedback({ message: "🎉 Świetnie! To właśnie ono zniknęło!", type: 'success' });
            setScore(s => s + 12 + (sequence.length * 2));
            setStars(s => s + 1);
            runCelebration();
        } else {
            setFeedback({ message: "💪 Spróbuj następnym razem!", type: 'error' });
        }
    };

    const flipCard = (index) => {
        if (flippedCards.length === 2 || memoryCards[index].state !== '') return;

        const newCards = [...memoryCards];
        newCards[index].state = 'flipped';
        const newFlipped = [...flippedCards, { ...newCards[index], index }];
        setMemoryCards(newCards);
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(m => m + 1);
            setTimeout(() => {
                const [first, second] = newFlipped;
                if (first.emoji === second.emoji) {
                    newCards[first.index].state = 'matched';
                    newCards[second.index].state = 'matched';
                    runCelebration();
                    if (newCards.every(c => c.state === 'matched')) {
                        setFeedback({ message: `🎉 Gratulacje! Ukończyłeś w ${moves + 1} ruchach!`, type: 'success' });
                        setIsGameFinished(true);
                        setAnswered(true);
                    }
                } else {
                    newCards[first.index].state = '';
                    newCards[second.index].state = '';
                }
                setMemoryCards([...newCards]);
                setFlippedCards([]);
            }, 1000);
        }
    };

    const nextRound = () => {
        if (currentRound < totalRounds - 1) {
            setCurrentRound(r => r + 1);
        } else {
            setIsGameFinished(true);
        }
    };

    const achievement = useMemo(() => {
        if (score >= 250) return "🏆 Superpamięć!";
        if (score >= 200) return "🌟 Mistrz Koncentracji!";
        if (score >= 150) return "⭐ Świetna Pamięć!";
        return "💪 Dobry Start!";
    }, [score]);

    const renderGameArea = () => {
        if (isGameFinished) return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <div style={{ fontSize: '5em', marginBottom: '30px' }}>🏆</div>
                <h2 style={{ fontSize: '2.5em', color: '#667eea', marginBottom: '20px' }}>
                    {currentMode === 'memory' ? 'Ukończyłeś Memory!' : 'Ukończyłeś wszystkie rundy!'}
                </h2>
                <div style={{ fontSize: '2.5em', color: '#4CAF50', marginBottom: '20px', fontWeight: 'bold' }}>{achievement}</div>
                <div style={{ fontSize: '2em', marginBottom: '20px' }}>Twoje punkty: <strong style={{ color: '#667eea' }}>{score}</strong></div>
                <div style={{ fontSize: '3em', marginBottom: '40px' }}>{starDisplay}</div>
                <p style={{ fontSize: '1.3em', color: '#666', marginBottom: '30px' }}>Masz niesamowitą pamięć!<br />Spróbuj innych trybów! 🧠</p>
                <button className="next-button" onClick={() => changeMode(currentMode)}>🔄 Zagraj ponownie</button>
            </div>
        );

        switch (currentMode) {
            case 'remember': return (
                <>
                    {gameState === 'initial' && <>
                        <div className="level-indicator">Poziom {currentRound + 1} - Zapamiętaj {sequenceLength} emoji</div>
                        <div className="instruction">Naciśnij START, aby zobaczyć sekwencję!</div>
                        <div className="button-group"><button className="action-button start" onClick={showRememberSequence}>▶️ START</button></div>
                    </>}
                    {gameState === 'showing' && <>
                        <div className="instruction">Zapamiętaj tę sekwencję!</div>
                        <div className="sequence-display">{sequence.map((emoji, i) => <div key={i} className="sequence-item">{emoji}</div>)}</div>
                        {countdown > 0 && <div className="countdown">{countdown}</div>}
                    </>}
                    {gameState === 'input' && <>
                        <div className="instruction">Odtwórz sekwencję w tej samej kolejności!</div>
                        <div className="user-sequence">{Array.from({ length: sequence.length }).map((_, i) => <div key={i} className={`user-item ${i < userSequence.length ? 'filled' : ''}`}>{userSequence[i] || '?'}</div>)}</div>
                        <div className="items-grid">{selectable.map(emoji => <div key={emoji} className="selectable-item" onClick={() => handleSelectEmoji(emoji)}>{emoji}</div>)}</div>
                        <div className="button-group"><button className="action-button reset" onClick={() => setUserSequence([])}>🔄 Zacznij od nowa</button></div>
                    </>}
                </>
            );
            case 'missing': return (
                 <>
                    {gameState === 'initial' && <>
                        <div className="level-indicator">Poziom {currentRound + 1} - Zapamiętaj {sequence.length} przedmiotów</div>
                        <div className="instruction">Zapamiętaj wszystkie przedmioty!</div>
                        <div className="sequence-display">{sequence.map((emoji, i) => <div key={i} className="sequence-item">{emoji}</div>)}</div>
                        {countdown > 0 && <div className="countdown">{countdown}</div>}
                    </>}
                    {gameState === 'input' && <>
                         <div className="instruction">Co zniknęło?</div>
                         <div className="sequence-display">{sequence.filter(e => e !== missingItem).map((emoji, i) => <div key={i} className="sequence-item">{emoji}</div>)}</div>
                         <div className="items-grid">{selectable.map(emoji => <div key={emoji} className={`selectable-item ${answered ? (emoji === missingItem ? 'selected' : 'disabled') : ''}`} onClick={() => checkMissing(emoji)}>{emoji}</div>)}</div>
                    </>}
                </>
            );
            case 'memory': return (
                <>
                    <div className="level-indicator">Gra Memory - Znajdź wszystkie pary!</div>
                    <div className="difficulty-selector">
                        <button className={`difficulty-button ${memoryDifficulty === 'easy' ? 'active' : ''}`} onClick={() => setMemoryDifficulty('easy')}>Łatwy (8)</button>
                        <button className={`difficulty-button ${memoryDifficulty === 'medium' ? 'active' : ''}`} onClick={() => setMemoryDifficulty('medium')}>Średni (12)</button>
                        <button className={`difficulty-button ${memoryDifficulty === 'hard' ? 'active' : ''}`} onClick={() => setMemoryDifficulty('hard')}>Trudny (20)</button>
                    </div>
                    <div className={`memory-grid ${memoryDifficulty}`}>{memoryCards.map((card, i) => <div key={i} className={`memory-card ${card.state}`} onClick={() => flipCard(i)}>{card.state.includes('flipped') || card.state.includes('matched') ? card.emoji : '❓'}</div>)}</div>
                </>
            );
            default: return null;
        }
    };

    return (
        <div className="memory-game-container">
                <div className="header">
                    <h1>🧠 Pamięć i Koncentracja</h1>
                    <p>Trenuj swoją superpamięć!</p>
                </div>
                <div className="mode-selector">
                    <button className={`mode-button ${currentMode === 'remember' ? 'active' : ''}`} onClick={() => changeMode('remember')}>👁️ Zapamiętaj</button>
                    <button className={`mode-button ${currentMode === 'missing' ? 'active' : ''}`} onClick={() => changeMode('missing')}>🔮 Co zniknęło?</button>
                    <button className={`mode-button ${currentMode === 'memory' ? 'active' : ''}`} onClick={() => changeMode('memory')}>🃏 Memory</button>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }}></div></div>
                <div className="stats-container">
                    <div className="stat-box">Punkty: <span>{score}</span></div>
                    <div className="stat-box"><span>{starDisplay}</span></div>
                    {currentMode === 'memory' && <div className="stat-box">Ruchy: <span>{moves}</span></div>}
                </div>

                <div className="game-area">{renderGameArea()}</div>

                <div className={`feedback ${feedback.type}`}>{feedback.message}</div>

                {answered && currentMode !== 'memory' && !isGameFinished && <button className="next-button" onClick={nextRound}>Następne ➡️</button>}

            <button className="help-button" onClick={() => setIsHelpVisible(v => !v)}>?</button>
            {isHelpVisible && <div className="tooltip show"><h3>Jak grać?</h3><p>{modeHelpTexts[currentMode]}</p></div>}
            {celebration.show && <div className="celebration show">{celebration.emoji}</div>}
        </div>
    );
}

export default MemoryGame;
