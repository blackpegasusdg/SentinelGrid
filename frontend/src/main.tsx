import React from 'react';
import ReactDOM from 'react-dom/client';
import Lenis from 'lenis';
import App from './App';
import './styles/globals.css';

// ---------------------------------------------------------
// Lenis — Smooth Scroll (only on landing page / non-app routes)
// Disabled inside the authenticated app shell (overflow: hidden layout)
// ---------------------------------------------------------
function initLenis() {
  if (window.location.pathname === '/') {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return lenis;
  }
  return null;
}

initLenis();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
