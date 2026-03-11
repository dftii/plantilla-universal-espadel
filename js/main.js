/**
 * Espadel – Plantilla Universal de Club de Pádel
 * main.js
 */

(function () {
  'use strict';

  /* ── Sticky Header ──────────────────────────────── */
  const header = document.getElementById('header');

  function onScroll() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveNavLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Mobile Nav Toggle ──────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');

  navToggle.addEventListener('click', function () {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close nav when a link is clicked
  nav.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── Active Nav Link on Scroll ──────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  function updateActiveNavLink() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(function (section) {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector('.nav__link[href="#' + id + '"]');
      if (!link) { return; }
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(function (l) { l.classList.remove('active'); });
        link.classList.add('active');
      }
    });
  }

  /* ── Counter Animation ──────────────────────────── */
  const statNumbers = document.querySelectorAll('.stat-card__number[data-target]');
  let countersStarted = false;

  function animateCounters() {
    if (countersStarted) { return; }

    const statsSection = document.querySelector('.stats');
    if (!statsSection) { return; }

    const rect = statsSection.getBoundingClientRect();
    if (rect.top > window.innerHeight) { return; }

    countersStarted = true;

    statNumbers.forEach(function (el) {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const duration = 1500;
      const start = performance.now();

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target).toLocaleString('es-ES');
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    });
  }

  window.addEventListener('scroll', animateCounters, { passive: true });
  // Run once on load in case already in view
  animateCounters();

  /* ── Set current year in footer ─────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ── Set minimum date for reservation form ───────── */
  const fechaInput = document.getElementById('fecha');
  if (fechaInput) {
    const today = new Date().toISOString().split('T')[0];
    fechaInput.setAttribute('min', today);
  }

  /* ── Form Validation Helper ─────────────────────── */
  function validateField(field) {
    const value = field.value.trim();

    if (field.hasAttribute('required') && !value) {
      field.classList.add('error');
      return false;
    }

    if (field.type === 'email' && value && !field.validity.valid) {
      field.classList.add('error');
      return false;
    }

    field.classList.remove('error');
    return true;
  }

  function validateForm(form) {
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
    let valid = true;
    fields.forEach(function (field) {
      if (!validateField(field)) {
        valid = false;
      }
    });
    return valid;
  }

  function showMessage(messageEl, text, type) {
    messageEl.textContent = text;
    messageEl.className = 'form-message ' + type;
  }

  /* ── Real-time field validation ─────────────────── */
  document.querySelectorAll('input, select, textarea').forEach(function (field) {
    field.addEventListener('blur', function () {
      validateField(field);
    });
    field.addEventListener('input', function () {
      if (field.classList.contains('error')) {
        validateField(field);
      }
    });
  });

  /* ── Reservation Form ───────────────────────────── */
  const reservaForm = document.getElementById('reservaForm');
  const formMessage = document.getElementById('formMessage');

  if (reservaForm) {
    reservaForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validateForm(reservaForm)) {
        showMessage(formMessage, 'Por favor, completa todos los campos obligatorios.', 'error');
        return;
      }

      const submitBtn = reservaForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Procesando…';

      // Simulate async submission (replace with real API call)
      setTimeout(function () {
        showMessage(
          formMessage,
          '✅ ¡Reserva confirmada! Te enviaremos un correo de confirmación en breve.',
          'success'
        );
        reservaForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirmar Reserva';
      }, 1200);
    });
  }

  /* ── Contact Form ───────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  const contactMessage = document.getElementById('contactMessage');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validateForm(contactForm)) {
        showMessage(contactMessage, 'Por favor, completa todos los campos obligatorios.', 'error');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando…';

      // Simulate async submission (replace with real API call)
      setTimeout(function () {
        showMessage(
          contactMessage,
          '✅ Mensaje enviado correctamente. Nos pondremos en contacto contigo en 24-48 horas.',
          'success'
        );
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Mensaje';
      }, 1000);
    });
  }

  /* ── Smooth-scroll for older browsers fallback ───── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') { return; }
      const target = document.querySelector(targetId);
      if (!target) { return; }
      e.preventDefault();
      const rawHeight = getComputedStyle(document.documentElement)
        .getPropertyValue('--header-height').trim();
      const headerOffset = parseFloat(rawHeight) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();
