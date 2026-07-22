import { useEffect, useState } from 'react';

import {
  FINAL_MESSAGES,
  LEVEL_MESSAGES,
  pickNextMessage,
} from '../utils/game.js';

const CONFETTI_COLORS = ['#ffb3c1', '#ffe0a3', '#bde9ff', '#c8f3d8', '#e6d1ff'];

export const useCompletionEffects = ({
  dialogRef,
  isComplete,
  isLastLevel,
  onComplete,
  playCompletion,
}) => {
  const [completionMessage, setCompletionMessage] = useState(LEVEL_MESSAGES[0]);

  useEffect(() => {
    if (!isComplete) return undefined;

    onComplete();

    const timeout = setTimeout(() => {
      const nextMessagePool = isLastLevel ? FINAL_MESSAGES : LEVEL_MESSAGES;
      setCompletionMessage((currentMessage) =>
        pickNextMessage(nextMessagePool, currentMessage),
      );
      dialogRef.current?.showModal();
    }, 200);

    return () => clearTimeout(timeout);
  }, [dialogRef, isComplete, isLastLevel, onComplete]);

  useEffect(() => {
    if (!isComplete || !isLastLevel) return;

    let isCancelled = false;

    const launchConfetti = async () => {
      const { default: confetti } = await import('canvas-confetti');
      if (isCancelled) return;

      confetti({
        disableForReducedMotion: true,
        particleCount: 90,
        spread: 90,
        origin: { x: 0.5, y: 0.45 },
        colors: CONFETTI_COLORS,
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
    if (isComplete) playCompletion();
  }, [isComplete, playCompletion]);

  return { completionMessage };
};
