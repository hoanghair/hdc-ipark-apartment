(function () {
  'use strict';

  const POPUP_HIDE_KEY = 'ipark_popup_hide_date';
  const popupEl = document.querySelector('.popup');
  if (!popupEl) return;

  const popupClose = popupEl.querySelector('.btn_close');
  const popupToday = popupEl.querySelector('#popup_today');

  const getTodayKey = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const shouldHideToday = () => {
    try {
      return localStorage.getItem(POPUP_HIDE_KEY) === getTodayKey();
    } catch (e) {
      return false;
    }
  };

  const setHideToday = () => {
    try {
      localStorage.setItem(POPUP_HIDE_KEY, getTodayKey());
    } catch (e) {
      // ignore storage errors
    }
  };

  const closePopup = () => {
    if (popupToday && popupToday.checked) {
      setHideToday();
    }
    popupEl.style.display = 'none';
    if (window.swiperPopup && typeof window.swiperPopup.autoplay?.stop === 'function') {
      window.swiperPopup.autoplay.stop();
    }
  };

  if (shouldHideToday()) {
    popupEl.style.display = 'none';
    return;
  }

  if (popupClose) {
    popupClose.addEventListener('click', closePopup);
  }

  const swiperPopup = new Swiper(popupEl.querySelector('.box_popup_swiper'), {
    slidesPerView: 1,
    spaceBetween: 10,
    autoHeight: true,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.popup .swiper-pagination',
      type: 'fraction',
    },
    navigation: {
      nextEl: '.popup .btn_next',
      prevEl: '.popup .btn_prev',
    },
    on: {
      init(swiper) {
        const controlEl = popupEl.querySelector('.box_swiper_control');
        const shouldHide = swiper.slides.filter((slide) => !slide.classList.contains('swiper-slide-duplicate')).length <= 1;
        if (controlEl) {
          controlEl.style.display = shouldHide ? 'none' : '';
        }
        updatePopupPaginationState(swiper);
      },
      slideChange(swiper) {
        updatePopupPaginationState(swiper);
      },
    },
  });

  window.swiperPopup = swiperPopup;

  function updatePopupPaginationState(swiper) {
    const controlEl = popupEl.querySelector('.box_swiper_control');
    if (!controlEl) return;

    const total = swiper.slides.filter((slide) => !slide.classList.contains('swiper-slide-duplicate')).length
      || swiper.slides.length;
    const isFirst = swiper.realIndex === 0;
    const isLast = swiper.realIndex === total - 1;

    controlEl.classList.toggle('is_first', isFirst);
    controlEl.classList.toggle('is_last', isLast);
  }
})();
