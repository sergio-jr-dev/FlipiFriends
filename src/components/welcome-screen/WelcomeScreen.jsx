import { BrandLogo } from '../brand-logo/BrandLogo.jsx';
import { PlayIcon } from '../icons/PlayIcon.jsx';
import { PlusIcon } from '../icons/PlusIcon.jsx';
import { LinkedinIcon } from '../icons/LinkedinIcon.jsx';
import { XIcon } from '../icons/XIcon.jsx';
import { GithubIcon } from '../icons/GithubIcon.jsx';
import { MailIcon } from '../icons/MailIcon.jsx';

import './welcome-screen.css';

const socialLinks = {
  linkedin: {
    href: 'https://www.linkedin.com/in/sergio-jim%C3%A9nez-rubio/',
    label: 'Enlace externo al perfil de LinkedIn de Sergio Jiménez Rubio',
    icon: <LinkedinIcon />,
  },
  x: {
    href: 'https://x.com/sergiojr_dev',
    label: 'Enlace externo a la cuenta de X de Sergio Jiménez Rubio',
    icon: <XIcon />,
  },
  github: {
    href: 'https://github.com/sergio-jr-dev',
    label: 'Enlace externo al perfil de GitHub de Sergio Jiménez Rubio',
    icon: <GithubIcon />,
  },
  email: {
    href: 'mailto:sergiojimenezrubio.dev@gmail.com',
    label: 'Enlace externo al correo electrónico de Sergio Jiménez Rubio',
    icon: <MailIcon />,
  },
};

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

    <footer>
      <div>
        <p>Sergio Jiménez Rubio - </p>
        <ul className="social-links">
          <li>
            <a
              href={socialLinks.linkedin.href}
              aria-label={socialLinks.linkedin.label}
              target="_blank"
              rel="noopener noreferrer"
            >
              {socialLinks.linkedin.icon}
            </a>
          </li>
          <li>
            <a
              href={socialLinks.x.href}
              aria-label={socialLinks.x.label}
              target="_blank"
              rel="noopener noreferrer"
            >
              {socialLinks.x.icon}
            </a>
          </li>
          <li>
            <a
              href={socialLinks.github.href}
              aria-label={socialLinks.github.label}
              target="_blank"
              rel="noopener noreferrer"
            >
              {socialLinks.github.icon}
            </a>
          </li>
          <li>
            <a
              href={socialLinks.email.href}
              aria-label={socialLinks.email.label}
              target="_blank"
              rel="noopener noreferrer"
            >
              {socialLinks.email.icon}
            </a>
          </li>
        </ul>
      </div>
      <small>
        Esta es una aplicación creada sin ánimo de lucro con fines educativos.
      </small>
    </footer>
  </section>
);
