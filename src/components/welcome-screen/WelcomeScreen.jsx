import { BrandLogo } from '../brand-logo/BrandLogo.jsx';
import { PlayIcon } from '../icons/PlayIcon.jsx';
import { PlusIcon } from '../icons/PlusIcon.jsx';

import './welcome-screen.css';

export const WelcomeScreen = ({
  characterGroups,
  characterListRef,
  groupPreviews,
  onGroupChange,
  onStart,
  selectedGroupId,
  showCharacterScrollHint,
}) => (
  <section className="welcome">
    <header className="brand">
      <BrandLogo size="large" />
      <h1>Bienvenido a FlipiFriends</h1>
      <p>Un juego para descubrir parejas y divertirse aprendiendo.</p>
    </header>

    <section
      className="character-selector"
      aria-label="Seleccion de personajes"
    >
      <h2>Elige con que amigos quieres jugar</h2>
      <ul className="character-list" ref={characterListRef}>
        {characterGroups.map((group) => (
          <li key={group.id} className="character-item">
            <label className="character-option">
              <div className="character-option-head">
                <input
                  type="radio"
                  name="character-group"
                  value={group.id}
                  checked={selectedGroupId === group.id}
                  onChange={() => onGroupChange(group.id)}
                />
                <h3>{group.label}</h3>
              </div>
              <div className="character-preview" aria-hidden="true">
                {(groupPreviews.get(group.id) ?? []).map((character) => (
                  <img
                    key={character.id}
                    src={character.image}
                    alt=""
                    className="preview-avatar"
                  />
                ))}
                {group.characters.length > 4 ? (
                  <span className="preview-avatar preview-more">
                    <PlusIcon className="preview-more-icon" />
                  </span>
                ) : null}
              </div>
            </label>
          </li>
        ))}
      </ul>
      <div
        className={`character-scroll-hint ${showCharacterScrollHint ? '' : 'is-hidden'}`}
        aria-hidden="true"
      >
        <span className="scroll-chevron" />
        <span className="scroll-chevron" />
      </div>
    </section>

    <button className="primary start-button" type="button" onClick={onStart}>
      <PlayIcon className="button-icon" />
      <span>Empezar a jugar</span>
    </button>
  </section>
);
