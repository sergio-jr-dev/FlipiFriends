import { memo, useCallback } from 'react';

import './card.css';

function Card({
  card,
  position,
  onCardClick,
  disabled,
  isSelected,
  isMismatched,
}) {
  const isRevealed = card.flipped || card.matched;
  const accessibleLabel = card.matched
    ? `Carta ${position}: ${card.character.name}, pareja encontrada`
    : isRevealed
      ? `Carta ${position} descubierta: ${card.character.name}`
      : `Carta oculta ${position}`;

  const handleClick = useCallback(() => {
    onCardClick(card.id);
  }, [onCardClick, card.id]);

  return (
    <button
      className={`card ${isRevealed ? 'is-flipped' : ''} ${
        card.matched ? 'is-matched' : ''
      } ${isSelected ? 'is-selected' : ''} ${isMismatched ? 'is-shaking' : ''}`}
      type="button"
      onClick={handleClick}
      disabled={disabled || isRevealed}
      aria-label={accessibleLabel}
    >
      <span className="card-inner" aria-hidden="true">
        <span className="card-face card-front">
          <span className="card-mark">?</span>
        </span>
        <span
          className="card-face card-back"
          style={{ backgroundColor: card.character.color }}
        >
          <img
            className="character-image"
            src={card.character.image}
            alt={card.character.name}
            loading="lazy"
            decoding="async"
          />
          <span className="name">{card.character.name}</span>
        </span>
      </span>
    </button>
  );
}

export default memo(Card);
