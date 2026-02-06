import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { characterGroups, defaultCharacterGroupId } from './data/characters.js';
import Board from './components/Board.jsx';
import { Dialog } from './components/dialog/Dialog.jsx';
import { LevelIcon } from './components/icons/LevelIcon.jsx';
import { MovesIcon } from './components/icons/MovesIcon.jsx';
import { PairsIcon } from './components/icons/PairsIcon.jsx';
import { PlayIcon } from './components/icons/PlayIcon.jsx';
import { PlusIcon } from './components/icons/PlusIcon.jsx';
import { RestartIcon } from './components/icons/RestartIcon.jsx';
import { SoundOffIcon } from './components/icons/SoundOffIcon.jsx';
import { SoundOnIcon } from './components/icons/SoundOnIcon.jsx';
import { TimeIcon } from './components/icons/TimeIcon.jsx';

const LEVELS = [2, 3, 4, 6, 8, 10, 12];
const CARD_RATIO = 1.25;
const CARD_FLIP_MS = 500;
const MISMATCH_SHAKE_MS = 340;
const LEVEL_MESSAGES = [
  'Buen trabajo, puedes continuar al siguiente nivel.',
  'Lo has hecho genial. Vamos a por el siguiente.',
  'Increible memoria. Listo para continuar.',
  'Gran nivel. Sigue asi.',
  'Fantastico. Estas mejorando mucho.',
  'Muy bien hecho. A por el siguiente reto.',
  'Que buen nivel. Continua jugando.',
  'Lo estas haciendo de maravilla.',
];
const FINAL_MESSAGES = [
  'Eres un campeon de FlipiFriends.',
  'Partida completa. Has encontrado todas las parejas.',
  'Mision cumplida. Juego terminado con exito.',
  'Has terminado todos los niveles. Super logro.',
  'Increible final. Te has salido.',
  'Juego completo. Memoria de experto.',
  'Enhorabuena. Nivel final superado.',
  'Gran victoria. Has ganado la partida.',
];
const characterGroupsById = new Map(
  characterGroups.map((group) => [group.id, group]),
);

const shuffle = (items) => {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const pickRandomItems = (items, count) =>
  shuffle(items).slice(0, Math.min(count, items.length));

const buildDeck = (pairsCount, availableCharacters) => {
  if (pairsCount <= 0 || availableCharacters.length === 0) return [];

  const chosen = [];
  while (chosen.length < pairsCount) {
    chosen.push(...shuffle(availableCharacters));
  }

  const duplicated = chosen.slice(0, pairsCount).flatMap((character, pairIndex) => {
    const pairId = `pair-${pairIndex}`;
    return [
      {
        id: `${character.id}-${pairIndex}-a`,
        pairId,
        character,
        flipped: false,
        matched: false,
      },
      {
        id: `${character.id}-${pairIndex}-b`,
        pairId,
        character,
        flipped: false,
        matched: false,
      },
    ];
  });

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

const pickNextMessage = (pool, previousMessage) => {
  if (pool.length === 0) return '';
  if (pool.length === 1) return pool[0];

  let nextMessage = pool[Math.floor(Math.random() * pool.length)];
  while (nextMessage === previousMessage) {
    nextMessage = pool[Math.floor(Math.random() * pool.length)];
  }

  return nextMessage;
};

function App() {
  const initialGroup =
    characterGroupsById.get(defaultCharacterGroupId) ?? characterGroups[0];

  const [selectedGroupId, setSelectedGroupId] = useState(initialGroup.id);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(true);
  const [levelIndex, setLevelIndex] = useState(0);
  const [deck, setDeck] = useState(() =>
    buildDeck(LEVELS[0], initialGroup.characters),
  );
  const [selected, setSelected] = useState([]);
  const [mismatchCardIds, setMismatchCardIds] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [completionMessage, setCompletionMessage] = useState(LEVEL_MESSAGES[0]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [boardArea, setBoardArea] = useState({ width: 1024, height: 720 });
  const [showCharacterScrollHint, setShowCharacterScrollHint] = useState(false);

  const levelStartRef = useRef(0);
  const boardAreaRef = useRef(null);
  const dialogRef = useRef(null);
  const characterListRef = useRef(null);

  const activeGroup = useMemo(
    () => characterGroupsById.get(selectedGroupId) ?? characterGroups[0],
    [selectedGroupId],
  );
  const sortedCharacterGroups = useMemo(
    () =>
      [...characterGroups].sort((groupA, groupB) =>
        groupA.label.localeCompare(groupB.label, 'es', { sensitivity: 'base' }),
      ),
    [],
  );
  const groupPreviews = useMemo(
    () =>
      new Map(
        characterGroups.map((group) => [group.id, pickRandomItems(group.characters, 4)]),
      ),
    [isWelcomeOpen],
  );
  const cardsById = useMemo(
    () => new Map(deck.map((card) => [card.id, card])),
    [deck],
  );
  const selectedIds = useMemo(() => new Set(selected), [selected]);
  const mismatchIds = useMemo(
    () => new Set(mismatchCardIds),
    [mismatchCardIds],
  );

  const pairsCount = LEVELS[levelIndex];
  const totalCards = pairsCount * 2;
  const isComplete = matches === pairsCount;
  const isLastLevel = levelIndex === LEVELS.length - 1;
  const isInteractionDisabled = isLocked || isWelcomeOpen || isComplete;

  const boardLayout = useMemo(
    () => resolveBoardLayout(totalCards, boardArea.width, boardArea.height),
    [totalCards, boardArea.width, boardArea.height],
  );

  const elapsedLabel = formatElapsed(elapsedMs);

  const resetForLevel = useCallback(
    (nextLevelIndex, characterPool = activeGroup.characters) => {
      const nextPairs = LEVELS[nextLevelIndex];
      setDeck(buildDeck(nextPairs, characterPool));
      setSelected([]);
      setMismatchCardIds([]);
      setMatches(0);
      setMoves(0);
      setElapsedMs(0);
      setIsLocked(false);
      levelStartRef.current = Date.now();
    },
    [activeGroup.characters],
  );

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
    if (!isWelcomeOpen || !characterListRef.current) {
      setShowCharacterScrollHint(false);
      return undefined;
    }

    const node = characterListRef.current;
    const updateScrollHint = () => {
      const canScroll = node.scrollHeight - node.clientHeight > 2;
      const reachedBottom = node.scrollTop + node.clientHeight >= node.scrollHeight - 2;
      setShowCharacterScrollHint(canScroll && !reachedBottom);
    };

    updateScrollHint();
    node.addEventListener('scroll', updateScrollHint, { passive: true });

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateScrollHint);
      return () => {
        node.removeEventListener('scroll', updateScrollHint);
        window.removeEventListener('resize', updateScrollHint);
      };
    }

    const observer = new ResizeObserver(updateScrollHint);
    observer.observe(node);

    return () => {
      node.removeEventListener('scroll', updateScrollHint);
      observer.disconnect();
    };
  }, [isWelcomeOpen, sortedCharacterGroups.length]);

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
    const firstCard = cardsById.get(firstId);
    const secondCard = cardsById.get(secondId);

    if (!firstCard || !secondCard) return undefined;

    if (firstCard.pairId === secondCard.pairId) {
      setMismatchCardIds([]);
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

    setMismatchCardIds([]);

    const mismatchIdsNext = [firstId, secondId];
    const startShakeTimeout = setTimeout(() => {
      setMismatchCardIds(mismatchIdsNext);
    }, CARD_FLIP_MS);

    const timeout = setTimeout(() => {
      setDeck((prev) =>
        prev.map((card) =>
          card.id === firstId || card.id === secondId
            ? { ...card, flipped: false }
            : card,
        ),
      );
      setSelected([]);
      setMismatchCardIds([]);
      setIsLocked(false);
    }, CARD_FLIP_MS + MISMATCH_SHAKE_MS + 60);

    return () => {
      clearTimeout(startShakeTimeout);
      clearTimeout(timeout);
    };
  }, [selected, cardsById]);

  useEffect(() => {
    if (!isComplete) return undefined;

    if (levelStartRef.current) {
      setElapsedMs(Date.now() - levelStartRef.current);
    }

    const nextMessagePool = isLastLevel ? FINAL_MESSAGES : LEVEL_MESSAGES;
    setCompletionMessage((currentMessage) =>
      pickNextMessage(nextMessagePool, currentMessage),
    );

    const timeout = setTimeout(() => {
      dialogRef.current?.showModal();
    }, 200);

    return () => clearTimeout(timeout);
  }, [isComplete, isLastLevel]);

  useEffect(() => {
    if (!isComplete || !isLastLevel) return;

    let isCancelled = false;

    const launchConfetti = async () => {
      const { default: confetti } = await import('canvas-confetti');
      if (isCancelled) return;

      confetti({
        particleCount: 90,
        spread: 90,
        origin: { x: 0.5, y: 0.45 },
        colors: ['#ffb3c1', '#ffe0a3', '#bde9ff', '#c8f3d8', '#e6d1ff'],
        startVelocity: 34,
        gravity: 0.85,
        ticks: 320,
      });
    };

    launchConfetti();

    return () => {
      isCancelled = true;
    };
  }, [isComplete, isLastLevel]);

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

  const handleCardClick = useCallback((id) => {
    if (isInteractionDisabled) return;

    const card = cardsById.get(id);
    if (!card || card.flipped || card.matched) return;

    setMoves((current) => current + 1);
    setMismatchCardIds([]);

    setDeck((prev) =>
      prev.map((item) => (item.id === id ? { ...item, flipped: true } : item)),
    );

    if (selected.length === 1) {
      setIsLocked(true);
      setSelected((prev) => [...prev, id]);
    } else {
      setSelected([id]);
    }
  }, [cardsById, isInteractionDisabled, selected.length]);

  const handleStartGame = useCallback(() => {
    setLevelIndex(0);
    resetForLevel(0, activeGroup.characters);
    dialogRef.current?.close();
    setIsWelcomeOpen(false);
  }, [activeGroup.characters, resetForLevel]);

  const handleGoToWelcome = useCallback(() => {
    setLevelIndex(0);
    resetForLevel(0);
    setIsWelcomeOpen(true);
    dialogRef.current?.close();
  }, [resetForLevel]);

  const handleNextLevel = useCallback(() => {
    setLevelIndex((current) => {
      const nextLevel = Math.min(current + 1, LEVELS.length - 1);
      resetForLevel(nextLevel);
      return nextLevel;
    });

    dialogRef.current?.close();
  }, [resetForLevel]);

  const handleToggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  return (
    <div className="app">
      {!isWelcomeOpen ? (
        <header className="top">
          <div className="brand">
            <span className="logo-badge" aria-hidden="true">
              <img className="logo-image" src="/brand/logo.png" alt="" />
            </span>
            <div className="title">
              <h1>FlipiFriends</h1>
              <p className="subtitle">{activeGroup.label}</p>
            </div>
          </div>
          <div className="controls">
            <button
              className="sound-toggle"
              type="button"
              onClick={handleGoToWelcome}
              aria-label="Volver a inicio"
            >
              <RestartIcon />
            </button>
            <button
              className={`sound-toggle ${soundEnabled ? 'is-on' : 'is-off'}`}
              type="button"
              onClick={handleToggleSound}
              aria-pressed={soundEnabled}
              aria-label={soundEnabled ? 'Sonido activado' : 'Sonido desactivado'}
            >
              {soundEnabled ? <SoundOnIcon /> : <SoundOffIcon />}
            </button>
          </div>
        </header>
      ) : null}

      <main className={`main-content ${isWelcomeOpen ? 'is-welcome' : 'is-game'}`}>
        {isWelcomeOpen ? (
          <section className="welcome">
            <header className="welcome-brand">
              <span className="logo-badge is-large" aria-hidden="true">
                <img className="logo-image" src="/brand/logo.png" alt="" />
              </span>
              <div>
                <h1>Bienvenido a FlipiFriends</h1>
                <p>Un juego para descubrir parejas y divertirse aprendiendo.</p>
              </div>
            </header>

            <section className="character-selector" aria-label="Seleccion de personajes">
              <h2>Elige con que amigos quieres jugar</h2>
              <ul className="character-list" ref={characterListRef}>
                {sortedCharacterGroups.map((group) => (
                  <li key={group.id} className="character-item">
                    <label className="character-option">
                      <div className="character-option-head">
                        <input
                          type="radio"
                          name="character-group"
                          value={group.id}
                          checked={selectedGroupId === group.id}
                          onChange={() => setSelectedGroupId(group.id)}
                        />
                        <h3>{group.label}</h3>
                      </div>
                      <div className="character-preview" aria-hidden="true">
                        {(groupPreviews.get(group.id) ?? []).map((character) => (
                          <img
                            key={character.id}
                            src={character.image}
                            alt=""
                            className="preview-avatar"
                          />
                        ))}
                        {group.characters.length > 4 ? (
                          <span className="preview-avatar preview-more">
                            <PlusIcon className="preview-more-icon" />
                          </span>
                        ) : null}
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
              <div
                className={`character-scroll-hint ${showCharacterScrollHint ? '' : 'is-hidden'}`}
                aria-hidden="true"
              >
                <span className="scroll-chevron" />
                <span className="scroll-chevron" />
              </div>
            </section>

            <button className="primary start-button" type="button" onClick={handleStartGame}>
              <PlayIcon className="button-icon" />
              <span>Empezar a jugar</span>
            </button>
          </section>
        ) : (
          <section className="board-wrap" ref={boardAreaRef}>
            <Board
              key={`level-${levelIndex}-${selectedGroupId}`}
              deck={deck}
              onCardClick={handleCardClick}
              isInteractionDisabled={isInteractionDisabled}
              selectedIds={selectedIds}
              mismatchIds={mismatchIds}
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
            <span className="status-label">Nivel</span>
            <LevelIcon className="status-icon" />
            <strong>
              {levelIndex + 1}/{LEVELS.length}
            </strong>
          </div>
          <div className="status-item pairs">
            <span className="status-label">Parejas</span>
            <PairsIcon className="status-icon" />
            <strong>
              {matches}/{pairsCount}
            </strong>
          </div>
          <div className="status-item time">
            <span className="status-label">Tiempo</span>
            <TimeIcon className="status-icon" />
            <strong>{elapsedLabel}</strong>
          </div>
          <div className="status-item moves">
            <span className="status-label">Movimientos</span>
            <MovesIcon className="status-icon" />
            <strong>{moves}</strong>
          </div>
        </section>
      ) : null}

      <Dialog
        isLastLevel={isLastLevel}
        dialogRef={dialogRef}
        handleNextLevel={handleNextLevel}
        handleGoToWelcome={handleGoToWelcome}
        level={levelIndex + 1}
        totalLevels={LEVELS.length}
        pairs={pairsCount}
        timeLabel={elapsedLabel}
        moves={moves}
        message={completionMessage}
      />
    </div>
  );
}

export default App;
