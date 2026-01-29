import { useEffect, useMemo, useRef, useState, Activity } from 'react';
import confetti from 'canvas-confetti';

import { characters } from './data/characters.js';
import Board from './components/Board.jsx';
import { Dialog } from './components/dialog/Dialog.jsx';
import { SoundOffIcon } from './components/icons/SoundOffIcon.jsx';
import { SoundOnIcon } from './components/icons/SoundOnIcon.jsx';

const LEVELS = [2, 3, 4, 6, 8, 10];

const shuffle = (items) => {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const buildDeck = (pairsCount) => {
  const chosen = shuffle(characters).slice(0, pairsCount);
  const duplicated = chosen.flatMap((character) => [
    {
      id: `${character.id}-a`,
      character,
      flipped: false,
      matched: false,
    },
    {
      id: `${character.id}-b`,
      character,
      flipped: false,
      matched: false,
    },
  ]);

  return shuffle(duplicated);
};

function App() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [deck, setDeck] = useState(() => buildDeck(LEVELS[0]));
  const [selected, setSelected] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [matches, setMatches] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window === 'undefined' ? 1200 : window.innerWidth,
  );

  const dialogRef = useRef(null);

  const pairsCount = LEVELS[levelIndex];
  const totalCards = pairsCount * 2;
  const isComplete = matches === pairsCount;
  const isLastLevel = levelIndex === LEVELS.length - 1;

  const columns = useMemo(() => {
    const cardSize = 136;
    const gap = 14;
    const maxBoardWidth = 1100;
    const boardWidth = Math.min(viewportWidth, maxBoardWidth) - 64;
    const maxColumnsByWidth = Math.max(
      2,
      Math.floor((boardWidth + gap) / (cardSize + gap)),
    );
    const targetColumns = Math.ceil(totalCards / 2);
    return Math.max(2, Math.min(maxColumnsByWidth, targetColumns));
  }, [totalCards, viewportWidth]);

  const resetForLevel = (nextLevelIndex) => {
    const nextPairs = LEVELS[nextLevelIndex];
    setDeck(buildDeck(nextPairs));
    setSelected([]);
    setMatches(0);
    setIsLocked(false);
  };

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (selected.length !== 2) return undefined;

    const [firstId, secondId] = selected;
    const firstCard = deck.find((card) => card.id === firstId);
    const secondCard = deck.find((card) => card.id === secondId);

    if (!firstCard || !secondCard) return undefined;

    if (firstCard.character.id === secondCard.character.id) {
      setDeck((prev) =>
        prev.map((card) =>
          card.id === firstId || card.id === secondId
            ? { ...card, matched: true }
            : card,
        ),
      );
      setSelected([]);
      setIsLocked(false);
      setMatches((current) => current + 1);
      return undefined;
    }

    const timeout = setTimeout(() => {
      setDeck((prev) =>
        prev.map((card) =>
          card.id === firstId || card.id === secondId
            ? { ...card, flipped: false }
            : card,
        ),
      );
      setSelected([]);
      setIsLocked(false);
    }, 900);

    return () => clearTimeout(timeout);
  }, [selected, deck]);

  const handleCardClick = (id) => {
    if (isLocked) return;

    const card = deck.find((item) => item.id === id);
    if (!card || card.flipped || card.matched) return;

    setDeck((prev) =>
      prev.map((item) => (item.id === id ? { ...item, flipped: true } : item)),
    );

    if (selected.length === 1) {
      setIsLocked(true);
      setSelected((prev) => [...prev, id]);
    } else {
      setSelected([id]);
    }
  };

  const handleReset = () => {
    resetForLevel(0);
    setLevelIndex(0);
    dialogRef.current.close();
  };

  const handleNextLevel = () => {
    if (isLastLevel) {
      return confetti({
        particleCount: 60,
        spread: 80,
        origin: { x: 0.5, y: 0.45 },
        colors: ['#ffb3c1', '#ffe0a3', '#bde9ff', '#c8f3d8', '#e6d1ff'],
        startVelocity: 32,
        gravity: 0.85,
        ticks: 300,
      });
    }

    setLevelIndex((current) => {
      const nextLevel = Math.min(current + 1, LEVELS.length - 1);
      resetForLevel(nextLevel);
      return nextLevel;
    });

    dialogRef.current.close();
  };

  useEffect(() => {
    if (!isComplete) return;

    setTimeout(() => {
      dialogRef.current.showModal();
    }, 200);
  }, [isComplete]);

  useEffect(() => {
    if (!isComplete || !soundEnabled) return;

    let audioContext;

    const playTone = (time, frequency, duration, gain) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(frequency, time);
      gainNode.gain.setValueAtTime(gain, time);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start(time);
      oscillator.stop(time + duration);
    };

    const playChime = async () => {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      const now = audioContext.currentTime;
      playTone(now, 523.25, 0.2, 0.25);
      playTone(now + 0.18, 659.25, 0.22, 0.22);
      playTone(now + 0.36, 783.99, 0.26, 0.2);
    };

    playChime();

    return () => {
      if (audioContext) audioContext.close();
    };
  }, [isComplete, soundEnabled]);

  return (
    <div className="app">
      <header className="top">
        <div className="title">
          <h1>FlipiFriends</h1>
          <p className="subtitle">Voltea, recuerda y gana.</p>
        </div>
        <div className="controls">
          <button
            className={`sound-toggle ${soundEnabled ? 'is-on' : 'is-off'}`}
            type="button"
            onClick={() => setSoundEnabled((prev) => !prev)}
            aria-pressed={soundEnabled}
            aria-label={soundEnabled ? 'Sonido activado' : 'Sonido desactivado'}
          >
            {soundEnabled ? <SoundOnIcon /> : <SoundOffIcon />}
          </button>
        </div>
      </header>

      <section className="status">
        <div className="status-card">
          <span>Nivel</span>
          <strong>
            {levelIndex + 1}/{LEVELS.length}
          </strong>
        </div>
        <div className="status-card">
          <span>Parejas</span>
          <strong>
            {matches}/{pairsCount}
          </strong>
        </div>
      </section>

      <Board
        key={`level-${levelIndex}`}
        deck={deck}
        onCardClick={handleCardClick}
        isLocked={isLocked}
        columns={columns}
      />

      <Activity mode={isComplete ? 'visible' : 'hidden'}>
        <Dialog
          isLastLevel={isLastLevel}
          dialogRef={dialogRef}
          handleNextLevel={handleNextLevel}
          handleReset={handleReset}
        />
      </Activity>
    </div>
  );
}

export default App;
