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
  soundEnabled,
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
    if (!isComplete || !soundEnabled) return undefined;

    let audioContext;
    let isCancelled = false;

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
      const AudioContextConstructor =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContextConstructor) return;

      audioContext = new AudioContextConstructor();

      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      if (isCancelled) {
        audioContext.close();
        return;
      }

      const now = audioContext.currentTime;
      playTone(now, 523.25, 0.2, 0.25);
      playTone(now + 0.18, 659.25, 0.22, 0.22);
      playTone(now + 0.36, 783.99, 0.26, 0.2);
    };

    playChime();

    return () => {
      isCancelled = true;
      if (audioContext) audioContext.close();
    };
  }, [isComplete, soundEnabled]);

  return { completionMessage };
};
