/* ============================================================
   HUSNA TASNEEM — PORTFOLIO SCRIPT
   Features:
     - Loading screen removal
     - Particle canvas background
     - Typing effect (hero)
     - Sticky navbar + active section highlighting
     - Hamburger mobile menu
     - Scroll reveal animations
     - Skill bar animation
     - Contact form validation
     - Scroll-to-top button
     - Footer year auto-update
   ============================================================ */

/* ============================================================
   1. LOADING SCREEN
   Hides the loader once the page has fully loaded
   ============================================================ */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  // Wait a bit so the animation is visible, then fade out
  setTimeout(() => {
    loader.classList.add('hidden');
    // Once hidden, start all the other page features
    initAll();
  }, 1500);
});

/* ============================================================
   2. INIT — Call everything after loader disappears
   ============================================================ */
function initAll() {
  initParticles();
  initTypingEffect();
  initNavbar();
  initHamburger();
  initScrollReveal();
  initSkillBars();
  initContactForm();
  initScrollTop();
  updateYear();
}

/* ============================================================
   3. PARTICLE CANVAS BACKGROUND
   Draws subtle floating dots and connecting lines
   ============================================================ */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 60;
  const CONNECTION_DIST = 140; // Max distance to draw a connecting line

  /* Resize canvas to fill window */
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* Single particle constructor */
  function Particle() {
    this.x    = Math.random() * canvas.width;
    this.y    = Math.random() * canvas.height;
    this.vx   = (Math.random() - 0.5) * 0.4;  // horizontal velocity
    this.vy   = (Math.random() - 0.5) * 0.4;  // vertical velocity
    this.size = Math.random() * 2 + 0.5;       // dot radius
    this.alpha= Math.random() * 0.5 + 0.2;     // dot opacity
  }

  /* Create all particles */
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  /* Draw loop */
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      /* Move */
      p.x += p.vx;
      p.y += p.vy;

      /* Wrap around edges */
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width)  p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      /* Draw dot */
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${p.alpha})`;
      ctx.fill();

      /* Draw lines between close particles */
      for (let j = i + 1; j < particles.length; j++) {
        const q    = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < CONNECTION_DIST) {
          const opacity = (1 - dist / CONNECTION_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(draw);
  }

  draw();
}

/* ============================================================
   4. TYPING EFFECT
   Cycles through an array of job titles
   ============================================================ */
function initTypingEffect() {
  const typedEl = document.getElementById('typed-text');
  if (!typedEl) return;

  // Words to cycle through
  const words = [
    'Java Full Stack Developer',
    'Problem Solver',
    'Web Developer',
    'Database Enthusiast',
    'Lifelong Learner'
  ];

  let wordIndex   = 0;   // Which word we're on
  let charIndex   = 0;   // Which character within the word
  let isDeleting  = false;
  const typeSpeed   = 80;  // ms per character when typing
  const deleteSpeed = 50;  // ms per character when deleting
  const pauseAfter  = 1800;// ms pause after full word appears

  function type() {
    const currentWord = words[wordIndex];

    if (!isDeleting) {
      /* Typing forward */
      typedEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentWord.length) {
        /* Finished typing — pause then start deleting */
        isDeleting = true;
        setTimeout(type, pauseAfter);
        return;
      }
    } else {
      /* Deleting */
      typedEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        /* Finished deleting — move to next word */
        isDeleting = false;
        wordIndex  = (wordIndex + 1) % words.length;
      }
    }

    setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
  }

  type(); // Kick off
}

/* ============================================================
   5. STICKY NAVBAR
   Adds `.scrolled` class after user scrolls 60px,
   and highlights the nav link of the visible section
   ============================================================ */
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    /* Scrolled state */
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    /* Active section highlighting */
    let currentId = '';
    sections.forEach(sec => {
      const top    = sec.offsetTop - 100;
      const bottom = top + sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      // Check if link's href ends with #currentId
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on init
}

/* ============================================================
   6. HAMBURGER MENU (mobile)
   Toggles the nav links open/closed on small screens
   ============================================================ */
function initHamburger() {
  const btn      = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  if (!btn || !navLinks) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  /* Close menu when a link is clicked */
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

/* ============================================================
   7. SCROLL REVEAL ANIMATIONS
   Uses IntersectionObserver to add `.visible` class
   when elements enter the viewport
   ============================================================ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, {
    threshold: 0.12,  // Trigger when 12% of element is visible
    rootMargin: '0px 0px -50px 0px' // Slight bottom offset
  });

  revealEls.forEach(el => observer.observe(el));
}

/* ============================================================
   8. SKILL BAR ANIMATION
   Fills the progress bars when they scroll into view
   ============================================================ */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar   = entry.target;
        const width = bar.getAttribute('data-width'); // e.g. "75"
        bar.style.width = width + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach(bar => observer.observe(bar));
}

/* ============================================================
   9. CONTACT FORM VALIDATION
   Simple client-side validation with error messages
   ============================================================ */
function initContactForm() {
  const form       = document.getElementById('contact-form');
  const submitBtn  = document.getElementById('submit-btn');
  const btnText    = document.getElementById('btn-text');
  const successMsg = document.getElementById('form-success');

  if (!form) return;

  /* Show an error under a field */
  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(`${fieldId}-error`);
    if (field) field.classList.add('error');
    if (error) error.textContent = message;
  }

  /* Clear all errors */
  function clearErrors() {
    ['name', 'email', 'message'].forEach(id => {
      const field = document.getElementById(id);
      const error = document.getElementById(`${id}-error`);
      if (field) field.classList.remove('error');
      if (error) error.textContent = '';
    });
  }

  /* Basic email regex check */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent real submission (no backend)
    clearErrors();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    let hasError  = false;

    /* Validate Name */
    if (name.length < 2) {
      showError('name', 'Please enter your name (min 2 characters).');
      hasError = true;
    }

    /* Validate Email */
    if (!email) {
      showError('email', 'Email address is required.');
      hasError = true;
    } else if (!isValidEmail(email)) {
      showError('email', 'Please enter a valid email address.');
      hasError = true;
    }

    /* Validate Message */
    if (message.length < 10) {
      showError('message', 'Message must be at least 10 characters.');
      hasError = true;
    }

    if (hasError) return;

    /* Simulate sending: show loading state */
    btnText.textContent = 'Sending...';
    submitBtn.disabled  = true;

    /* Fake async delay (replace with real fetch() for a backend) */
    setTimeout(() => {
      form.reset();
      btnText.textContent = 'Send Message';
      submitBtn.disabled  = false;

      /* Show success message */
      successMsg.classList.remove('hidden');
      setTimeout(() => successMsg.classList.add('hidden'), 5000);
    }, 1500);
  });

  /* Remove error styling when user starts typing */
  ['name', 'email', 'message'].forEach(id => {
    const field = document.getElementById(id);
    if (field) {
      field.addEventListener('input', () => {
        field.classList.remove('error');
        document.getElementById(`${id}-error`).textContent = '';
      });
    }
  });
}

/* ============================================================
   10. SCROLL TO TOP BUTTON
   Shows a button after scrolling down 400px
   ============================================================ */
function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   11. FOOTER YEAR — Auto update copyright year
   ============================================================ */
function updateYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
