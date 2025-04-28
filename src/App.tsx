import SponsorFAB from '@features/sponsor/SponsorFAB';
import Footer from '@layout/Footer';
import Navbar from '@layout/Navbar';
import ChartsPage from '@pages/ChartsPage';
import HomePage from '@pages/HomePage';
import HowItWorksPage from '@pages/HowItWorksPage';
import ManualModePage from '@pages/ManualModePage';
import FlameBackground from '@ui/FlameBackground';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="from-customBg-1 to-customBg-2 relative flex min-h-screen flex-col bg-gradient-to-br transition-colors duration-500">
      <FlameBackground />
      <Navbar />

      <main className="pt-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/charts" element={<ChartsPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/manual" element={<ManualModePage />} />
        </Routes>
      </main>
      <SponsorFAB />
      <Footer />
    </div>
  );
}

export default App;
