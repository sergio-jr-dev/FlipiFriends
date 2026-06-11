import { useCallback, useEffect, useRef, useState } from 'react';

import { formatElapsed } from '../utils/game.js';

export const useLevelTimer = (isRunning) => {
  const [elapsedMs, setElapsedMs] = useState(0);
  const levelStartRef = useRef(0);

  const startTimer = useCallback(() => {
    if (!levelStartRef.current) {
      levelStartRef.current = Date.now();
      setElapsedMs(0);
    }
  }, []);

  const resetTimer = useCallback(() => {
    setElapsedMs(0);
    levelStartRef.current = 0;
  }, []);

  const finishTimer = useCallback(() => {
    if (levelStartRef.current) {
      setElapsedMs(Date.now() - levelStartRef.current);
    }
  }, []);

  useEffect(() => {
    if (!isRunning) return undefined;

    if (!levelStartRef.current) {
      levelStartRef.current = Date.now();
    }

    const interval = setInterval(() => {
      setElapsedMs(Date.now() - levelStartRef.current);
    }, 250);

    return () => clearInterval(interval);
  }, [isRunning]);

  return {
    elapsedLabel: formatElapsed(elapsedMs),
    finishTimer,
    resetTimer,
    startTimer,
  };
};
