import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button.jsx';
import { Card } from '../ui/Card.jsx';
import { supabase } from '../../lib/supabase.js';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const done = localStorage.getItem('onboardingCompleted');
      if (!done) {
        navigate('/welcome');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-slate-600">Log in to continue your EcoSkill journey.</p>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-full border border-emerald-100 bg-white px-12 py-3 text-slate-900 shadow-soft focus:border-emerald-300 focus:outline-none"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-full border border-emerald-100 bg-white px-12 py-3 text-slate-900 shadow-soft focus:border-emerald-300 focus:outline-none"
              />
              <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600">
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-rose-600">
                {error}
              </motion.div>
            )}
            <Button type="submit" variant="primary" loading={loading} className="w-full">
              Log In
            </Button>
          </form>
          <p className="text-center text-sm text-slate-600">
            New here? <Link to="/signup" className="text-emerald-700 hover:text-emerald-900">Create account</Link>
          </p>
        </div>
      </Card>
    </div>
  );
}