import { useState, useCallback, useMemo } from 'react';
import { generateStory } from '../utils/storyEngine';
import { saveGame, createSaveState, recordHighScore } from '../utils/saveManager';
import SaveSlotScreen from '../components/game/SaveSlotScreen';
import TopicSelector from '../components/game/TopicSelector';
import StoryNarrator from '../components/game/StoryNarrator';
import ChoicePanel from '../components/game/ChoicePanel';
import MerlinReaction from '../components/game/MerlinReaction';
import GameHUD from '../components/game/GameHUD';
import EndingScreen from '../components/game/EndingScreen';
import '../styles/Quest.css';

// Stars background
function StarsBG() {
  const stars = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      size: Math.random() > 0.7 ? 3 : 2,
    })), []);

  return (
    <div className="quest-stars">
      {stars.map(s => (
        <div key={s.id} className="quest-star" style={{
          left: `${s.left}%`, top: `${s.top}%`,
          animationDelay: `${s.delay}s`,
          width: s.size, height: s.size,
        }} />
      ))}
    </div>
  );
}

/*
  GAME STATES:
  save_select → topic_select → loading → narration → decision → reaction → ending
*/

export default function QuestPage() {
  const [gameState, setGameState] = useState('save_select');
  const [activeSlot, setActiveSlot] = useState(null);
  const [story, setStory] = useState(null);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [decisions, setDecisions] = useState([]);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [topic, setTopic] = useState(null);
  const [lastChoice, setLastChoice] = useState(null);
  const [lastChoiceCorrect, setLastChoiceCorrect] = useState(false);

  // Count decision moments in story
  const totalMoments = story?.segments?.filter(s => s.type === 'decision').length || 0;
  const currentMoment = decisions.length;

  // Current segment
  const currentSegment = story?.segments?.[segmentIndex] || null;

  // Auto-save helper
  const doSave = useCallback((overrides = {}) => {
    if (activeSlot === null) return;
    saveGame(activeSlot, createSaveState({
      story,
      currentSegmentIndex: segmentIndex,
      decisions,
      score,
      topic,
      ...overrides,
    }));
  }, [activeSlot, story, segmentIndex, decisions, score, topic]);

  // ─── Handlers ──────────────────────────

  const handleNewGame = (slotIndex) => {
    setActiveSlot(slotIndex);
    setGameState('topic_select');
  };

  const handleContinue = (slotIndex, saveData) => {
    setActiveSlot(slotIndex);
    setStory(saveData.story);
    setSegmentIndex(saveData.currentSegmentIndex);
    setDecisions(saveData.decisions || []);
    setScore(saveData.score || { correct: 0, total: 0 });
    setTopic(saveData.topic);

    if (saveData.completed) {
      setGameState('ending');
    } else {
      const seg = saveData.story?.segments?.[saveData.currentSegmentIndex];
      setGameState(seg?.type === 'decision' ? 'decision' : 'narration');
    }
  };

  const handleTopicSelect = async (selectedTopic) => {
    setTopic(selectedTopic);
    setGameState('loading');

    try {
      const generatedStory = await generateStory(selectedTopic);
      setStory(generatedStory);
      setSegmentIndex(0);
      setDecisions([]);
      setScore({ correct: 0, total: 0 });
      setGameState('narration');

      // Initial save
      if (activeSlot !== null) {
        saveGame(activeSlot, createSaveState({
          story: generatedStory,
          currentSegmentIndex: 0,
          decisions: [],
          score: { correct: 0, total: 0 },
          topic: selectedTopic,
        }));
      }
    } catch {
      // Should never reach here due to fallbacks, but just in case
      setGameState('topic_select');
    }
  };

  const handleNarrationContinue = () => {
    const nextIndex = segmentIndex + 1;
    if (nextIndex >= story.segments.length) {
      setGameState('ending');
      doSave({ currentSegmentIndex: nextIndex, completed: true });
      recordHighScore({ topic, characterName: story.character_name, correct: score.correct, total: score.total });
      return;
    }

    setSegmentIndex(nextIndex);
    const nextSeg = story.segments[nextIndex];
    setGameState(nextSeg.type === 'decision' ? 'decision' : 'narration');
    doSave({ currentSegmentIndex: nextIndex });
  };

  const handleChoice = (choiceIndex, choice) => {
    const isCorrect = choice.is_correct;
    const newDecisions = [...decisions, {
      momentIndex: currentMoment,
      choiceIndex,
      choiceText: choice.text,
      wasCorrect: isCorrect,
    }];
    const newScore = {
      correct: score.correct + (isCorrect ? 1 : 0),
      total: score.total + 1,
    };

    setDecisions(newDecisions);
    setScore(newScore);
    setLastChoice(choice);
    setLastChoiceCorrect(isCorrect);
    setGameState('reaction');

    // Save after decision
    if (activeSlot !== null) {
      saveGame(activeSlot, createSaveState({
        story,
        currentSegmentIndex: segmentIndex,
        decisions: newDecisions,
        score: newScore,
        topic,
      }));
    }
  };

  const handleReactionContinue = () => {
    const nextIndex = segmentIndex + 1;
    if (nextIndex >= story.segments.length) {
      setGameState('ending');
      doSave({ currentSegmentIndex: nextIndex, completed: true });
      recordHighScore({ topic, characterName: story.character_name, correct: score.correct, total: score.total });
      return;
    }

    setSegmentIndex(nextIndex);
    const nextSeg = story.segments[nextIndex];
    setGameState(nextSeg.type === 'decision' ? 'decision' : 'narration');
    doSave({ currentSegmentIndex: nextIndex });
  };

  const handleNewQuest = () => {
    setStory(null);
    setSegmentIndex(0);
    setDecisions([]);
    setScore({ correct: 0, total: 0 });
    setTopic(null);
    setGameState('topic_select');
  };

  const handleBackToSaves = () => {
    setStory(null);
    setSegmentIndex(0);
    setDecisions([]);
    setScore({ correct: 0, total: 0 });
    setTopic(null);
    setActiveSlot(null);
    setGameState('save_select');
  };

  // ─── Render ────────────────────────────

  return (
    <div className="quest-page">
      <StarsBG />

      {gameState === 'save_select' && (
        <SaveSlotScreen onNewGame={handleNewGame} onContinue={handleContinue} />
      )}

      {gameState === 'topic_select' && (
        <TopicSelector onSelect={handleTopicSelect} />
      )}

      {gameState === 'loading' && (
        <div className="quest-loading">
          <div className="quest-loading-text">
            MERLIN IS CRAFTING YOUR QUEST...
          </div>
          <div className="quest-loading-bar">
            <div className="quest-loading-fill" />
          </div>
          <div className="quest-subtitle" style={{ marginTop: 16 }}>
            Generating a {topic} story with AI magic ✨
          </div>
        </div>
      )}

      {(gameState === 'narration' || gameState === 'decision' || gameState === 'reaction') && story && (
        <GameHUD
          topic={topic}
          currentMoment={currentMoment + (gameState === 'decision' ? 1 : 0)}
          totalMoments={totalMoments}
          score={score}
        />
      )}

      {gameState === 'narration' && currentSegment && (
        <StoryNarrator
          text={currentSegment.text}
          onContinue={handleNarrationContinue}
        />
      )}

      {gameState === 'decision' && currentSegment && (
        <>
          <StoryNarrator
            text={currentSegment.text}
            onContinue={() => {}}
            showMerlin={false}
          />
          <ChoicePanel
            choices={currentSegment.choices}
            onChoice={handleChoice}
          />
        </>
      )}

      {gameState === 'reaction' && (
        <MerlinReaction
          choice={lastChoice}
          isCorrect={lastChoiceCorrect}
          onContinue={handleReactionContinue}
        />
      )}

      {gameState === 'ending' && (
        <EndingScreen
          story={story}
          decisions={decisions}
          score={score}
          onNewGame={handleNewQuest}
          onBackToSaves={handleBackToSaves}
        />
      )}
    </div>
  );
}
