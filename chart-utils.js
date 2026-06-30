export const renderProgressRing = (canvas, percent, color = '#1a56db') => {
  const ctx = canvas.getContext('2d');
  const x = canvas.width / 2;
  const y = canvas.height / 2;
  const radius = (canvas.width / 2) - 10;
  
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 8;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x, y, radius, -Math.PI/2, (-Math.PI/2) + (2 * Math.PI * (percent/100)));
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  ctx.lineWidth = 8;
  ctx.stroke();
};

export const renderMiniLineChart = (canvas, data) => {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const max = Math.max(...data);
  const min = Math.min(...data);
  
  ctx.clearRect(0,0, width, height);
  ctx.beginPath();
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  
  data.forEach((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / (max - min) * height);
    if(i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
};
