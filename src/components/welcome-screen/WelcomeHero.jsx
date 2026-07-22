import { BrandLogo } from '../brand-logo/BrandLogo.jsx';

import './welcome-hero.css';

const PromptRays = ({ side }) => (
  <span className={`prompt-rays is-${side}`} aria-hidden="true">
    <i />
    <i />
    <i />
  </span>
);

export const WelcomeHero = ({ titleRef }) => (
  <header className="welcome-hero">
    <BrandLogo size="large" />
    <h1 id="welcome-title" ref={titleRef} tabIndex={-1}>
      Bienvenido a FlipiFriends
    </h1>
    <p>Un juego para descubrir parejas y divertirse aprendiendo</p>

    <div className="selector-prompt">
      <PromptRays side="left" />
      <h2 id="character-selector-title">¡Elige a tus amigos!</h2>
      <PromptRays side="right" />
    </div>
  </header>
);
