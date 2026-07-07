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

  /* ---------- 💡 Intro Character Animation ---------- */
  const introSection = document.querySelector('.intro');
  if (introSection) {
    const introObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            introSection.classList.remove('is-active');
            void introSection.offsetWidth; 
            introSection.classList.add('is-active');
          } else {
            introSection.classList.remove('is-active');
          }
        });
      },
      { threshold: 0.3 }
    );
    introObserver.observe(introSection);
  }

  /* ---------- ✨ TECH UP PROCESS (멀티 탭 Swiper 완벽 수정본) ---------- */
  const tabButtons = document.querySelectorAll('.tabs__btn');
  const tabPanels = document.querySelectorAll('.tabs__panel');
  let projectSwiper = null;

  // 활성화된 탭 패널 내부의 Swiper만 조준해서 초기화하는 함수
  function initActiveSwiper() {
    // 1. 현재 active 클래스가 붙은 패널을 찾습니다.
    const activePanel = document.querySelector('.tabs__panel.active');
    if (!activePanel) return;

    // 2. 그 패널 '내부'에 있는 스위퍼 엘리먼트를 찾습니다.
    const swiperTarget = activePanel.querySelector('.project-swiper');
    if (!swiperTarget) return;

    // 3. 기존에 돌아가던 Swiper 인스턴스가 있다면 파괴
    if (projectSwiper) {
      projectSwiper.destroy(true, true);
      projectSwiper = null;
    }

    // 4. 찾은 타겟에만 정확하게 Swiper를 입혀줍니다.
    projectSwiper = new Swiper(swiperTarget, {
      slidesPerView: 'auto',
      spaceBetween: 16,
      loop: true,
      speed: 5000,
      allowTouchMove: false,
      observeParents: true,
      observer: true,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
    });
  }

  // 첫 페이지 로드 시 (첫 번째 탭 기본 실행)
  initActiveSwiper();

  // 탭 버튼 클릭 기능
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      // 1. 기존 슬라이더 안전하게 파괴
      if (projectSwiper) {
        projectSwiper.destroy(true, true);
        projectSwiper = null;
      }

      // 2. 탭 활성화 클래스 교체
      tabButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      tabPanels.forEach((panel) => {
        panel.classList.toggle('active', panel.dataset.panel === target);
      });

      // 3. 탭이 완전히 바뀌어 display: flex가 반영된 후(100ms 지연) 해당 패널 슬라이더 켜기
      setTimeout(() => {
        initActiveSwiper();
      }, 100);
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