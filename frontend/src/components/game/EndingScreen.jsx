import { useEffect, useState } from 'react';
import PixelSprite from './PixelSprite';

export default function EndingScreen({ story, decisions, score, onNewGame, onBackToSaves }) {
  const [confetti, setConfetti] = useState([]);
  const isGood = score.correct >= Math.ceil(score.total / 2);
  const percentage = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  useEffect(() => {
    if (isGood) {
      const colors = ['#ffd700', '#00cc6a', '#3498db', '#9b59b6', '#ff4757'];
      const pixels = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 2,
      }));
      setConfetti(pixels);
    }
  }, [isGood]);

  return (
    <div className="ending-screen q-fade-in">
      {isGood && confetti.length > 0 && (
        <div className="pixel-confetti">
          {confetti.map((p) => (
            <div
              key={p.id}
              className="confetti-pixel"
              style={{
                left: `${p.left}%`,
                background: p.color,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      <PixelSprite character="merlin" emotion={isGood ? 'happy' : 'angry'} />

      <h1 className={`ending-title ${isGood ? 'good' : 'bad'}`}>
        {isGood ? '🏆 QUEST COMPLETE! 🏆' : '💀 QUEST FAILED 💀'}
      </h1>

      <div className="ending-score">
        {score.correct} / {score.total} correct ({percentage}%)
      </div>

      <p className="ending-text">
        {isGood ? story?.good_ending : story?.bad_ending}
      </p>

      <div className="ending-decisions">
        <div className="quest-subtitle q-mb">Decision Summary</div>
        {decisions.map((d, i) => (
          <div key={i} className={`ending-decision-item ${d.wasCorrect ? 'correct' : 'wrong'}`}>
            {d.wasCorrect ? '✅' : '❌'} Moment {i + 1}: {d.choiceText}
          </div>
        ))}
      </div>

      <div className="ending-buttons">
        <button className="pixel-btn pixel-btn-gold" onClick={onNewGame}>
          NEW QUEST
        </button>
        <button className="pixel-btn" onClick={onBackToSaves}>
          SAVE SLOTS
        </button>
      </div>
    </div>
  );
}
