import { useEffect, useRef } from 'react';

export const useViewFocus = (isWelcomeOpen, levelIndex) => {
  const gameTitleRef = useRef(null);
  const welcomeTitleRef = useRef(null);
  const previousViewRef = useRef({ isWelcomeOpen, levelIndex });
  const isInitialRenderRef = useRef(true);

  useEffect(() => {
    const previousView = previousViewRef.current;
    previousViewRef.current = { isWelcomeOpen, levelIndex };

    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false;
      return undefined;
    }

    const didScreenChange = previousView.isWelcomeOpen !== isWelcomeOpen;
    const didLevelChange =
      !isWelcomeOpen && previousView.levelIndex !== levelIndex;

    if (!didScreenChange && !didLevelChange) return undefined;

    const titleRef = isWelcomeOpen ? welcomeTitleRef : gameTitleRef;
    const animationFrame = requestAnimationFrame(() => {
      titleRef.current?.focus();
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [isWelcomeOpen, levelIndex]);

  return { gameTitleRef, welcomeTitleRef };
};
