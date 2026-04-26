import { useState, useRef, useEffect } from 'react';
import { askFollowUpQuestion } from '../../utils/advisorEngine';
import '../../styles/Quest.css';

export default function AdvisorReport({ plan, userData, onFinish }) {
  const [chatLog, setChatLog] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  if (!plan) return null;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    setChatLog(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsChatLoading(true);

    // Build history for API with context
    const history = [
      { 
        role: 'assistant', 
        content: `Context: I gave this plan for salary: ₹${userData?.salary}, expenses: ₹${userData?.expenses}, location: ${userData?.location}. Plan: ${JSON.stringify(plan)}` 
      },
      ...chatLog.map(m => ({ role: m.role, content: m.content }))
    ];

    const response = await askFollowUpQuestion(history, userMsg);
    setChatLog(prev => [...prev, { role: 'assistant', content: response }]);
    setIsChatLoading(false);
  };

  return (
    <div className="ending-screen q-fade-in" style={{ padding: '2rem', overflowY: 'auto', maxHeight: '90vh', maxWidth: '800px', margin: '0 auto', background: 'rgba(20, 20, 40, 0.95)', border: '4px solid #b8860b', borderRadius: '8px' }}>
      <h1 className="quest-title" style={{ color: '#ffd700', fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
        📜 Merlin's Financial Scroll 📜
      </h1>

      {/* Budget Section */}
      <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.5)', borderLeft: '4px solid #4a90e2' }}>
        <h2 style={{ color: '#a8d8ff', marginBottom: '1rem' }}>💰 Budget Breakdown</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', color: '#fff', fontSize: '1.1rem' }}>
          <div><strong>Savings:</strong> ₹{plan.budget_plan?.savings_amount}</div>
          <div><strong>Investments:</strong> ₹{plan.budget_plan?.investments_amount}</div>
          <div><strong>Needs:</strong> ₹{plan.budget_plan?.needs_amount}</div>
          <div><strong>Wants:</strong> ₹{plan.budget_plan?.wants_amount}</div>
        </div>
        <p style={{ marginTop: '1rem', fontStyle: 'italic', color: '#ffd700' }}>
          " {plan.budget_plan?.merlin_comment} "
        </p>
      </div>

      {/* Projections Section - NEW */}
      {plan.projections && (
        <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.5)', borderLeft: '4px solid #b82cbd' }}>
          <h2 style={{ color: '#eb8cff', marginBottom: '1rem' }}>🔮 Future Wealth Projections</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', color: '#fff', fontSize: '1.1rem', marginBottom: '1rem' }}>
            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.9rem', color: '#ccc' }}>5 Years</div>
              <strong>{plan.projections.year_5}</strong>
            </div>
            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.9rem', color: '#ccc' }}>10 Years</div>
              <strong>{plan.projections.year_10}</strong>
            </div>
            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.9rem', color: '#ccc' }}>20 Years</div>
              <strong>{plan.projections.year_20}</strong>
            </div>
          </div>
          <div style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1rem' }}>
            <strong>Years to Financial Freedom:</strong> {plan.projections.financial_freedom_years}
          </div>
          <p style={{ fontStyle: 'italic', color: '#ffd700' }}>
            " {plan.projections.merlin_comment} "
          </p>
        </div>
      )}

      {/* Tax Section */}
      <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.5)', borderLeft: '4px solid #e24a4a' }}>
        <h2 style={{ color: '#ffa8a8', marginBottom: '1rem' }}>📋 Tax Strategy</h2>
        <div style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1rem' }}>
          <strong>Recommended Regime:</strong> {plan.tax_advice?.recommended_regime}
        </div>
        <ul style={{ color: '#fff', fontSize: '1.1rem', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          {plan.tax_advice?.tips?.map((tip, idx) => (
            <li key={idx} style={{ marginBottom: '0.5rem' }}>{tip}</li>
          ))}
        </ul>
        <p style={{ fontStyle: 'italic', color: '#ffd700' }}>
          " {plan.tax_advice?.merlin_comment} "
        </p>
      </div>

      {/* Investment Section */}
      <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.5)', borderLeft: '4px solid #4ae26a' }}>
        <h2 style={{ color: '#a8ffbc', marginBottom: '1rem' }}>📈 Investment Opportunities</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {plan.investment_advice?.map((inv, idx) => (
            <div key={idx} style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ color: '#fff', fontSize: '1.2rem' }}>{inv.name}</strong>
                <span style={{ color: '#a8d8ff' }}>Alloc: {inv.allocation_percent}%</span>
              </div>
              <div style={{ color: '#ffa8a8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Risk: {inv.risk_level}</div>
              <p style={{ color: '#ddd', lineHeight: '1.4' }}>{inv.details}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '1.5rem', background: '#2a2210', border: '2px dashed #b8860b', borderRadius: '4px', textAlign: 'center', marginBottom: '2rem' }}>
        <p style={{ color: '#ffd700', fontSize: '1.2rem', fontStyle: 'italic', lineHeight: '1.5' }}>
          "{plan.final_words}"
        </p>
      </div>

      {/* Dynamic Chat Section */}
      <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.8)', border: '2px solid #4a90e2', borderRadius: '4px' }}>
        <h2 style={{ color: '#a8d8ff', marginBottom: '1rem', textAlign: 'center' }}>🧙‍♂️ Consult Merlin</h2>
        
        <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
          {chatLog.length === 0 ? (
            <p style={{ color: '#aaa', textAlign: 'center', fontStyle: 'italic' }}>Ask me about specific risks, alternative investments, or how to save more!</p>
          ) : (
            chatLog.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: '1rem', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                <div style={{ 
                  display: 'inline-block', 
                  padding: '0.8rem 1.2rem', 
                  borderRadius: '8px',
                  background: msg.role === 'user' ? '#4a90e2' : '#2a2210',
                  color: '#fff',
                  border: msg.role === 'assistant' ? '1px solid #b8860b' : 'none',
                  maxWidth: '80%',
                  lineHeight: '1.4'
                }}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {isChatLoading && (
            <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
              <div style={{ display: 'inline-block', padding: '0.8rem', background: '#2a2210', color: '#ffd700', border: '1px solid #b8860b', borderRadius: '8px' }}>
                Merlin is pondering... ✨
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleChatSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            placeholder="Ask a follow-up question..."
            style={{ flex: 1, padding: '0.8rem', background: '#111', border: '2px solid #4a90e2', color: '#fff', outline: 'none', fontFamily: 'inherit' }}
            disabled={isChatLoading}
          />
          <button type="submit" className="btn-pixel" disabled={isChatLoading} style={{ padding: '0.8rem 1.5rem', width: 'auto' }}>
            Send
          </button>
        </form>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button className="btn-pixel" onClick={onFinish}>
          Return to Menu
        </button>
      </div>
    </div>
  );
}
