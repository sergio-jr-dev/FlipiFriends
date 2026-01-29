import { Activity } from 'react';

import './dialog.css';

export const Dialog = ({
  isLastLevel,
  dialogRef,
  handleNextLevel,
  handleReset,
}) => {
  return (
    <dialog ref={dialogRef} aria-live="polite" closedby="none">
      <h2>{isLastLevel ? 'Juego completado' : 'Nivel completado'}</h2>
      <p>
        {isLastLevel
          ? 'Has encontrado todas las parejas.'
          : 'Pasemos al siguiente nivel.'}
      </p>
      <div className="actions">
        <Activity mode={!isLastLevel ? 'visible' : 'hidden'}>
          <button className="primary" onClick={handleNextLevel}>
            Siguiente nivel
          </button>
        </Activity>
        <button className="secondary" onClick={handleReset}>
          Jugar otra vez
        </button>
      </div>
    </dialog>
  );
};
