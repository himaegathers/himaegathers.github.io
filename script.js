(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- falling leaves (Himaé palette) ---------- */
  const palette = ['#c8694a', '#85856a', '#e0bc96', '#d9a252', '#5f6b4f', '#d6865a'];
  const shapes = [
    // pointed leaf with midrib
    '<path d="M12 1C20 8 21 19 12 31C3 19 4 8 12 1Z" fill="currentColor"/><path d="M12 6V28" stroke="rgba(255,255,255,.35)" stroke-width="1" fill="none"/>',
    // round petal
    '<path d="M12 2C20 8 20 22 12 29C4 22 4 8 12 2Z" fill="currentColor"/>',
    // slim leaf
    '<path d="M12 1C17 10 17 22 12 31C7 22 7 10 12 1Z" fill="currentColor"/><path d="M12 8V27" stroke="rgba(255,255,255,.3)" stroke-width="1" fill="none"/>'
  ];
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  function makeLeaves() {
    const wrap = document.getElementById('leaves');
    if (!wrap || reduce) return;
    wrap.textContent = '';
    const w = innerWidth;
    const count = w < 480 ? 12 : w < 900 ? 16 : 24;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const leaf = document.createElement('span');
      const size = rand(w < 480 ? 12 : 14, w < 480 ? 24 : 30);
      const dur = rand(11, 22);
      leaf.className = 'leaf';
      leaf.style.cssText =
        `--x:${rand(-2, 100).toFixed(1)}%;--s:${size.toFixed(1)}px;--o:${rand(.55, .9).toFixed(2)};` +
        `--d:${dur.toFixed(1)}s;--dl:${(-rand(0, dur)).toFixed(1)}s;--sd:${rand(2.4, 4.6).toFixed(1)}s;` +
        `--sw:${rand(14, 46).toFixed(0)}px;--r:${rand(25, 80).toFixed(0)}deg;--drift:${rand(-60, 90).toFixed(0)}px;` +
        `color:${pick(palette)}`;
      leaf.innerHTML = `<svg viewBox="0 0 24 32" aria-hidden="true">${pick(shapes)}</svg>`;
      frag.appendChild(leaf);
    }
    wrap.appendChild(frag);
  }
  makeLeaves();

  // rebuild only when the width bracket changes (avoids flicker on mobile scroll/URL-bar resize)
  const bracket = () => (innerWidth < 480 ? 0 : innerWidth < 900 ? 1 : 2);
  let last = bracket(), t;
  addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => { const b = bracket(); if (b !== last) { last = b; makeLeaves(); } }, 250);
  });

  /* ---------- gentle parallax on the floral corners (mouse devices only) ---------- */
  const tl = document.querySelector('.f-tl'), br = document.querySelector('.f-br');
  if (!reduce && tl && br && matchMedia('(hover: hover)').matches) {
    addEventListener('pointermove', e => {
      const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      tl.style.translate = `${x * -12}px ${y * -12}px`;
      br.style.translate = `${x * 12}px ${y * 12}px`;
    }, { passive: true });
  }

  /* ---------- soft ripple on press ---------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('pointerdown', e => {
      if (reduce) return;
      const r = btn.getBoundingClientRect(), s = document.createElement('span');
      s.style.cssText = `position:absolute;left:${e.clientX - r.left}px;top:${e.clientY - r.top}px;width:10px;height:10px;margin:-5px;border-radius:50%;background:rgba(255,255,255,.55);transform:scale(0);opacity:1;transition:transform .6s,opacity .6s;pointer-events:none`;
      btn.appendChild(s);
      requestAnimationFrame(() => { s.style.transform = 'scale(34)'; s.style.opacity = '0'; });
      setTimeout(() => s.remove(), 650);
    });
  });

  /* ---------- butterflies (Himaé palette) ---------- */
  const page = document.querySelector('.page');
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const shortest = a => { a = (a + Math.PI) % (Math.PI * 2); if (a < 0) a += Math.PI * 2; return a - Math.PI; };

  // body colour, light inner patch, small dots
  const PAL = [
    { a: '#d6865a', b: '#f3c9a8', c: '#fff3e2' }, // terracotta
    { a: '#e2a78c', b: '#f8dcc6', c: '#fff3e2' }, // blush
    { a: '#d9a252', b: '#f3dba4', c: '#fff6e0' }, // gold
    { a: '#9aa88a', b: '#d5dcc0', c: '#fbf3e3' }, // sage
    { a: '#c8694a', b: '#e9b9a0', c: '#f6e3cd' }  // deep terracotta
  ];
  const WING =
    '<path d="M31 27C33 15 44 4 53 6C58 8 58 17 53 24C48 30 38 31 31 30Z" fill="var(--a)"/>' +
    '<path d="M31 29C40 29 50 31 51.5 39C53 47 45 53 38.5 49C33 46 31 38 31 29Z" fill="var(--a)"/>' +
    '<path d="M33 27C35 18 43 9 51 9.5C54 12 52 19 48 23C44 27 38 28 33 28Z" fill="var(--b)" opacity=".75"/>' +
    '<path d="M35 33C41 33 47 35 48 40C49 45 44 48 40 45.5C37 43 35 38 35 33Z" fill="var(--b)" opacity=".7"/>' +
    '<circle cx="50" cy="13" r="1.8" fill="var(--c)"/><circle cx="46" cy="42" r="1.5" fill="var(--c)"/><circle cx="42" cy="47" r="1.2" fill="var(--c)"/>' +
    '<path d="M32 28.5L48 14M32 30L47 38" stroke="#6b4a2b" stroke-opacity=".18" stroke-width=".5" fill="none"/>' +
    '<path d="M31 27C33 15 44 4 53 6C58 8 58 17 53 24C48 30 38 31 31 30ZM31 29C40 29 50 31 51.5 39C53 47 45 53 38.5 49C33 46 31 38 31 29Z" fill="none" stroke="#6b4a2b" stroke-opacity=".35" stroke-width=".7" stroke-linejoin="round"/>';
  const BODY =
    '<path d="M29.4 21.5C28 16.5 25.6 14.4 24 13.8M30.6 21.5C32 16.5 34.4 14.4 36 13.8" stroke="#5a3f28" stroke-width=".7" fill="none" stroke-linecap="round"/>' +
    '<circle cx="24" cy="13.8" r=".9" fill="#5a3f28"/><circle cx="36" cy="13.8" r=".9" fill="#5a3f28"/>' +
    '<ellipse cx="30" cy="31" rx="1.7" ry="8" fill="#5a3f28"/><circle cx="30" cy="22.6" r="2" fill="#5a3f28"/>';
  const BF_SVG =
    '<svg viewBox="0 0 60 60" width="100%" height="100%" style="display:block;overflow:visible" aria-hidden="true"><g class="wings"><g>' + WING + '</g>' +
    '<g transform="translate(60 0) scale(-1 1)">' + WING + '</g></g>' + BODY + '</svg>';

  // spots on the flower corners where butterflies like to land (fractions of each flower image)
  const PERCH = [
    [[.14, .18], [.32, .20], [.14, .38], [.12, .54], [.05, .30]],  // top-left daisies
    [[.79, .66], [.65, .91], [.45, .81], [.91, .83]]               // bottom-right daisies
  ];

  function initButterflies() {
    if (!page) return;
    const flowers = [document.querySelector('.f-tl'), document.querySelector('.f-br')];
    const layer = document.createElement('div');
    layer.className = 'butterflies';
    layer.style.cssText = 'position:absolute;inset:0;z-index:3;pointer-events:none;overflow:hidden';
    layer.setAttribute('aria-hidden', 'true');
    page.appendChild(layer);

    let W = page.clientWidth, H = page.clientHeight;
    if ('ResizeObserver' in window) new ResizeObserver(() => { W = page.clientWidth; H = page.clientHeight; }).observe(page);

    function perchPoint() {
      const i = Math.random() < .5 ? 0 : 1, f = flowers[i];
      if (!f) return null;
      const pr = page.getBoundingClientRect(), fr = f.getBoundingClientRect();
      if (fr.height < 20) return null;
      const [fx, fy] = pick(PERCH[i]);
      return { x: fr.left - pr.left + fr.width * fx, y: fr.top - pr.top + fr.height * fy };
    }

    function aim(f, allowPerch) {
      f.perch = false;
      if (allowPerch && Math.random() < .4) {
        const p = perchPoint();
        if (p) { f.tx = p.x; f.ty = p.y; f.perch = true; return; }
      }
      for (let n = 0; n < 6; n++) {
        const x = rand(.06, .94) * W, y = rand(.04, .96) * H;
        if (Math.hypot(x - f.x, y - f.y) > Math.min(W, H) * .25 || n === 5) { f.tx = x; f.ty = y; return; }
      }
    }

    function takeoff(f) {
      f.mode = 'fly';
      f.el.classList.remove('rest');
      aim(f, false);
      f.vy = -34;
    }

    function arrive(f, t) {
      if (f.perch) {
        f.mode = 'rest';
        f.until = t + rand(3, 6.5);
        f.restAng = rand(-.7, .7);
        f.el.classList.add('rest');
      } else aim(f, true);
    }

    function make(i) {
      const pal = PAL[i % PAL.length];
      const el = document.createElement('div');
      el.className = 'bf';
      const size = W < 480 ? rand(30, 42) : rand(38, 50);
      el.style.cssText = `position:absolute;top:0;left:0;width:${size.toFixed(0)}px;height:${size.toFixed(0)}px;margin:${(-size / 2).toFixed(1)}px 0 0 ${(-size / 2).toFixed(1)}px;--sz:${size.toFixed(0)}px;--a:${pal.a};--b:${pal.b};--c:${pal.c};--fs:${rand(.3, .46).toFixed(2)}s`;
      el.innerHTML = BF_SVG;
      layer.appendChild(el);
      const dir = rand(0, Math.PI * 2);
      const f = {
        el, mode: 'fly', perch: false, tx: 0, ty: 0, until: 0, restAng: 0,
        x: rand(.1, .9) * W, y: rand(.1, .9) * H,
        vx: Math.cos(dir) * 30, vy: Math.sin(dir) * 30, ang: dir + Math.PI / 2,
        ph: rand(0, 6.28), speed: clamp(W * rand(.13, .2), 48, 100),
        wob: rand(.5, .9), bobA: rand(2.5, 4.5), bobF: rand(5, 8), pf: rand(3.5, 5.5)
      };
      aim(f, true);
      setTimeout(() => el.classList.add('in'), 250 + i * 350);
      return f;
    }

    const count = innerWidth < 480 ? 4 : 5;

    /* reduced motion: a few butterflies resting quietly on the flowers */
    if (reduce) {
      const rest = () => {
        for (let i = 0; i < 3; i++) {
          const f = make(i), p = perchPoint();
          if (p) { f.x = p.x; f.y = p.y; }
          f.el.style.transform = `translate3d(${f.x.toFixed(1)}px,${f.y.toFixed(1)}px,0) rotate(${rand(-.6, .6).toFixed(2)}rad)`;
          f.el.classList.add('in');
        }
      };
      if (document.readyState === 'complete') rest(); else addEventListener('load', rest, { once: true });
      return;
    }

    const flies = [];
    for (let i = 0; i < count; i++) flies.push(make(i));

    function update(f, dt, t) {
      if (f.mode === 'rest') {
        const damp = Math.pow(.0008, dt);
        f.vx *= damp; f.vy *= damp;
        f.x += f.vx * dt; f.y += f.vy * dt;
        f.ang += shortest(f.restAng - f.ang) * (1 - Math.pow(.05, dt));
        if (t > f.until) takeoff(f);
      } else {
        const dx = f.tx - f.x, dy = f.ty - f.y, d = Math.hypot(dx, dy) || 1;
        const nx = dx / d, ny = dy / d;
        // speed surges with each wing beat, slows down when landing
        let sp = f.speed * (.55 + .45 * Math.sin(t * f.pf + f.ph));
        if (f.perch && d < 80) sp *= Math.max(.3, d / 80);
        sp = Math.max(sp, 14);
        // lazy side-to-side wandering
        const w = (Math.sin(t * .8 + f.ph) * .6 + Math.sin(t * 2.1 + f.ph * 1.7) * .4) * f.wob * Math.min(1, d / 90);
        const k = 1 - Math.pow(.04, dt);
        f.vx += ((nx - ny * w) * sp - f.vx) * k;
        f.vy += ((ny + nx * w) * sp - f.vy) * k;
        f.x += f.vx * dt; f.y += f.vy * dt;
        if (Math.hypot(f.vx, f.vy) > 6) {
          f.ang += shortest(Math.atan2(f.vy, f.vx) + Math.PI / 2 - f.ang) * (1 - Math.pow(.004, dt));
        }
        if (d < (f.perch ? 7 : 28)) arrive(f, t);
        if (f.x < -60 || f.x > W + 60 || f.y < -60 || f.y > H + 60) aim(f, false);
      }
      const bob = f.mode === 'rest' ? 0 : Math.sin(t * f.bobF + f.ph) * f.bobA;
      f.el.style.transform = `translate3d(${f.x.toFixed(1)}px,${(f.y + bob).toFixed(1)}px,0) rotate(${f.ang.toFixed(3)}rad)`;
    }

    let last = performance.now();
    (function frame(now) {
      const dt = Math.min(.05, (now - last) / 1000);
      last = now;
      for (const f of flies) update(f, dt, now / 1000);
      requestAnimationFrame(frame);
    })(last);

    /* butterflies flutter away from a tap or the mouse */
    function scare(cx, cy, r) {
      const pr = page.getBoundingClientRect(), px = cx - pr.left, py = cy - pr.top;
      for (const f of flies) {
        const dx = f.x - px, dy = f.y - py, d = Math.hypot(dx, dy);
        if (d >= r) continue;
        if (f.mode === 'rest') takeoff(f);
        const m = (1 - d / r) * 150 + 30, n = d || 1;
        f.vx = clamp(f.vx + dx / n * m, -240, 240);
        f.vy = clamp(f.vy + dy / n * m, -240, 240);
      }
    }
    addEventListener('pointerdown', e => scare(e.clientX, e.clientY, 120), { passive: true });
    if (matchMedia('(hover: hover)').matches) {
      addEventListener('pointermove', e => scare(e.clientX, e.clientY, 60), { passive: true });
    }
  }
  initButterflies();

  /* ---------- floating pollen sparkles ---------- */
  (function pollen() {
    if (!page || reduce) return;
    const wrap = document.createElement('div');
    wrap.className = 'pollen-layer';
    wrap.style.cssText = 'position:absolute;inset:0;z-index:2;pointer-events:none;overflow:hidden';
    wrap.setAttribute('aria-hidden', 'true');
    const n = innerWidth < 480 ? 10 : 14, frag = document.createDocumentFragment();
    for (let i = 0; i < n; i++) {
      const d = rand(7, 13), s = document.createElement('span');
      s.className = 'pollen';
      s.style.cssText = `--x:${rand(4, 96).toFixed(1)}%;--y:${rand(25, 98).toFixed(1)}%;--s:${rand(3, 5.5).toFixed(1)}px;` +
        `--d:${d.toFixed(1)}s;--dl:${(-rand(0, d)).toFixed(1)}s;--px:${rand(-28, 28).toFixed(0)}px`;
      frag.appendChild(s);
    }
    wrap.appendChild(frag);
    page.appendChild(wrap);
  })();
})();
