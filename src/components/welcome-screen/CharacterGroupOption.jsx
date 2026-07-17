import { groupPresentation } from '../../data/groupPresentation.js';

import './character-group-option.css';

const getPreviewImage = (presentation, character) =>
  presentation.previewImages?.[character.id] ?? character.image;

export const CharacterGroupOption = ({
  group,
  groupIndex,
  isSelected,
  onChange,
  onReveal,
  previews,
}) => {
  const presentation = groupPresentation[group.id];
  const loading = groupIndex < 5 ? 'eager' : 'lazy';

  return (
    <li
      className="character-item"
      data-group-id={group.id}
      onClick={(event) => onReveal(event.currentTarget)}
    >
      <label
        className={`character-option ${isSelected ? 'is-selected' : ''}`}
      >
        <input
          className="character-option-input"
          type="radio"
          name="character-group"
          value={group.id}
          checked={isSelected}
          onChange={() => onChange(group.id)}
          aria-describedby={`group-count-${group.id}`}
        />

        <span className="selection-star" aria-hidden="true">
          <img src="/ui-icons/star-3d.webp" alt="" />
        </span>

        <span className="group-name">{group.label}</span>

        <span className="group-hero" aria-hidden="true">
          <img
            className="group-main-image"
            src={presentation.image}
            alt=""
            loading={loading}
          />
        </span>

        <span className="character-strip" aria-hidden="true">
          {previews.map((character) => (
            <span className="preview-avatar" key={character.id}>
              <img
                src={getPreviewImage(presentation, character)}
                alt=""
                className="preview-avatar-image"
                loading={loading}
              />
            </span>
          ))}
        </span>

        <span className="visually-hidden" id={`group-count-${group.id}`}>
          {group.characters.length} personajes
        </span>
      </label>
    </li>
  );
};
