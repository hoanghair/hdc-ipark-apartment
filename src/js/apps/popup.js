const popupClose = document.querySelector('.popup .btn_close');
if(popupClose) {
  popupClose.addEventListener('click', function () {
    document.querySelector('.popup').style.display = 'none';
  });
}


const swiperPopup = new Swiper('.box_popup_swiper', {
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
      const controlEl = document.querySelector('.popup .box_swiper_control');
      const shouldHide = swiper.slides.length <= 1;
      if (controlEl) {
        controlEl.style.display = shouldHide ? 'none' : '';
      }
    },
  },
});
