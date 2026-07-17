import { useMemo, useState } from 'react';

import { characterGroups, defaultCharacterGroupId } from '../data/characters.js';
import { groupPresentation } from '../data/groupPresentation.js';

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
        characterGroups.map((group) => {
          const charactersById = new Map(
            group.characters.map((character) => [character.id, character]),
          );
          const previewIds = groupPresentation[group.id]?.previewIds ?? [];

          return [
            group.id,
            previewIds
              .map((characterId) => charactersById.get(characterId))
              .filter(Boolean),
          ];
        }),
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
