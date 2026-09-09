(function () {
  'use strict';

  const layer = document.querySelectorAll('.layer');
  const btnSelectTab = document.querySelector('.btn_select_tab');
  const boxTabDetail = document.querySelector('.box_tab_detail');
  const btnMySelect = document.querySelectorAll('.btn_my_select');
  const btnSelect = document.querySelectorAll('.btn_select');
  const optionCheckbox = document.querySelectorAll(
    '.sec_my_calculate .box_checkbox input[type="checkbox"]'
  );
  const inputFile = document.querySelectorAll('.box_file input[type="file"]');
  const faqButtons = document.querySelectorAll(
    '.sec_contact_faq .accordion_btn'
  );
  const tables = document.querySelectorAll('.content_table .box_table');
  const selectCategoryPc = document.querySelector('.select_category');
  const selectCategoryMo = document.querySelector('.select_category_mo_list');
  const selectCategoryContainers = document.querySelectorAll('.select_category');
  const sectionJoin = document.querySelector('.sec_join');
  const btnViewLinks = sectionJoin ? sectionJoin.querySelectorAll('.btn_view_link') : [];
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

  // 공통 Flatpickr 설정
  const defaultFlatpickrConfig = {
    locale: {
      ...flatpickr.l10ns.ko,
      months: {
        shorthand: [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '10',
          '11',
          '12',
        ],
        longhand: [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '10',
          '11',
          '12',
        ],
      },
    },
    dateFormat: 'Y-m-d',
    disableMobile: true,
    animate: false,
  };

  // 기존 input datepicker
  flatpickr('#datepicker', defaultFlatpickrConfig);

  // data-attr 캘린더 초기화
  const initCalendars = () => {
    const calendarElements = document.querySelectorAll('[data-calendar]');

    calendarElements.forEach((element) => {
      const dataset = element.dataset;

      // data-disable-dates 배열로 변환
      const disableDates = dataset.disableDates
        ? dataset.disableDates.split(',').map((date) => date.trim())
        : [];

      // data-disable-weekends가 true면 주말 비활성화 함수
      const disableWeekends =
        dataset.disableWeekends === 'true'
          ? [
              function (date) {
                return date.getDay() === 0 || date.getDay() === 6;
              },
            ]
          : [];

      // 비활성화 날짜 병합
      const allDisabledDates = [...disableDates, ...disableWeekends];

      const config = {
        ...defaultFlatpickrConfig,

        // 인라인 모드
        inline: dataset.calendar === 'inline',
        static: dataset.calendar === 'inline',

        // 날짜 범위 
        ...(dataset.minDate && { minDate: dataset.minDate }),
        ...(dataset.maxDate && { maxDate: dataset.maxDate }),

        // 비활성화 날짜
        ...(allDisabledDates.length > 0 && { disable: allDisabledDates }),

        // 날짜 선택 시 이벤트
        onChange: (selectedDates, dateStr) => {
          if (dataset.targetInput) {
            const targetInput = document.querySelector(dataset.targetInput);
            if (targetInput) {
              targetInput.value = dateStr;
            }
          }

          console.log('선택된 날짜:', dateStr);
        },
      };

      // Flatpickr 인스턴스 생성
      flatpickr(element, config);
    });
  };

  // 캘린더 초기화 실행
  initCalendars();

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

  // 모바일 2Depth 메뉴
  if (btnSelectTab) {
    btnSelectTab.addEventListener('click', function (e) {
      btnSelectTab.classList.toggle('is_show');
      btnSelectTab.setAttribute(
        'aria-expanded',
        !btnSelectTab.getAttribute('aria-expanded')
      );
    });
  }

  // 모바일 3Depth 메뉴
  if (boxTabDetail) {
    const dataActive = boxTabDetail.dataset.active;
    const swiper = new Swiper('.box_tab_detail .list_tab', {
      slidesPerView: 'auto',
      spaceBetween: 8,
      initialSlide: Number(dataActive),

      breakpoints: {
        1024: {
          spaceBetween: 0,
        },
      },
    });
    swiper.update();
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

  const listSelects = document.querySelectorAll('.list_select_box');
  listSelects.forEach((list) => trapScroll(list));

  // Select Box
  initToggleButtons(btnMySelect, '.btn_my_select');
  initToggleButtons(btnSelect, '.btn_select');
  initToggleButtons(btnFilter, '.btn_filter');
  initToggleButtons(btnProjectSelect, '.btn_project_select');

  // 모바일 연체 할인 체크박스
  if (optionCheckbox.length > 0) {
    const optionAll = document.querySelector(
      '.sec_my_calculate .box_checkbox input[type="checkbox"].option_all'
    );
    const optionItems = Array.from(optionCheckbox).filter(
      (cb) => !cb.classList.contains('option_all')
    );
    const tableElements = document.querySelectorAll(
      '.box_result_content .table_my th[data-label], .box_result_content .table_my td[data-label]'
    );

    // 테이블 요소 표시/숨김 토글 함수
    const toggleTableElements = (value, isChecked) => {
      if (value === '전체') return;

      tableElements.forEach((element) => {
        const dataLabel = element.getAttribute('data-label');
        if (dataLabel === value) {
          console.log(element);
          if (isChecked) {
            element.classList.remove('is_hidden');
          } else {
            element.classList.add('is_hidden');
          }
        }
      });
    };

    // 전체 선택/해제 기능
    if (optionAll) {
      optionAll.addEventListener('change', function (e) {
        const isChecked = e.target.checked;
        optionItems.forEach((checkbox) => {
          checkbox.checked = isChecked;
          toggleTableElements(checkbox.value, isChecked);
        });
      });
    }

    // 개별 체크박스 변경 시
    optionItems.forEach((checkbox) => {
      checkbox.addEventListener('change', function (e) {
        const value = e.target.value;
        const isChecked = e.target.checked;

        toggleTableElements(value, isChecked);

        if (optionAll) {
          const allChecked = optionItems.every((cb) => cb.checked);
          optionAll.checked = allChecked;
        }
      });
    });
  }

  if (inputFile.length > 0) {
    inputFile.forEach((input) => {
      const boxFile = input.closest('.box_file');
      const inputSpan = boxFile.querySelector('.input');
      const btnDelete = boxFile.querySelector('.btn_delete');

      // 파일명과 확장자 분리 함수
      const splitFileName = (fileName) => {
        const lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex === -1 || lastDotIndex === 0) {
          // 확장자가 없거나 파일명이 .으로 시작하는 경우
          return { name: fileName, ext: '' };
        }
        return {
          name: fileName.substring(0, lastDotIndex),
          ext: fileName.substring(lastDotIndex),
        };
      };

      // 파일명 표시 함수
      const displayFileName = (fileName) => {
        const { name, ext } = splitFileName(fileName);

        // 파일명과 확장자를 분리된 요소로 표시
        let fileNameSpan = inputSpan.querySelector('.file_name');
        let fileExtSpan = inputSpan.querySelector('.file_ext');

        if (!fileNameSpan) {
          // 요소가 없으면 생성
          inputSpan.innerHTML = '';
          fileNameSpan = document.createElement('span');
          fileNameSpan.className = 'file_name';
          fileExtSpan = document.createElement('span');
          fileExtSpan.className = 'file_ext';
          inputSpan.appendChild(fileNameSpan);
          inputSpan.appendChild(fileExtSpan);
        }

        fileNameSpan.textContent = name;
        fileExtSpan.textContent = ext;
      };

      // 초기화 함수
      const resetFile = () => {
        inputSpan.innerHTML = '선택된 파일이 없습니다.';
        inputSpan.classList.remove('is_value');
        if (btnDelete) {
          btnDelete.style.display = 'none';
        }
      };

      input.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
          const maxSize = 5 * 1024 * 1024; // 5MB
          if (file.size > maxSize) {
            alert(
              `파일은 5mb까지 첨부가능합니다. \n첨부된파일을 다시확인해주세요.`
            );
            input.value = '';
            resetFile();
            return;
          }

          displayFileName(file.name);
          inputSpan.classList.add('is_value');
          if (btnDelete) {
            btnDelete.style.display = 'block';
          }
        } else {
          resetFile();
        }
      });

      if (btnDelete) {
        btnDelete.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          input.value = '';
          resetFile();
        });
      }
    });
  }

  // Contact - FAQ 아코디언
  faqButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const isOpen = this.getAttribute('aria-expanded') === 'true';

      faqButtons.forEach((btn) => {
        btn.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        this.setAttribute('aria-expanded', 'true');
      }

      requestAnimationFrame(() => {
        if (window.lenis) window.lenis.resize();
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      });
    });
  });

  tables.forEach(function (table, index) {
    table.dataset.tableIndex = index;
  });

  function showTable(index) {
    tables.forEach(function (table) {
      var tableIndex = parseInt(table.dataset.tableIndex, 10);
      if (tableIndex === index) {
        table.classList.add('is_active');
      } else {
        table.classList.remove('is_active');
      }
    });
  }

  function syncSelectCategory(index) {
    if (selectCategoryPc) {
      const pcItems = selectCategoryPc.querySelectorAll('.item_category');
      const pcBtn = selectCategoryPc.querySelector('.btn_category_select');

      pcItems.forEach(function (item) {
        const itemIndex = parseInt(item.dataset.index, 10);
        if (itemIndex === index) {
          item.setAttribute('aria-selected', 'true');
          pcBtn.textContent =
            item.querySelector('.btn_category_item').textContent;
        } else {
          item.setAttribute('aria-selected', 'false');
        }
      });
    }

    if (selectCategoryMo) {
      selectCategoryMo.value = String(index + 1);
    }
  }

  selectCategoryContainers.forEach(function (container) {
    const toggleBtn = container.querySelector('.btn_category_select');
    const listbox = container.querySelector('.list_category');
    const items = container.querySelectorAll('.item_category');

    function toggleDropdown() {
      const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', String(!isOpen));
      listbox.classList.toggle('is_open', !isOpen);
    }

    function closeDropdown() {
      toggleBtn.setAttribute('aria-expanded', 'false');
      listbox.classList.remove('is_open');
    }

    function selectOption(item) {
      const button = item.querySelector('.btn_category_item');
      const text = button.textContent;
      const index = parseInt(item.dataset.index, 10);

      items.forEach(function (i) {
        i.setAttribute('aria-selected', 'false');
      });
      item.setAttribute('aria-selected', 'true');

      toggleBtn.textContent = text;

      showTable(index);
      syncSelectCategory(index);
    }

    toggleBtn.addEventListener('click', toggleDropdown);

    items.forEach(function (item) {
      const button = item.querySelector('.btn_category_item');
      button.addEventListener('click', function () {
        selectOption(item);
      });
    });

    container.addEventListener('keydown', function (e) {
      const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';

      if (e.key === 'Escape' && isOpen) {
        closeDropdown();
        toggleBtn.focus();
      }
    });
  });

  if (selectCategoryMo) {
    selectCategoryMo.addEventListener('change', function () {
      const index = parseInt(this.value, 10) - 1;
      showTable(index);
      syncSelectCategory(index);
    });
  }


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



  // 회원가입 약관 체크박스
  if (sectionJoin) {
    const joinOptionAll = sectionJoin.querySelector('#option_all');
    const joinOptionItems = sectionJoin.querySelectorAll(
      '.terms_checkbox input[type="checkbox"]:not(#option_all)'
    );

    if (joinOptionAll && joinOptionItems.length > 0) {
      joinOptionAll.addEventListener('change', function () {
        const isChecked = this.checked;
        joinOptionItems.forEach((checkbox) => {
          checkbox.checked = isChecked;
        });
      });

      joinOptionItems.forEach((checkbox) => {
        checkbox.addEventListener('change', function () {
          const allChecked = Array.from(joinOptionItems).every(
            (cb) => cb.checked
          );
          joinOptionAll.checked = allChecked;
        });
      });
    }

    btnViewLinks.forEach((btn) => {
      btn.addEventListener('click', function () {
        const termsItem = this.closest('.terms_item');
        const termsContent = termsItem.querySelector('.terms_content');
        if (termsContent) {
          termsContent.classList.toggle('is_open');
          this.textContent = termsContent.classList.contains('is_open')
            ? '접기'
            : '보기';
        }
      });
    });
  }

  // 약관 페이지 - iframe (높이 적용 후에만 노출해 스크롤 깜빡임 방지)
  const initIframeHeight = () => {
    const iframe = document.querySelector('.sec_terms .box_iframe iframe');
    if (!iframe) return;
  
    const boxIframe = iframe.closest('.box_iframe');
  
    // ✅ applyHeight을 rAF 기반으로 변경 (레이아웃 스래싱 방지)
    const applyHeight = () => {
      requestAnimationFrame(() => {
        try {
          const body = iframe.contentWindow?.document?.body;
          if (!body) return;
  
          iframe.style.height = '';
          iframe.style.height = `${body.scrollHeight}px`;
          boxIframe?.classList.add('is_ready');
        } catch (_) {}
      });
    };
  
    let rafId;
    const onResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(applyHeight);
    };
  
    iframe.onload = applyHeight;
  
    const isLoaded = iframe.contentDocument?.readyState === 'complete';
    isLoaded ? applyHeight() : setTimeout(applyHeight, 300);
  
    window.addEventListener('resize', onResize);
  
    const lenisInstance = window.lenis; // lenis 인스턴스 접근 방식에 맞게 수정
  
    if (lenisInstance && boxIframe) {
      boxIframe.addEventListener('mouseenter', () => lenisInstance.stop());
      boxIframe.addEventListener('mouseleave', () => lenisInstance.start());
    }
  
    // ✅ iframe 내부 콘텐츠 높이 변경 감지 (동적 콘텐츠 대응)
    const observeIframeBody = () => {
      try {
        const body = iframe.contentWindow?.document?.body;
        if (!body) return;
  
        const ro = new ResizeObserver(applyHeight);
        ro.observe(body);
      } catch (_) {}
    };
  
    iframe.addEventListener('load', observeIframeBody);
  };
  
  initIframeHeight();

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
  bindSectionScrollOnClick('.sec_my_agreement_info', '.pagination .btn_pagination');

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
