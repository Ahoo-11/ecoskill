import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from '../ui/ProgressBar.jsx';
import { Card } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { useProfile } from '../../hooks/useProfile.jsx';

const questions = [
  {
    title: 'Where do you live?',
    options: [
      { label: 'City' },
      { label: 'Suburbs' },
      { label: 'Rural' }
    ]
  },
  {
    title: "What's your main goal?",
    options: [
      { label: 'Save money' },
      { label: 'Reduce waste' },
      { label: 'Lower carbon' },
      { label: 'Learn' }
    ]
  },
  {
    title: 'Transportation?',
    options: [
      { label: 'Car' },
      { label: 'Public' },
      { label: 'Bike' },
      { label: 'Walk' }
    ]
  },
  {
    title: 'Diet?',
    options: [
      { label: 'Omnivore' },
      { label: 'Vegetarian' },
      { label: 'Vegan' },
      { label: 'Flexitarian' }
    ]
  },
  {
    title: 'Current skill level?',
    options: [
      { label: 'Beginner' },
      { label: 'Intermediate' },
      { label: 'Advanced' }
    ]
  }
];

export default function QuizFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const { updateFields } = useProfile();

  const selectOption = (label) => {
    setAnswers({ ...answers, [questions[step].title]: label });
  };

  const next = async () => {
    if (step < questions.length - 1) {
      setStep((s) => s + 1);
    } else {
      try {
        // Persist onboarding preferences to user profile for AI personalization
        await updateFields({ preferences: answers });
      } catch (_) {
        // Non-blocking: proceed even if preferences are not yet supported in DB
      }
      navigate('/dashboard');
    }
  };

  const back = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-6">
        <ProgressBar value={Math.round(((step + 1) / questions.length) * 100)} />
        <div className="mt-2 text-sm text-slate-600">Question {step + 1} / {questions.length}</div>
      </div>
      <Card className="space-y-6">
        <h2 className="text-2xl font-semibold">{questions[step].title}</h2>
        <div className="grid grid-cols-2 gap-4">
          {questions[step].options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => selectOption(opt.label)}
              className={`glass-panel flex items-center gap-3 rounded-2xl border px-4 py-4 text-left ${answers[questions[step].title] === opt.label ? 'border-emerald-300 bg-emerald-50' : 'border-emerald-100 bg-white'}`}
            >
              <span className="font-medium">{opt.label}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <Button variant="secondary" onClick={back} disabled={step === 0}>Back</Button>
          <Button variant="primary" onClick={next}>Next</Button>
        </div>
      </Card>
    </div>
  );
}