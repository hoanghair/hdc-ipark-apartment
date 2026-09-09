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

  // 브랜드 경험
  const swiper = new Swiper('.sec_main_brand .list_brand', {
    slidesPerView: 'auto',
    spaceBetween: 8,
    enabled: true,
    navigation: {
      nextEl: '.sec_main_brand  .btn_next',
      prevEl: '.sec_main_brand  .btn_prev',
    },
    breakpoints: {
      1025: {
        enabled: false,
        spaceBetween: 0,
      },
    },
  });

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
})();
