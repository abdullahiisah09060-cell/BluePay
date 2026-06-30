// app.js
import { auth } from './firebase-config.js';
import { toast, injectNavigation } from './components.js';

document.addEventListener("DOMContentLoaded", () => {
  // 1. PWA Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').catch(err => console.log("SW Error", err));
    });
  }

  // 2. Global Reveal Logic
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('revealed');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // 3. Page Loader Removal
  const loader = document.getElementById('global-loader');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 500);
    }, 600);
  }
});
