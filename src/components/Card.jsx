function Card({ card, onClick, disabled }) {
  const isRevealed = card.flipped || card.matched

  return (
    <button
      className={`card ${isRevealed ? 'is-flipped' : ''} ${
        card.matched ? 'is-matched' : ''
      }`}
      type="button"
      onClick={onClick}
      disabled={disabled || isRevealed}
      aria-label={`Carta ${card.character.name}`}
    >
      <span className="card-inner">
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
          />
          <span className="name">{card.character.name}</span>
        </span>
      </span>
    </button>
  )
}

export default Card
