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
    <div className="relative flex min-h-screen flex-col bg-gradient-to-br from-orange-50 to-red-50 transition-colors duration-500 dark:from-gray-900 dark:to-red-950">
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
