// ============================================================
// SentinelGrid — Framer Motion Variants & GSAP Utilities
// ============================================================

import type { Variants } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------
// Page transition variants
// ---------------------------------------------------------
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.3,  ease: [0.4, 0, 1, 1] } },
};

// ---------------------------------------------------------
// Stagger children container
// ---------------------------------------------------------
export const staggerContainer: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

// ---------------------------------------------------------
// Fade-up (used for cards, text blocks)
// ---------------------------------------------------------
export const fadeUp: Variants = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// ---------------------------------------------------------
// Fade-in
// ---------------------------------------------------------
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ---------------------------------------------------------
// Clip reveal (bottom → top unmask)
// ---------------------------------------------------------
export const clipReveal: Variants = {
  initial: { clipPath: 'inset(0 0 100% 0)' },
  animate: {
    clipPath: 'inset(0 0 0% 0)',
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

// ---------------------------------------------------------
// Scale in (for modals, dialogs)
// ---------------------------------------------------------
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

// ---------------------------------------------------------
// Slide in from right (drawer)
// ---------------------------------------------------------
export const slideInRight: Variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, x: 40, transition: { duration: 0.3 } },
};

// ---------------------------------------------------------
// GSAP: Animate section heading on scroll
// ---------------------------------------------------------
export function gsapRevealHeading(el: Element, delay = 0) {
  gsap.fromTo(el,
    { opacity: 0, y: 50 },
    {
      opacity: 1, y: 0,
      duration: 1,
      delay,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    }
  );
}

// ---------------------------------------------------------
// GSAP: Stagger-reveal a list of elements
// ---------------------------------------------------------
export function gsapStaggerReveal(els: Element[], stagger = 0.1, delay = 0) {
  gsap.fromTo(els,
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0,
      duration: 0.8,
      stagger,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: els[0],
        start: 'top 88%',
        once: true,
      },
    }
  );
}

// ---------------------------------------------------------
// GSAP: Animated counter
// ---------------------------------------------------------
export function gsapCounter(
  el: HTMLElement,
  target: number,
  duration = 1.5,
  prefix = '',
  suffix = ''
) {
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target,
    duration,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      once: true,
    },
    onUpdate: () => {
      el.textContent = `${prefix}${Math.round(obj.val).toLocaleString()}${suffix}`;
    },
  });
}

// ---------------------------------------------------------
// GSAP: Parallax element
// ---------------------------------------------------------
export function gsapParallax(el: Element, speed = 0.4) {
  gsap.to(el, {
    yPercent: -20 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
}
