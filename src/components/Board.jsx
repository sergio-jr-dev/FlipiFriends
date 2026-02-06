import Card from './Card.jsx';

function Board({ deck, onCardClick, isLocked, columns, cardSize, gap }) {
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
          onClick={() => onCardClick(card.id)}
          disabled={isLocked}
        />
      ))}
    </section>
  );
}

export default Board;
