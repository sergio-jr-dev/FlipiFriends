import { useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';

import { characterGroups, defaultCharacterGroupId } from './data/characters.js';
import Board from './components/Board.jsx';
import { Dialog } from './components/dialog/Dialog.jsx';
import { SoundOffIcon } from './components/icons/SoundOffIcon.jsx';
import { SoundOnIcon } from './components/icons/SoundOnIcon.jsx';

const LEVELS = [2, 3, 4, 6, 8, 10];
const CARD_RATIO = 1.25;

const shuffle = (items) => {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const buildDeck = (pairsCount, availableCharacters) => {
  const maxPairs = Math.min(pairsCount, availableCharacters.length);
  const chosen = shuffle(availableCharacters).slice(0, maxPairs);
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

const formatElapsed = (milliseconds) => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const resolveBoardLayout = (totalCards, width, height) => {
  const safeWidth = Math.max(260, width);
  const safeHeight = Math.max(220, height);
  const gap = safeWidth < 720 ? 8 : 12;
  const maxColumns = Math.max(2, Math.min(totalCards, 10));

  let best = {
    columns: Math.min(4, maxColumns),
    cardSize: 64,
    gap,
  };

  for (let columns = 2; columns <= maxColumns; columns += 1) {
    const rows = Math.ceil(totalCards / columns);
    const freeWidth = safeWidth - gap * (columns - 1);
    const freeHeight = safeHeight - gap * (rows - 1);

    if (freeWidth <= 0 || freeHeight <= 0) continue;

    const byWidth = freeWidth / columns;
    const byHeight = freeHeight / rows / CARD_RATIO;
    const cardSize = Math.floor(Math.min(byWidth, byHeight, 148));

    if (cardSize > best.cardSize) {
      best = {
        columns,
        cardSize,
        gap,
      };
    }
  }

  return {
    columns: best.columns,
    cardSize: Math.max(40, best.cardSize),
    gap: best.gap,
  };
};

function App() {
  const selectedGroup = useMemo(
    () =>
      characterGroups.find((group) => group.id === defaultCharacterGroupId) ??
      characterGroups[0],
    [],
  );

  const [selectedGroupId, setSelectedGroupId] = useState(selectedGroup.id);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(true);
  const [levelIndex, setLevelIndex] = useState(0);
  const [deck, setDeck] = useState(() =>
    buildDeck(LEVELS[0], selectedGroup.characters),
  );
  const [selected, setSelected] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [boardArea, setBoardArea] = useState({ width: 1024, height: 720 });

  const levelStartRef = useRef(0);
  const boardAreaRef = useRef(null);
  const dialogRef = useRef(null);

  const activeGroup = useMemo(
    () =>
      characterGroups.find((group) => group.id === selectedGroupId) ??
      characterGroups[0],
    [selectedGroupId],
  );

  const pairsCount = Math.min(LEVELS[levelIndex], activeGroup.characters.length);
  const totalCards = pairsCount * 2;
  const isComplete = matches === pairsCount;
  const isLastLevel = levelIndex === LEVELS.length - 1;

  const boardLayout = useMemo(
    () => resolveBoardLayout(totalCards, boardArea.width, boardArea.height),
    [totalCards, boardArea.width, boardArea.height],
  );

  const elapsedLabel = formatElapsed(elapsedMs);

  const resetForLevel = (nextLevelIndex, characterPool = activeGroup.characters) => {
    const nextPairs = Math.min(LEVELS[nextLevelIndex], characterPool.length);
    setDeck(buildDeck(nextPairs, characterPool));
    setSelected([]);
    setMatches(0);
    setMoves(0);
    setElapsedMs(0);
    setIsLocked(false);
    levelStartRef.current = Date.now();
  };

  useEffect(() => {
    if (!boardAreaRef.current || isWelcomeOpen) return undefined;

    const node = boardAreaRef.current;

    const updateSize = () => {
      setBoardArea({
        width: node.clientWidth,
        height: node.clientHeight,
      });
    };

    updateSize();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }

    const observer = new ResizeObserver(updateSize);
    observer.observe(node);

    return () => observer.disconnect();
  }, [isWelcomeOpen]);

  useEffect(() => {
    if (isWelcomeOpen || isComplete) return undefined;

    if (!levelStartRef.current) {
      levelStartRef.current = Date.now();
    }

    const interval = setInterval(() => {
      setElapsedMs(Date.now() - levelStartRef.current);
    }, 250);

    return () => clearInterval(interval);
  }, [isWelcomeOpen, isComplete, levelIndex]);

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

  useEffect(() => {
    if (!isComplete) return undefined;

    if (levelStartRef.current) {
      setElapsedMs(Date.now() - levelStartRef.current);
    }

    const timeout = setTimeout(() => {
      dialogRef.current?.showModal();
    }, 200);

    return () => clearTimeout(timeout);
  }, [isComplete]);

  useEffect(() => {
    if (!isComplete || !soundEnabled) return undefined;

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

  const handleCardClick = (id) => {
    if (isLocked || isWelcomeOpen || isComplete) return;

    const card = deck.find((item) => item.id === id);
    if (!card || card.flipped || card.matched) return;

    setMoves((current) => current + 1);

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

  const handleStartGame = () => {
    setLevelIndex(0);
    resetForLevel(0, activeGroup.characters);
    dialogRef.current?.close();
    setIsWelcomeOpen(false);
  };

  const handleReset = () => {
    setLevelIndex(0);
    resetForLevel(0);
    dialogRef.current?.close();
  };

  const handleNextLevel = () => {
    if (isLastLevel) {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { x: 0.5, y: 0.45 },
        colors: ['#ffb3c1', '#ffe0a3', '#bde9ff', '#c8f3d8', '#e6d1ff'],
        startVelocity: 32,
        gravity: 0.85,
        ticks: 300,
      });
      return;
    }

    setLevelIndex((current) => {
      const nextLevel = Math.min(current + 1, LEVELS.length - 1);
      resetForLevel(nextLevel);
      return nextLevel;
    });

    dialogRef.current?.close();
  };

  return (
    <div className="app">
      {!isWelcomeOpen ? (
        <header className="top">
          <div className="brand">
            <span className="logo-badge" aria-hidden="true">
              <img src="/brand/simple-logo.svg" alt="" />
            </span>
            <div className="title">
              <h1>FlipiFriends</h1>
              <p className="subtitle">{`Coleccion activa: ${activeGroup.label}`}</p>
            </div>
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
      ) : null}

      <main className="main-content">
        {isWelcomeOpen ? (
          <section className="welcome" role="dialog" aria-modal="true">
            <div className="welcome-brand">
              <span className="logo-badge is-large" aria-hidden="true">
                <img src="/brand/simple-logo.svg" alt="" />
              </span>
              <div>
                <h2>Bienvenido a FlipiFriends</h2>
                <p>Un juego para descubrir parejas y divertirse aprendiendo.</p>
              </div>
            </div>
            <section className="welcome-steps" aria-label="Como jugar">
              <article className="welcome-step">
                <div className="step-head">
                  <span className="step-badge">1</span>
                  <h3>Voltea cartas</h3>
                </div>
                <p>Toca dos cartas para descubrir si son iguales.</p>
                <div className="step-visual">Espacio para imagen</div>
              </article>
              <article className="welcome-step">
                <div className="step-head">
                  <span className="step-badge">2</span>
                  <h3>Haz parejas</h3>
                </div>
                <p>Si aciertas, la pareja se queda descubierta.</p>
                <div className="step-visual">Espacio para imagen</div>
              </article>
              <article className="welcome-step">
                <div className="step-head">
                  <span className="step-badge">3</span>
                  <h3>Gana niveles</h3>
                </div>
                <p>Completa todos los niveles para ganar.</p>
                <div className="step-visual">Espacio para imagen</div>
              </article>
            </section>

            <fieldset className="character-selector">
              <legend>Elige con que amigos quieres jugar</legend>
              {characterGroups.map((group) => (
                <label key={group.id} className="character-option">
                  <div className="character-option-head">
                    <input
                      type="radio"
                      name="character-group"
                      value={group.id}
                      checked={selectedGroupId === group.id}
                      onChange={() => setSelectedGroupId(group.id)}
                    />
                    <span>{group.label}</span>
                  </div>
                  <div className="character-preview" aria-hidden="true">
                    {group.characters.slice(0, 4).map((character) => (
                      <img
                        key={character.id}
                        src={character.image}
                        alt=""
                        className="preview-avatar"
                      />
                    ))}
                  </div>
                </label>
              ))}
            </fieldset>

            <button className="primary" type="button" onClick={handleStartGame}>
              Empezar a jugar
            </button>
          </section>
        ) : (
          <section className="board-wrap" ref={boardAreaRef}>
            <Board
              key={`level-${levelIndex}-${selectedGroupId}`}
              deck={deck}
              onCardClick={handleCardClick}
              isLocked={isLocked}
              columns={boardLayout.columns}
              cardSize={boardLayout.cardSize}
              gap={boardLayout.gap}
            />
          </section>
        )}
      </main>

      {!isWelcomeOpen ? (
        <section className="status-dock" aria-live="polite">
          <div className="status-item level">
            <span>Nivel</span>
            <strong>
              {levelIndex + 1}/{LEVELS.length}
            </strong>
          </div>
          <div className="status-item pairs">
            <span>Parejas</span>
            <strong>
              {matches}/{pairsCount}
            </strong>
          </div>
          <div className="status-item time">
            <span>Tiempo</span>
            <strong>{elapsedLabel}</strong>
          </div>
          <div className="status-item moves">
            <span>Movimientos</span>
            <strong>{moves}</strong>
          </div>
        </section>
      ) : null}

      <Dialog
        isLastLevel={isLastLevel}
        dialogRef={dialogRef}
        handleNextLevel={handleNextLevel}
        handleReset={handleReset}
        level={levelIndex + 1}
        totalLevels={LEVELS.length}
        pairs={pairsCount}
        timeLabel={elapsedLabel}
        moves={moves}
      />
    </div>
  );
}

export default App;
