import SponsorFAB from '@features/sponsor/SponsorFAB';
import Footer from '@layout/Footer';
import GlobalErrorBoundary from '@layout/GlobalErrorBoundary';
import Navbar from '@layout/Navbar';
import HomePage from '@pages/HomePage';
import HowItWorksPage from '@pages/HowItWorksPage';
import FlameBackground from '@ui/FlameBackground';
import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
const ChartsPage = lazy(() => import('@pages/ChartsPage'));
const ManualModePage = lazy(() => import('@pages/ManualModePage'));

function App() {
  return (
    <div className="from-customBg-1 to-customBg-2 relative flex min-h-screen flex-col bg-gradient-to-br transition-colors duration-500">
      <FlameBackground />
      <Navbar />

      <main className="pt-6">
        <GlobalErrorBoundary>
          <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/charts" element={<ChartsPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/manual" element={<ManualModePage />} />
            </Routes>
          </Suspense>
        </GlobalErrorBoundary>
      </main>
      <SponsorFAB />
      <Footer />
    </div>
  );
}

export default App;
