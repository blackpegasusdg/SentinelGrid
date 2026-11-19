import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Mail, Lock, User, Shield, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { tenants, users, getApiError } from '@/services/api';
import { fadeUp, staggerContainer } from '@/animations';

type Step = 'org' | 'user';

export function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Step management
  const [step, setStep] = useState<Step>('org');

  // Org step
  const [orgName, setOrgName]   = useState('');
  const [orgError, setOrgError] = useState('');
  const [orgLoading, setOrgLoading] = useState(false);
  const [tenantId, setTenantId] = useState<number | null>(null);

  // User step
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [userError, setUserError] = useState('');
  const [userLoading, setUserLoading] = useState(false);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) { setOrgError('Organisation name is required'); return; }
    setOrgLoading(true);
    setOrgError('');
    try {
      const tenant = await tenants.create({ name: orgName.trim() });
      setTenantId(tenant.id);
      setStep('user');
    } catch (e) {
      setOrgError(getApiError(e));
    } finally {
      setOrgLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim())   { setUserError('Full name is required'); return; }
    if (!email.trim())  { setUserError('Email is required'); return; }
    if (password.length < 8) { setUserError('Password must be at least 8 characters'); return; }
    if (!tenantId)      { setUserError('Organisation not set up — go back'); return; }

    setUserLoading(true);
    setUserError('');
    try {
      await users.register({ name, email, password, tenant_id: tenantId });
      const auth = await users.login({ email, password });
      await login(auth.access_token);
      navigate('/dashboard');
    } catch (e) {
      setUserError(getApiError(e));
    } finally {
      setUserLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-bg-primary">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden bg-bg-secondary border-r border-border-default">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute inset-0 hero-glow" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-accent-cyan/8 rounded-full blur-[80px]" />
        <div className="relative flex flex-col items-center justify-center flex-1 px-16">
          <Shield size={56} className="text-accent-cyan mb-8" strokeWidth={1.5} />
          <h1 className="font-space text-5xl font-extrabold text-text-primary mb-4 text-center">
            SENTINEL<span className="text-accent-cyan">GRID</span>
          </h1>
          <p className="text-text-secondary text-base font-inter text-center max-w-xs leading-relaxed mb-12">
            Create your organisation and start monitoring your digital attack surface.
          </p>
          {/* Step indicators */}
          <div className="flex flex-col gap-4 w-full max-w-xs">
            {[
              { n: 1, label: 'Create Organisation', key: 'org' },
              { n: 2, label: 'Create Your Account', key: 'user' },
            ].map(s => (
              <div key={s.n} className={`flex items-center gap-4 px-5 py-4 rounded-xl border transition-all ${step === s.key ? 'border-accent-cyan/40 bg-accent-cyan/8' : (tenantId && s.key === 'org' ? 'border-success/30 bg-success/5' : 'border-border-default bg-bg-card')}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-sm ${step === s.key ? 'bg-accent-cyan text-bg-primary' : (tenantId && s.key === 'org' ? 'bg-success text-bg-primary' : 'bg-bg-secondary text-text-secondary')}`}>
                  {tenantId && s.key === 'org' ? '✓' : s.n}
                </div>
                <span className={`text-sm font-inter ${step === s.key ? 'text-text-primary font-semibold' : 'text-text-secondary'}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-col items-center justify-center flex-1 px-6 py-16">
        <div className="w-full max-w-sm">
          {step === 'org' ? (
            <motion.div
              key="org"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={fadeUp} className="mb-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-full bg-accent-cyan text-bg-primary flex items-center justify-center font-mono font-bold text-sm">1</div>
                  <span className="text-xs font-mono text-text-secondary uppercase tracking-widest">Step 1 of 2</span>
                </div>
                <h2 className="font-space text-2xl font-bold text-text-primary mb-1">Create Your Organisation</h2>
                <p className="text-text-secondary text-sm font-inter">Your organisation is your SentinelGrid tenant. All assets and scans are scoped to it.</p>
              </motion.div>
              <form onSubmit={handleCreateOrg} className="space-y-5">
                <motion.div variants={fadeUp}>
                  <Input
                    label="Organisation Name"
                    value={orgName}
                    onChange={e => setOrgName(e.target.value)}
                    placeholder="Acme Security Corp"
                    icon={<Building2 size={16} />}
                    error={orgError}
                    autoFocus
                  />
                </motion.div>
                <motion.div variants={fadeUp}>
                  <Button type="submit" variant="primary" size="lg" loading={orgLoading} className="w-full" iconRight={!orgLoading ? <ArrowRight size={16} /> : undefined}>
                    Continue
                  </Button>
                </motion.div>
              </form>
              <motion.p variants={fadeUp} className="mt-8 text-center text-text-secondary text-sm font-inter">
                Already have an account?{' '}
                <Link to="/login" className="text-accent-cyan hover:underline">Sign in</Link>
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="user"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={fadeUp} className="mb-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-full bg-accent-cyan text-bg-primary flex items-center justify-center font-mono font-bold text-sm">2</div>
                  <span className="text-xs font-mono text-text-secondary uppercase tracking-widest">Step 2 of 2</span>
                </div>
                <h2 className="font-space text-2xl font-bold text-text-primary mb-1">Create Your Account</h2>
                <p className="text-text-secondary text-sm font-inter">
                  Organisation: <span className="text-accent-cyan font-mono">{orgName}</span>
                  <span className="text-text-muted"> (ID: {tenantId})</span>
                </p>
              </motion.div>
              <form onSubmit={handleRegister} className="space-y-4">
                <motion.div variants={fadeUp}>
                  <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith" icon={<User size={16} />} autoComplete="name" />
                </motion.div>
                <motion.div variants={fadeUp}>
                  <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" icon={<Mail size={16} />} autoComplete="email" />
                </motion.div>
                <motion.div variants={fadeUp} className="relative">
                  <Input label="Password" type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" icon={<Lock size={16} />} autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-9 text-text-secondary hover:text-text-primary">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </motion.div>
                {userError && (
                  <motion.p variants={fadeUp} className="text-critical text-sm font-inter bg-critical/10 border border-critical/20 rounded-lg px-4 py-3">
                    {userError}
                  </motion.p>
                )}
                <motion.div variants={fadeUp} className="pt-2">
                  <Button type="submit" variant="primary" size="lg" loading={userLoading} className="w-full" iconRight={!userLoading ? <ArrowRight size={16} /> : undefined}>
                    Create Account
                  </Button>
                </motion.div>
              </form>
              <motion.button variants={fadeUp} onClick={() => setStep('org')} className="mt-6 text-text-secondary text-sm font-inter hover:text-text-primary w-full text-center transition-colors">
                ← Back to Organisation step
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
