/* ═══════════════════════════════════════════════════════════════
   PLANTILLA LANDING PAGE — NEGOCIO LOCAL
   script.js
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── Año dinámico en el footer ──────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ── Efecto de transparencia → opaco en la navbar ───────────── */
const navbar = document.getElementById('navbar');
function handleNavScroll() {
  navbar.classList.toggle('nav-scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', handleNavScroll, { passive: true });

/* ── Menú móvil hamburguesa ─────────────────────────────────── */
const menuBtn    = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuIcon   = document.getElementById('menuIcon');

menuBtn.addEventListener('click', () => {
  const isOpen = !mobileMenu.classList.contains('hidden');
  mobileMenu.classList.toggle('hidden', isOpen);
  menuIcon.className = isOpen ? 'fas fa-bars text-xl' : 'fas fa-times text-xl';
  menuBtn.setAttribute('aria-expanded', String(!isOpen));
});

/* Cerrar menú móvil al pulsar cualquier enlace interno */
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    menuIcon.className = 'fas fa-bars text-xl';
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

/* ── Animaciones de entrada (IntersectionObserver) ───────────── */
const animObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        animObserver.unobserve(entry.target);   // Solo anima una vez
      }
    });
  },
  { threshold: 0.12 }
);

/* Retraso escalonado para elementos en el mismo bloque de grid */
document.querySelectorAll('.anim-item').forEach((el, index) => {
  el.style.transitionDelay = `${(index % 6) * 80}ms`;
  animObserver.observe(el);
});

/* ── Contador animado en el hero ────────────────────────────── */
function animateCounter(el, target, suffix = '') {
  const duration = 1800;
  const start    = performance.now();
  const isPlus   = suffix.startsWith('+');
  const prefix   = isPlus ? '+' : '';
  const cleanSuffix = isPlus ? suffix.slice(1) : suffix;

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value    = Math.round(eased * target);
    el.textContent = prefix + value + cleanSuffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* Observar los contadores del hero para iniciar cuando sean visibles */
const counterObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw    = el.dataset.countTo   || '0';
      const suffix = el.dataset.suffix    || '';
      animateCounter(el, parseInt(raw, 10), suffix);
      obs.unobserve(el);
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('[data-count-to]').forEach(el => counterObserver.observe(el));

/* ── Carrusel de testimonios (slider táctil) ────────────────── */
(function initTestimonialsSlider() {
  const track     = document.getElementById('testimonialsTrack');
  const prevBtn   = document.getElementById('testimPrev');
  const nextBtn   = document.getElementById('testimNext');
  const dotsWrap  = document.getElementById('testimDots');

  if (!track) return;  // Sección no presente

  const cards       = Array.from(track.children);
  let   current     = 0;
  let   startX      = 0;
  let   isDragging  = false;
  let   autoTimer;

  /* Crear dots indicadores */
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'w-2.5 h-2.5 rounded-full transition-all duration-300 ' +
                    (i === 0 ? 'bg-blue-600 w-6' : 'bg-gray-300');
    dot.setAttribute('aria-label', `Testimonio ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(index) {
    current = (index + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
  }

  function updateDots() {
    dotsWrap.querySelectorAll('button').forEach((dot, i) => {
      dot.className = 'h-2.5 rounded-full transition-all duration-300 ' +
                      (i === current ? 'bg-blue-600 w-6' : 'bg-gray-300 w-2.5');
    });
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }
  function stopAuto() { clearInterval(autoTimer); }

  prevBtn?.addEventListener('click', () => { goTo(current - 1); stopAuto(); startAuto(); });
  nextBtn?.addEventListener('click', () => { goTo(current + 1); stopAuto(); startAuto(); });

  /* Soporte táctil (swipe) */
  track.addEventListener('touchstart',  e => { startX = e.touches[0].clientX; isDragging = true; stopAuto(); }, { passive: true });
  track.addEventListener('touchend',    e => {
    if (!isDragging) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    isDragging = false;
    startAuto();
  });

  startAuto();
})();

/* ═══════════════════════════════════════════════════════════════
   FORMULARIO DE CONTACTO
   Validación client-side + feedback visual.
   Para envío real: conecta el submit a tu backend, Formspree,
   EmailJS, o cualquier servicio de formularios sin servidor.
   ═══════════════════════════════════════════════════════════════ */
(function initContactForm() {
  const form        = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn   = document.getElementById('contactSubmit');
  const submitLabel = document.getElementById('submitLabel');
  const statusBox   = document.getElementById('formStatus');
  const msgTextarea = document.getElementById('contactMessage');
  const msgCount    = document.getElementById('msgCount');
  const privacyCb   = document.getElementById('contactPrivacy');
  const privacyErr  = document.getElementById('privacyError');

  /* ── Contador de caracteres del textarea ── */
  msgTextarea?.addEventListener('input', () => {
    msgCount.textContent = msgTextarea.value.length;
  });

  /* ── Validación de un campo individual ── */
  function validateField(input) {
    const error   = input.closest('.form-field')?.querySelector('.form-error');
    let   message = '';

    if (input.validity.valueMissing) {
      message = 'Este campo es obligatorio.';
    } else if (input.validity.typeMismatch && input.type === 'email') {
      message = 'Introduce un email válido.';
    } else if (input.validity.tooShort) {
      message = `Mínimo ${input.minLength} caracteres.`;
    } else if (input.validity.tooLong) {
      message = `Máximo ${input.maxLength} caracteres.`;
    } else if (input.validity.patternMismatch) {
      message = 'Formato no válido.';
    }

    input.classList.toggle('is-invalid', !!message);
    input.classList.toggle('is-valid',   !message && input.value.trim() !== '');
    if (error) error.textContent = message;
    return !message;
  }

  /* ── Validar en blur (al salir del campo) ── */
  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('is-invalid')) validateField(input);
    });
  });

  /* ── Submit ── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    /* Validar todos los campos */
    let isValid = true;
    form.querySelectorAll('.form-input').forEach(input => {
      if (!validateField(input)) isValid = false;
    });

    /* Validar checkbox privacidad */
    if (!privacyCb.checked) {
      privacyErr.textContent = 'Debes aceptar la política de privacidad.';
      isValid = false;
    } else {
      privacyErr.textContent = '';
    }

    if (!isValid) return;

    /* Estado de carga */
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitLabel.textContent = 'Enviando…';
    statusBox.className = 'hidden rounded-xl px-5 py-4 text-sm font-medium';
    statusBox.textContent = '';

    /* ── CONEXIÓN CON TU BACKEND ──────────────────────────────
       Opciones:
       A) Formspree:   action="https://formspree.io/f/XXXXXXXX"
       B) EmailJS:     emailjs.send(serviceId, templateId, params)
       C) API propia:  fetch('/api/contact', { method:'POST', body: formData })

       El bloque try/catch simula el envío. Reemplázalo con tu
       integración real eliminando el setTimeout.
    ────────────────────────────────────────────────────────── */
    try {
      /* SIMULACIÓN — elimina esto y añade tu lógica de envío real */
      await new Promise(resolve => setTimeout(resolve, 1200));
      /* FIN SIMULACIÓN */

      /* Éxito */
      statusBox.className = 'status-success rounded-xl px-5 py-4 text-sm font-medium';
      statusBox.innerHTML = '<i class="fas fa-check-circle text-lg flex-shrink-0"></i>' +
                            '<span>¡Mensaje enviado! Te responderemos en menos de 24 h.</span>';
      form.reset();
      form.querySelectorAll('.form-input').forEach(i => {
        i.classList.remove('is-valid', 'is-invalid');
      });
      if (msgCount) msgCount.textContent = '0';

    } catch (_err) {
      /* Error */
      statusBox.className = 'status-error rounded-xl px-5 py-4 text-sm font-medium';
      statusBox.innerHTML = '<i class="fas fa-exclamation-circle text-lg flex-shrink-0"></i>' +
                            '<span>Hubo un error al enviar. Por favor, inténtalo de nuevo o ' +
                            'llámanos directamente.</span>';
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      submitLabel.textContent = 'Enviar mensaje';
      statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
})();

/* ══════════════════════════════════════════════════════════════
   BOTÓN VOLVER ARRIBA
   ══════════════════════════════════════════════════════════════ */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
