import { BrandLogo } from '../brand-logo/BrandLogo.jsx';

import './app-header.css';

export const AppHeader = ({
  activeGroupLabel,
  onRestart,
  onToggleSound,
  soundEnabled,
}) => (
  <header className="top">
    <div className="brand">
      <BrandLogo />
      <div className="title">
        <h1>FlipiFriends</h1>
        <p className="subtitle">{activeGroupLabel}</p>
      </div>
    </div>
    <div className="controls">
      <button
        className="sound-toggle is-reset"
        type="button"
        onClick={onRestart}
        aria-label="Volver a inicio"
      >
        <img
          className="control-icon"
          src="/ui-icons/reset-3d.webp"
          alt=""
          aria-hidden="true"
        />
      </button>
      <button
        className={`sound-toggle ${soundEnabled ? 'is-on' : 'is-off'}`}
        type="button"
        onClick={onToggleSound}
        aria-pressed={soundEnabled}
        aria-label={soundEnabled ? 'Sonido activado' : 'Sonido desactivado'}
      >
        <img
          className="control-icon"
          src={
            soundEnabled
              ? '/ui-icons/sound-on-3d.webp'
              : '/ui-icons/sound-off-3d.webp'
          }
          alt=""
          aria-hidden="true"
        />
      </button>
    </div>
  </header>
);
