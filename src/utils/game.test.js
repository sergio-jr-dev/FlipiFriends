import { describe, expect, test } from 'vitest';

import {
  BOARD_EFFECT_CLEARANCE,
  CARD_RATIO,
  resolveBoardLayout,
} from './game.js';

describe('resolveBoardLayout', () => {
  test.each([
    { totalCards: 12, width: 270, height: 438 },
    { totalCards: 24, width: 390, height: 620 },
    { totalCards: 4, width: 1024, height: 720 },
  ])('reserves room for selected-card effects', ({ totalCards, width, height }) => {
    const layout = resolveBoardLayout(totalCards, width, height);
    const rows = Math.ceil(totalCards / layout.columns);
    const boardWidth =
      layout.cardSize * layout.columns + layout.gap * (layout.columns - 1);
    const boardHeight =
      layout.cardSize * CARD_RATIO * rows + layout.gap * (rows - 1);

    expect(boardWidth).toBeLessThanOrEqual(width - BOARD_EFFECT_CLEARANCE * 2);
    expect(boardHeight).toBeLessThanOrEqual(height - BOARD_EFFECT_CLEARANCE * 2);
  });
});
