import { Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import FloatingControlPanel from './components/layout/FloatingControlPanel';
import FlameBackground from './components/ui/FlameBackground';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ChartsPage from './pages/ChartsPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ManualModePage from './pages/ManualModePage';
import { useState } from 'react';

function App() {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-red-950 transition-colors duration-500 relative flex flex-col">
      <FlameBackground animationsEnabled={animationsEnabled} />
      <Navbar />
      
      <FloatingControlPanel
        animationsEnabled={animationsEnabled}
        setAnimationsEnabled={setAnimationsEnabled}
      />
      
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