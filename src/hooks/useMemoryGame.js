import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  buildDeck,
  CARD_FLIP_MS,
  FINAL_MESSAGES,
  formatElapsed,
  LEVEL_MESSAGES,
  LEVELS,
  MISMATCH_SHAKE_MS,
  pickNextMessage,
} from '../utils/game.js';

export const useMemoryGame = (activeGroup) => {
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(true);
  const [levelIndex, setLevelIndex] = useState(0);
  const [deck, setDeck] = useState(() =>
    buildDeck(LEVELS[0], activeGroup.characters),
  );
  const [selected, setSelected] = useState([]);
  const [mismatchCardIds, setMismatchCardIds] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [completionMessage, setCompletionMessage] = useState(LEVEL_MESSAGES[0]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const dialogRef = useRef(null);
  const levelStartRef = useRef(0);
  const mismatchTimeoutsRef = useRef([]);

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
  const elapsedLabel = formatElapsed(elapsedMs);

  const clearMismatchTimeouts = useCallback(() => {
    mismatchTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    mismatchTimeoutsRef.current = [];
  }, []);

  const resetForLevel = useCallback(
    (nextLevelIndex, characterPool = activeGroup.characters) => {
      clearMismatchTimeouts();
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
    [activeGroup.characters, clearMismatchTimeouts],
  );

  useEffect(
    () => () => {
      clearMismatchTimeouts();
    },
    [clearMismatchTimeouts],
  );

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

    if (selected.length === 1) {
      const firstId = selected[0];
      const firstCard = cardsById.get(firstId);

      if (!firstCard) return;

      const isMatch = firstCard.pairId === card.pairId;

      setDeck((prev) =>
        prev.map((item) => {
          if (item.id !== id && item.id !== firstId) return item;
          return {
            ...item,
            flipped: true,
            matched: isMatch ? true : item.matched,
          };
        }),
      );

      if (isMatch) {
        setSelected([]);
        setMatches((current) => current + 1);
        return;
      }

      setIsLocked(true);
      setSelected([firstId, id]);

      const mismatchIdsNext = [firstId, id];
      const startShakeTimeout = setTimeout(() => {
        setMismatchCardIds(mismatchIdsNext);
      }, CARD_FLIP_MS);

      const timeout = setTimeout(() => {
        setDeck((prev) =>
          prev.map((item) =>
            item.id === firstId || item.id === id
              ? { ...item, flipped: false }
              : item,
          ),
        );
        setSelected([]);
        setMismatchCardIds([]);
        setIsLocked(false);
        mismatchTimeoutsRef.current = [];
      }, CARD_FLIP_MS + MISMATCH_SHAKE_MS + 60);

      mismatchTimeoutsRef.current = [startShakeTimeout, timeout];
      return;
    }

    setDeck((prev) =>
      prev.map((item) => (item.id === id ? { ...item, flipped: true } : item)),
    );
    setSelected([id]);
  }, [cardsById, isInteractionDisabled, selected]);

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

  return {
    completionMessage,
    deck,
    dialogRef,
    elapsedLabel,
    handleCardClick,
    handleGoToWelcome,
    handleNextLevel,
    handleStartGame,
    handleToggleSound,
    isInteractionDisabled,
    isLastLevel,
    isWelcomeOpen,
    levelIndex,
    matches,
    mismatchIds,
    moves,
    pairsCount,
    selectedIds,
    soundEnabled,
    totalCards,
    totalLevels: LEVELS.length,
  };
};
