(function () {
  'use strict';

  const gnbLink = document.querySelectorAll('.gnb_link');
  const btnMenu = document.querySelector('.btn_menu');
  const btnFamilySite = document.querySelector('.btn_family_site');
  const btnSearch = document.querySelector('.header .btn_search');
  const boxSearch = document.querySelector('.header .box_search');
  const btnSearchClose = document.querySelector('.header .box_search .btn_close');

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

  lenis.on('scroll', ({ direction }) => {
    ScrollTrigger.update();
    updateBtnTop();

    if (!canHide) return;

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
    if (!isMobile() && !boxSearch.classList.contains('is_show')) {
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

  // Footer Family Site
  if (btnFamilySite) {
    btnFamilySite.addEventListener('click', (e) => {
      const isExpanded = btnFamilySite.getAttribute('aria-expanded') === 'true';

      btnFamilySite.setAttribute('aria-expanded', !isExpanded);
      btnFamilySite.classList.toggle('is_open');
    });
  }

  // 검색
  btnSearch.addEventListener('click', () => {
    boxSearch.classList.add('is_show');
    header.classList.remove('is_open');
    lenis.stop();
  });

  btnSearchClose.addEventListener('click', () => {
    boxSearch.classList.remove('is_show');
    lenis.start();
  });


  document.addEventListener('click', (e) => {
    if (
      boxSearch.classList.contains('is_show') &&
      !boxSearch.contains(e.target) &&
      !btnSearch.contains(e.target)
    ) {
      boxSearch.classList.remove('is_show');
      lenis.start();
    }
  });
})();
