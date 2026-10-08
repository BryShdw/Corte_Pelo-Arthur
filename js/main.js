/* =========================================================
   Invitación · Corte de Pelo · Arthur Jaziel ✂️
   ========================================================= */

/* ---------- CONFIGURACIÓN (Edita aquí fácilmente) ---------- */
const CONFIG = {
  // Fecha y hora del evento: Sábado 24 de Octubre a las 8:00 p.m. (-05:00)
  eventDate: '2026-10-24T20:00:00-05:00',
  eventEnd: '2026-10-24T23:59:00-05:00',
  title: 'Corte de Pelo de Arthur Jaziel ✂️',
  mapsUrl: 'https://maps.app.goo.gl/yNcyCmgx2SY7xG256',

  // Nombre o dirección específica del local (opcional)
  venueName: '',

  // Número de WhatsApp para confirmación (opcional, ej: '51987654321' sin '+')
  whatsapp: '',
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Portada / Sobre Interactivo ---------- */
(function initCover() {
  const cover = document.getElementById('cover');
  const openBtn = document.getElementById('openBtn');
  if (!cover || !openBtn) return;

  let opened = false;

  const open = () => {
    if (opened) return;
    opened = true;
    openBtn.style.transform = 'scale(0.92)';

    setTimeout(() => {
      launchConfetti();
      cover.classList.add('is-gone');
      document.body.classList.remove('is-locked');
      revealHeaderNow();
    }, reduceMotion ? 100 : 350);

    setTimeout(() => cover.remove(), reduceMotion ? 400 : 1200);
  };

  openBtn.addEventListener('click', open);
})();

/* ---------- Confeti en Canvas (Celestes, dorados y blancos) ---------- */
function launchConfetti() {
  if (reduceMotion) return;
  const canvas = document.getElementById('confetti');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = window.innerWidth;
  const H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.scale(dpr, dpr);

  const colors = ['#8ec3ec', '#549cd4', '#fae4a8', '#e5af3a', '#ffffff', '#c4e1f7'];
  const pieces = Array.from({ length: Math.min(140, Math.round(W / 3.2)) }, () => ({
    x: W / 2 + (Math.random() - 0.5) * 80,
    y: H * 0.45,
    vx: (Math.random() - 0.5) * 12,
    vy: -Math.random() * 14 - 5,
    size: Math.random() * 8 + 4,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.25,
    color: colors[(Math.random() * colors.length) | 0],
    shape: Math.random() > 0.4 ? 'circle' : 'star',
  }));

  const start = performance.now();
  const DURATION = 3600;

  (function frame(now) {
    const t = now - start;
    ctx.clearRect(0, 0, W, H);
    const fade = t > DURATION - 700 ? Math.max(0, (DURATION - t) / 700) : 1;
    ctx.globalAlpha = fade;

    for (const p of pieces) {
      p.vy += 0.35;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Estrellita
        ctx.font = `${p.size * 1.5}px sans-serif`;
        ctx.fillText('✦', -p.size / 2, p.size / 2);
      }
      ctx.restore();
    }

    if (t < DURATION) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, W, H);
  })(start);
}

/* ---------- Animación de Entrada al Scroll ---------- */
let revealObserver;

(function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((el) => {
    if (!el.classList.contains('header')) revealObserver.observe(el);
  });
})();

function revealHeaderNow() {
  document.querySelectorAll('.header.reveal').forEach((el) => el.classList.add('is-visible'));
}

if (!document.getElementById('cover')) {
  document.body.classList.remove('is-locked');
  revealHeaderNow();
}

/* ---------- Marco de Foto Interactivo (Giro) ---------- */
(function initPhoto() {
  const frame = document.getElementById('photoFrame');
  if (!frame) return;
  let timer;

  const toggle = () => frame.classList.toggle('is-flipped');
  const restart = () => {
    clearInterval(timer);
    if (!reduceMotion) timer = setInterval(toggle, 5000);
  };

  frame.addEventListener('click', () => { toggle(); restart(); });
  frame.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); restart(); }
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) restart();
      else clearInterval(timer);
    }, { threshold: 0.3 }).observe(frame);
  }
})();

/* ---------- Cuenta Regresiva para las 8:00 p.m. ---------- */
(function initCountdown() {
  const box = document.getElementById('countdown');
  if (!box) return;

  const target = new Date(CONFIG.eventDate).getTime();
  const end = new Date(CONFIG.eventEnd).getTime();
  const nums = {
    d: box.querySelector('[data-unit="d"]'),
    h: box.querySelector('[data-unit="h"]'),
    m: box.querySelector('[data-unit="m"]'),
    s: box.querySelector('[data-unit="s"]'),
  };
  const title = box.querySelector('.countdown-title');
  const pad = (n) => String(n).padStart(2, '0');

  const set = (el, value) => {
    if (!el || el.textContent === value) return;
    el.textContent = value;
    if (!reduceMotion) {
      el.classList.remove('tick');
      void el.offsetWidth;
      el.classList.add('tick');
    }
  };

  let interval;
  const update = () => {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      box.classList.add('is-today');
      title.textContent = now < end ? '¡Hoy es el gran día del corte de pelo! ✂️' : '¡Gracias por acompañarnos en este hermoso momento! 💙';
      clearInterval(interval);
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    set(nums.d, pad(d));
    set(nums.h, pad(h));
    set(nums.m, pad(m));
    set(nums.s, pad(s));
  };

  update();
  interval = setInterval(update, 1000);
})();

/* ---------- Ubicación y WhatsApp ---------- */
(function initLinks() {
  const venue = document.getElementById('venueName');
  if (venue && CONFIG.venueName) venue.textContent = CONFIG.venueName;

  const mapBtn = document.getElementById('mapBtn');
  if (mapBtn && CONFIG.mapsUrl) mapBtn.href = CONFIG.mapsUrl;

  const wa = document.getElementById('rsvpBtn');
  const rsvpWrap = document.getElementById('rsvpWrap');
  if (wa && CONFIG.whatsapp) {
    const msg = '¡Hola! Confirmo mi asistencia al Corte de Pelo de Arthur Jaziel ✂️💙';
    wa.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
    if (rsvpWrap) rsvpWrap.hidden = false;
  }
})();
