/* xkmyth 关于页：星空 + 流星
   - DPR≤2 降采样省电 · 后台自动暂停 · prefers-reduced-motion 全关 */
(function () {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const cv = document.getElementById('sky');
  if (!cv || reduceMotion) return;
  const ctx = cv.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0, H = 0, stars = [], meteors = [], running = true;

  function resize() {
    W = innerWidth; H = innerHeight;
    cv.width = Math.floor(W * dpr); cv.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  addEventListener('resize', resize);

  for (let i = 0; i < 130; i++) {
    stars.push({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: Math.random(),
      r: Math.random() * 1.5 + 0.3,
      tw: Math.random() * Math.PI * 2
    });
  }

  let meteorTimer = 0;
  function spawnMeteor() {
    meteors.push({
      x: Math.random() * W * 0.8 + W * 0.2,
      y: Math.random() * H * 0.25,
      vx: -(Math.random() * 3 + 4),
      vy: Math.random() * 1.6 + 1.6,
      life: 1
    });
  }

  function frame(now) {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    const t = now / 1000;
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const x = (s.x + t * 0.004 * s.z) % 2 - 1;
      const a = 0.3 + 0.7 * Math.abs(Math.sin(s.tw + t * 1.3));
      ctx.globalAlpha = a * (0.4 + 0.6 * s.z);
      ctx.fillStyle = i % 9 === 0 ? '#9ae3ff' : '#fff';
      ctx.beginPath();
      ctx.arc((x + 1) / 2 * W, (s.y + 1) / 2 * H, s.r * (0.5 + s.z), 0, 7);
      ctx.fill();
    }
    if (now - meteorTimer > 3200) { meteorTimer = now; spawnMeteor(); }
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.x += m.vx; m.y += m.vy; m.life -= 0.012;
      if (m.life <= 0) { meteors.splice(i, 1); continue; }
      const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 12, m.y - m.vy * 12);
      grad.addColorStop(0, 'rgba(255,255,255,' + m.life + ')');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.vx * 12, m.y - m.vy * 12);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }
  function pause() { running = document.visibilityState === 'visible'; if (running) requestAnimationFrame(frame); }
  document.addEventListener('visibilitychange', pause);
  requestAnimationFrame(frame);
})();
