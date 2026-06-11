import { useMemo, useState } from 'react';

import { characterGroups, defaultCharacterGroupId } from '../data/characters.js';
import { pickRandomItems } from '../utils/game.js';

const characterGroupsById = new Map(
  characterGroups.map((group) => [group.id, group]),
);

export const useCharacterGroups = () => {
  const initialGroup =
    characterGroupsById.get(defaultCharacterGroupId) ?? characterGroups[0];

  const [selectedGroupId, setSelectedGroupId] = useState(initialGroup.id);

  const activeGroup = useMemo(
    () => characterGroupsById.get(selectedGroupId) ?? characterGroups[0],
    [selectedGroupId],
  );

  const sortedCharacterGroups = useMemo(
    () =>
      [...characterGroups].sort((groupA, groupB) =>
        groupA.label.localeCompare(groupB.label, 'es', { sensitivity: 'base' }),
      ),
    [],
  );

  const groupPreviews = useMemo(
    () =>
      new Map(
        characterGroups.map((group) => [
          group.id,
          pickRandomItems(group.characters, 4),
        ]),
      ),
    [],
  );

  return {
    activeGroup,
    characterGroups: sortedCharacterGroups,
    groupPreviews,
    selectedGroupId,
    setSelectedGroupId,
  };
};
