export const DEFAULT_CHARACTER_EXTENSION = 'webp';

export const toCharacterId = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const createCharacter = ({
  color,
  extension = DEFAULT_CHARACTER_EXTENSION,
  fileName,
  groupPath,
  id,
  imageName = fileName,
  name = fileName,
  short = name.slice(0, 2),
}) =>
  Object.freeze({
    id: id ?? toCharacterId(name),
    name,
    short,
    color,
    image: `/characters/${groupPath}/${imageName}.${extension}`,
  });

export const createCharacters = (groupPath, entries) =>
  Object.freeze(
    entries.map((entry) =>
      createCharacter({
        groupPath,
        ...entry,
      }),
    ),
  );

export const createCharacterGroup = ({
  characters,
  description,
  id,
  label,
}) =>
  Object.freeze({
    id,
    label,
    description,
    characters: Object.freeze([...characters]),
  });

const REQUIRED_CHARACTER_FIELDS = ['id', 'name', 'short', 'color', 'image'];

const validateCharacters = (group, errors) => {
  const characterIds = new Set();

  group.characters.forEach((character, index) => {
    REQUIRED_CHARACTER_FIELDS.forEach((field) => {
      if (!character[field]) {
        errors.push(
          `${group.id}: character at index ${index} is missing "${field}"`,
        );
      }
    });

    if (characterIds.has(character.id)) {
      errors.push(`${group.id}: duplicate character id "${character.id}"`);
    }

    characterIds.add(character.id);

    if (!character.image?.startsWith('/characters/')) {
      errors.push(`${group.id}: invalid image path for "${character.id}"`);
    }
  });
};

export const validateCharacterGroups = (groups) => {
  const errors = [];
  const groupIds = new Set();

  groups.forEach((group) => {
    if (!group.id) errors.push('group is missing "id"');
    if (!group.label) errors.push(`${group.id}: group is missing "label"`);
    if (!group.description) {
      errors.push(`${group.id}: group is missing "description"`);
    }

    if (groupIds.has(group.id)) {
      errors.push(`duplicate group id "${group.id}"`);
    }

    groupIds.add(group.id);

    if (!Array.isArray(group.characters) || group.characters.length === 0) {
      errors.push(`${group.id}: group has no characters`);
      return;
    }

    validateCharacters(group, errors);
  });

  if (errors.length > 0) {
    throw new Error(`Invalid character catalog:\n- ${errors.join('\n- ')}`);
  }

  return Object.freeze([...groups]);
};
