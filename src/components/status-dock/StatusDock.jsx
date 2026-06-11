import { LevelIcon } from '../icons/LevelIcon.jsx';
import { MovesIcon } from '../icons/MovesIcon.jsx';
import { PairsIcon } from '../icons/PairsIcon.jsx';
import { TimeIcon } from '../icons/TimeIcon.jsx';

import './status-dock.css';

export const StatusDock = ({
  level,
  matches,
  moves,
  pairs,
  timeLabel,
  totalLevels,
}) => (
  <section className="status-dock" aria-live="polite">
    <div className="status-item level">
      <span className="status-label">Nivel</span>
      <LevelIcon className="status-icon" />
      <strong>
        {level}/{totalLevels}
      </strong>
    </div>
    <div className="status-item pairs">
      <span className="status-label">Parejas</span>
      <PairsIcon className="status-icon" />
      <strong>
        {matches}/{pairs}
      </strong>
    </div>
    <div className="status-item time">
      <span className="status-label">Tiempo</span>
      <TimeIcon className="status-icon" />
      <strong>{timeLabel}</strong>
    </div>
    <div className="status-item moves">
      <span className="status-label">Movimientos</span>
      <MovesIcon className="status-icon" />
      <strong>{moves}</strong>
    </div>
  </section>
);
