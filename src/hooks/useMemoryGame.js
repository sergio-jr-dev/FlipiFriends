import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  buildDeck,
  CARD_FLIP_MS,
  getPlayableLevels,
  LEVELS,
  MISMATCH_SHAKE_MS,
} from '../utils/game.js';
import { useCompletionEffects } from './useCompletionEffects.js';
import { useLevelTimer } from './useLevelTimer.js';

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
  const [hasStarted, setHasStarted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const dialogRef = useRef(null);
  const mismatchTimeoutsRef = useRef([]);

  const playableLevels = useMemo(
    () => getPlayableLevels(LEVELS, activeGroup.characters),
    [activeGroup.characters],
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

  const totalLevels = playableLevels.length;
  const pairsCount = playableLevels[levelIndex] ?? playableLevels[0] ?? 0;
  const totalCards = pairsCount * 2;
  const isComplete = matches === pairsCount;
  const isLastLevel = levelIndex === totalLevels - 1;
  const isInteractionDisabled = isLocked || isWelcomeOpen || isComplete;
  const { elapsedLabel, finishTimer, resetTimer, startTimer } = useLevelTimer(
    hasStarted && !isWelcomeOpen && !isComplete,
  );
  const { completionMessage } = useCompletionEffects({
    dialogRef,
    isComplete,
    isLastLevel,
    onComplete: finishTimer,
    soundEnabled,
  });

  const clearMismatchTimeouts = useCallback(() => {
    mismatchTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    mismatchTimeoutsRef.current = [];
  }, []);

  const resetForLevel = useCallback(
    (nextLevelIndex, characterPool = activeGroup.characters) => {
      clearMismatchTimeouts();
      const nextPairs = playableLevels[nextLevelIndex] ?? playableLevels[0] ?? 0;
      setDeck(buildDeck(nextPairs, characterPool));
      setSelected([]);
      setMismatchCardIds([]);
      setMatches(0);
      setMoves(0);
      setHasStarted(false);
      setIsLocked(false);
      resetTimer();
    },
    [activeGroup.characters, clearMismatchTimeouts, playableLevels, resetTimer],
  );

  useEffect(
    () => () => {
      clearMismatchTimeouts();
    },
    [clearMismatchTimeouts],
  );

  const handleCardClick = useCallback((id) => {
    if (isInteractionDisabled) return;

    const card = cardsById.get(id);
    if (!card || card.flipped || card.matched) return;

    startTimer();
    setHasStarted(true);
    setMismatchCardIds([]);

    if (selected.length === 1) {
      setMoves((current) => current + 1);

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
  }, [cardsById, isInteractionDisabled, selected, startTimer]);

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
      const nextLevel = Math.min(current + 1, totalLevels - 1);
      resetForLevel(nextLevel);
      return nextLevel;
    });

    dialogRef.current?.close();
  }, [resetForLevel, totalLevels]);

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
    totalLevels,
  };
};
