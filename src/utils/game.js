export const LEVELS = [2, 3, 4, 6, 8, 10, 12];
export const CARD_RATIO = 1.25;
export const CARD_FLIP_MS = 500;
export const MISMATCH_SHAKE_MS = 340;

export const LEVEL_MESSAGES = [
  'Buen trabajo, puedes continuar al siguiente nivel.',
  'Lo has hecho genial. Vamos a por el siguiente.',
  'Increible memoria. Listo para continuar.',
  'Gran nivel. Sigue asi.',
  'Fantastico. Estas mejorando mucho.',
  'Muy bien hecho. A por el siguiente reto.',
  'Que buen nivel. Continua jugando.',
  'Lo estas haciendo de maravilla.',
];

export const FINAL_MESSAGES = [
  'Eres un campeon de FlipiFriends.',
  'Partida completa. Has encontrado todas las parejas.',
  'Mision cumplida. Juego terminado con exito.',
  'Has terminado todos los niveles. Super logro.',
  'Increible final. Te has salido.',
  'Juego completo. Memoria de experto.',
  'Enhorabuena. Nivel final superado.',
  'Gran victoria. Has ganado la partida.',
];

export const shuffle = (items) => {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const pickRandomItems = (items, count) =>
  shuffle(items).slice(0, Math.min(count, items.length));

export const getPlayableLevels = (levels, availableCharacters) =>
  levels.filter((pairsCount) => pairsCount <= availableCharacters.length);

export const buildDeck = (pairsCount, availableCharacters) => {
  if (pairsCount <= 0 || availableCharacters.length === 0) return [];

  const chosen = [];
  while (chosen.length < pairsCount) {
    chosen.push(...shuffle(availableCharacters));
  }

  const duplicated = chosen.slice(0, pairsCount).flatMap((character, pairIndex) => {
    const pairId = `pair-${pairIndex}`;
    return [
      {
        id: `${character.id}-${pairIndex}-a`,
        pairId,
        character,
        flipped: false,
        matched: false,
      },
      {
        id: `${character.id}-${pairIndex}-b`,
        pairId,
        character,
        flipped: false,
        matched: false,
      },
    ];
  });

  return shuffle(duplicated);
};

export const formatElapsed = (milliseconds) => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
};

export const resolveBoardLayout = (totalCards, width, height) => {
  const safeWidth = Math.max(260, width);
  const safeHeight = Math.max(220, height);
  const gap = safeWidth < 720 ? 8 : 12;
  const maxColumns = Math.max(2, Math.min(totalCards, 10));
  const maxCardSize =
    safeWidth >= 720 && totalCards <= 4
      ? 196
      : safeWidth >= 720 && totalCards <= 6
        ? 176
        : 148;

  let best = {
    columns: Math.min(4, maxColumns),
    cardSize: 64,
    gap,
  };

  for (let columns = 2; columns <= maxColumns; columns += 1) {
    const rows = Math.ceil(totalCards / columns);
    const freeWidth = safeWidth - gap * (columns - 1);
    const freeHeight = safeHeight - gap * (rows - 1);

    if (freeWidth <= 0 || freeHeight <= 0) continue;

    const byWidth = freeWidth / columns;
    const byHeight = freeHeight / rows / CARD_RATIO;
    const cardSize = Math.floor(Math.min(byWidth, byHeight, maxCardSize));

    if (cardSize > best.cardSize) {
      best = {
        columns,
        cardSize,
        gap,
      };
    }
  }

  return {
    columns: best.columns,
    cardSize: Math.max(40, best.cardSize),
    gap: best.gap,
  };
};

export const pickNextMessage = (pool, previousMessage) => {
  if (pool.length === 0) return '';
  if (pool.length === 1) return pool[0];

  let nextMessage = pool[Math.floor(Math.random() * pool.length)];
  while (nextMessage === previousMessage) {
    nextMessage = pool[Math.floor(Math.random() * pool.length)];
  }

  return nextMessage;
};
