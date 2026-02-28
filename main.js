/* =====================================================
   ABUJA SCENT — Minimal JS
   Handles: Scroll reveal, sticky nav, hamburger menu
   ===================================================== */

(function () {
  'use strict';

  // ===== STICKY NAVBAR =====
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // ===== HAMBURGER MENU =====
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active');
  });
  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });

  // ===== SCROLL REVEAL =====
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger sibling reveals
          const siblings = entry.target.parentElement.querySelectorAll('.reveal:not(.visible)');
          let delay = 0;
          siblings.forEach(sibling => {
            if (sibling === entry.target || entry.target.contains(sibling)) {
              setTimeout(() => sibling.classList.add('visible'), delay);
              delay += 80;
            }
          });
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealElements.forEach(el => observer.observe(el));

  // ===== SMOOTH SCROLL for nav anchors =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ===== FLOATING WA SHOW AFTER SCROLL =====
  const floatingWa = document.querySelector('.floating-wa');
  floatingWa.style.opacity = '0';
  floatingWa.style.transform = 'scale(0.8)';
  floatingWa.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  setTimeout(() => {
    floatingWa.style.opacity = '1';
    floatingWa.style.transform = 'scale(1)';
  }, 2000);

  // ===== GOLD NUMBER COUNTER ANIMATION =====
  const animateCounters = () => {
    document.querySelectorAll('.stat-num').forEach(el => {
      const text = el.innerText;
      const num = parseFloat(text.replace(/[^0-9.]/g, ''));
      if (!num) return;
      const suffix = text.replace(/[0-9.]/g, '');
      const duration = 1500;
      const start = performance.now();
      const update = (time) => {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.innerText = (num * eased).toFixed(num % 1 === 0 ? 0 : 0) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    });
  };

  // Trigger counter when problem section visible
  const problemSection = document.querySelector('.problem');
  if (problemSection) {
    const counterObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateCounters();
        counterObserver.disconnect();
      }
    }, { threshold: 0.4 });
    counterObserver.observe(problemSection);
  }

})();
