(function () {
  'use strict';

  const overviewValueEl = document.querySelector('.sec_overview_value .box_value_swiper');
  if (overviewValueEl) {
    const overviewMq = window.matchMedia('(min-width: 1025px)');

    const overviewValueSwiper = new Swiper(overviewValueEl, {
      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },
      loop: true,
      speed: 600,
      autoHeight: !overviewMq.matches,
      observer: true,
      observeParents: true,
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      pagination: {
        el: '.sec_overview_value .swiper-pagination',
        clickable: true,
      },
    });

    const syncOverviewValueSwiper = () => {
      const isPc = overviewMq.matches;
      overviewValueSwiper.params.autoHeight = !isPc;
      overviewValueSwiper.originalParams.autoHeight = !isPc;

      if (isPc) {
        overviewValueEl.style.height = '';
        if (overviewValueSwiper.wrapperEl) {
          overviewValueSwiper.wrapperEl.style.height = '';
        }
      }

      overviewValueSwiper.update();
      if (!isPc) {
        overviewValueSwiper.updateAutoHeight(0);
      }
    };

    if (typeof overviewMq.addEventListener === 'function') {
      overviewMq.addEventListener('change', syncOverviewValueSwiper);
    } else {
      overviewMq.addListener(syncOverviewValueSwiper);
    }

    window.addEventListener('resize', () => {
      requestAnimationFrame(syncOverviewValueSwiper);
    });

    requestAnimationFrame(syncOverviewValueSwiper);
    window.addEventListener('load', syncOverviewValueSwiper, { once: true });
  }

})();
