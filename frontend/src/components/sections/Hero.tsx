import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { gsap } from 'gsap';

// Animated network node background
function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const nodes: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    const NODE_COUNT = 55;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r:  Math.random() * 2 + 1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update + draw nodes
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(53, 214, 232, 0.5)';
        ctx.fill();
      });

      // Draw edges for nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.2;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(53, 214, 232, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.6 }}
    />
  );
}

export function HeroSection() {
  const taglineRef = useRef<HTMLSpanElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = [h1Ref.current, subRef.current, ctaRef.current].filter(Boolean);
    gsap.set(els, { opacity: 0, y: 40 });
    gsap.to(els, {
      opacity: 1, y: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power4.out',
      delay: 0.3,
    });
    if (taglineRef.current) {
      gsap.set(taglineRef.current, { opacity: 0, y: 12 });
      gsap.to(taglineRef.current, { opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: 'power3.out' });
    }
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-bg-primary">
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid" />
      <NetworkBackground />
      <div className="hero-glow absolute inset-0 pointer-events-none" />

      {/* Atmospheric centre glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-accent-cyan/5 blur-[120px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24">
        {/* Pre-heading label */}
        <span
          ref={taglineRef}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-cyan/8 border border-accent-cyan/20 text-accent-cyan text-xs font-mono tracking-widest uppercase mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
          AI-Assisted Security Posture Monitoring
        </span>

        {/* Main heading */}
        <h1
          ref={h1Ref}
          className="font-space text-5xl md:text-7xl lg:text-8xl font-extrabold leading-none tracking-tight mb-6"
        >
          <span className="text-text-primary">SENTINEL</span>
          <span className="text-accent-cyan text-glow-cyan">GRID</span>
          <br />
          <span className="text-3xl md:text-4xl lg:text-5xl font-normal text-text-secondary mt-3 inline-block leading-tight">
            Your Digital Infrastructure.
            <br />
            <em className="not-italic text-text-primary font-semibold">Under Continuous Vigilance.</em>
          </span>
        </h1>

        {/* Description */}
        <p
          ref={subRef}
          className="max-w-2xl mx-auto text-text-secondary text-base md:text-lg font-inter leading-relaxed mb-10"
        >
          An intelligent cybersecurity posture monitoring platform designed to discover,
          assess and monitor your organisation's digital attack surface.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/#capabilities">
            <Button variant="secondary" size="lg" magnetic iconRight={<ArrowRight size={18} />}>
              Explore Platform
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="lg" magnetic iconRight={<ArrowRight size={18} />}>
              Get Started
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-secondary"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
        <ChevronDown size={16} />
      </motion.div>
    </section>
  );
}
