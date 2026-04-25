export default function TopicSelector({ onSelect }) {
  const topics = [
    { id: 'budgeting', icon: '💰', name: 'Budgeting', desc: 'Learn to manage your money, save wisely, and avoid spending traps' },
    { id: 'taxing', icon: '📋', name: 'Taxing', desc: 'Navigate the world of taxes, deductions, and smart filing' },
    { id: 'investment', icon: '📈', name: 'Investment', desc: 'Start your investment journey and avoid common financial scams' },
  ];

  return (
    <div className="topic-selector q-fade-in">
      <h1 className="quest-title">🗡️ CHOOSE YOUR QUEST 🗡️</h1>
      <p className="quest-subtitle">Select a financial skill to master</p>
      <div className="topic-grid">
        {topics.map((t) => (
          <div key={t.id} className="topic-card" onClick={() => onSelect(t.id)}>
            <span className="topic-icon">{t.icon}</span>
            <div className="topic-name">{t.name}</div>
            <div className="topic-desc">{t.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
