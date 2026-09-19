/* PAGE LOADER */
(function(){
  var loader = document.getElementById("page-loader");
  var pctEl  = document.getElementById("ldrPct");
  var pct = 0, hidden = false;
  var counter = setInterval(function(){
    if(hidden){clearInterval(counter);return;}
    pct = Math.min(pct + Math.random()*4.5, 99);
    if(pctEl) pctEl.textContent = Math.floor(pct)+"%";
  }, 75);
  function hide(){
    if(hidden) return;
    hidden = true;
    clearInterval(counter);
    if(pctEl) pctEl.textContent = "100%";
    setTimeout(function(){
      if(loader){ loader.classList.add("ldr-hidden"); }
      setTimeout(function(){ if(loader) loader.style.display="none"; }, 700);
    }, 300);
  }
  var minT = setTimeout(hide, 2200);
  window.addEventListener("load", function(){ clearTimeout(minT); setTimeout(hide, 400); });
})();

﻿/* ==========================================
   XAVATHON 2027 - SCRIPT.JS
   ========================================== */

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
// Target: 1st March 2027
const target = new Date('2027-03-01T06:00:00');
const cdDays  = document.getElementById('cd-days');
const cdHours = document.getElementById('cd-hours');
const cdMins  = document.getElementById('cd-mins');
const cdSecs  = document.getElementById('cd-secs');

function pad(n, width) {
  const s = String(n);
  return s.length >= width ? s : '0'.repeat(width - s.length) + s;
}

function updateCountdown() {
  const now  = new Date();
  const diff = target - now;
  if (diff <= 0) {
    cdDays.textContent = '000';
    cdHours.textContent = '00';
    cdMins.textContent  = '00';
    cdSecs.textContent  = '00';
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000)  / 60000);
  const s = Math.floor((diff % 60000)    / 1000);
  cdDays.textContent  = pad(d, 3);
  cdHours.textContent = pad(h, 2);
  cdMins.textContent  = pad(m, 2);
  cdSecs.textContent  = pad(s, 2);
}
updateCountdown();
setInterval(updateCountdown, 1000);

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

// Auto-add reveal classes to section children
document.querySelectorAll('.section-title, .section-label, .section-subtitle, .about-text, .about-visual, .race-card, .green-card, .highlight-card, .partner-tier, .insta-card, .cta-box')
  .forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 3 === 1) el.classList.add('reveal-delay-1');
    if (i % 3 === 2) el.classList.add('reveal-delay-2');
    observer.observe(el);
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
          a.style.color = 'var(--green-glow)';
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
