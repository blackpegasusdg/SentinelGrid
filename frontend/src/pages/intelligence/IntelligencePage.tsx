import { motion } from 'framer-motion';
import { Shield, Lock, Eye, BarChart3, AlertTriangle, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { staggerContainer, fadeUp } from '@/animations';

const plannedFeatures = [
  { icon: Eye,          title: 'Vulnerability Intelligence',  description: 'CVE lookup, vulnerability scoring, and exploit chain analysis across your registered assets.', eta: 'Q2 2027' },
  { icon: BarChart3,    title: 'Risk Score Dashboard',        description: 'Automated risk scoring based on asset exposure, known vulnerabilities, and patch cadence.', eta: 'Q2 2027' },
  { icon: AlertTriangle, title: 'Threat Attribution',        description: 'Map discovered vulnerabilities to known threat actors and attack campaigns.', eta: 'Q3 2027' },
  { icon: Lock,         title: 'Continuous Monitoring',       description: 'Scheduled automated scans and real-time alerting when your security posture changes.', eta: 'Q3 2027' },
];

export function IntelligencePage() {
  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <motion.div className="mb-8" variants={staggerContainer} initial="initial" animate="animate">
        <motion.p variants={fadeUp} className="text-xs font-mono text-text-secondary uppercase tracking-widest mb-1">Security Operations</motion.p>
        <motion.h1 variants={fadeUp} className="font-space text-3xl font-bold text-text-primary">Security Intelligence</motion.h1>
      </motion.div>

      {/* Current status banner */}
      <motion.div
        className="relative overflow-hidden bg-bg-secondary rounded-2xl border border-accent-cyan/20 p-8 mb-8 text-center"
        variants={fadeUp}
        initial="initial"
        animate="animate"
      >
        <div className="absolute inset-0 hero-glow opacity-50" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-xs font-mono tracking-widest uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
            Intelligence Engine — Under Development
          </div>
          <h2 className="font-space text-3xl font-bold text-text-primary mb-4">
            Vulnerability & Risk Intelligence
          </h2>
          <p className="text-text-secondary text-base font-inter max-w-xl mx-auto">
            The SentinelGrid intelligence engine is currently under active development.
            Security scan requests are accepted and recorded — findings analysis will be
            available once the backend scanner is connected.
          </p>
        </div>
      </motion.div>

      {/* What's planned */}
      <div className="mb-6">
        <h3 className="font-space text-xl font-semibold text-text-primary mb-6">On the Roadmap</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {plannedFeatures.map(f => (
            <Card key={f.title} animate tilt>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center">
                    <f.icon size={18} className="text-accent-blue" />
                  </div>
                  <span className="text-xs font-mono text-text-secondary bg-bg-secondary px-2 py-1 rounded-lg border border-border-default">
                    {f.eta}
                  </span>
                </div>
                <h4 className="font-space text-base font-semibold text-text-primary mb-2">{f.title}</h4>
                <p className="text-text-secondary text-sm font-inter">{f.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* What works now */}
      <Card animate>
        <div className="p-6">
          <h3 className="font-space text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Shield size={16} className="text-success" />
            What's Available Now
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Asset Registration & Inventory',  status: 'Live', desc: 'Register domains, IPs, and web applications' },
              { label: 'DNS Ownership Verification',      status: 'Live', desc: 'Verify asset ownership via TXT records' },
              { label: 'Scan Request Queue',              status: 'Live', desc: 'TLS, HTTP headers, asset inventory scans' },
              { label: 'Scan History',                    status: 'Live', desc: 'Track all requested assessments' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b border-border-default last:border-0">
                <div>
                  <p className="text-sm font-inter font-medium text-text-primary">{item.label}</p>
                  <p className="text-xs text-text-secondary font-inter">{item.desc}</p>
                </div>
                <span className="text-xs font-mono text-success bg-success/10 border border-success/20 px-2.5 py-1 rounded-full">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
