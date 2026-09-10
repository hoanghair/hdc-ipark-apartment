(function () {
  'use strict';

  const layer = document.querySelectorAll('.layer');
  const btnFilter = document.querySelectorAll('.btn_filter');
  const spaceSlides = document.querySelectorAll('.sec_project_space .box_space_swiper .swiper-slide');

  const btnSubTab = document.querySelectorAll('.box_sub_tab .js_sub_tab');
  const btnProjectSelect = document.querySelectorAll('.btn_project_select');
    
  const brandTabs = document.querySelectorAll('.box_brand_tab .btn_brand_tab');
  const brandPanels = document.querySelectorAll('.box_content .box_panel');

  const btnMasterMore = document.querySelector('.sec_design_master .btn_more');
  const itemMaster = document.querySelectorAll('.sec_design_master .item_master');
  const btnMaster = document.querySelectorAll('.sec_design_master .btn_master');
  const layerMaster = document.querySelectorAll('.layer_master');
  const btnMasterClose = document.querySelectorAll('.layer_master .btn_close');


  // Layer 열고 닫기
  if (layer.length > 0) {
    layer.forEach((layer) => {
      const btnClose = layer.querySelector('.btn_close');

      btnClose.addEventListener('click', function (e) {
        if (e.target.closest('.layer')) {
          layer.style.display = 'none';
        }
      });
      document.addEventListener('click', function (e) {
        if (e.target.classList.contains('layer')) {
          layer.style.display = 'none';
        }
      });
    });
  }


  // 해당 영역만 스크롤 가능하도록 wheel 이벤트 격리
  const trapScroll = (el) => {
    el.addEventListener(
      'wheel',
      function (e) {
        const { scrollTop, scrollHeight, clientHeight } = el;
        const isScrollingUp = e.deltaY < 0;
        const isScrollingDown = e.deltaY > 0;
        const isAtTop = scrollTop === 0;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

        if (scrollHeight > clientHeight) {
          if (
            (isScrollingUp && !isAtTop) ||
            (isScrollingDown && !isAtBottom)
          ) {
            e.stopPropagation();
          }
        }
      },
      { passive: false }
    );
  };

  const initToggleButtons = (buttons, selector) => {
    if (!buttons || buttons.length === 0) return;

    const closeAllButtons = (exceptBtn = null) => {
      buttons.forEach((button) => {
        if (button !== exceptBtn) {
          button.classList.remove('is_show');
          button.setAttribute('aria-expanded', 'false');
        }
      });
    };

    const toggleButton = (btn) => {
      const isOpen = btn.classList.contains('is_show');
      closeAllButtons(btn);

      if (isOpen) {
        btn.classList.remove('is_show');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        btn.classList.add('is_show');
        btn.setAttribute('aria-expanded', 'true');
      }
    };

    buttons.forEach((btn) => {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleButton(btn);
      });

      const list = btn.nextElementSibling;
      if (list) trapScroll(list);
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest(selector)) {
        closeAllButtons();
      }
    });
  };

  // Select Box
  initToggleButtons(btnFilter, '.btn_filter');
  initToggleButtons(btnProjectSelect, '.btn_project_select');


  // Project - 대표 이미지 스와이퍼
  const thumbEl = document.querySelector('.swiper_thumb');
  if (thumbEl) {
    new Swiper('.swiper_thumb', {
      slidesPerView: 1,
      loop: true,
      navigation: {
        nextEl: '.box_thumb .btn_next',
        prevEl: '.box_thumb .btn_prev',
      },
    });
  }

  // Project - 공간설계 스와이퍼
  const swiperSpace = new Swiper('.sec_project_space .box_space_swiper', {
    slidesPerView: 'auto',
    spaceBetween: 8,
    navigation: {
      nextEl: '.sec_project_space .btn_next',
      prevEl: '.sec_project_space .btn_prev',
    },
    breakpoints: {
      1024: {
        spaceBetween: 24,
      },
    },
  });

  window.swiperSpace = swiperSpace;

  // Project - 공간설계 팝업
  if (spaceSlides.length > 0) {
    const layerImg = document.querySelector('.layer_img');
    const layerImgBox = layerImg ? layerImg.querySelector('.box_img') : null;
    const layerImgClose = layerImg ? layerImg.querySelector('.btn_close') : null;
    const layerImgInnerImg = layerImgBox ? layerImgBox.querySelector('img') : null;

    if (layerImg && layerImgBox && layerImgInnerImg) {
      spaceSlides.forEach((slide) => {
        slide.addEventListener('click', function () {
          const targetImg = this.querySelector('img');
          if (!targetImg) return;
          layerImg.classList.add('is_show');
          layerImgInnerImg.src = targetImg.getAttribute('src');
          lenis.stop();
        });
      });

      if (layerImgClose) {
        layerImgClose.addEventListener('click', function () {
          layerImg.classList.remove('is_show');
          lenis.start();
        });
      }

      // 팝업 외 영역 클릭 시 닫기
      layerImg.addEventListener('click', function (e) {
        if (e.target === layerImg) {
          layerImg.classList.remove('is_show');
          lenis.start();
        }
      });
    }
  }

  // Project - 공정현황 스와이퍼
  const swiperProcess = new Swiper('.sec_project_process .box_process_swiper', {
    loop: true,
    slidesPerView: 1,
    navigation: {
      nextEl: '.sec_project_process .btn_next',
      prevEl: '.sec_project_process .btn_prev',
    },
  });

  // Project - 소식 및 공지 서브 탭
  if(btnSubTab.length > 0) {
    const activateTab = (targetTab) => {
      btnSubTab.forEach((tab) => {
        const isActive = tab === targetTab;
        const panelId = tab.getAttribute('aria-controls');
        const panel = panelId ? document.getElementById(panelId) : null;
        
        tab.classList.toggle('is_active', isActive);
        tab.setAttribute('aria-selected', isActive);
        
        
        if (panel) {
          if (isActive) {
            panel.classList.add('is_show');
          } else {
            panel.classList.remove('is_show');
          }
        }
      });
    };

    
    btnSubTab.forEach((btn) => {
      btn.addEventListener('click', function () {
        activateTab(btn);
      });

    });

  }



  // Project - 지도 영역에서 전체 스크롤 방지
  const initProjectMapScrollLock = () => {
    const mapContainer = document.querySelector('.sec_project_overview .map');
    if (!mapContainer) return;

    // Lenis 스크롤 잠금 (마우스가 지도 위에 있을 때)
    const lenisInstance = window.lenis;
    if (lenisInstance) {
      mapContainer.addEventListener('mouseenter', () => lenisInstance.stop());
      mapContainer.addEventListener('mouseleave', () => lenisInstance.start());
    }

    // 지도 안에서의 휠 스크롤이 바디로 전파되지 않도록 차단
    mapContainer.addEventListener(
      'wheel',
      (e) => {
        e.stopPropagation();
        e.preventDefault();
      },
      { passive: false }
    );
  };

  initProjectMapScrollLock();
  if (brandTabs.length > 0 && brandPanels.length > 0) {
    // 탭 활성화 함수
    const activateTab = (targetTab, index) => {
      brandTabs.forEach((tab, i) => {
        const isActive = tab === targetTab;
        tab.classList.toggle('is_active', isActive);
        tab.setAttribute('aria-selected', isActive);

        if (brandPanels[i]) {
          if (isActive) {
            brandPanels[i].classList.add('is_show');
          } else {
            brandPanels[i].classList.remove('is_show');
          }
        }
      });
    };
    
    // 탭 클릭 이벤트
    brandTabs.forEach((tab, index) => {
      tab.addEventListener('click', function() {
        activateTab(tab, index);
      });
    });
    
  }



  // Design - Masterpiece (처음 3개 노출, 더보기 시 3개씩 추가 노출)
  const SHOW_INITIAL = 3;
  const SHOW_PER_CLICK = 3;

  if (itemMaster.length > 0) {
    let visibleCount = Math.min(SHOW_INITIAL, itemMaster.length);
    itemMaster.forEach((item, index) => {
      item.style.display = index < visibleCount ? '' : 'none';
    });

    if (btnMasterMore) {
      if (visibleCount >= itemMaster.length) {
        btnMasterMore.remove();
      } else {
        btnMasterMore.addEventListener('click', function () {
          visibleCount = Math.min(visibleCount + SHOW_PER_CLICK, itemMaster.length);
          itemMaster.forEach((item, index) => {
            item.style.display = index < visibleCount ? '' : 'none';
          });
          if (visibleCount >= itemMaster.length) {
            btnMasterMore.remove();
          }
          requestAnimationFrame(() => {
            if (window.lenis) window.lenis.resize();
            if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
          });
        });
      }
    }

    btnMaster.forEach((btn) => {
      btn.addEventListener('click', function (e) {
        const target = e.currentTarget;
        const index = target.dataset.item;
        layerMaster.forEach((layer) => {
          layer.classList.remove('is_show');
        });
        layerMaster[index].classList.add('is_show');
        lenis.stop();
      });
    });

    btnMasterClose.forEach((btn) => {
      btn.addEventListener('click', function () {
        layerMaster.forEach((layer) => {
          layer.classList.remove('is_show');
        });
        lenis.start();
      });
    });

    layerMaster.forEach((layer) => {
      layer.addEventListener('click', function (e) {
        if (e.target.closest('.layer_master_content') || e.target.closest('.btn_close')) return;
        layer.classList.remove('is_show');
        lenis.start();
      });
    });
  }
  

  function clampWithIcon(el) {
    const title = el.querySelector('.news_title');
    if (!title) return;
    const fullText = title.dataset.fullText || title.textContent.trim();
    title.dataset.fullText = fullText;

    const style = window.getComputedStyle(title);
    const lineHeightPx = parseFloat(style.lineHeight);
    const lineHeight = Number.isNaN(lineHeightPx) ? parseFloat(style.fontSize) * 1.3 : lineHeightPx;
    const maxHeight = Math.floor(lineHeight * 2.2);

    title.textContent = fullText;
    if (el.scrollHeight <= maxHeight) return;

    const ratio = maxHeight / el.scrollHeight;
    let cutLength = Math.floor(fullText.length * ratio) - 3;
    if (cutLength < 1) cutLength = 1;

    title.textContent = fullText.slice(0, cutLength).trim() + '...';
    while (el.scrollHeight > maxHeight && cutLength > 1) {
      cutLength--;
      title.textContent = fullText.slice(0, cutLength).trim() + '...';
    }
  }

  function initClamp() {
    document.querySelectorAll('.nexs_title_box').forEach(el => clampWithIcon(el));
  }

  function runClampWhenReady() {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => requestAnimationFrame(initClamp));
    } else {
      requestAnimationFrame(initClamp);
    }
  }
  runClampWhenReady();

  window.addEventListener('resize', () => requestAnimationFrame(initClamp));

  // 공통: 특정 섹션으로 스크롤 이동
  const scrollToSection = (target, offset = 0) => {
    if (!target) return;
    if (window.lenis) {
      window.lenis.scrollTo(target, { offset, immediate: false });
    } else {
      const rectTop = target.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top: rectTop, behavior: 'smooth' });
    }
  };

  // 공통: 섹션 안의 버튼 클릭 시 해당 섹션 상단으로 스크롤
  const bindSectionScrollOnClick = (sectionSelector, buttonSelector, offset = 0) => {
    const section = document.querySelector(sectionSelector);
    if (!section) return;
    const buttons = section.querySelectorAll(buttonSelector);
    if (!buttons.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToSection(section, offset);
      });
    });
  };

  // .sec_project_notice pagination 클릭 시 섹션 상단으로 스크롤
  bindSectionScrollOnClick('.sec_project_notice', '.pagination .btn_pagination');

  const secBrandCore = document.querySelector('.sec_brand_core');
  const secBrandEssense = document.querySelector('.sec_brand_essense');

  document.addEventListener('scroll', () => {

    const scrollTop = window.scrollY;
    if (secBrandCore) {
      const secBrandCoreTop = secBrandCore.offsetTop;
      if (scrollTop > secBrandCoreTop) {
        secBrandCore.classList.add('is_show');
      } 
    }
    if (secBrandEssense) {
      const secBrandEssenseTop = secBrandEssense.offsetTop;
      if (scrollTop > secBrandEssenseTop - 80) {
        secBrandEssense.classList.add('is_show');
      } 
    }
  });


})();
