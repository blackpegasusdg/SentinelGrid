import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Shield, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { users, getApiError } from '@/services/api';
import { fadeUp, staggerContainer } from '@/animations';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const validate = () => {
    if (!email) return 'Email is required';
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    setError('');
    try {
      const res = await users.login({ email, password });
      await login(res.access_token);
      navigate('/dashboard');
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-bg-primary">
      {/* Left panel — brand */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden bg-bg-secondary border-r border-border-default">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute inset-0 hero-glow" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-accent-cyan/8 rounded-full blur-[80px]" />

        <div className="relative flex flex-col items-center justify-center flex-1 px-16">
          <Shield size={56} className="text-accent-cyan mb-8" strokeWidth={1.5} />
          <h1 className="font-space text-5xl font-extrabold text-text-primary mb-4 text-center">
            SENTINEL<span className="text-accent-cyan">GRID</span>
          </h1>
          <p className="text-text-secondary text-lg font-inter text-center max-w-xs leading-relaxed">
            AI-Assisted Cybersecurity Posture Monitoring Platform
          </p>
          <div className="mt-16 grid grid-cols-2 gap-6 w-full max-w-xs">
            {[
              { label: 'Asset Types', value: '3' },
              { label: 'Scan Types',  value: '3' },
              { label: 'Tenant ISO',  value: '100%' },
              { label: 'API Uptime',  value: '99.9%' },
            ].map(s => (
              <div key={s.label} className="bg-bg-card border border-border-default rounded-xl p-4 text-center">
                <div className="font-mono text-2xl font-bold text-accent-cyan">{s.value}</div>
                <div className="text-xs text-text-secondary mt-1 font-inter">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-col items-center justify-center flex-1 px-6 py-16">
        <motion.div
          className="w-full max-w-sm"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Logo (mobile only) */}
          <motion.div variants={fadeUp} className="lg:hidden mb-10 text-center">
            <div className="inline-flex items-center gap-2">
              <Shield size={24} className="text-accent-cyan" />
              <span className="font-space font-bold text-text-primary text-xl">
                SENTINEL<span className="text-accent-cyan">GRID</span>
              </span>
            </div>
          </motion.div>

          <motion.h2 variants={fadeUp} className="font-space text-2xl font-bold text-text-primary mb-1">
            Welcome back
          </motion.h2>
          <motion.p variants={fadeUp} className="text-text-secondary text-sm font-inter mb-8">
            Sign in to your SentinelGrid account
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div variants={fadeUp}>
              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                icon={<Mail size={16} />}
                autoComplete="email"
              />
            </motion.div>
            <motion.div variants={fadeUp} className="relative">
              <Input
                label="Password"
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                icon={<Lock size={16} />}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-9 text-text-secondary hover:text-text-primary transition-colors"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </motion.div>

            {error && (
              <motion.p
                variants={fadeUp}
                className="text-critical text-sm font-inter bg-critical/10 border border-critical/20 rounded-lg px-4 py-3"
              >
                {error}
              </motion.p>
            )}

            <motion.div variants={fadeUp}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full"
                iconRight={!loading ? <ArrowRight size={16} /> : undefined}
              >
                Sign In
              </Button>
            </motion.div>
          </form>

          <motion.p variants={fadeUp} className="mt-8 text-center text-text-secondary text-sm font-inter">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent-cyan hover:underline">
              Create one
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
