

﻿/* ==========================================
   XAVATHON 2027 - SCRIPT.JS
   ========================================== */

// ---- Page Loader ----
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('ldr-hidden');
    }, 500);
  }
});

// ---- Navbar scroll ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ---- Hamburger menu ----
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});
// close on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// ---- Countdown Timer ----
// Target: 1st January 2027
const target = new Date('2027-01-01T06:00:00');
const cdMonths = document.getElementById('cd-months');
const cdDays   = document.getElementById('cd-days');
const cdHours  = document.getElementById('cd-hours');
const cdMins   = document.getElementById('cd-mins');

function pad(n, width) {
  const s = String(n);
  return s.length >= width ? s : '0'.repeat(width - s.length) + s;
}

function updateCountdown() {
  const now  = new Date();
  const diff = target - now;
  if (diff <= 0) {
    cdMonths.textContent = '00';
    cdDays.textContent   = '00';
    cdHours.textContent  = '00';
    cdMins.textContent   = '00';
    return;
  }
  // Calculate whole months remaining
  let mo = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
  // Adjust if the day-of-month hasn't been reached yet in the current month
  const tempDate = new Date(now.getFullYear(), now.getMonth() + mo, now.getDate(),
                            now.getHours(), now.getMinutes(), now.getSeconds());
  if (tempDate > target) mo--;
  // Remaining diff after subtracting whole months
  const monthStart = new Date(now.getFullYear(), now.getMonth() + mo, now.getDate(),
                              now.getHours(), now.getMinutes(), now.getSeconds());
  const rem  = target - monthStart;
  const d = Math.floor(rem / 86400000);
  const h = Math.floor((rem % 86400000) / 3600000);
  const m = Math.floor((rem % 3600000)  / 60000);
  cdMonths.textContent = pad(Math.max(mo, 0), 2);
  cdDays.textContent   = pad(d, 2);
  cdHours.textContent  = pad(h, 2);
  cdMins.textContent   = pad(m, 2);
}
updateCountdown();
setInterval(updateCountdown, 60000);

// ---- Animated Particles ----
const particlesContainer = document.getElementById('particles');
function spawnParticle() {
  if (!particlesContainer) return;
  const p = document.createElement('div');
  p.className = 'particle';
  p.style.left = Math.random() * 100 + '%';
  p.style.bottom = '0';
  const size   = Math.random() * 4 + 2;
  const dur    = Math.random() * 8 + 6;
  const delay  = Math.random() * 4;
  p.style.width  = size + 'px';
  p.style.height = size + 'px';
  p.style.animationDuration = dur + 's';
  p.style.animationDelay    = delay + 's';
  p.style.opacity = (Math.random() * 0.5 + 0.3).toString();
  particlesContainer.appendChild(p);
  setTimeout(() => p.remove(), (dur + delay) * 1000);
}
for (let i = 0; i < 20; i++) {
  setTimeout(spawnParticle, i * 400);
}
setInterval(spawnParticle, 600);

// ---- Counter Animation ----
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    if (target >= 1000) {
      el.textContent = Math.floor(current).toLocaleString() + (target === 3000 ? '+' : '');
    } else {
      el.textContent = Math.floor(current) + (target === 100 ? '' : '');
    }
    if (current >= target) clearInterval(timer);
  }, 16);
}

// ---- Intersection Observer for scroll reveals and counters ----
const revealEls = document.querySelectorAll('.reveal');
const statNums  = document.querySelectorAll('.stat-num');
const statsStrip = document.querySelector('.stats-strip');
let countersRun = false;

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersRun) {
      countersRun = true;
      statNums.forEach(el => animateCounter(el));
    }
  });
}, { threshold: 0.5 });

if (statsStrip) counterObserver.observe(statsStrip);

// Auto-add reveal classes to section children (cards etc, NOT headings — handled separately)
document.querySelectorAll('.about-text, .about-visual, .race-card, .green-card, .highlight-card, .partner-tier, .insta-card, .cta-box')
  .forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 3 === 1) el.classList.add('reveal-delay-1');
    if (i % 3 === 2) el.classList.add('reveal-delay-2');
    observer.observe(el);
  });

// ==========================================
// HEADING TYPEWRITER ANIMATIONS
// ==========================================

// -- 1. Section Labels: slide-in + underline sweep --
const labelObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('lbl-visible');
      labelObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });
document.querySelectorAll('.section-label').forEach(el => labelObserver.observe(el));

// -- 2. Section Titles: Text Animations --
function applyTextAnimation(titleEl) {
  if (titleEl.dataset.animApplied) return;
  titleEl.dataset.animApplied = '1';

  const animType = titleEl.dataset.anim || 'typewriter';

  if (animType === 'none') return;

  if (animType === 'typewriter') {
    // Collect child nodes into line groups
    const children = Array.from(titleEl.childNodes);
    const frag = document.createDocumentFragment();
    const CHAR_SPEED = 0.04;
    const LINE_GAP   = 0.15;
    let cumulativeDelay = 0;

    children.forEach((node) => {
      const span = document.createElement('span');
      span.className = 'tw-line';

      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.replace(/\n/g, '').trim();
        if (!text) return;
        span.textContent = text;
        const dur = Math.max(0.4, text.length * CHAR_SPEED);
        span.style.setProperty('--tw-dur', dur + 's');
        span.style.setProperty('--tw-delay', cumulativeDelay + 's');
        cumulativeDelay += dur + LINE_GAP;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const clone = node.cloneNode(true);
        span.appendChild(clone);
        const text = node.textContent;
        const dur = Math.max(0.4, text.length * CHAR_SPEED);
        span.style.setProperty('--tw-dur', dur + 's');
        span.style.setProperty('--tw-delay', cumulativeDelay + 's');
        cumulativeDelay += dur + LINE_GAP;
      } else {
        return;
      }
      frag.appendChild(span);
    });

    titleEl.innerHTML = '';
    titleEl.appendChild(frag);

    const lines = titleEl.querySelectorAll('.tw-line');
    if (lines.length) {
      lines[lines.length - 1].classList.add('tw-cursor');
      const lastLine = lines[lines.length - 1];
      const lastDelay  = parseFloat(lastLine.style.getPropertyValue('--tw-delay') || 0);
      const lastDur    = parseFloat(lastLine.style.getPropertyValue('--tw-dur') || 0.8);
      setTimeout(() => lastLine.classList.add('tw-done'), (lastDelay + lastDur + 0.2) * 1000);
    }
  } else {
    // Other animations: split by word
    const children = Array.from(titleEl.childNodes);
    const frag = document.createDocumentFragment();
    let wordIndex = 0;

    children.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.textContent.split(' ');
        words.forEach(word => {
          if (!word.trim()) { frag.appendChild(document.createTextNode(' ')); return; }
          const span = document.createElement('span');
          span.className = `anim-word ${animType}`;
          span.textContent = word;
          span.style.animationDelay = (wordIndex * 0.1) + 's';
          frag.appendChild(span);
          frag.appendChild(document.createTextNode(' '));
          wordIndex++;
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const clone = node.cloneNode(true);
        clone.className = (clone.className + ` anim-word ${animType}`).trim();
        clone.style.animationDelay = (wordIndex * 0.1) + 's';
        frag.appendChild(clone);
        frag.appendChild(document.createTextNode(' '));
        wordIndex++;
      }
    });

    titleEl.innerHTML = '';
    titleEl.appendChild(frag);
  }
}

const titleObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const titleEl = entry.target;
      applyTextAnimation(titleEl);
      requestAnimationFrame(() => {
        titleEl.querySelectorAll('.tw-line').forEach(line => line.classList.add('tw-animate'));
        titleEl.querySelectorAll('.anim-word').forEach(word => word.classList.add('anim-animate'));
      });
      titleObserver.unobserve(titleEl);
    }
  });
}, { threshold: 0.35 });
document.querySelectorAll('.section-title').forEach(el => titleObserver.observe(el));

// -- 3. Section Subtitles: delayed slide-up --
const subtitleObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('sub-visible');
      subtitleObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.section-subtitle').forEach(el => subtitleObserver.observe(el));

// Also animate the CTA h2 like a section-title
document.querySelectorAll('.cta-text h2').forEach(el => {
  el.classList.add('section-title');
  el.dataset.anim = 'bounce-in';
  titleObserver.observe(el);
});

// ---- Notify form ----
const notifyForm = document.getElementById('notifyForm');
const toast      = document.getElementById('toast');

function showToast(msg, color) {
  toast.textContent = msg;
  toast.style.background = color || '#1a7a3c';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

if (notifyForm) {
  notifyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('notifyEmail').value.trim();
    if (!email) return;
    notifyForm.reset();
    showToast('Thank you! We will notify you when registration opens.', '#1a7a3c');
  });
}

// ---- Smooth active nav highlight ----
const sections = document.querySelectorAll('section[id], footer[id]');
const navAs    = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAs.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === '#' + id) {
          a.style.color = 'var(--blue-glow)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => sectionObserver.observe(sec));

// ---- Race card tilt effect ----
document.querySelectorAll('.race-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -12;
    card.style.transform = `translateY(-8px) rotateX(${y}deg) rotateY(${x}deg)`;
    card.style.perspective = '800px';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ---- Instagram cards hover ----
document.querySelectorAll('.insta-card').forEach(card => {
  card.addEventListener('click', () => {
    window.open('https://instagram.com', '_blank', 'noopener,noreferrer');
  });
});
