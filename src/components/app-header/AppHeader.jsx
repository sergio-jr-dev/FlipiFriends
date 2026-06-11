import { BrandLogo } from '../brand-logo/BrandLogo.jsx';
import { RestartIcon } from '../icons/RestartIcon.jsx';
import { SoundOffIcon } from '../icons/SoundOffIcon.jsx';
import { SoundOnIcon } from '../icons/SoundOnIcon.jsx';

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
        className="sound-toggle"
        type="button"
        onClick={onRestart}
        aria-label="Volver a inicio"
      >
        <RestartIcon />
      </button>
      <button
        className={`sound-toggle ${soundEnabled ? 'is-on' : 'is-off'}`}
        type="button"
        onClick={onToggleSound}
        aria-pressed={soundEnabled}
        aria-label={soundEnabled ? 'Sonido activado' : 'Sonido desactivado'}
      >
        {soundEnabled ? <SoundOnIcon /> : <SoundOffIcon />}
      </button>
    </div>
  </header>
);
