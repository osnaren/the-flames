import CallToAction from './components/CallToAction';
import Header from './components/Header';
import MeaningSection from './components/MeaningSection';
import Step1Names from './components/Step1Names';
import Step2CommonLetters from './components/Step2CommonLetters';
import Step3FlamesSimulation from './components/Step3FlamesSimulation';
import { DEMO_COMMON_LETTERS, DEMO_NAME1, DEMO_NAME2, DEMO_REMAINING_COUNT } from './howItWorks.constants';

/**
 * Container component for the How It Works feature
 * Serves as the composition point for all section components
 */
export default function HowItWorksContainer() {
  return (
    <div className="px-4 py-8 md:px-6">
      <div className="mx-auto max-w-4xl">
        <Header />

        {/* Tutorial sections with consistent spacing */}
        <div className="space-y-20">
          <Step1Names name1={DEMO_NAME1} name2={DEMO_NAME2} />

          <Step2CommonLetters
            name1={DEMO_NAME1}
            name2={DEMO_NAME2}
            commonLetters={DEMO_COMMON_LETTERS}
            remainingLettersCount={DEMO_REMAINING_COUNT}
          />

          <Step3FlamesSimulation remainingLettersCount={DEMO_REMAINING_COUNT} />

          <MeaningSection />

          <CallToAction />
        </div>
      </div>
    </div>
  );
}
