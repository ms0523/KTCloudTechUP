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

  /* ---------- Intro ---------- */
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

  /* ---------- TECH UP PROCESS  ---------- */
  const tabButtons = document.querySelectorAll('.tabs__btn');
  const tabPanels = document.querySelectorAll('.tabs__panel');
  let projectSwiper = null;

  function initActiveSwiper() {
    const activePanel = document.querySelector('.tabs__panel.active');
    if (!activePanel) return;
    const swiperTarget = activePanel.querySelector('.project-swiper');
    if (!swiperTarget) return;

    if (projectSwiper) {
      projectSwiper.destroy(true, true);
      projectSwiper = null;
    }

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

  initActiveSwiper();

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      if (projectSwiper) {
        projectSwiper.destroy(true, true);
        projectSwiper = null;
      }

      tabButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      tabPanels.forEach((panel) => {
        panel.classList.toggle('active', panel.dataset.panel === target);
      });

      setTimeout(() => {
        initActiveSwiper();
      }, 100);
    });
  });

  

  document.addEventListener("DOMContentLoaded", () => {
  // 관찰할 대상들 (도형들)
  const targets = document.querySelectorAll('.bg-Focus, .bg-Cylinder, .bg-Pyramid, .bg-Thorus');

  const observerOptions = {
    root: null, // 뷰포트 기준
    threshold: 0.2 // 20% 진입 시
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('bg-active');
        // 애니메이션 한 번만 실행하고 싶다면 아래 주석 해제
        // observer.unobserve(entry.target); 
      } else {
        entry.target.classList.remove('bg-active');
      }
    });
  }, observerOptions);

  targets.forEach(target => observer.observe(target));
});

/* ---------- PORTFOLIO  ---------- */
function initPortfolioSliders() {
  const portfolioItems = document.querySelectorAll('.js-portfolio-item');
  
  if (portfolioItems.length === 0) {
    console.log("포트폴리오 아이템을 찾지 못했습니다. 클래스명을 확인해주세요.");
    return;
  }

  portfolioItems.forEach((item) => {
    const prevBtn = item.querySelector('.btn-prev');
    const nextBtn = item.querySelector('.btn-next');
    const images = item.querySelectorAll('.portfolio__thumb img');
    
    if (images.length <= 1) return;

    let currentIndex = 0; // 현재 보여지는 이미지의 인덱스 번호

    function changeImage(index) {
      images.forEach(img => img.classList.remove('active'));
      images[index].classList.add('active');
    }

    if (nextBtn) {
      nextBtn.onclick = (e) => {
        e.preventDefault(); // 링크 이동 방지
        currentIndex++;
        if (currentIndex >= images.length) currentIndex = 0;
        changeImage(currentIndex);
      };
    }

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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPortfolioSliders);
} else {
  initPortfolioSliders();
}

/* ---------- TESTIMONIAL  ---------- */
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

/* ---------- CURRICULUM ---------- */
document.querySelectorAll('.timeline li').forEach((li) => {
  li.addEventListener('click', () => {
    document.querySelectorAll('.timeline li').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.curriculum__detail-item').forEach(el => el.classList.remove('active'));

    li.classList.add('active');

    const index = li.getAttribute('data-index');
    document.querySelectorAll('.curriculum__detail-item')[index].classList.add('active');
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const timelineItems = document.querySelectorAll('.timeline li');
  const detailItems = document.querySelectorAll('.curriculum__detail-item');

  timelineItems.forEach((li, index) => {
    li.addEventListener('click', () => {
      
      timelineItems.forEach(item => item.classList.remove('active'));
      detailItems.forEach(item => item.classList.remove('active'));

      li.classList.add('active');
      
      if (detailItems[index]) {
        detailItems[index].classList.add('active');
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const timelineItems = document.querySelectorAll('.timeline li');
  const detailItems = document.querySelectorAll('.curriculum__detail-item');

  timelineItems.forEach((li) => {
    li.addEventListener('click', () => {
      const targetIndex = li.dataset.index;

      timelineItems.forEach(item => item.classList.remove('active'));
      li.classList.add('active');

      detailItems.forEach((detail) => {
        if (detail.dataset.index === targetIndex) {
          detail.classList.add('active');
        } else {
          detail.classList.remove('active');
        }
      });
    });
  });
});

/* career status */
const counters = document.querySelectorAll('.count');

const runCounter = () => {
  counters.forEach(counter => {
    // 1. 애니메이션 시작 전 항상 0으로 초기화
    counter.innerText = '30';
    
    const target = parseInt(counter.getAttribute('data-target')) || 0;
    const updateCount = () => {
      const current = parseInt(counter.innerText) || 0;
      const inc = target / 50;

      if (current < target) {
        counter.innerText = Math.ceil(current + inc);
        setTimeout(updateCount, 50);
      } else {
        counter.innerText = target;
      }
    };
    updateCount();
  });
};

// IntersectionObserver 설정
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // 2. 화면에 들어올 때마다 매번 실행
      runCounter();
    } else {
      // 3. 화면 밖으로 나가면 숫자를 0으로 초기화 (다시 들어올 때 재생을 위해)
      counters.forEach(counter => counter.innerText = '0');
    }
  });
}, { threshold: 0.5 }); // 화면의 50%가 보일 때 실행

const statsSection = document.querySelector('.stats');
if (statsSection) observer.observe(statsSection);
  

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