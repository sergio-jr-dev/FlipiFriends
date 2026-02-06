export const LevelIcon = ({ className = '' }) => {
  return (
    <svg
      className={className}
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M7 4h10v4a5 5 0 0 1 -10 0z" />
      <path d="M5 9a3 3 0 0 1 -3 -3v-1h5" />
      <path d="M19 9a3 3 0 0 0 3 -3v-1h-5" />
    </svg>
  );
};
