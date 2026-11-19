import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield } from 'lucide-react';
import { useCursor } from '@/context/CursorContext';
import { Button } from '@/components/ui/Button';

const navLinks = [
  { label: 'Platform',     href: '/#platform' },
  { label: 'Capabilities', href: '/#capabilities' },
  { label: 'How It Works', href: '/#how-it-works' },
];

function NavLink({ label, href }: { label: string; href: string }) {
  const { setCursorState, setCursorLabel } = useCursor();
  return (
    <a
      href={href}
      onMouseEnter={() => setCursorState('hover')}
      onMouseLeave={() => { setCursorState('default'); setCursorLabel(''); }}
      className="text-text-secondary text-sm font-inter hover:text-text-primary transition-colors relative group"
    >
      {label}
      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent-cyan transition-all duration-300 group-hover:w-full" />
    </a>
  );
}

export function LandingNavbar() {
  const { scrollY }        = useScroll();
  const bgOpacity          = useTransform(scrollY, [0, 80], [0, 1]);
  const { scrollYProgress } = useScroll();
  const scaleX             = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <>
      <motion.div
        className="scroll-progress"
        style={{ scaleX }}
      />
      <motion.nav
        className="fixed top-0 left-0 right-0 z-[100] px-6 md:px-12 py-4"
      >
        <motion.div
          className="absolute inset-0 backdrop-blur-md border-b border-border-default"
          style={{ opacity: bgOpacity }}
        />
        <div className="relative max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center group-hover:border-accent-cyan/60 transition-colors">
              <Shield size={16} className="text-accent-cyan" />
            </div>
            <span className="font-space font-bold text-text-primary tracking-tight">
              SENTINEL<span className="text-accent-cyan">GRID</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(l => <NavLink key={l.href} {...l} />)}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm" magnetic>Get Started</Button>
            </Link>
          </div>
        </div>
      </motion.nav>
    </>
  );
}
