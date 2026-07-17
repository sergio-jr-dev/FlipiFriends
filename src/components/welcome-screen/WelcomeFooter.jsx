import { GithubIcon } from '../icons/GithubIcon.jsx';
import { LinkedinIcon } from '../icons/LinkedinIcon.jsx';
import { MailIcon } from '../icons/MailIcon.jsx';
import { XIcon } from '../icons/XIcon.jsx';

import './welcome-footer.css';

const socialLinks = [
  {
    name: 'linkedin',
    href: 'https://www.linkedin.com/in/sergio-jim%C3%A9nez-rubio/',
    label: 'Enlace externo al perfil de LinkedIn de Sergio Jiménez Rubio',
    Icon: LinkedinIcon,
  },
  {
    name: 'x',
    href: 'https://x.com/sergiojr_dev',
    label: 'Enlace externo a la cuenta de X de Sergio Jiménez Rubio',
    Icon: XIcon,
  },
  {
    name: 'github',
    href: 'https://github.com/sergio-jr-dev',
    label: 'Enlace externo al perfil de GitHub de Sergio Jiménez Rubio',
    Icon: GithubIcon,
  },
  {
    name: 'email',
    href: 'mailto:sergiojimenezrubio.dev@gmail.com',
    label: 'Enlace externo al correo electrónico de Sergio Jiménez Rubio',
    Icon: MailIcon,
  },
];

export const WelcomeFooter = () => (
  <footer className="welcome-footer">
    <p className="footer-message">
      Creado con{' '}
      <img
        className="footer-heart"
        src="/ui-icons/heart-3d.webp"
        alt="cariño"
      />{' '}
      para aprender jugando
    </p>

    <div className="creator">
      <span>Sergio Jiménez Rubio</span>
      <ul className="social-links">
        {socialLinks.map(({ Icon, href, label, name }) => (
          <li key={name}>
            <a
              href={href}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon />
            </a>
          </li>
        ))}
      </ul>
    </div>

    <small>
      FlipiFriends no se monetiza. Es una aplicación sin ánimo de lucro creada
      exclusivamente con fines educativos.
    </small>
    <small>
      Los derechos de las imágenes de los personajes pertenecen a cada marca. El
      logo, los iconos y el fondo han sido generados por IA.
    </small>
  </footer>
);
