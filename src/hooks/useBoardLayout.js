import { useEffect, useMemo, useRef, useState } from 'react';

import { resolveBoardLayout } from '../utils/game.js';

export const useBoardLayout = (totalCards, isEnabled) => {
  const boardAreaRef = useRef(null);
  const [boardArea, setBoardArea] = useState({ width: 1024, height: 720 });

  useEffect(() => {
    if (!boardAreaRef.current || !isEnabled) return undefined;

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
  }, [isEnabled]);

  const boardLayout = useMemo(
    () => resolveBoardLayout(totalCards, boardArea.width, boardArea.height),
    [totalCards, boardArea.width, boardArea.height],
  );

  return { boardAreaRef, boardLayout };
};
