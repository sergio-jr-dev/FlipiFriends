import {
  createCharacterGroup,
  validateCharacterGroups,
} from './character-groups/catalog.js';
import { blueyCharacters } from './character-groups/bluey.js';
import { doraemonCharacters } from './character-groups/doraemon.js';
import { gabbyDollhouseCharacters } from './character-groups/gabbyDollhouse.js';
import { kpopWarriorsCharacters } from './character-groups/kpopWarriors.js';
import { pawPatrolCharacters } from './character-groups/pawPatrol.js';
import { pokemonCharacters } from './character-groups/pokemon.js';
import { zootropolisCharacters } from './character-groups/zootropolis.js';

const baseCharacterGroups = [
  createCharacterGroup({
    id: 'bluey',
    label: 'Bluey',
    description: 'Personajes de Bluey para peques desde el nivel 1.',
    characters: blueyCharacters,
  }),
  createCharacterGroup({
    id: 'paw-patrol',
    label: 'Patrulla Canina',
    description: 'Personajes de la Patrulla Canina en todos los niveles.',
    characters: pawPatrolCharacters,
  }),
  createCharacterGroup({
    id: 'gabby-dollhouse',
    label: 'La Casa de Muñecas de Gabby',
    description: 'Personajes de La Casa de Muñecas de Gabby.',
    characters: gabbyDollhouseCharacters,
  }),
  createCharacterGroup({
    id: 'pokemon',
    label: 'Pokemon',
    description: 'Personajes de Pokemon.',
    characters: pokemonCharacters,
  }),
  createCharacterGroup({
    id: 'kpop-warriors',
    label: 'Las Guerreras K-pop',
    description: 'Personajes de Las Guerreras K-pop.',
    characters: kpopWarriorsCharacters,
  }),
  createCharacterGroup({
    id: 'doraemon',
    label: 'Doraemon',
    description: 'Personajes de Doraemon.',
    characters: doraemonCharacters,
  }),
  createCharacterGroup({
    id: 'zootropolis',
    label: 'Zootropolis',
    description: 'Personajes de Zootropolis.',
    characters: zootropolisCharacters,
  }),
];

const mixedCharacters = Object.freeze(
  baseCharacterGroups.flatMap((group) => group.characters),
);

export const characterGroups = validateCharacterGroups([
  ...baseCharacterGroups,
  createCharacterGroup({
    id: 'mixed',
    label: 'Mezcla de todos los personajes',
    description: 'Una mezcla con todos los personajes disponibles.',
    characters: mixedCharacters,
  }),
]);

export const defaultCharacterGroupId = characterGroups[0].id;
