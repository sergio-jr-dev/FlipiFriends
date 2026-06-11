import { useEffect, useRef, useState } from 'react';

export const useCharacterScrollHint = (isEnabled, contentKey) => {
  const characterListRef = useRef(null);
  const [showCharacterScrollHint, setShowCharacterScrollHint] = useState(false);

  useEffect(() => {
    if (!isEnabled || !characterListRef.current) {
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
  }, [isEnabled, contentKey]);

  return { characterListRef, showCharacterScrollHint };
};
