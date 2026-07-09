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

  

// 포트폴리오 이미지 슬라이더 기능
function initPortfolioSliders() {
  // 1. 페이지 내 모든 프로젝트 카드(.js-portfolio-item)를 선택합니다.
  const portfolioItems = document.querySelectorAll('.js-portfolio-item');
  
  if (portfolioItems.length === 0) {
    console.log("포트폴리오 아이템을 찾지 못했습니다. 클래스명을 확인해주세요.");
    return;
  }

  portfolioItems.forEach((item) => {
    // 2. 현재 카드 안의 이전/다음 버튼과 이미지들을 찾습니다.
    const prevBtn = item.querySelector('.btn-prev');
    const nextBtn = item.querySelector('.btn-next');
    const images = item.querySelectorAll('.portfolio__thumb img');
    
    // 3. 만약 이미지가 없거나 1장 이하라면 슬라이더 기능을 실행하지 않습니다.
    if (images.length <= 1) return;

    let currentIndex = 0; // 현재 보여지는 이미지의 인덱스 번호

    // 4. 활성화된 이미지를 변경해주는 핵심 함수
    function changeImage(index) {
      images.forEach(img => img.classList.remove('active'));
      images[index].classList.add('active');
    }

    // 👉 오른쪽(다음) 버튼 클릭 시
    if (nextBtn) {
      nextBtn.onclick = (e) => {
        e.preventDefault(); // 링크 이동 방지
        currentIndex++;
        if (currentIndex >= images.length) currentIndex = 0;
        changeImage(currentIndex);
      };
    }

    // 👈 왼쪽(이전) 버튼 클릭 시
    if (prevBtn) {
      prevBtn.onclick = (e) => {
        e.preventDefault(); // 링크 이동 방지
        currentIndex--;
        if (currentIndex < 0) currentIndex = images.length - 1;
        changeImage(currentIndex);
      };
    }
  });
}

// 브라우저가 준비되면 실행하되, 혹시 모르니 즉시 실행도 걸어둡니다.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPortfolioSliders);
} else {
  initPortfolioSliders();
}


// 후기 슬라이더
const testimonialSwiper = new Swiper('.testimonial-swiper', {
  slidesPerView: 'auto',
  spaceBetween: 16,
  loop: true,
  speed: 6000,
  allowTouchMove: true,
  observeParents: true,
  observer: true,
  autoplay: {
    delay: 0,
    disableOnInteraction: true,
    pauseOnMouseEnter: true,
  },
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


/* ---------- FAQ accordion ---------- */
document.querySelectorAll('.faq__item').forEach((item) => {
  item.addEventListener('click', () => {
    // 1. 클릭된 버튼에서 가장 가까운 부모 상자(.faq__block)를 찾습니다.
    const currentBlock = item.closest('.faq__block');
    
    if (currentBlock) {
      // 2. 부모 상자에 CSS와 약속된 'is-open' 클래스를 토글합니다.
      currentBlock.classList.toggle('is-open');
    }
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