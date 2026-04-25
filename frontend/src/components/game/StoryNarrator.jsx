import { useState, useEffect, useRef } from 'react';
import PixelSprite from './PixelSprite';

export default function StoryNarrator({ text, onContinue, showMerlin = true }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let i = 0;

    intervalRef.current = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(intervalRef.current);
        setIsTyping(false);
      }
    }, 25);

    return () => clearInterval(intervalRef.current);
  }, [text]);

  const handleSkip = () => {
    if (isTyping) {
      clearInterval(intervalRef.current);
      setDisplayedText(text);
      setIsTyping(false);
    } else {
      onContinue();
    }
  };

  return (
    <div className="narrator-container q-fade-in" onClick={handleSkip}>
      <div className="narrator-box">
        <div className="narrator-character-row">
          {showMerlin && (
            <div style={{ flexShrink: 0 }}>
              <PixelSprite character="merlin" emotion="neutral" />
            </div>
          )}
          <div className="narrator-text-area">
            <p className="narrator-text">
              {displayedText}
              {isTyping && <span className="narrator-cursor" />}
            </p>
          </div>
        </div>
        {!isTyping && (
          <div className="narrator-continue">
            <button className="narrator-continue-btn">
              CONTINUE ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
