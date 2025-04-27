import FloatingControlPanel from '@layout/FloatingControlPanel';
import Footer from '@layout/Footer';
import Navbar from '@layout/Navbar';
import ChartsPage from '@pages/ChartsPage';
import HomePage from '@pages/HomePage';
import HowItWorksPage from '@pages/HowItWorksPage';
import ManualModePage from '@pages/ManualModePage';
import FlameBackground from '@ui/FlameBackground';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

function App() {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  return (
    <div className="from-background to-primary-container relative flex min-h-screen flex-col bg-gradient-to-br transition-colors duration-500">
      <FlameBackground animationsEnabled={animationsEnabled} />
      <Navbar />

      <FloatingControlPanel animationsEnabled={animationsEnabled} setAnimationsEnabled={setAnimationsEnabled} />

      <main className="pt-6">
        <Routes>
          <Route path="/" element={<HomePage animationsEnabled={animationsEnabled} />} />
          <Route path="/charts" element={<ChartsPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/manual" element={<ManualModePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
