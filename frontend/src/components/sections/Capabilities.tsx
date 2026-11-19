import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Globe, Cpu, BarChart3, Shield, Eye, Zap } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { staggerContainer, fadeUp } from '@/animations';

const capabilities = [
  {
    icon: Globe,
    title: 'Asset Discovery',
    description: 'Register and monitor domains, IP addresses, and web applications. Maintain a live inventory of your external attack surface.',
    accent: 'accent-cyan',
    iconColor: 'text-accent-cyan',
    borderColor: 'border-accent-cyan/20',
    bgColor: 'bg-accent-cyan/8',
  },
  {
    icon: Eye,
    title: 'Ownership Verification',
    description: 'Prove asset ownership through DNS TXT record verification. Only verified assets are eligible for security assessments.',
    accent: 'accent-blue',
    iconColor: 'text-accent-blue',
    borderColor: 'border-accent-blue/20',
    bgColor: 'bg-accent-blue/8',
  },
  {
    icon: Cpu,
    title: 'Security Scanning',
    description: 'Request targeted assessments including TLS configuration analysis, HTTP security header reviews, and asset inventory scans.',
    accent: 'accent-cyan',
    iconColor: 'text-accent-cyan',
    borderColor: 'border-accent-cyan/20',
    bgColor: 'bg-accent-cyan/8',
  },
  {
    icon: BarChart3,
    title: 'Risk Intelligence',
    description: "Visualise your organisation's security posture, track scan history, and understand your risk distribution at a glance.",
    accent: 'accent-blue',
    iconColor: 'text-accent-blue',
    borderColor: 'border-accent-blue/20',
    bgColor: 'bg-accent-blue/8',
  },
  {
    icon: Shield,
    title: 'Multi-Tenant Architecture',
    description: "Complete tenant isolation ensures that your organisation's data never leaks to other tenants. Enterprise-grade access control.",
    accent: 'accent-cyan',
    iconColor: 'text-accent-cyan',
    borderColor: 'border-accent-cyan/20',
    bgColor: 'bg-accent-cyan/8',
  },
  {
    icon: Zap,
    title: 'Real-Time Monitoring',
    description: 'Continuous visibility over your registered assets. Know the moment your security posture changes.',
    accent: 'accent-blue',
    iconColor: 'text-accent-blue',
    borderColor: 'border-accent-blue/20',
    bgColor: 'bg-accent-blue/8',
  },
];

export function CapabilitiesSection() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section id="capabilities" className="relative py-28 px-6 overflow-hidden bg-bg-primary">
      {/* Subtle background grid */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-accent-cyan/40" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-20"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.span
            variants={fadeUp}
            className="inline-block px-4 py-1.5 rounded-full bg-accent-cyan/8 border border-accent-cyan/20 text-accent-cyan text-xs font-mono tracking-widest uppercase mb-6"
          >
            Core Capabilities
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-space text-4xl md:text-5xl font-bold text-text-primary mb-4"
          >
            Everything you need to
            <br />
            <span className="text-accent-cyan">secure your perimeter</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-text-secondary text-lg font-inter max-w-2xl mx-auto"
          >
            SentinelGrid unifies asset management, ownership verification, and security
            scanning into a single, coherent platform.
          </motion.p>
        </motion.div>

        {/* Capability cards */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, i) => (
            <Card key={cap.title} tilt spotlight cursorLabel="EXPLORE" animate>
              <div className="p-7">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${cap.bgColor} border ${cap.borderColor} flex items-center justify-center mb-5`}>
                  <cap.icon size={22} className={cap.iconColor} />
                </div>
                <h3 className="font-space text-lg font-semibold text-text-primary mb-2">
                  {cap.title}
                </h3>
                <p className="text-text-secondary text-sm font-inter leading-relaxed">
                  {cap.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
