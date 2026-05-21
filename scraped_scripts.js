// === SCRIPT ===

// ─── NAVBAR SCROLL ───
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 60) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

// ─── IMAGE SLIDESHOW ───
(function() {
  const TOTAL = 8;
  const INTERVAL = 2000;
  let current = 0;
  let autoTimer = null;

  function goToSlide(index) {
    current = ((index % TOTAL) + TOTAL) % TOTAL;
    const track = document.getElementById('slideTrack');
    if (track) {
      track.style.transition = 'transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      track.style.animation = 'none';
      track.style.transform = `translateX(-${current * 12.5}%)`;
    }
    document.querySelectorAll('.slide-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  window.goToSlide = goToSlide;

  function startAuto() {
    autoTimer = setInterval(() => {
      const next = (current + 1) % TOTAL;
      goToSlide(next);
    }, INTERVAL);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('slideTrack');
    if (track) {
      track.style.animation = 'none';
      track.style.transform = 'translateX(0)';
      startAuto();
    }
  });
})();

// ─── MOBILE MENU ───
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

// ─── BACK TO TOP ───
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
window.addEventListener('scroll', () => {
  const btn = document.getElementById('back-top');
  if (window.scrollY > 400) btn.classList.add('visible');
  else btn.classList.remove('visible');
});

// ─── SCROLL REVEAL ───
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), 80);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ─── SMOOTH NAV ───
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ─── TABS ───
function showTab(id) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  event.target.classList.add('active');
}

// ─── COUNTER ANIMATION ───
const counters = document.querySelectorAll('.stat-num');
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'));
      if (target) {
        let count = 0;
        const inc = target / 60;
        const timer = setInterval(() => {
          count += inc;
          if (count >= target) { el.textContent = target + '+'; clearInterval(timer); }
          else el.textContent = Math.floor(count) + '+';
        }, 25);
      }
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObs.observe(c));

