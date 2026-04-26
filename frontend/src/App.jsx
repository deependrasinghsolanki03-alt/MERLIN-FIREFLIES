import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import QuestPage from './pages/QuestPage';
import CrtWrapper from './components/CrtWrapper';

import MainMenu from './pages/MainMenu';
import AdvisorPage from './pages/AdvisorPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <CrtWrapper>
            <MainMenu />
          </CrtWrapper>
        } />
        <Route path="/quest" element={
          <CrtWrapper>
            <QuestPage />
          </CrtWrapper>
        } />
        <Route path="/advisor" element={
          <CrtWrapper>
            <AdvisorPage />
          </CrtWrapper>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
