import './start-game-button.css';

export const StartGameButton = ({ onStart }) => (
  <button className="primary start-button" type="button" onClick={onStart}>
    <img
      className="button-icon"
      src="/ui-icons/play-3d.webp"
      alt=""
      aria-hidden="true"
    />
    <span>Empezar a jugar</span>
  </button>
);
