import { useCallback, useEffect, useRef, useState } from 'react';

const SCROLL_TOLERANCE = 3;

export const useCharacterCarousel = (isEnabled, contentKey) => {
  const carouselRef = useRef(null);
  const [navigation, setNavigation] = useState({
    canScrollNext: false,
    canScrollPrevious: false,
  });

  const updateNavigation = useCallback(() => {
    const node = carouselRef.current;

    if (!node) {
      setNavigation({
        canScrollNext: false,
        canScrollPrevious: false,
      });
      return;
    }

    const maximumScrollLeft = node.scrollWidth - node.clientWidth;

    setNavigation({
      canScrollPrevious: node.scrollLeft > SCROLL_TOLERANCE,
      canScrollNext:
        node.scrollLeft < maximumScrollLeft - SCROLL_TOLERANCE,
    });
  }, []);

  useEffect(() => {
    const node = carouselRef.current;

    if (!isEnabled || !node) {
      return undefined;
    }

    updateNavigation();
    node.addEventListener('scroll', updateNavigation, { passive: true });

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateNavigation);

      return () => {
        node.removeEventListener('scroll', updateNavigation);
        window.removeEventListener('resize', updateNavigation);
      };
    }

    const observer = new ResizeObserver(updateNavigation);
    observer.observe(node);

    return () => {
      node.removeEventListener('scroll', updateNavigation);
      observer.disconnect();
    };
  }, [contentKey, isEnabled, updateNavigation]);

  const scrollByPage = useCallback((direction) => {
    const node = carouselRef.current;

    if (!node) return;

    const firstItem = node.querySelector('.character-item');
    const styles = window.getComputedStyle(node);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
    const itemWidth = firstItem?.getBoundingClientRect().width ?? node.clientWidth;
    const itemStep = itemWidth + gap;
    const visibleItems = Math.max(
      1,
      Math.round((node.clientWidth + gap) / itemStep),
    );
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    node.scrollBy({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      left: direction * itemStep * visibleItems,
    });
  }, []);

  return {
    carouselRef,
    canScrollNext: navigation.canScrollNext,
    canScrollPrevious: navigation.canScrollPrevious,
    scrollNext: () => scrollByPage(1),
    scrollPrevious: () => scrollByPage(-1),
  };
};
