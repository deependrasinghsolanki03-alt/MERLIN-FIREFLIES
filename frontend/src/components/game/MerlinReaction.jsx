import { useState, useEffect, useRef } from 'react';
import PixelSprite from './PixelSprite';

export default function MerlinReaction({ choice, isCorrect, onContinue }) {
  const [displayedReaction, setDisplayedReaction] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const intervalRef = useRef(null);
  const fullText = choice?.merlin_reaction || '';

  useEffect(() => {
    setDisplayedReaction('');
    setIsTyping(true);
    let i = 0;

    intervalRef.current = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedReaction(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(intervalRef.current);
        setIsTyping(false);
      }
    }, 20);

    return () => clearInterval(intervalRef.current);
  }, [fullText]);

  const handleClick = () => {
    if (isTyping) {
      clearInterval(intervalRef.current);
      setDisplayedReaction(fullText);
      setIsTyping(false);
    }
  };

  const emotion = isCorrect ? 'happy' : 'angry';
  const moodClass = isCorrect ? 'happy' : 'angry';

  return (
    <div className="merlin-reaction q-fade-in" onClick={handleClick}>
      <div className={`merlin-reaction-box ${moodClass}`}>
        <div className="merlin-reaction-header">
          <PixelSprite character="merlin" emotion={emotion} />
          <span className={`merlin-reaction-name ${moodClass}`}>
            {isCorrect ? '🌟 MERLIN APPROVES! 🌟' : '💢 MERLIN IS DISPLEASED! 💢'}
          </span>
        </div>

        <p className="merlin-reaction-text">
          {displayedReaction}
          {isTyping && <span className="narrator-cursor" />}
        </p>

        {choice?.explanation && !isTyping && (
          <div className="merlin-explanation">
            {choice.explanation}
          </div>
        )}

        {!isTyping && (
          <div style={{ textAlign: 'right', marginTop: '16px' }}>
            <button className="pixel-btn pixel-btn-gold" onClick={onContinue}>
              CONTINUE QUEST ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
