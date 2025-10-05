import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button.jsx';
import { Sprout, Coins, Globe2, Flame } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';

const slides = [
  {
    icon: <Sprout className="h-12 w-12" />,
    title: 'Learn & Earn',
    text: 'Turn simple green actions into daily rewards.',
    bg: 'from-emerald-100 via-emerald-50 to-white'
  },
  {
    icon: <Coins className="h-12 w-12" />,
    title: 'Real Token Rewards',
    text: 'Complete challenges and earn up to 150 tokens/week.',
    bg: 'from-yellow-100 via-emerald-50 to-white'
  },
  {
    icon: <Globe2 className="h-12 w-12" />,
    title: 'Impact You Can Feel',
    text: 'Join thousands saving money and the planet—together.',
    bg: 'from-sky-100 via-emerald-50 to-white'
  }
];

export default function Onboarding() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const done = localStorage.getItem('onboardingCompleted');
    if (done) {
      navigate(user ? '/dashboard' : '/signup');
    }
  }, [navigate, user]);

  const next = () => {
    if (index < slides.length - 1) {
      setIndex((i) => i + 1);
    } else {
      localStorage.setItem('onboardingCompleted', 'true');
      navigate(user ? '/onboarding-quiz' : '/signup');
    }
  };

  const skip = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    navigate(user ? '/onboarding-quiz' : '/signup');
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-between bg-gradient-to-br from-white via-emerald-50 to-emerald-100 px-6 py-8">
      <div className="flex w-full max-w-2xl justify-end">
        <button onClick={skip} className="text-emerald-700 hover:text-emerald-900 text-sm font-medium">Skip</button>
      </div>
      <div className="flex w-full max-w-2xl flex-1 items-center justify-center">
        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.35 }}
              className={`glass-panel mx-auto max-w-xl space-y-6 bg-gradient-to-br ${slides[index].bg} p-8 text-center`}
            >
              <div className="eco-gradient mx-auto flex h-24 w-24 items-center justify-center rounded-full shadow-soft">
                <span className="text-white">{slides[index].icon}</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900">{slides[index].title}</h2>
              <p className="text-slate-600">{slides[index].text}</p>

              {/* Hooks: value props */}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 text-left">
                <div className="rounded-xl border border-emerald-100 bg-white/70 p-3 backdrop-blur">
                  <div className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-emerald-600" />
                    <p className="text-sm font-semibold text-slate-900">Earn tokens</p>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">Verify actions and get paid in tokens.</p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-white/70 p-3 backdrop-blur">
                  <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-emerald-600" />
                    <p className="text-sm font-semibold text-slate-900">Build streaks</p>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">Daily bonuses when you stay consistent.</p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-white/70 p-3 backdrop-blur">
                  <div className="flex items-center gap-2">
                    <Globe2 className="h-5 w-5 text-emerald-600" />
                    <p className="text-sm font-semibold text-slate-900">Save money</p>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">Cut costs with smart sustainable swaps.</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="flex w-full max-w-2xl items-center justify-between">
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <span key={i} className={`h-2 w-2 rounded-full ${i === index ? 'bg-emerald-500' : 'bg-emerald-200'}`} />
          ))}
        </div>
        <Button variant="primary" onClick={next}>
          {index < slides.length - 1 ? 'Next' : 'Start earning now'}
        </Button>
      </div>
    </div>
  );
}