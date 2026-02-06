import './dialog.css';

export const Dialog = ({
  isLastLevel,
  dialogRef,
  handleNextLevel,
  handleGoToWelcome,
  level,
  totalLevels,
  pairs,
  timeLabel,
  moves,
  message,
}) => {
  const title = isLastLevel
    ? `Juego completado (Nivel ${level})`
    : `Nivel ${level} completado`;

  return (
    <dialog ref={dialogRef} aria-live="polite" closedby="none">
      <header className="dialog-header">
        <h2 className="dialog-title">{title}</h2>
        <p className="dialog-message">{message}</p>
      </header>

      <section className="dialog-stats" aria-label="Resumen del nivel">
        <div className="dialog-stat level">
          <span>Nivel</span>
          <strong>
            {level}/{totalLevels}
          </strong>
        </div>
        <div className="dialog-stat pairs">
          <span>Parejas</span>
          <strong>{pairs}</strong>
        </div>
        <div className="dialog-stat time">
          <span>Tiempo</span>
          <strong>{timeLabel}</strong>
        </div>
        <div className="dialog-stat moves">
          <span>Movimientos</span>
          <strong>{moves}</strong>
        </div>
      </section>

      <div className="actions">
        {!isLastLevel ? (
          <button className="primary" onClick={handleNextLevel} type="button">
            Siguiente nivel
          </button>
        ) : (
          <button className="secondary" onClick={handleGoToWelcome} type="button">
            Empezar de nuevo
          </button>
        )}
      </div>
    </dialog>
  );
};
