import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { characterGroups } from '../src/data/characters.js';

const projectRoot = dirname(fileURLToPath(new URL('../package.json', import.meta.url)));
const mixedGroup = characterGroups.find((group) => group.id === 'mixed');
const baseGroups = characterGroups.filter((group) => group.id !== 'mixed');
const uniqueImages = [
  ...new Set(
    characterGroups.flatMap((group) =>
      group.characters.map((character) => character.image),
    ),
  ),
];

const missingImages = uniqueImages.filter((image) => {
  const publicPath = image.startsWith('/') ? image.slice(1) : image;
  return !existsSync(join(projectRoot, 'public', publicPath));
});

const baseCharactersCount = baseGroups.reduce(
  (total, group) => total + group.characters.length,
  0,
);

if (missingImages.length > 0) {
  console.error('Missing character images:');
  missingImages.forEach((image) => console.error(`- ${image}`));
  process.exit(1);
}

if (!mixedGroup) {
  console.error('Missing mixed character group.');
  process.exit(1);
}

if (mixedGroup.characters.length !== baseCharactersCount) {
  console.error(
    `Mixed group has ${mixedGroup.characters.length} characters, expected ${baseCharactersCount}.`,
  );
  process.exit(1);
}

console.log(
  `Character catalog valid: ${characterGroups.length} groups, ${uniqueImages.length} images.`,
);
