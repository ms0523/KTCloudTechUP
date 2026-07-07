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

  /* ---------- Sub Navigation Sticky ---------- */
  const subNav = document.getElementById('subNav');
  const subNavSpacer = document.getElementById('subNavSpacer');
  const heroSection = document.querySelector('.hero');

  if (subNav && subNavSpacer && heroSection) {
    let stickyPoint = heroSection.offsetTop + heroSection.offsetHeight - subNav.offsetHeight;

    const recalcStickyPoint = () => {
      if (!subNav.classList.contains('is-fixed')) {
        stickyPoint = heroSection.offsetTop + heroSection.offsetHeight - subNav.offsetHeight;
      }
    };

    const updateSubNavState = () => {
      const shouldBeFixed = window.scrollY >= stickyPoint;
      const isFixed = subNav.classList.contains('is-fixed');

      if (shouldBeFixed && !isFixed) {
        // .hero의 isolation: isolate 때문에 fixed여도 안에 갇히는 걸 방지하려고
        // body로 잠깐 옮겼다가, 풀리면 다시 hero 안으로 되돌림
        document.body.appendChild(subNav);
        subNav.classList.add('is-fixed');
        subNavSpacer.classList.add('active');
      } else if (!shouldBeFixed && isFixed) {
        heroSection.appendChild(subNav);
        subNav.classList.remove('is-fixed');
        subNavSpacer.classList.remove('active');
      }
    };

    window.addEventListener('scroll', updateSubNavState, { passive: true });
    window.addEventListener('resize', () => {
      recalcStickyPoint();
      updateSubNavState();
    });
    updateSubNavState();
  }

  /* ---------- 💡 Intro Character Animation (화면 진입 시 매번 전체 재생 버전) ---------- */
  const introSection = document.querySelector('.intro');
  if (introSection) {
    
    const introObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 1. 화면에 들어오면 혹시 남아있을지 모를 클래스를 먼저 지우고
            introSection.classList.remove('is-active');
            
            // 2. 브라우저에게 초기화 상태를 확실히 인지시킨 뒤 (렌더링 리플로우)
            void introSection.offsetWidth; 
            
            // 3. 클래스를 딱 붙여서 캐릭터와 말풍선 전체가 동시에 날아오게 합니다.
            introSection.classList.add('is-active');
          } else {
            // 4. 💡 화면 밖으로 완전히 벗어나면 클래스를 미리 제거해 둡니다. (다음 진입 시 재실행 대기)
            introSection.classList.remove('is-active');
          }
        });
      },
      { 
        /* 캐릭터 무대가 화면에 20%(0.2) 정도 보이기 시작할 때 애니메이션 가동 */
        threshold: 0.3
      }
    );

    // 감시 카메라 작동 시작
    introObserver.observe(introSection);
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

