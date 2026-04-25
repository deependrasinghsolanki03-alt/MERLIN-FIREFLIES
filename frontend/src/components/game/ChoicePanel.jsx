import { useState } from 'react';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function ChoicePanel({ choices, onChoice }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const handleClick = (index) => {
    if (selected !== null) return;
    setSelected(index);
    setRevealed(true);

    setTimeout(() => {
      onChoice(index, choices[index]);
    }, 1200);
  };

  const getClass = (index) => {
    if (!revealed) return '';
    if (choices[index].is_correct) return 'correct';
    if (index === selected && !choices[index].is_correct) return 'selected-wrong';
    if (!choices[index].is_correct) return 'wrong';
    return '';
  };

  return (
    <div className="choice-panel q-fade-in">
      <div className="choice-label">⚔️ Choose wisely ⚔️</div>
      <div className="choice-grid">
        {choices.map((c, i) => (
          <button
            key={i}
            className={`choice-btn ${getClass(i)}`}
            onClick={() => handleClick(i)}
            disabled={selected !== null}
          >
            <span className="choice-letter">{LETTERS[i]}.</span>
            <span className="choice-text">{c.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
