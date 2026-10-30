/* All the behaviour lives here. Your personal content is in config.js. */
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* ---------------- Confetti ---------------- */
  const canvas = $('confetti');
  const ctx = canvas.getContext('2d');
  let pieces = [];
  let raf = 0;
  const confettiColors = ['#D81B6A', '#FF5C9D', '#FFB8D4', '#FFB020', '#FFFFFF', '#A8125A'];

  function resizeConfetti() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resizeConfetti();
  addEventListener('resize', resizeConfetti);

  function burst(opts) {
    if (reduceMotion) return;
    const o = opts || {};
    const n = o.n || 140;
    const x = o.x != null ? o.x : innerWidth * 0.5;
    const y = o.y != null ? o.y : innerHeight * 0.35;
    const spread = o.spread || 14;
    const wide = n > 60;
    for (let i = 0; i < n; i++) {
      pieces.push({
        x: x + (Math.random() - 0.5) * (wide ? innerWidth * 0.5 : 20),
        y: y,
        vx: (Math.random() - 0.5) * spread,
        vy: -Math.random() * spread - 3,
        w: 6 + Math.random() * 8,
        h: 4 + Math.random() * 6,
        rot: Math.random() * 6,
        vr: (Math.random() - 0.5) * 0.4,
        color: confettiColors[(Math.random() * confettiColors.length) | 0]
      });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    pieces.forEach((p) => {
      p.vy += 0.32; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    pieces = pieces.filter((p) => p.y < innerHeight + 30);
    raf = pieces.length ? requestAnimationFrame(tick) : 0;
    if (!pieces.length) ctx.clearRect(0, 0, innerWidth, innerHeight);
  }
  function centerOf(node) {
    const r = node.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  /* ---------------- Basic content ---------------- */
  function fillContent() {
    $('name').textContent = CONFIG.name;
    $('intro-name').textContent = CONFIG.name;
    $('age').textContent = CONFIG.age;
    $('env-age').textContent = CONFIG.age;
    $('lede').textContent = CONFIG.lede;
    $('from').textContent = CONFIG.from;
    $('footer').textContent = CONFIG.footer;
    document.title = 'Happy ' + CONFIG.age + 'th Birthday ' + CONFIG.name;

    (CONFIG.reasons || []).forEach((t) => $('reasons').appendChild(el('div', 'reason', t)));
    (CONFIG.letter || []).forEach((t) => $('letter-body').appendChild(el('p', '', t)));

    (CONFIG.timeline || []).forEach((t) => {
      const item = el('div', 'tl-item');
      item.appendChild(el('span', 'tl-dot'));
      const card = el('div', 'tl-card');
      card.appendChild(el('p', 'tl-when', t.when));
      card.appendChild(el('h3', '', t.title));
      card.appendChild(el('p', '', t.text));
      item.appendChild(card);
      $('timeline').appendChild(item);
    });
    if (!(CONFIG.timeline || []).length) $('timeline-section').hidden = true;

    (CONFIG.photos || []).forEach((ph) => {
      const f = el('figure', 'polaroid');
      const box = el('div', 'photo');
      if (ph.src) {
        const img = document.createElement('img');
        img.src = ph.src;
        img.alt = ph.caption || '';
        box.appendChild(img);
      } else {
        box.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.6 4.5c2 0 3.5 1 5.4 3 1.9-2 3.4-3 5.4-3 3.6 0 5.7 3.7 4.2 7.2C19.5 16.4 12 21 12 21z"/></svg>';
      }
      f.appendChild(box);
      f.appendChild(el('figcaption', '', ph.caption));
      $('polaroids').appendChild(f);
    });
  }

  /* ---------------- Cake ---------------- */
  function circle(parent, cx, cy, r, fill) {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', r); c.setAttribute('fill', fill);
    parent.appendChild(c);
  }
  function setupCake() {
    for (let x = 97; x <= 223; x += 18) circle($('drips'), x, 134, 9, 'var(--blush)');
    for (let x = 80; x <= 240; x += 20) circle($('drips'), x, 196, 10, 'var(--accent)');
    const colors = ['#FFF6FA', '#FFB020', '#FFB8D4'];
    let seed = 7;
    const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    for (let i = 0; i < 26; i++) {
      const r = document.createElementNS(NS, 'rect');
      const x = 66 + rnd() * 188, y = 214 + rnd() * 38;
      r.setAttribute('x', x); r.setAttribute('y', y); r.setAttribute('width', 8); r.setAttribute('height', 3);
      r.setAttribute('rx', 1.5); r.setAttribute('fill', colors[i % 3]);
      r.setAttribute('transform', 'rotate(' + Math.round(rnd() * 180) + ' ' + (x + 4) + ' ' + (y + 1.5) + ')');
      $('sprinkles').appendChild(r);
    }

    const cake = $('cake'), blow = $('blow'), wish = $('wish');
    blow.addEventListener('click', () => {
      const out = cake.classList.toggle('out');
      cake.setAttribute('aria-label', out ? 'A pink birthday cake with the candles blown out' : 'A pink birthday cake with three lit candles');
      blow.textContent = out ? 'Light them again' : 'Blow out the candles';
      wish.textContent = out ? 'Hope your wish comes true, ' + CONFIG.name + '.' : '';
      if (out) burst();
    });

    // floating hearts
    const hearts = $('hearts');
    for (let i = 0; i < 14; i++) {
      const s = el('span', '', '♥');
      s.style.left = ((4 + i * 7) % 98) + '%';
      s.style.fontSize = (14 + (i * 5) % 22) + 'px';
      s.style.animationDuration = (9 + (i * 3) % 8) + 's';
      s.style.animationDelay = '-' + ((i * 2.3) % 12) + 's';
      if (reduceMotion) s.style.top = (10 + (i * 37) % 80) + '%';
      hearts.appendChild(s);
    }

    // sparkle trail that follows the mouse over the hero
    const hero = $('hero');
    if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
      let last = 0;
      hero.addEventListener('pointermove', (e) => {
        const t = performance.now();
        if (t - last < 55) return;
        last = t;
        const r = hero.getBoundingClientRect();
        const s = el('span', 'spark', '♥');
        s.style.left = (e.clientX - r.left) + 'px';
        s.style.top = (e.clientY - r.top) + 'px';
        s.style.fontSize = (10 + Math.random() * 12) + 'px';
        hero.appendChild(s);
        setTimeout(() => s.remove(), 900);
      });
    }
  }

  /* ---------------- Music ---------------- */
  let audio = null;
  const musicBtn = $('music');
  function setMusicState(on) { musicBtn.textContent = on ? 'Music on' : 'Music off'; }
  function setupMusic() {
    if (!CONFIG.music) return;
    audio = new Audio(CONFIG.music);
    audio.loop = true;
    audio.volume = 0.6;
    audio.addEventListener('error', () => { musicBtn.hidden = true; });
    musicBtn.hidden = false;
    musicBtn.addEventListener('click', () => {
      if (audio.paused) audio.play().then(() => setMusicState(true)).catch(() => setMusicState(false));
      else { audio.pause(); setMusicState(false); }
    });
  }
  function startMusic() {
    if (!audio) return;
    audio.play().then(() => setMusicState(true)).catch(() => setMusicState(false));
  }

  /* ---------------- Intro envelope ---------------- */
  function setupIntro() {
    const intro = $('intro');
    function open() {
      if (intro.classList.contains('open')) return;
      intro.classList.add('open');
      startMusic();
      setTimeout(() => {
        intro.classList.add('gone');
        document.body.classList.remove('locked');
        burst({ n: 90 });
        setTimeout(() => { intro.hidden = true; }, 700);
      }, reduceMotion ? 50 : 1500);
    }
    $('env-btn').addEventListener('click', open);
  }

  /* ---------------- Live counter ---------------- */
  function setupCounter() {
    const parts = String(CONFIG.birthDate || '').split('-').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) { $('alive').hidden = true; return; }
    const y = parts[0], m = parts[1], d = parts[2];
    const birth = new Date(y, m - 1, d);
    const target = new Date(y + CONFIG.age, m - 1, d);
    const nf = new Intl.NumberFormat('en-US');
    const dateText = target.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    function update() {
      const now = new Date();
      const counting = now < target;
      const ms = Math.abs(counting ? target - now : now - birth);
      const s = Math.floor(ms / 1000);
      $('c-days').textContent = nf.format(Math.floor(s / 86400));
      $('c-hours').textContent = String(Math.floor(s / 3600) % 24);
      $('c-mins').textContent = String(Math.floor(s / 60) % 60);
      $('c-secs').textContent = String(s % 60);
      if (counting) {
        $('alive-eyebrow').textContent = 'Almost there';
        $('alive-title').textContent = 'Until you turn ' + CONFIG.age;
        $('alive-sub').textContent = 'Your ' + CONFIG.age + 'th birthday is on ' + dateText + '.';
      } else {
        const beats = Math.floor((ms / 60000) * 72);
        $('alive-eyebrow').textContent = 'Right now';
        $('alive-title').textContent = 'You have been alive for';
        $('alive-sub').textContent = 'That is about ' + Math.round(beats / 1e6) + ' million heartbeats so far, give or take.';
      }
    }
    update();
    setInterval(update, 1000);
  }

  /* ---------------- Game 1: balloons ---------------- */
  function setupBalloons() {
    const msgs = CONFIG.balloons || [];
    if (!msgs.length) { $('balloon-section').hidden = true; return; }
    const grid = $('balloons'), out = $('balloon-msg'), reset = $('balloon-reset');
    const colors = ['var(--accent)', 'var(--blush)', 'var(--deep)', '#FFB020'];
    $('balloon-total').textContent = msgs.length;
    let popped = 0;

    function render() {
      popped = 0;
      $('popped').textContent = 0;
      out.textContent = 'Every balloon holds a wish. Pick one.';
      reset.hidden = true;
      grid.replaceChildren();
      msgs.forEach((text, i) => {
        const c = colors[i % colors.length];
        const b = el('button', 'balloon');
        b.type = 'button';
        b.style.setProperty('--d', '-' + ((i * 0.37) % 3).toFixed(2) + 's');
        b.setAttribute('aria-label', 'Pop balloon ' + (i + 1));
        b.innerHTML =
          '<svg viewBox="0 0 60 92" aria-hidden="true">' +
          '<ellipse cx="30" cy="30" rx="24" ry="29" fill="' + c + '"/>' +
          '<ellipse cx="21" cy="19" rx="5" ry="8" fill="#fff" opacity=".35" transform="rotate(25 21 19)"/>' +
          '<path d="M30 59 l-4 6 h8z" fill="' + c + '"/>' +
          '<path d="M30 65 q-8 10 0 18 q6 5 0 8" stroke="var(--ink-soft)" fill="none" stroke-width="1.5"/>' +
          '</svg>';
        b.addEventListener('click', () => {
          if (b.classList.contains('popped')) return;
          b.classList.add('popped');
          popped++;
          $('popped').textContent = popped;
          out.textContent = text;
          const p = centerOf(b);
          burst({ n: 26, x: p.x, y: p.y, spread: 9 });
          if (popped === msgs.length) {
            setTimeout(() => {
              out.textContent = CONFIG.balloonsDone || 'All popped!';
              reset.hidden = false;
              burst({ n: 160 });
            }, 650);
          }
        });
        grid.appendChild(b);
      });
    }
    reset.addEventListener('click', render);
    render();
  }

  /* ---------------- Game 2: scratch card ---------------- */
  function setupScratch() {
    const box = $('scratch'), cv = $('scratch-canvas'), reveal = $('scratch-reveal');
    const sctx = cv.getContext('2d', { willReadFrequently: true });
    $('prize').textContent = (CONFIG.scratch && CONFIG.scratch.prize) || '';
    let w = 0, done = false, drawing = false, strokes = 0, last = null;

    function paint() {
      if (done) return;
      const r = box.getBoundingClientRect();
      if (Math.round(r.width) === w) return;
      w = Math.round(r.width);
      const h = Math.round(r.height);
      const dpr = window.devicePixelRatio || 1;
      cv.width = w * dpr;
      cv.height = h * dpr;
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sctx.globalCompositeOperation = 'source-over';
      const g = sctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#F7A8C8');
      g.addColorStop(0.5, '#E5679B');
      g.addColorStop(1, '#F7A8C8');
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, w, h);
      sctx.fillStyle = 'rgba(255,255,255,0.35)';
      for (let i = 0; i < 70; i++) {
        sctx.beginPath();
        sctx.arc(Math.random() * w, Math.random() * h, 1 + Math.random() * 2.5, 0, 6.3);
        sctx.fill();
      }
      sctx.fillStyle = '#FFFFFF';
      sctx.font = '700 20px Figtree, system-ui, sans-serif';
      sctx.textAlign = 'center';
      sctx.textBaseline = 'middle';
      sctx.fillText('Scratch here', w / 2, h / 2);
    }
    function pos(e) {
      const r = cv.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    }
    function finish() {
      if (done) return;
      done = true;
      cv.classList.add('gone');
      reveal.hidden = true;
      const p = centerOf(box);
      burst({ n: 80, x: p.x, y: p.y, spread: 12 });
    }
    function check() {
      const data = sctx.getImageData(0, 0, cv.width, cv.height).data;
      let clear = 0, total = 0;
      for (let i = 3; i < data.length; i += 64) { total++; if (data[i] < 40) clear++; }
      if (total && clear / total > 0.5) finish();
    }
    cv.addEventListener('pointerdown', (e) => {
      if (done) return;
      drawing = true;
      cv.setPointerCapture(e.pointerId);
      last = pos(e);
      sctx.globalCompositeOperation = 'destination-out';
      sctx.beginPath();
      sctx.arc(last[0], last[1], 24, 0, 6.3);
      sctx.fill();
    });
    cv.addEventListener('pointermove', (e) => {
      if (!drawing || done) return;
      const p = pos(e);
      sctx.globalCompositeOperation = 'destination-out';
      sctx.lineWidth = 48;
      sctx.lineCap = 'round';
      sctx.beginPath();
      sctx.moveTo(last[0], last[1]);
      sctx.lineTo(p[0], p[1]);
      sctx.stroke();
      last = p;
      if (++strokes % 12 === 0) check();
    });
    const stop = () => { if (drawing) { drawing = false; if (!done) check(); } };
    cv.addEventListener('pointerup', stop);
    cv.addEventListener('pointercancel', stop);
    reveal.addEventListener('click', finish);
    paint();
    addEventListener('resize', paint);
  }

  /* ---------------- Game 3: spin the wheel ---------------- */
  function setupWheel() {
    const prizes = CONFIG.wheel || [];
    if (prizes.length < 2) { $('wheel-section').hidden = true; return; }
    const cv = $('wheel'), spin = $('spin'), out = $('wheel-result');
    const n = prizes.length, arc = 360 / n, SIZE = 420;
    const palette = [['#D81B6A', '#FFFFFF'], ['#FFB8D4', '#4B1230'], ['#A8125A', '#FFFFFF'], ['#FFB020', '#4B1230']];
    const extra = ['#FF8FB8', '#4B1230'];
    cv.width = SIZE * 2;
    cv.height = SIZE * 2;
    const c = cv.getContext('2d');

    function lines(label) {
      const text = String(label);
      const words = text.split(' ');
      if (words.length < 2 || text.length <= 11) return [text];
      let best = 1, diff = Infinity;
      for (let i = 1; i < words.length; i++) {
        const d = Math.abs(words.slice(0, i).join(' ').length - words.slice(i).join(' ').length);
        if (d < diff) { diff = d; best = i; }
      }
      return [words.slice(0, best).join(' '), words.slice(best).join(' ')];
    }
    function draw() {
      c.setTransform(2, 0, 0, 2, 0, 0);
      c.clearRect(0, 0, SIZE, SIZE);
      const cx = SIZE / 2, cy = SIZE / 2, R = SIZE / 2 - 6;
      prizes.forEach((p, i) => {
        const col = (n % palette.length === 1 && i === n - 1) ? extra : palette[i % palette.length];
        const a0 = (-90 + i * arc) * Math.PI / 180;
        const a1 = (-90 + (i + 1) * arc) * Math.PI / 180;
        c.beginPath();
        c.moveTo(cx, cy);
        c.arc(cx, cy, R, a0, a1);
        c.closePath();
        c.fillStyle = col[0];
        c.fill();
        c.lineWidth = 2;
        c.strokeStyle = '#FFF6FA';
        c.stroke();
        c.save();
        c.translate(cx, cy);
        c.rotate((a0 + a1) / 2);
        c.fillStyle = col[1];
        c.textAlign = 'right';
        c.textBaseline = 'middle';
        c.font = '700 16px Figtree, system-ui, sans-serif';
        const ls = lines(p.label);
        ls.forEach((t, k) => c.fillText(t, R - 18, (k - (ls.length - 1) / 2) * 19));
        c.restore();
      });
      c.beginPath();
      c.arc(cx, cy, R, 0, Math.PI * 2);
      c.lineWidth = 6;
      c.strokeStyle = '#A8125A';
      c.stroke();
      c.beginPath();
      c.arc(cx, cy, 28, 0, Math.PI * 2);
      c.fillStyle = '#FFF6FA';
      c.fill();
      c.lineWidth = 5;
      c.strokeStyle = '#A8125A';
      c.stroke();
      c.fillStyle = '#D81B6A';
      c.font = '700 26px Figtree, system-ui, sans-serif';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText('\u2665\uFE0E', cx, cy + 1);
    }
    draw();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);

    let rotation = 0, spinning = false;
    spin.addEventListener('click', () => {
      if (spinning) return;
      spinning = true;
      spin.disabled = true;
      const k = Math.floor(Math.random() * n);
      const jitter = (Math.random() - 0.5) * arc * 0.7;
      const theta = k * arc + arc / 2 + jitter;   // angle on the wheel that must end up under the pointer
      const target = (360 - theta) % 360;
      const delta = ((target - (rotation % 360)) + 360) % 360 + 360 * (5 + Math.floor(Math.random() * 3));
      rotation += delta;
      const dur = reduceMotion ? 0 : 4800;
      cv.style.transition = dur ? 'transform ' + dur + 'ms cubic-bezier(.12, .7, .1, 1)' : 'none';
      cv.style.transform = 'rotate(' + rotation + 'deg)';
      out.textContent = 'Spinning...';
      setTimeout(() => {
        out.textContent = prizes[k].text;
        spinning = false;
        spin.disabled = false;
        spin.textContent = 'Spin again';
        const p = centerOf(cv);
        burst({ n: 70, x: p.x, y: p.y, spread: 12 });
      }, dur + 100);
    });
  }

  /* ---------------- Game 4: memory pairs ---------------- */
  function setupMemory() {
    const grid = $('memory'), movesEl = $('moves'), msg = $('memory-msg');
    const symbols = ['♥', '★', '✿', '♪', '☾', '❀'].map((s) => s + '︎');
    const PAIRS = 6;

    function faces() {
      const out = (CONFIG.photos || []).filter((p) => p.src).slice(0, PAIRS)
        .map((p) => ({ img: p.src, alt: p.caption || 'Photo' }));
      for (let s = 0; out.length < PAIRS; s++) out.push({ sym: symbols[s], alt: 'Symbol' });
      return out.map((f, k) => Object.assign({ k: k }, f));
    }
    function deal() {
      const f = faces();
      const deck = shuffle(f.concat(f));
      let first = null, lock = false, matched = 0, moves = 0;
      movesEl.textContent = 0;
      msg.hidden = true;
      grid.replaceChildren();

      deck.forEach((face) => {
        const card = el('button', 'mem-card');
        card.type = 'button';
        card.setAttribute('aria-label', 'Hidden card');
        const inner = el('span', 'mem-inner');
        const front = el('span', 'mem-front');
        const back = el('span', 'mem-back');
        if (face.img) {
          const im = document.createElement('img');
          im.src = face.img; im.alt = '';
          back.appendChild(im);
        } else {
          back.textContent = face.sym;
        }
        inner.append(front, back);
        card.appendChild(inner);

        card.addEventListener('click', () => {
          if (lock || card.classList.contains('flipped')) return;
          card.classList.add('flipped');
          card.setAttribute('aria-label', face.alt);
          if (!first) { first = { card: card, face: face }; return; }
          moves++;
          movesEl.textContent = moves;
          const a = first;
          first = null;
          if (a.face.k === face.k) {
            a.card.classList.add('matched');
            card.classList.add('matched');
            matched++;
            if (matched === PAIRS) {
              msg.textContent = 'You found every pair in ' + moves + ' moves.';
              msg.hidden = false;
              burst();
            }
          } else {
            lock = true;
            setTimeout(() => {
              [a.card, card].forEach((c) => { c.classList.remove('flipped'); c.setAttribute('aria-label', 'Hidden card'); });
              lock = false;
            }, 800);
          }
        });
        grid.appendChild(card);
      });
    }
    $('memory-reset').addEventListener('click', deal);
    deal();
  }

  /* ---------------- Gift ---------------- */
  function setupGift() {
    const btn = $('gift-btn'), note = $('gift-note'), gift = $('gift');
    btn.addEventListener('click', () => {
      const open = gift.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      note.hidden = !open;
      note.textContent = open ? CONFIG.gift : '';
      $('gift-hint').textContent = open ? 'Happy birthday!' : 'Tap the box.';
      if (open) burst();
    });
  }

  /* ---------------- Start ---------------- */
  fillContent();
  setupCake();
  setupMusic();
  setupIntro();
  setupCounter();
  setupBalloons();
  setupScratch();
  setupWheel();
  setupMemory();
  setupGift();
})();
