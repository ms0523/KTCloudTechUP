document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const topNav = document.getElementById('topNav');
  if (navToggle && topNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = topNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  /* ---------- Team project tabs ---------- */
  const tabButtons = document.querySelectorAll('.tabs__btn');
  const tabPanels = document.querySelectorAll('.tabs__panel');
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      tabPanels.forEach((panel) => {
        panel.classList.toggle('active', panel.dataset.panel === target);
      });
    });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq__item').forEach((item) => {
    item.addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });

  /* ---------- Sub nav active link on scroll ---------- */
  const subNavLinks = document.querySelectorAll('.sub-nav__link');
  const sections = Array.from(subNavLinks)
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const setActiveLink = () => {
    const scrollPos = window.scrollY + 140;
    let currentIndex = 0;
    sections.forEach((section, i) => {
      if (section.offsetTop <= scrollPos) currentIndex = i;
    });
    subNavLinks.forEach((link, i) => {
      link.classList.toggle('active', i === currentIndex);
    });
  };
  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ---------- Close mobile nav after click ---------- */
  document.querySelectorAll('.sub-nav__link, .top-nav a').forEach((link) => {
    link.addEventListener('click', () => {
      topNav?.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Back to top ---------- */
  const toTop = document.getElementById('toTop');
  if (toTop) {
    window.addEventListener('scroll', () => {
      toTop.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});