import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './components/Landing';
import DiagnosisForm from './components/DiagnosisForm';
import ResultPage from './components/ResultPage';
import SupportPrograms from './components/SupportPrograms';
import Simulation from './components/Simulation';
import { diagnose, submitEventAnswers } from './lib/api';

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

    // profile_id는 이미 정보입력 2스텝(희망 주거 정보) 완료 시점에 확보되어 있다.
    // 진단 화면은 로컬 계산으로 이미 그려졌으니 이벤트 답변 제출은 기다리지 않고
    // 실패해도 화면 흐름이 끊기지 않도록 조용히 콘솔에만 남긴다.
    if (formData.profileId) {
      submitEventAnswers(formData.profileId, formData.confirmedEvents ?? []).catch((err) => {
        console.warn('[persona] 이벤트 제출 실패 (백엔드 미연동 상태일 수 있음):', err.message);
      });
    }
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
