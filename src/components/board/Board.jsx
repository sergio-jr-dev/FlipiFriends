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
      aria-label="Tablero de cartas"
      style={{
        '--columns': columns,
        '--card-size': `${cardSize / 16}rem`,
        '--board-gap': `${gap / 16}rem`,
      }}
    >
      {deck.map((card, cardIndex) => (
        <Card
          key={card.id}
          card={card}
          position={cardIndex + 1}
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
