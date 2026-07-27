import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './components/Landing';
import DiagnosisForm from './components/DiagnosisForm';
import ResultPage from './components/ResultPage';
import SupportPrograms from './components/SupportPrograms';
import Simulation from './components/Simulation';
import { diagnose } from './lib/api';

const pageVariants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

function App() {
  const [view, setView] = useState('landing');
  const [form, setForm] = useState(null);
  const [result, setResult] = useState(null);
  const [formKey, setFormKey] = useState(0);

  const handleNavigate = (target) => {
    setView(target);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleComplete = async (formData) => {
    setForm(formData);
    setResult(await diagnose(formData));
    handleNavigate('result');
  };

  const handleRestart = () => {
    setForm(null);
    setResult(null);
    setFormKey((k) => k + 1);
    handleNavigate('landing');
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAF8]">
      <Header onNavigate={handleNavigate} />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            {view === 'landing' && <Landing onStart={() => handleNavigate('form')} />}
            {view === 'form' && (
              <DiagnosisForm
                key={formKey}
                onComplete={handleComplete}
                onExit={() => handleNavigate('landing')}
              />
            )}
            {view === 'result' && form && result && (
              <ResultPage form={form} result={result} onCheckSupport={() => handleNavigate('support')} />
            )}
            {view === 'support' && form && (
              <SupportPrograms
                form={form}
                onBack={() => handleNavigate('result')}
                onNext={() => handleNavigate('simulation')}
              />
            )}
            {view === 'simulation' && form && result && (
              <Simulation
                form={form}
                result={result}
                onBack={() => handleNavigate('support')}
                onRestart={handleRestart}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

export default App;
