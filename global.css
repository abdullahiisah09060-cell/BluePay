/* Inter Font Import */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

:root {
  /* Backgrounds */
  --bg: #06080f;
  --bg2: #0b0f1a;
  --bg3: #0f1422;
  --bg4: #141928;

  /* Brand */
  --blue: #1a56db;
  --blue2: #3b82f6;
  --blue3: #60a5fa;
  --gold: #d4af37;
  --gold2: #f0d878;
  --goldd: #a8891f;

  /* Text */
  --text: #eef0f4;
  --muted: #5e6980;
  --muted2: #8896aa;

  /* Status */
  --green: #22c55e;
  --red: #ef4444;
  --orange: #f59e0b;
  --purple: #a855f7;

  /* Borders */
  --border: rgba(255,255,255,0.07);
  --borderb: rgba(26,86,219,0.25);
  --borderg: rgba(212,175,55,0.18);

  /* Radius */
  --radius-xs: 8px;
  --radius-s: 10px;
  --radius: 16px;
  --radius-l: 24px;

  /* Spacing scale */
  --space-1: 4px;  --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
  --space-5: 20px; --space-6: 24px;  --space-8: 32px;  --space-10: 40px;
  --space-12: 48px; --space-16: 64px; --space-20: 80px; --space-24: 96px;

  /* Shadows */
  --shadow-s: 0 4px 16px rgba(0,0,0,0.25);
  --shadow:   0 8px 32px rgba(0,0,0,0.4);
  --shadow-l: 0 24px 64px rgba(0,0,0,0.5);

  --font-main: 'Inter', sans-serif;
}

/* Reset & Base */
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { scroll-behavior: smooth; font-size: 16px; }
body {
  background-color: var(--bg);
  color: var(--text);
  font-family: var(--font-main);
  line-height: 1.5;
  overflow-x: hidden;
  width: 100%;
}

/* Typography Scale */
.text-display { font-size: clamp(2.5rem, 8vw, 4rem); font-weight: 800; letter-spacing: -0.02em; line-height: 1.1; }
.text-h1 { font-size: clamp(1.75rem, 5vw, 2.5rem); font-weight: 700; letter-spacing: -0.01em; }
.text-h2 { font-size: clamp(1.5rem, 4vw, 2rem); font-weight: 700; }
.text-h3 { font-size: 1.25rem; font-weight: 600; }
.text-body { font-size: 1rem; font-weight: 400; color: var(--muted2); }
.text-small { font-size: 0.875rem; font-weight: 400; }
.text-micro { font-size: 0.75rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }

/* Buttons */
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: var(--space-3) var(--space-6); border-radius: var(--radius-s);
  font-weight: 600; cursor: pointer; transition: all 0.2s ease;
  border: none; outline: none; gap: var(--space-2); min-height: 48px;
  text-decoration: none; font-family: inherit;
}
.btn-primary { background: linear-gradient(135deg, var(--blue), var(--blue2)); color: white; }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(26, 86, 219, 0.4); }
.btn-gold { background: linear-gradient(135deg, var(--gold), var(--gold2)); color: var(--bg); }
.btn-gold:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4); }
.btn-outline { background: transparent; border: 1px solid var(--borderb); color: var(--blue3); }
.btn-outline:hover { background: rgba(59, 130, 246, 0.05); }
.btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; }

/* Cards */
.card {
  background: var(--bg2); border: 1px solid var(--border);
  border-radius: var(--radius); padding: var(--space-6);
  transition: all 0.3s ease; position: relative; overflow: hidden;
}
.card-interactive:hover { border-color: var(--borderb); transform: translateY(-4px); box-shadow: var(--shadow); }

/* Forms */
.form-group { margin-bottom: var(--space-5); width: 100%; }
.label { display: block; margin-bottom: var(--space-2); font-size: 0.9rem; font-weight: 500; color: var(--muted2); }
.input {
  width: 100%; height: 52px; background: var(--bg3); border: 1px solid var(--border);
  border-radius: var(--radius-s); padding: 0 var(--space-4); color: white;
  font-family: inherit; font-size: 1rem; transition: border-color 0.2s;
}
.input:focus { outline: none; border-color: var(--blue); background: var(--bg4); }

/* Layout Utilities */
.container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 var(--space-4); }
.flex-center { display: flex; align-items: center; justify-content: center; }
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-4); }
@media (max-width: 768px) { .grid-2 { grid-template-columns: 1fr; } }

/* Toast */
#toast-container { position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; }
.toast {
  min-width: 300px; padding: var(--space-4); border-radius: var(--radius-s);
  color: white; font-weight: 500; box-shadow: var(--shadow);
  animation: slideIn 0.3s forwards; display: flex; align-items: center; gap: 12px;
}
.toast-success { background: var(--green); }
.toast-error { background: var(--red); }
@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

/* Skeleton */
.skeleton { background: linear-gradient(90deg, var(--bg3) 25%, var(--bg4) 50%, var(--bg3) 75%); background-size: 200% 100%; animation: loading 1.5s infinite; }
@keyframes loading { from { background-position: 200% 0; } to { background-position: -200% 0; } }
