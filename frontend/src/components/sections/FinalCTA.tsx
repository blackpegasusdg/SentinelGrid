import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { staggerContainer, fadeUp } from '@/animations';

export function FinalCTA() {
  return (
    <section className="relative py-32 px-6 bg-bg-primary overflow-hidden">
      {/* Atmospheric glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[300px] bg-accent-cyan/5 rounded-full blur-[100px]" />
      </div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent" />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.span variants={fadeUp} className="inline-block px-4 py-1.5 rounded-full bg-accent-cyan/8 border border-accent-cyan/20 text-accent-cyan text-xs font-mono tracking-widest uppercase mb-8">
            Start Today
          </motion.span>
          <motion.h2 variants={fadeUp} className="font-space text-5xl md:text-6xl lg:text-7xl font-extrabold text-text-primary mb-6 leading-tight">
            Secure your
            <br />
            <span className="text-accent-cyan text-glow-cyan">attack surface</span>
            <br />
            today.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-text-secondary text-lg font-inter mb-10 max-w-xl mx-auto">
            Join SentinelGrid and gain complete visibility over your organisation's
            digital assets and security posture.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button variant="primary" size="lg" magnetic iconRight={<ArrowRight size={18} />}>
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">
                Sign In
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer className="bg-bg-secondary border-t border-border-default py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="font-space font-bold text-text-primary">SENTINEL<span className="text-accent-cyan">GRID</span></span>
          <span className="text-text-secondary text-xs font-mono">v0.1.0</span>
        </div>
        <p className="text-text-secondary text-sm font-inter">
          AI-Assisted Cybersecurity Posture Monitoring Platform
        </p>
        <p className="text-text-secondary text-xs font-mono">
          © 2026 SentinelGrid. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
