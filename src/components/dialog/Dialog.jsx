import './dialog.css';

export const Dialog = ({
  isLastLevel,
  dialogRef,
  handleNextLevel,
  handleReset,
  level,
  totalLevels,
  pairs,
  timeLabel,
  moves,
}) => {
  return (
    <dialog ref={dialogRef} aria-live="polite" closedby="none">
      <h2>{isLastLevel ? 'Juego completado' : 'Nivel completado'}</h2>
      <p>
        {isLastLevel
          ? 'Has terminado todos los niveles.'
          : 'Buen trabajo, puedes continuar al siguiente nivel.'}
      </p>

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
        <button className="primary" onClick={handleNextLevel} type="button">
          {isLastLevel ? 'Celebrar' : 'Siguiente nivel'}
        </button>
        <button className="secondary" onClick={handleReset} type="button">
          Jugar otra vez
        </button>
      </div>
    </dialog>
  );
};
