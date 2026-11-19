import { motion } from 'framer-motion';
import { staggerContainer, fadeUp } from '@/animations';

const steps = [
  {
    num: '01',
    title: 'Register Your Organisation',
    description: 'Create your SentinelGrid tenant. Invite your team and set up your organisation profile in minutes.',
    detail: 'POST /api/v1/tenants → POST /api/v1/users/register',
  },
  {
    num: '02',
    title: 'Register Digital Assets',
    description: 'Add domains, IP addresses, and web applications to your asset inventory. SentinelGrid validates each asset type automatically.',
    detail: 'POST /api/v1/assets',
  },
  {
    num: '03',
    title: 'Verify Asset Ownership',
    description: 'For domains and web applications, prove ownership by placing a DNS TXT record. This ensures only authorised scans are performed.',
    detail: 'POST /api/v1/assets/{id}/verification-token',
  },
  {
    num: '04',
    title: 'Request Security Assessments',
    description: 'Trigger targeted scans: TLS configuration analysis, HTTP security header review, or asset inventory checks.',
    detail: 'POST /api/v1/scans — types: tls_configuration, http_security_headers, asset_inventory',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-28 px-6 bg-bg-secondary overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-20"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.span variants={fadeUp} className="inline-block px-4 py-1.5 rounded-full bg-accent-cyan/8 border border-accent-cyan/20 text-accent-cyan text-xs font-mono tracking-widest uppercase mb-6">
            How It Works
          </motion.span>
          <motion.h2 variants={fadeUp} className="font-space text-4xl md:text-5xl font-bold text-text-primary mb-4">
            From zero to <span className="text-accent-cyan">full visibility</span>
            <br />in four steps
          </motion.h2>
        </motion.div>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/20 to-transparent" />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-60px' }}
          >
            {steps.map((step, i) => (
              <motion.div key={step.num} variants={fadeUp} className="relative">
                {/* Step number */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-bg-card border border-accent-cyan/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-mono text-accent-cyan font-bold text-lg">{step.num}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block flex-1 h-px bg-accent-cyan/10" />
                  )}
                </div>

                <h3 className="font-space font-semibold text-text-primary text-lg mb-3">{step.title}</h3>
                <p className="text-text-secondary text-sm font-inter leading-relaxed mb-4">{step.description}</p>
                <code className="text-xs font-mono text-accent-cyan/70 bg-accent-cyan/5 px-3 py-1.5 rounded-lg block">
                  {step.detail}
                </code>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent" />
    </section>
  );
}
