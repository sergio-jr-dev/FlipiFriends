import { memo } from 'react';

import Card from '../card/Card.jsx';

import './board.css';

function Board({
  deck,
  onCardClick,
  isInteractionDisabled,
  selectedIds,
  mismatchIds,
  columns,
  cardSize,
  gap,
}) {
  return (
    <section
      className="board"
      aria-live="polite"
      style={{
        '--columns': columns,
        '--card-size': `${cardSize / 16}rem`,
        '--board-gap': `${gap / 16}rem`,
      }}
    >
      {deck.map((card) => (
        <Card
          key={card.id}
          card={card}
          onCardClick={onCardClick}
          disabled={isInteractionDisabled}
          isSelected={selectedIds.has(card.id)}
          isMismatched={mismatchIds.has(card.id)}
        />
      ))}
    </section>
  );
}

export default memo(Board);
