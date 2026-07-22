import { useCallback, useEffect, useRef } from 'react';

const MIN_GAIN = 0.0001;

const scheduleTone = (
  audioContext,
  output,
  {
    duration,
    endFrequency,
    frequency,
    gain,
    startTime,
    type = 'sine',
  },
) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const attackTime = Math.min(0.015, duration / 3);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  if (endFrequency) {
    oscillator.frequency.exponentialRampToValueAtTime(
      endFrequency,
      startTime + duration,
    );
  }

  gainNode.gain.setValueAtTime(MIN_GAIN, startTime);
  gainNode.gain.exponentialRampToValueAtTime(
    gain,
    startTime + attackTime,
  );
  gainNode.gain.exponentialRampToValueAtTime(
    MIN_GAIN,
    startTime + duration,
  );

  oscillator.connect(gainNode);
  gainNode.connect(output);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
};

const scheduleFlip = (audioContext, output, startTime) => {
  const duration = 0.075;
  const frameCount = Math.ceil(audioContext.sampleRate * duration);
  const noiseBuffer = audioContext.createBuffer(
    1,
    frameCount,
    audioContext.sampleRate,
  );
  const samples = noiseBuffer.getChannelData(0);

  for (let index = 0; index < frameCount; index += 1) {
    const progress = index / frameCount;
    samples[index] = (Math.random() * 2 - 1) * (1 - progress);
  }

  const source = audioContext.createBufferSource();
  const filter = audioContext.createBiquadFilter();
  const gainNode = audioContext.createGain();

  source.buffer = noiseBuffer;
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1800, startTime);
  filter.frequency.exponentialRampToValueAtTime(5200, startTime + duration);
  filter.Q.value = 0.8;

  gainNode.gain.setValueAtTime(MIN_GAIN, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.075, startTime + 0.008);
  gainNode.gain.exponentialRampToValueAtTime(MIN_GAIN, startTime + duration);

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(output);
  source.start(startTime);
  source.stop(startTime + duration);
};

export const useGameSounds = (soundEnabled) => {
  const audioContextRef = useRef(null);
  const outputRef = useRef(null);

  const getAudioContext = useCallback(async (forceEnabled = false) => {
    const AudioContextConstructor =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextConstructor) return null;

    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      const audioContext = new AudioContextConstructor();
      const output = audioContext.createGain();
      output.gain.value = soundEnabled || forceEnabled ? 1 : 0;
      output.connect(audioContext.destination);
      audioContextRef.current = audioContext;
      outputRef.current = output;
    }

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    return audioContextRef.current;
  }, [soundEnabled]);

  const playSound = useCallback(
    async (schedule) => {
      if (!soundEnabled) return;

      try {
        const audioContext = await getAudioContext();
        if (!audioContext || !outputRef.current) return;

        schedule(audioContext, outputRef.current, audioContext.currentTime);
      } catch {
        // Audio is an optional enhancement and must never interrupt the game.
      }
    },
    [getAudioContext, soundEnabled],
  );

  const playFlip = useCallback(() => {
    playSound((audioContext, output, now) => {
      scheduleFlip(audioContext, output, now);
    });
  }, [playSound]);

  const playMatch = useCallback(() => {
    playSound((audioContext, output, now) => {
      const resultTime = now + 0.18;
      scheduleTone(audioContext, output, {
        frequency: 659.25,
        duration: 0.13,
        gain: 0.11,
        startTime: resultTime,
      });
      scheduleTone(audioContext, output, {
        frequency: 880,
        duration: 0.17,
        gain: 0.09,
        startTime: resultTime + 0.1,
      });
    });
  }, [playSound]);

  const playMismatch = useCallback(() => {
    playSound((audioContext, output, now) => {
      scheduleTone(audioContext, output, {
        frequency: 220,
        endFrequency: 145,
        duration: 0.22,
        gain: 0.1,
        startTime: now + 0.2,
        type: 'triangle',
      });
    });
  }, [playSound]);

  const playCompletion = useCallback(() => {
    playSound((audioContext, output, now) => {
      const chimeTime = now + 0.48;
      scheduleTone(audioContext, output, {
        frequency: 523.25,
        duration: 0.2,
        gain: 0.25,
        startTime: chimeTime,
        type: 'triangle',
      });
      scheduleTone(audioContext, output, {
        frequency: 659.25,
        duration: 0.22,
        gain: 0.22,
        startTime: chimeTime + 0.18,
        type: 'triangle',
      });
      scheduleTone(audioContext, output, {
        frequency: 783.99,
        duration: 0.26,
        gain: 0.2,
        startTime: chimeTime + 0.36,
        type: 'triangle',
      });
    });
  }, [playSound]);

  const playSoundEnabled = useCallback(async () => {
    try {
      const audioContext = await getAudioContext(true);
      const output = outputRef.current;
      if (!audioContext || !output) return;

      output.gain.cancelScheduledValues(audioContext.currentTime);
      output.gain.setValueAtTime(1, audioContext.currentTime);
      scheduleTone(audioContext, output, {
        frequency: 880,
        endFrequency: 1046.5,
        duration: 0.065,
        gain: 0.065,
        startTime: audioContext.currentTime,
        type: 'triangle',
      });
    } catch {
      // Audio is an optional enhancement and must never interrupt the game.
    }
  }, [getAudioContext]);

  useEffect(() => {
    const audioContext = audioContextRef.current;
    const output = outputRef.current;

    if (!audioContext || !output || audioContext.state === 'closed') return;

    output.gain.cancelScheduledValues(audioContext.currentTime);
    output.gain.setTargetAtTime(
      soundEnabled ? 1 : 0,
      audioContext.currentTime,
      0.015,
    );
  }, [soundEnabled]);

  useEffect(
    () => () => {
      const audioContext = audioContextRef.current;
      audioContextRef.current = null;
      outputRef.current = null;

      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
    },
    [],
  );

  return {
    playCompletion,
    playFlip,
    playMatch,
    playMismatch,
    playSoundEnabled,
  };
};
