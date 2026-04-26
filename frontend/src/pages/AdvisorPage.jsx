import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdvisorForm from '../components/game/AdvisorForm';
import AdvisorReport from '../components/game/AdvisorReport';
import { generateAdvisorPlan } from '../utils/advisorEngine';
import '../styles/Quest.css';

function StarsBG() {
  const stars = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      size: Math.random() > 0.7 ? 3 : 2,
    })), []);

  return (
    <div className="quest-stars">
      {stars.map(s => (
        <div key={s.id} className="quest-star" style={{
          left: `${s.left}%`, top: `${s.top}%`,
          animationDelay: `${s.delay}s`,
          width: s.size, height: s.size,
        }} />
      ))}
    </div>
  );
}

export default function AdvisorPage() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('advisor_input');
  const [advisorPlan, setAdvisorPlan] = useState(null);
  const [userData, setUserData] = useState(null);

  const handleAdvisorSubmit = async (data) => {
    setUserData(data);
    setGameState('advisor_loading');
    try {
      const plan = await generateAdvisorPlan(data);
      setAdvisorPlan(plan);
      setGameState('advisor_result');
    } catch (err) {
      console.error(err);
      setGameState('advisor_input');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="quest-page">
      <StarsBG />

      {gameState === 'advisor_input' && (
        <AdvisorForm onSubmit={handleAdvisorSubmit} onCancel={handleCancel} />
      )}

      {gameState === 'advisor_loading' && (
        <div className="quest-loading">
          <div className="quest-loading-text">
            MERLIN IS CALCULATING YOUR FUTURE...
          </div>
          <div className="quest-loading-bar">
            <div className="quest-loading-fill" />
          </div>
          <div className="quest-subtitle" style={{ marginTop: 16 }}>
            Crunching the numbers with AI magic ✨
          </div>
        </div>
      )}

      {gameState === 'advisor_result' && (
        <AdvisorReport 
          plan={advisorPlan} 
          userData={userData}
          onFinish={handleCancel} 
        />
      )}
    </div>
  );
}
