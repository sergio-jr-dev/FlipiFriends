import Board from '../board/Board.jsx';

import './game-board.css';

export const GameBoard = ({
  boardAreaRef,
  boardLayout,
  deck,
  isInteractionDisabled,
  mismatchIds,
  onCardClick,
  selectedGroupId,
  selectedIds,
  levelIndex,
}) => (
  <section className="board-wrap" ref={boardAreaRef}>
    <Board
      key={`level-${levelIndex}-${selectedGroupId}`}
      deck={deck}
      onCardClick={onCardClick}
      isInteractionDisabled={isInteractionDisabled}
      selectedIds={selectedIds}
      mismatchIds={mismatchIds}
      columns={boardLayout.columns}
      cardSize={boardLayout.cardSize}
      gap={boardLayout.gap}
    />
  </section>
);
