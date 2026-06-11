import './brand-logo.css';

export const BrandLogo = ({ size = 'default' }) => (
  <img
    className={`logo ${size === 'large' ? 'is-large' : ''}`}
    src="/brand/logo-kids.webp"
    alt="Logo FlipiFriends"
    fetchPriority="high"
  />
);
