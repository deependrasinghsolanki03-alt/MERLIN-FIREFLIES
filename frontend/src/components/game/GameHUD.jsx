export default function GameHUD({ topic, currentMoment, totalMoments, score }) {
  const topicIcons = { budgeting: '💰', taxing: '📋', investment: '📈' };

  return (
    <div className="game-hud">
      <div className="hud-item hud-topic">
        {topicIcons[topic] || '📖'} {topic?.toUpperCase()}
      </div>
      <div className="hud-item hud-progress">
        ⚔️ MOMENT {currentMoment}/{totalMoments}
      </div>
      <div className="hud-item hud-score">
        <span className="hud-coin" /> × {score.correct}
      </div>
    </div>
  );
}
