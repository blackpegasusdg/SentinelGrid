import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Building2, Users, Calendar, Shield, Database } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { staggerContainer, fadeUp } from '@/animations';

export function OrganizationPage() {
  const { user } = useAuth();

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <motion.div className="mb-8" variants={staggerContainer} initial="initial" animate="animate">
        <motion.p variants={fadeUp} className="text-xs font-mono text-text-secondary uppercase tracking-widest mb-1">Account Management</motion.p>
        <motion.h1 variants={fadeUp} className="font-space text-3xl font-bold text-text-primary">Organisation</motion.h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card animate tilt>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
                <Building2 size={18} className="text-accent-cyan" />
              </div>
              <h2 className="font-space text-lg font-semibold text-text-primary">Tenant Details</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between py-2.5 border-b border-border-default">
                <span className="text-text-secondary text-sm font-inter">Tenant ID</span>
                <span className="font-mono text-accent-cyan text-sm">{user?.tenant_id}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-border-default">
                <span className="text-text-secondary text-sm font-inter">Your Name</span>
                <span className="text-text-primary text-sm font-inter">{user?.name}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-border-default">
                <span className="text-text-secondary text-sm font-inter">Your Email</span>
                <span className="text-text-primary text-sm font-mono">{user?.email}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-text-secondary text-sm font-inter">User ID</span>
                <span className="font-mono text-accent-blue text-sm">{user?.id}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card animate>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center">
                <Shield size={18} className="text-accent-blue" />
              </div>
              <h2 className="font-space text-lg font-semibold text-text-primary">Platform Access</h2>
            </div>
            <div className="space-y-3 text-sm font-inter text-text-secondary">
              <p>Your account has full access to all SentinelGrid features within your tenant boundary.</p>
              <ul className="space-y-2 mt-4">
                {['Asset Management', 'DNS Ownership Verification', 'Security Scan Requests', 'Scan History'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    <span>{f}</span>
                  </li>
                ))}
                {['User Role Management', 'Team Member Invites', 'API Keys / Webhooks'].map(f => (
                  <li key={f} className="flex items-center gap-2 opacity-40">
                    <span className="w-1.5 h-1.5 rounded-full bg-text-secondary" />
                    <span>{f} <span className="text-xs font-mono">(Planned)</span></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Planned features note */}
      <motion.div className="mt-8 bg-bg-secondary rounded-2xl border border-border-default p-6" variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
        <div className="flex items-center gap-3 mb-3">
          <Users size={18} className="text-accent-blue" />
          <h3 className="font-space font-semibold text-text-primary">Team Management</h3>
          <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-accent-blue/8 border border-accent-blue/20 text-accent-blue">Roadmap</span>
        </div>
        <p className="text-text-secondary text-sm font-inter">
          Multi-user team management, role-based access control (RBAC), and user invitations are
          planned for a future release. The backend architecture supports multi-tenancy but
          per-tenant user listing and role management endpoints are not yet implemented.
        </p>
      </motion.div>
    </div>
  );
}
