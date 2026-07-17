import { CharacterGroupOption } from './CharacterGroupOption.jsx';

import './character-selector.css';

const revealClippedGroup = (carousel, item) => {
  if (!carousel || !item) return;

  const carouselBounds = carousel.getBoundingClientRect();
  const itemBounds = item.getBoundingClientRect();
  const isClipped =
    itemBounds.left < carouselBounds.left ||
    itemBounds.right > carouselBounds.right;

  if (!isClipped) return;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  item.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'nearest',
    inline: 'center',
  });
};

const CarouselControl = ({ direction, disabled, onClick }) => {
  const isPrevious = direction === 'previous';

  return (
    <button
      className={`carousel-control is-${direction}`}
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={
        isPrevious ? 'Ver grupos anteriores' : 'Ver grupos siguientes'
      }
    >
      <img
        className={`carousel-icon ${isPrevious ? 'is-left' : ''}`}
        src="/ui-icons/chevron-3d.webp"
        alt=""
        aria-hidden="true"
      />
    </button>
  );
};

export const CharacterSelector = ({
  canScrollNext,
  canScrollPrevious,
  carouselRef,
  characterGroups,
  groupPreviews,
  onGroupChange,
  onNextGroup,
  onPreviousGroup,
  selectedGroupId,
}) => {
  const handleClippedGroupClick = (item) => {
    revealClippedGroup(carouselRef.current, item);
  };

  return (
    <section
      className="character-selector"
      aria-labelledby="character-selector-title"
    >
      <div className="carousel-stage">
        <CarouselControl
          direction="previous"
          disabled={!canScrollPrevious}
          onClick={onPreviousGroup}
        />

        <ul
          className="character-list"
          ref={carouselRef}
          aria-label="Grupos de personajes"
        >
          {characterGroups.map((group, groupIndex) => (
            <CharacterGroupOption
              key={group.id}
              group={group}
              groupIndex={groupIndex}
              isSelected={selectedGroupId === group.id}
              onChange={onGroupChange}
              onReveal={handleClippedGroupClick}
              previews={groupPreviews.get(group.id) ?? []}
            />
          ))}
        </ul>

        <CarouselControl
          direction="next"
          disabled={!canScrollNext}
          onClick={onNextGroup}
        />
      </div>
    </section>
  );
};
