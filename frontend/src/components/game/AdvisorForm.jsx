import { useState } from 'react';
import '../../styles/Quest.css';

export default function AdvisorForm({ onSubmit, onCancel }) {
  const [salary, setSalary] = useState('');
  const [expenses, setExpenses] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!salary || !expenses || !location) return;
    
    onSubmit({
      salary: Number(salary),
      expenses: Number(expenses),
      location
    });
  };

  return (
    <div className="choice-panel q-fade-in" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: '#ffd700', textShadow: '0 2px 0 #b8860b', textAlign: 'center', marginBottom: '1rem' }}>
        🧙‍♂️ Merlin's Advisor 🧙‍♂️
      </h2>
      <p style={{ color: '#fff', textAlign: 'center', marginBottom: '2rem' }}>
        Provide your details so Merlin can craft your personalized financial scroll!
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: '#a8d8ff', fontSize: '1.1rem' }}>Monthly Salary (₹):</label>
          <input 
            type="number" 
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.5)', border: '2px solid #5a5a8c', color: '#fff', fontSize: '1.2rem', borderRadius: '4px' }}
            required 
            placeholder="e.g. 50000"
            min="0"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: '#a8d8ff', fontSize: '1.1rem' }}>Monthly Fixed Expenses (₹):</label>
          <input 
            type="number" 
            value={expenses}
            onChange={(e) => setExpenses(e.target.value)}
            style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.5)', border: '2px solid #5a5a8c', color: '#fff', fontSize: '1.2rem', borderRadius: '4px' }}
            required 
            placeholder="e.g. 20000"
            min="0"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: '#a8d8ff', fontSize: '1.1rem' }}>Location/City:</label>
          <input 
            type="text" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.5)', border: '2px solid #5a5a8c', color: '#fff', fontSize: '1.2rem', borderRadius: '4px' }}
            required 
            placeholder="e.g. Mumbai, Tier-2 City"
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="submit" className="choice-btn" style={{ flex: 1, justifyContent: 'center' }}>
            Consult Merlin ✨
          </button>
          <button type="button" onClick={onCancel} className="choice-btn" style={{ flex: 0.5, justifyContent: 'center', background: '#3a1c1c', borderColor: '#8c5a5a' }}>
            Back
          </button>
        </div>
      </form>
    </div>
  );
}
