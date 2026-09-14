(function () {
  'use strict';
  const animate = document.querySelectorAll('.animate');

  const secMagazine = document.querySelectorAll('.sec_main_magazine');

  const listBrand = document.querySelector('.sec_main_brand .list_brand');

  // 공통 애니메이션
  if (animate.length > 0) {
    const animateObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is_show');
          animateObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    animate.forEach((item) => {
      animateObserver.observe(item);
    });
  }


  const isMainPage = document.querySelector('.sec_main_kv');
  if (!isMainPage) return;

  const header = document.querySelector('.header');
  const kvSection = document.querySelector('.sec_main_kv');
  const kvImg = document.querySelector('.list_kv_img');
  const visionSection = document.querySelector('.sec_main_vision');

  // Main KV - 스크롤에 따라 scale + fade out
  const handleKvScroll = () => {
    if (!kvImg) return;
    const sectionHeight = kvSection.offsetHeight;
    const scrollY = window.scrollY;

    if (scrollY <= 0) {
      kvImg.style.transform = 'scale(1)';
      kvImg.style.opacity = '1';
      return;
    }

    if (scrollY >= sectionHeight) return;

    const progress = Math.min(1, Math.max(0, scrollY / sectionHeight));
    const scale = 1 + progress * 0.5;
    const opacity = 1 - progress;

    kvImg.style.transform = `scale(${scale})`;
    kvImg.style.opacity = `${opacity}`;
  };

  // 비전 제시 - 헤더 클래스 토글
  const handleVisionScroll = () => {
    if (!visionSection) return;
    const rect = visionSection.getBoundingClientRect();

    if (rect.top <= 0) {
      header.classList.remove('type_main');
    } else {
      header.classList.add('type_main');
    }
  };

  window.addEventListener('scroll', () => {
    handleKvScroll();
    handleVisionScroll();
  }, { passive: true });

  window.addEventListener('load', () => {
    handleKvScroll();
    handleVisionScroll();
  });

  // 삶의 가치 & 브랜드 경험
  if (secMagazine.length > 0) {
    const magazineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.classList.contains('is_show')) {
          entry.target.classList.add('is_show');
          magazineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -100% 0px' });

    secMagazine.forEach((section) => {
      magazineObserver.observe(section);
    });
  }

  // 비전 제시 스와이퍼 (이미지 + 텍스트 동기화)
  const visionImgEl = document.querySelector('.sec_main_vision .box_vision_swiper');
  if (visionImgEl) {
    const visionShared = {
      slidesPerView: 1,
      spaceBetween: 0,
      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },
      speed: 700,
      allowTouchMove: false,
    };

    const visionTextSwiper = document.querySelector('.sec_main_vision .box_vision_text')
      ? new Swiper('.sec_main_vision .box_vision_text', {
          ...visionShared,
          autoHeight: true,
        })
      : null;
    const visionSubSwiper = document.querySelector('.sec_main_vision .box_vision_sub')
      ? new Swiper('.sec_main_vision .box_vision_sub', {
          ...visionShared,
          autoHeight: true,
        })
      : null;

    const updateVisionTextHeight = () => {
      visionTextSwiper?.updateAutoHeight(300);
      visionSubSwiper?.updateAutoHeight(300);
    };

    const visionMq = window.matchMedia('(min-width: 1025px)');
    const getVisionPaginationType = () => (visionMq.matches ? 'fraction' : 'bullets');

    const visionImgSwiper = new Swiper(visionImgEl, {
      ...visionShared,
      allowTouchMove: true,
      pagination: {
        el: '.sec_main_vision .swiper-pagination',
        type: getVisionPaginationType(),
        clickable: true,
      },
      navigation: {
        nextEl: '.sec_main_vision .btn_next',
        prevEl: '.sec_main_vision .btn_prev',
      },
      controller: {
        control: [visionTextSwiper, visionSubSwiper].filter(Boolean),
      },
      on: {
        init: updateVisionTextHeight,
        slideChangeTransitionStart: updateVisionTextHeight,
      },
    });

    const syncVisionPagination = () => {
      const nextType = getVisionPaginationType();
      if (visionImgSwiper.params.pagination.type === nextType) return;

      visionImgSwiper.params.pagination.type = nextType;
      visionImgSwiper.originalParams.pagination.type = nextType;
      visionImgSwiper.pagination.destroy();
      visionImgSwiper.pagination.init();
      visionImgSwiper.pagination.render();
      visionImgSwiper.pagination.update();
    };

    if (typeof visionMq.addEventListener === 'function') {
      visionMq.addEventListener('change', syncVisionPagination);
    } else {
      visionMq.addListener(syncVisionPagination);
    }

    // fade + autoHeight 초기 높이 보정
    requestAnimationFrame(updateVisionTextHeight);
    window.addEventListener('load', updateVisionTextHeight, { once: true });
  }

  // 브랜드 정의
  const brandSection = document.querySelector('.sec_main_brand');
  const brandList = document.querySelector('.sec_main_brand .list_brand');
  const brandWrapper = brandList?.querySelector('.swiper-wrapper');

  if (brandList) {
    new Swiper(brandList, {
      slidesPerView: 'auto',
      spaceBetween: 8,
      enabled: true,
      navigation: {
        nextEl: '.sec_main_brand .btn_next',
        prevEl: '.sec_main_brand .btn_prev',
      },
      breakpoints: {
        1025: {
          enabled: false,
          spaceBetween: 0,
        },
      },
    });
  }

  // PC: pin section + horizontal scroll items
  if (brandSection && brandList && brandWrapper) {
    ScrollTrigger.matchMedia({
      '(min-width: 1025px)': function () {
        const getScrollDistance = () =>
          Math.max(0, brandWrapper.scrollWidth - brandList.clientWidth);

        const tween = gsap.to(brandWrapper, {
          x: () => -getScrollDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: brandSection,
            // padding 128 유지, pin 시 상단 여백만 약 54px
            start: () => {
              const padTop = parseFloat(getComputedStyle(brandSection).paddingTop) || 0;
              return `top+=${Math.max(0, padTop - 54)} top`;
            },
            end: () => '+=' + getScrollDistance(),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        requestAnimationFrame(function () { ScrollTrigger.refresh(); });

        return function () {
          if (tween.scrollTrigger) tween.scrollTrigger.kill();
          tween.kill();
          gsap.set(brandWrapper, { clearProps: 'transform' });
        };
      },
    });
  }

  if (listBrand) {
    const brandObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          listBrand.classList.add('is_show');
          brandObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    brandObserver.observe(listBrand);
  }

  // 유닛 타입 아코디언
  const unitSection = document.querySelector('.sec_main_unit');
  if (unitSection) {
    const unitImg = unitSection.querySelector('.img_unit_bg');
    const unitItems = unitSection.querySelectorAll('.item_unit');

    const openUnitItem = (item) => {
      unitItems.forEach((el) => {
        const isTarget = el === item;
        el.classList.toggle('is_active', isTarget);
        const btn = el.querySelector('.btn_unit');
        if (btn) btn.setAttribute('aria-expanded', isTarget ? 'true' : 'false');
      });

      const nextSrc = item.getAttribute('data-img');
      // PC: 좌측 이미지 교체 / MO: 아코디언 내부 이미지 사용
      if (unitImg && nextSrc && window.innerWidth > 1024 && unitImg.getAttribute('src') !== nextSrc) {
        unitImg.style.opacity = '0';
        window.setTimeout(() => {
          unitImg.setAttribute('src', nextSrc);
          unitImg.style.opacity = '1';
        }, 320);
      }
    };

    unitItems.forEach((item) => {
      const btn = item.querySelector('.btn_unit');
      if (!btn) return;
      btn.addEventListener('click', () => {
        if (item.classList.contains('is_active')) return;
        openUnitItem(item);
      });
    });
  }
})();
