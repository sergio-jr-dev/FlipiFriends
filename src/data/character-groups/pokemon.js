import { createCharacter, toCharacterId } from './catalog.js';

const POKEMON_COLOR_PALETTE = [
  '#fff3b8',
  '#d7f5d7',
  '#ffd9c2',
  '#d7ebff',
  '#ffe2bf',
  '#cfe1ff',
  '#d6f0d6',
  '#ffdff0',
  '#ffe0b5',
  '#ffe6d6',
];

const POKEMON_FILE_NAMES = [
  'Arbok',
  'Beedrill',
  'Blastoide',
  'Bulbasaur',
  'Butterfree',
  'Caterpie',
  'Charizard',
  'Charmander',
  'Charmeleon',
  'Ekans',
  'Fearow',
  'Jigglypuff',
  'Kakuna',
  'MEtapod',
  'Nidoqueen',
  'Nidoran',
  'Nidorina',
  'Pidgeot',
  'Pidgeotto',
  'Pidgey',
  'Pikachu',
  'Raichu',
  'Raticate',
  'Rattata',
  'Sandshrew',
  'Sandslash',
  'Spearow',
  'Squirtle',
  'Venusaur',
  'Vulpix',
  'Wartortle',
  'Weedle',
  'Yvysaur',
];

const POKEMON_DISPLAY_NAMES = {
  MEtapod: 'Metapod',
  Yvysaur: 'Ivysaur',
};

export const pokemonCharacters = Object.freeze(
  POKEMON_FILE_NAMES.map((fileName, index) => {
    const displayName = POKEMON_DISPLAY_NAMES[fileName] ?? fileName;

    return createCharacter({
      id: `pokemon-${toCharacterId(displayName)}`,
      name: displayName,
      short: displayName.slice(0, 2),
      color: POKEMON_COLOR_PALETTE[index % POKEMON_COLOR_PALETTE.length],
      fileName,
      groupPath: 'Pokemon',
    });
  }),
);
