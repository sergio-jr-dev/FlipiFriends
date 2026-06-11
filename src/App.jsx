import { useBoardLayout } from './hooks/useBoardLayout.js';
import { useCharacterGroups } from './hooks/useCharacterGroups.js';
import { useCharacterScrollHint } from './hooks/useCharacterScrollHint.js';
import { useMemoryGame } from './hooks/useMemoryGame.js';
import { AppHeader } from './components/app-header/AppHeader.jsx';
import { Dialog } from './components/dialog/Dialog.jsx';
import { GameBoard } from './components/game-board/GameBoard.jsx';
import { StatusDock } from './components/status-dock/StatusDock.jsx';
import { WelcomeScreen } from './components/welcome-screen/WelcomeScreen.jsx';

import './App.css';

function App() {
  const {
    activeGroup,
    characterGroups,
    groupPreviews,
    selectedGroupId,
    setSelectedGroupId,
  } = useCharacterGroups();

  const game = useMemoryGame(activeGroup);

  const { boardAreaRef, boardLayout } = useBoardLayout(
    game.totalCards,
    !game.isWelcomeOpen
  );

  const { characterListRef, showCharacterScrollHint } = useCharacterScrollHint(
    game.isWelcomeOpen,
    characterGroups.length
  );

  return (
    <div className="app">
      {!game.isWelcomeOpen ? (
        <AppHeader
          activeGroupLabel={activeGroup.label}
          onRestart={game.handleGoToWelcome}
          onToggleSound={game.handleToggleSound}
          soundEnabled={game.soundEnabled}
        />
      ) : null}

      <main
        className={`main-content ${game.isWelcomeOpen ? 'is-welcome' : 'is-game'}`}
      >
        {game.isWelcomeOpen ? (
          <WelcomeScreen
            characterGroups={characterGroups}
            characterListRef={characterListRef}
            groupPreviews={groupPreviews}
            onGroupChange={setSelectedGroupId}
            onStart={game.handleStartGame}
            selectedGroupId={selectedGroupId}
            showCharacterScrollHint={showCharacterScrollHint}
          />
        ) : (
          <GameBoard
            boardAreaRef={boardAreaRef}
            boardLayout={boardLayout}
            deck={game.deck}
            isInteractionDisabled={game.isInteractionDisabled}
            levelIndex={game.levelIndex}
            mismatchIds={game.mismatchIds}
            onCardClick={game.handleCardClick}
            selectedGroupId={selectedGroupId}
            selectedIds={game.selectedIds}
          />
        )}
      </main>

      {!game.isWelcomeOpen ? (
        <StatusDock
          level={game.levelIndex + 1}
          matches={game.matches}
          moves={game.moves}
          pairs={game.pairsCount}
          timeLabel={game.elapsedLabel}
          totalLevels={game.totalLevels}
        />
      ) : null}

      <Dialog
        isLastLevel={game.isLastLevel}
        dialogRef={game.dialogRef}
        handleNextLevel={game.handleNextLevel}
        handleGoToWelcome={game.handleGoToWelcome}
        level={game.levelIndex + 1}
        totalLevels={game.totalLevels}
        pairs={game.pairsCount}
        timeLabel={game.elapsedLabel}
        moves={game.moves}
        message={game.completionMessage}
      />
    </div>
  );
}

export default App;
