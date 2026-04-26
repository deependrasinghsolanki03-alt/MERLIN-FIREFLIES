import { useNavigate } from 'react-router-dom';
import '../styles/Quest.css';

export default function MainMenu() {
  const navigate = useNavigate();

  return (
    <div className="quest-page q-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="quest-stars">
        {/* Simple stars background directly embedded or imported, since it's shared, maybe just simple css for now */}
      </div>
      
      <div style={{ textAlign: 'center', marginBottom: '3rem', zIndex: 10 }}>
        <h1 className="quest-title" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
          MERLIN'S DOMAIN
        </h1>
        <p className="quest-subtitle" style={{ fontSize: '1.2rem' }}>
          Choose your path, young adventurer!
        </p>
      </div>

      <div className="topic-grid" style={{ zIndex: 10, maxWidth: '800px', display: 'flex', gap: '2rem', padding: '0 2rem' }}>
        <div 
          className="topic-card" 
          onClick={() => navigate('/quest')}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}
        >
          <span className="topic-icon" style={{ fontSize: '4rem', marginBottom: '1rem' }}>🗡️</span>
          <div className="topic-name" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Play Quest</div>
          <div className="topic-desc" style={{ textAlign: 'center' }}>
            Embark on a story-driven adventure to test your financial knowledge and make crucial choices.
          </div>
        </div>

        <div 
          className="topic-card" 
          onClick={() => navigate('/advisor')}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}
        >
          <span className="topic-icon" style={{ fontSize: '4rem', marginBottom: '1rem' }}>📜</span>
          <div className="topic-name" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Consult Advisor</div>
          <div className="topic-desc" style={{ textAlign: 'center' }}>
            Get a personalized financial plan, concrete future projections, and ask Merlin follow-up questions.
          </div>
        </div>
      </div>
    </div>
  );
}
