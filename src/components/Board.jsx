import { memo } from 'react';

import Card from './Card.jsx';

function Board({
  deck,
  onCardClick,
  isInteractionDisabled,
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
        '--card-size': `${cardSize}px`,
        '--board-gap': `${gap}px`,
      }}
    >
      {deck.map((card) => (
        <Card
          key={card.id}
          card={card}
          onCardClick={onCardClick}
          disabled={isInteractionDisabled}
        />
      ))}
    </section>
  );
}

export default memo(Board);
