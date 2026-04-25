import { getSaveSlots, deleteSave } from '../../utils/saveManager';
import { useState } from 'react';

export default function SaveSlotScreen({ onNewGame, onContinue }) {
  const [slots, setSlots] = useState(getSaveSlots());
  const [confirmIndex, setConfirmIndex] = useState(null);

  const handleDelete = (i, e) => {
    e.stopPropagation();
    e.preventDefault();
    if (confirmIndex === i) {
      // Second click — actually delete
      deleteSave(i);
      setSlots(getSaveSlots());
      setConfirmIndex(null);
    } else {
      // First click — ask for confirmation
      setConfirmIndex(i);
    }
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setConfirmIndex(null);
  };

  const handleSlotClick = (i) => {
    if (confirmIndex !== null) {
      setConfirmIndex(null);
      return;
    }
    if (slots[i]) {
      onContinue(i, slots[i]);
    } else {
      onNewGame(i);
    }
  };

  const topicIcons = { budgeting: '💰', taxing: '📋', investment: '📈' };

  const formatDate = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="save-slots-container q-fade-in">
      <h1 className="quest-title">⚔️ MERLIN'S QUEST ⚔️</h1>
      <p className="quest-subtitle">Choose a save slot</p>

      {slots.map((slot, i) => (
        <div
          key={i}
          className={`save-slot ${!slot ? 'empty' : ''}`}
          onClick={() => handleSlotClick(i)}
        >
          {slot ? (
            <>
              <div className="save-slot-header">
                <span className="save-slot-title">
                  {topicIcons[slot.topic] || '📖'} {slot.storyTitle || 'Quest'}
                </span>
                <span className="save-slot-topic">{slot.topic}</span>
              </div>
              <div className="save-slot-info">
                {slot.characterName} · Score: {slot.score?.correct || 0}/{slot.score?.total || 0}
                {slot.completed ? ' · ✅ COMPLETE' : ''}
              </div>
              <div className="save-slot-info">{formatDate(slot.timestamp)}</div>
              <div className="save-slot-progress">
                <div
                  className="save-slot-progress-fill"
                  style={{
                    width: slot.totalMoments
                      ? `${((slot.score?.total || 0) / slot.totalMoments) * 100}%`
                      : '0%'
                  }}
                />
              </div>
              <div className="save-slot-actions">
                <button className="pixel-btn pixel-btn-green" style={{ fontSize: '0.5rem', padding: '8px 16px' }}>
                  {slot.completed ? 'VIEW' : 'CONTINUE'}
                </button>
                {confirmIndex === i ? (
                  <>
                    <button
                      className="pixel-btn pixel-btn-red"
                      style={{ fontSize: '0.5rem', padding: '8px 16px', background: '#ff4757', color: '#fff' }}
                      onClick={(e) => handleDelete(i, e)}
                    >
                      CONFIRM?
                    </button>
                    <button
                      className="pixel-btn"
                      style={{ fontSize: '0.5rem', padding: '8px 16px' }}
                      onClick={handleCancelDelete}
                    >
                      CANCEL
                    </button>
                  </>
                ) : (
                  <button
                    className="pixel-btn pixel-btn-red"
                    style={{ fontSize: '0.5rem', padding: '8px 16px' }}
                    onClick={(e) => handleDelete(i, e)}
                  >
                    DELETE
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="save-slot-new-icon">✨</div>
              <div className="save-slot-empty-text">
                — SLOT {i + 1} — NEW QUEST —
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
