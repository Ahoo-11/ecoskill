import { NavLink, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from './components/ui/Button.jsx';
import Onboarding from './components/Onboarding.jsx';
import SignUp from './components/Auth/SignUp.jsx';
import Login from './components/Auth/Login.jsx';
import QuizFlow from './components/Quiz/QuizFlow.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import AuthGuard from './components/AuthGuard.jsx';
import Tutor from './components/Tutor/Tutor.jsx';
import ChallengeSubmit from './components/Challenge/ChallengeSubmit.jsx';
import { useAuth } from './hooks/useAuth.jsx';
import LessonView from './components/Lesson/LessonView.jsx';

function HeaderNav() {
  const { user } = useAuth();
  const location = useLocation();
  const isWelcome = location.pathname.startsWith('/welcome');
  const guestLinks = [
    { to: '/signup', label: 'Sign Up' },
    { to: '/login', label: 'Login' }
  ];
  const authedLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/onboarding-quiz', label: 'Quiz' },
    { to: '/tutor', label: 'Tutor' }
  ];
  const links = user ? authedLinks : guestLinks;

  return (
    <nav className="hidden gap-2 md:flex">
      {links.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              isActive ? 'bg-emerald-500 text-white shadow-soft' : 'text-emerald-700 hover:bg-emerald-100'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

const Placeholder = ({ title }) => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-emerald-50 px-6 py-12 text-center">
    <div className="eco-gradient flex h-24 w-24 items-center justify-center rounded-full shadow-soft">
      <Sparkles className="h-12 w-12 text-white" />
    </div>
    <div className="space-y-6 max-w-md">
      <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
      <p className="text-slate-600">
        This screen is in progress. We&apos;ll craft a delightful EcoSkill experience here soon.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Button variant="primary">Primary action</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="success">Earn Tokens</Button>
      </div>
    </div>
  </div>
);

const AppShell = () => (
  <div className="flex min-h-screen flex-col bg-gradient-to-br from-white via-emerald-50 to-emerald-100">
    <header className="sticky top-0 z-20 border-b border-emerald-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-2xl">🌿</span>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">EcoSkill</p>
            <h1 className="text-lg font-semibold text-slate-900">Design System Playground</h1>
          </div>
        </div>
        <HeaderNav />
      </div>
    </header>
    <main className="flex-1">
      <Outlet />
    </main>
    <footer className="border-t border-emerald-100 bg-white/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-4 text-sm text-emerald-600 md:flex-row">
        <span>© {new Date().getFullYear()} EcoSkill Labs</span>
        <span className="flex items-center gap-1">
          Crafted with <span role="img" aria-label="sparkles">✨</span> for a greener future
        </span>
      </div>
    </footer>
  </div>
);

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/welcome" element={<Onboarding />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/onboarding-quiz"
          element={
            <AuthGuard>
              <QuizFlow />
            </AuthGuard>
          }
        />
        <Route
          path="/challenge/:id/submit"
          element={
            <AuthGuard>
              <ChallengeSubmit />
            </AuthGuard>
          }
        />
        <Route
          path="/tutor"
          element={
            <AuthGuard>
              <Tutor />
            </AuthGuard>
          }
        />
        <Route
          path="/lesson/:id"
          element={
            <AuthGuard>
              <LessonView />
            </AuthGuard>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route path="*" element={<Placeholder title="EcoSkill Experience Coming Soon" />} />
      </Route>
    </Routes>
  );
}

export default App;
