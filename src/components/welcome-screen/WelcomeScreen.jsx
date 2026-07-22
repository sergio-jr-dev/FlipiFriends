import { CharacterSelector } from './CharacterSelector.jsx';
import { StartGameButton } from './StartGameButton.jsx';
import { WelcomeFooter } from './WelcomeFooter.jsx';
import { WelcomeHero } from './WelcomeHero.jsx';

import './welcome-screen.css';

export const WelcomeScreen = ({
  canScrollNext,
  canScrollPrevious,
  carouselRef,
  characterGroups,
  groupPreviews,
  onGroupChange,
  onNextGroup,
  onPreviousGroup,
  onStart,
  selectedGroupId,
  titleRef,
}) => (
  <section className="welcome" aria-labelledby="welcome-title">
    <div className="welcome-content">
      <WelcomeHero titleRef={titleRef} />
      <CharacterSelector
        canScrollNext={canScrollNext}
        canScrollPrevious={canScrollPrevious}
        carouselRef={carouselRef}
        characterGroups={characterGroups}
        groupPreviews={groupPreviews}
        onGroupChange={onGroupChange}
        onNextGroup={onNextGroup}
        onPreviousGroup={onPreviousGroup}
        selectedGroupId={selectedGroupId}
      />
      <StartGameButton onStart={onStart} />
    </div>
    <WelcomeFooter />
  </section>
);
