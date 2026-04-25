/**
 * Save Manager — 3-slot localStorage save system for Merlin Quest
 */

const SAVE_KEY = 'merlin_quest_saves';
const HIGH_SCORES_KEY = 'merlin_quest_highscores';

export function getSaveSlots() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return [null, null, null];
    const parsed = JSON.parse(raw);
    return [parsed[0] || null, parsed[1] || null, parsed[2] || null];
  } catch {
    return [null, null, null];
  }
}

export function saveGame(slotIndex, data) {
  if (slotIndex < 0 || slotIndex > 2) return;
  const slots = getSaveSlots();
  slots[slotIndex] = {
    ...data,
    slot: slotIndex,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(slots));
}

export function loadGame(slotIndex) {
  const slots = getSaveSlots();
  return slots[slotIndex] || null;
}

export function deleteSave(slotIndex) {
  const slots = getSaveSlots();
  slots[slotIndex] = null;
  localStorage.setItem(SAVE_KEY, JSON.stringify(slots));
}

export function recordHighScore(entry) {
  try {
    const raw = localStorage.getItem(HIGH_SCORES_KEY);
    const scores = raw ? JSON.parse(raw) : [];
    scores.push({
      topic: entry.topic,
      characterName: entry.characterName,
      correct: entry.correct,
      total: entry.total,
      percentage: Math.round((entry.correct / entry.total) * 100),
      timestamp: new Date().toISOString(),
    });
    scores.sort((a, b) => b.percentage - a.percentage);
    localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(scores.slice(0, 20)));
  } catch { /* silent */ }
}

export function getHighScores() {
  try {
    const raw = localStorage.getItem(HIGH_SCORES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function createSaveState({ story, currentSegmentIndex, decisions, score, topic, completed = false }) {
  return {
    story,
    currentSegmentIndex,
    decisions: decisions || [],
    score: score || { correct: 0, total: 0 },
    topic,
    characterName: story?.character_name || 'Unknown',
    storyTitle: story?.title || 'Untitled Quest',
    completed,
    totalMoments: story?.segments?.filter(s => s.type === 'decision').length || 0,
  };
}
