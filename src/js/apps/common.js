(function () {
  'use strict';

  const gnbLink = document.querySelectorAll('.gnb_link');
  const btnMenu = document.querySelector('.btn_menu');

  const header = document.querySelector('header');
  const mainKv = document.querySelector('.sec_main_kv');

  let canHide = !mainKv;

  // Mobile 체크
  const isMobile = () => {
    return window.innerWidth <= 1024;
  };

  const lenis = new Lenis({
    autoRaf: false,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    duration: 0.8,
  });

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  window.lenis = lenis;

  if (mainKv) {
    ScrollTrigger.create({
      trigger: '.sec_main_kv',
      start: 'bottom -5%',
      onEnter: () => {
        canHide = true;
      },
      onLeaveBack: () => {
        canHide = false;
        header.classList.remove('is_hidden');
      },
    });
  }

  const btnTop = document.querySelector('.btn_top');
  const footer = document.querySelector('.footer');

  if (btnTop) {
    btnTop.addEventListener('click', () => {
      if (window.lenis) {
        window.lenis.scrollTo(0, { force: true });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  const updateBtnTop = () => {
    if (!btnTop) return;
    const scrollY = window.lenis ? window.lenis.scroll : window.scrollY;

    if (scrollY >= window.innerHeight) {
      btnTop.classList.add('is_show');
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const gapPx = isMobile() ? 20 : (40 * 100 / 1920) * (window.innerWidth / 100);
        const defaultBottomPx = isMobile() ? 20 : (40 * 100 / 1920) * (window.innerWidth / 100);
        const footerBasedBottom = window.innerHeight - footerRect.top + gapPx;
        btnTop.style.bottom = `${Math.max(defaultBottomPx, footerBasedBottom)}px`;
      } else {
        btnTop.style.bottom = '';
      }
    } else {
      btnTop.classList.remove('is_show');
      btnTop.style.bottom = '';
    }
  };

  let holdHeaderVisibility = false;
  let holdHeaderTimer;

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.btn_unit')) return;
    holdHeaderVisibility = true;
    window.clearTimeout(holdHeaderTimer);
    holdHeaderTimer = window.setTimeout(() => {
      holdHeaderVisibility = false;
    }, 800);
  });

  lenis.on('scroll', ({ direction }) => {
    ScrollTrigger.update();
    updateBtnTop();

    if (!canHide || holdHeaderVisibility) return;

    if (isMobile() && header.classList.contains('is_open')) {
      return;
    }

    if(scrollY < 60) {
      header.classList.remove('is_hidden');
      return;
    }

    if (direction === 1) {
      if (!header.classList.contains('is_hidden')) {
        header.classList.add('is_hidden');
      }
    } else if (direction === -1) {
      if (header.classList.contains('is_hidden')) {
        header.classList.remove('is_hidden');
      }
    }
  });

  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
    lenis.resize();
    updateBtnTop();
  });

  window.addEventListener('resize', () => {
    updateBtnTop();
    if (!isMobile()) {
      lenis.start();
      header.classList.remove('is_hidden');
      btnMenu.setAttribute('aria-expanded', false);
      btnMenu.setAttribute('aria-label', '메뉴 열기');
    }
  });

  // GNB 모바일
  if (btnMenu && header) {
    btnMenu.addEventListener('click', (e) => {
      const isExpanded = btnMenu.getAttribute('aria-expanded') === 'true';
      btnMenu.setAttribute('aria-expanded', !isExpanded);
      if (isExpanded) {
        btnMenu.setAttribute('aria-label', '메뉴 열기');
        lenis.start();
      } else {
        btnMenu.setAttribute('aria-label', '메뉴 닫기');
        lenis.stop();
      }
      header.classList.toggle('is_open');
    });
  }

  if (gnbLink.length > 0) {
    gnbLink.forEach((link) => {
      link.addEventListener('click', (e) => {
        if (isMobile()) {
          e.preventDefault();
          gnbLink.forEach((l) => {
            l.classList.remove('is_open');
          });
          link.classList.toggle('is_open');
        }
      });
    });
  }
})();
