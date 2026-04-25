import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import QuestPage from './pages/QuestPage';
import CrtWrapper from './components/CrtWrapper';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <CrtWrapper>
            <QuestPage />
          </CrtWrapper>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
