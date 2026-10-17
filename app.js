// MyOS Decision Wheel
const root = document.getElementById('WheelApp');
if (root) {
  const cv = document.getElementById('wh-cv'), ctx = cv.getContext('2d'), ta = document.getElementById('wh-opts');
  const COLORS = ['#9b59b6', '#3498db', '#1abc9c', '#f39c12', '#e74c3c', '#2ecc71', '#e67e22', '#34495e'];
  const KEY = 'myos.wheel.opts';
  let angle = 0, spinning = false;
  try { ta.value = localStorage.getItem(KEY) || 'Pizza\nTacos\nSushi\nBurgers\nSalad\nThai'; } catch (e) { ta.value = 'Yes\nNo\nMaybe'; }
  function opts() { return ta.value.split('\n').map(s => s.trim()).filter(Boolean); }
  function draw() {
    const o = opts(), n = o.length || 1, R = 150; ctx.clearRect(0, 0, 300, 300);
    for (let i = 0; i < n; i++) {
      ctx.beginPath(); ctx.moveTo(R, R);
      ctx.arc(R, R, R - 4, angle + i * 2 * Math.PI / n, angle + (i + 1) * 2 * Math.PI / n);
      ctx.fillStyle = COLORS[i % COLORS.length]; ctx.fill();
      ctx.save(); ctx.translate(R, R); ctx.rotate(angle + (i + 0.5) * 2 * Math.PI / n);
      ctx.fillStyle = '#fff'; ctx.font = '12px sans-serif'; ctx.textAlign = 'right';
      ctx.fillText((o[i] || '').slice(0, 14), R - 14, 4); ctx.restore();
    }
    ctx.beginPath(); ctx.moveTo(300, R - 10); ctx.lineTo(282, R); ctx.lineTo(300, R + 10); ctx.fillStyle = '#fff'; ctx.fill();
  }
  function spin() {
    if (spinning) return; const o = opts(); if (!o.length) return;
    spinning = true; document.getElementById('wh-res').textContent = '…';
    const target = angle + Math.PI * (8 + Math.random() * 6), start = angle, t0 = performance.now(), dur = 3200;
    (function step(now) {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      angle = start + (target - start) * e; draw();
      if (p < 1) requestAnimationFrame(step);
      else { spinning = false; const n = o.length, norm = ((-angle) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI); const idx = Math.floor(norm / (2 * Math.PI / n)) % n; document.getElementById('wh-res').textContent = '→ ' + o[idx]; }
    })(t0);
  }
  ta.addEventListener('input', () => { try { localStorage.setItem(KEY, ta.value); } catch (e) {} draw(); });
  document.getElementById('wh-spin').onclick = spin;
  draw();
}
