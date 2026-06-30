// chart-utils.js
export function renderProgressRing(canvasId, percent, color = "#3b82f6") {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const x = canvas.width / 2;
  const y = canvas.height / 2;
  const radius = x - 5;
  const endAngle = (Math.PI * 2 * percent) / 100;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Track
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 4;
  ctx.stroke();

  // Progress
  ctx.beginPath();
  ctx.arc(x, y, radius, -Math.PI / 2, endAngle - Math.PI / 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.stroke();
}

export function renderMiniLine(canvasId, data, color = "#22c55e") {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const step = w / (data.length - 1);
  const max = Math.max(...data) * 1.1;

  ctx.clearRect(0, 0, w, h);
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';

  data.forEach((val, i) => {
    const x = i * step;
    const y = h - (val / max) * h;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}
