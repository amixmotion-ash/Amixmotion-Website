// ======================================================================
// == 1. MENU TOGGLE ==
// ======================================================================
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
const body = document.querySelector('body');

if (navToggle && mainNav && body) {
    let menuLockedScrollY = 0;
    let menuCloseTimer = null;
    const MENU_TRANSITION_MS = 600; /* matches .main-nav transform 0.6s */
    const toggleParent = navToggle.parentNode;
    const toggleNextSibling = navToggle.nextSibling;

    const setMenuToggleLabel = (isOpen) => {
        navToggle.textContent = isOpen ? 'CLOSE' : 'MENU';
        navToggle.setAttribute('aria-label', isOpen ? 'close' : 'menu');
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    const clearMenuCursorState = () => {
        document.documentElement.classList.remove('menu-cursor-active', 'cursor-hover');
        body.classList.remove('menu-cursor-active', 'cursor-hover');
        mainNav.classList.remove('has-menu-hover');
        mainNav.querySelectorAll('a.is-current').forEach((a) => a.classList.remove('is-current'));
    };

    const lockPageScroll = () => {
        menuLockedScrollY = window.scrollY || window.pageYOffset || 0;
        body.style.top = `-${menuLockedScrollY}px`;
        body.classList.add('body-no-scroll');
    };

    const unlockPageScroll = () => {
        body.classList.remove('body-no-scroll');
        body.style.top = '';
        window.scrollTo(0, menuLockedScrollY);
    };

    const floatCloseButton = () => {
        // Reparent above the raised panel (z 920); keep screen position
        const toggleRect = navToggle.getBoundingClientRect();
        navToggle.style.top = `${toggleRect.top}px`;
        navToggle.style.left = `${toggleRect.left}px`;
        navToggle.classList.add('menu-close-float');
        body.appendChild(navToggle);
    };

    const restoreCloseButton = () => {
        navToggle.classList.remove('menu-close-float');
        navToggle.style.top = '';
        navToggle.style.left = '';
        if (toggleNextSibling && toggleNextSibling.parentNode === toggleParent) {
            toggleParent.insertBefore(navToggle, toggleNextSibling);
        } else {
            toggleParent.insertBefore(navToggle, toggleParent.firstChild);
        }
    };

    const finishMenuClose = () => {
        if (menuCloseTimer) {
            clearTimeout(menuCloseTimer);
            menuCloseTimer = null;
        }
        mainNav.removeEventListener('transitionend', onMenuCloseTransitionEnd);
        body.classList.remove('menu-is-closing');
        unlockPageScroll();
    };

    const onMenuCloseTransitionEnd = (event) => {
        if (event.target !== mainNav || event.propertyName !== 'transform') return;
        finishMenuClose();
    };

    const openMenu = () => {
        if (mainNav.classList.contains('nav-open')) return;
        // Interrupt an in-progress close
        if (body.classList.contains('menu-is-closing')) {
            finishMenuClose();
        }
        floatCloseButton();
        mainNav.classList.add('nav-open');
        lockPageScroll();
        body.classList.add('menu-dim-active');
        setMenuToggleLabel(true);
    };

    const closeMenu = () => {
        if (!mainNav.classList.contains('nav-open')) return;
        if (body.classList.contains('menu-is-closing')) return;

        // Hold panel-above-header stacking until the slide finishes
        body.classList.add('menu-is-closing');
        body.classList.remove('menu-dim-active'); /* start scrim fade-out */
        mainNav.classList.remove('nav-open');
        restoreCloseButton();
        setMenuToggleLabel(false);
        clearMenuCursorState();

        mainNav.addEventListener('transitionend', onMenuCloseTransitionEnd);
        menuCloseTimer = setTimeout(finishMenuClose, MENU_TRANSITION_MS + 50);
    };

    // Belt-and-suspenders: block wheel / trackpad / touch / keys while menu is open
    // even if a page overflow rule tries to leave a scrollport.
    const menuScrollKeys = new Set([
        'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Spacebar'
    ]);
    const preventMenuPageScroll = (event) => {
        if (!body.classList.contains('body-no-scroll')) return;
        if (event.type === 'keydown' && !menuScrollKeys.has(event.key)) return;
        event.preventDefault();
    };
    window.addEventListener('wheel', preventMenuPageScroll, { passive: false });
    window.addEventListener('touchmove', preventMenuPageScroll, { passive: false });
    window.addEventListener('keydown', preventMenuPageScroll, { passive: false });

    setMenuToggleLabel(mainNav.classList.contains('nav-open'));

    navToggle.addEventListener('click', () => {
        if (mainNav.classList.contains('nav-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Click anywhere off the black menu panel (dimmed page / scrim) to close.
    // Ignore clicks on the panel (incl. menu words) and on CLOSE/MENU.
    document.addEventListener('click', (event) => {
        if (!mainNav.classList.contains('nav-open')) return;
        const target = event.target;
        if (!(target instanceof Node)) return;
        if (navToggle.contains(target) || mainNav.contains(target)) return;
        event.preventDefault();
        closeMenu();
    });
}

// ======================================================================
// == 2. HEADER HIDE ON SCROLL + POINTER REVEAL ==
// ======================================================================
const header = document.querySelector('header');
let lastScrollY = window.scrollY;

if (header) {
    const HEADER_POINTER_ZONE = 100; // top viewport band (px) that can reveal the bar
    const SCROLL_IDLE_MS = 180; // "screen is static" after no scroll for this long
    let scrollIdleTimer = null;
    let isScrolling = false;
    let lastPointerY = null;
    const finePointer = window.matchMedia('(pointer: fine)');

    const menuIsOpen = () => document.body.classList.contains('body-no-scroll');

    const pointerInHeaderZone = () =>
        typeof lastPointerY === 'number' && lastPointerY <= HEADER_POINTER_ZONE;

    const revealHeaderIfPointerIdle = () => {
        if (menuIsOpen()) return;
        if (isScrolling) return;
        if (!finePointer.matches) return;
        if (!header.classList.contains('is-hidden')) return;
        if (pointerInHeaderZone()) {
            header.classList.remove('is-hidden');
            // Pointer reveal also turns the wash on when not at the true top
            if (window.scrollY > 50) header.classList.add('has-fade');
        }
    };

    const markScrolling = () => {
        isScrolling = true;
        if (scrollIdleTimer) clearTimeout(scrollIdleTimer);
        scrollIdleTimer = setTimeout(() => {
            isScrolling = false;
            // After scroll-down finishes, show if the pointer is already in the top zone
            revealHeaderIfPointerIdle();
        }, SCROLL_IDLE_MS);
    };

    window.addEventListener('scroll', () => {
        markScrolling();

        const y = window.scrollY;
        if (y > 50) {
            if (lastScrollY < y) {
                // Scrolling down: hide header and clear wash
                header.classList.add('is-hidden');
                header.classList.remove('has-fade');
            } else if (lastScrollY > y) {
                // Scrolling up: show header and turn wash on
                header.classList.remove('is-hidden');
                header.classList.add('has-fade');
            }
            // Equal Y (duplicate scroll events): leave visibility as-is
        } else {
            // At the top: header visible, wash off
            header.classList.remove('is-hidden');
            header.classList.remove('has-fade');
        }
        lastScrollY = y;
    }, { passive: true });

    // When the page is static, moving the pointer into the top zone reveals the header.
    // If scrollY > 50, also turn the gradient on (same as scroll-up).
    // Coarse/touch pointers are ignored so phantom mouse events don't flash the bar.
    const onPointerMove = (event) => {
        if (typeof event.clientY === 'number') {
            lastPointerY = event.clientY;
        }
        if (menuIsOpen()) return;
        if (!finePointer.matches) return;
        if (isScrolling) return;
        if (lastPointerY !== null && lastPointerY <= HEADER_POINTER_ZONE) {
            header.classList.remove('is-hidden');
            if (window.scrollY > 50) header.classList.add('has-fade');
        }
    };

    document.addEventListener('mousemove', onPointerMove, { passive: true });
    document.addEventListener('pointermove', onPointerMove, { passive: true });
}

// ======================================================================
// == 2b. BACK TO TOP ==
// ======================================================================
const backToTop = document.querySelector('.back-to-top');

if (backToTop) {
    const updateBackToTop = () => {
        const revealAfter = Math.max(480, window.innerHeight * 0.7);
        backToTop.classList.toggle('is-visible', window.scrollY > revealAfter);
    };

    window.addEventListener('scroll', updateBackToTop, { passive: true });
    updateBackToTop();

    backToTop.addEventListener('click', () => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
}

// ======================================================================
// == 3. ANIMATION TRIGGERS (Scroll Reveal) ==
// ======================================================================
const elementsToFadeIn = document.querySelectorAll('.fade-in-on-scroll, .mission-section, .testimonials-section, .profile-grid-section');

if (elementsToFadeIn.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    elementsToFadeIn.forEach(element => {
        observer.observe(element);
    });
}

// ======================================================================
// == 4. UNIVERSAL SCROLL WIPE (Mission & Bio) ==
// ======================================================================
const textWipes = document.querySelectorAll('.mission-statement-scroll-effect');

if (textWipes.length > 0) {
    const reduceMissionWipe = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        && document.body.classList.contains('homepage');

    if (reduceMissionWipe) {
        textWipes.forEach(wipe => {
            const foregroundWrapper = wipe.querySelector('.mission-statement-foreground-wrapper');
            if (foregroundWrapper) {
                foregroundWrapper.style.setProperty('--progress', '100%');
            }
        });
    } else {
        window.addEventListener('scroll', function() {
            const viewportHeight = window.innerHeight;

            textWipes.forEach(wipe => {
                const foregroundWrapper = wipe.querySelector('.mission-statement-foreground-wrapper');
                const rect = wipe.getBoundingClientRect();
                const startPoint = viewportHeight * 0.9;
                const endPoint = viewportHeight * 0.3;
                const progress = Math.max(0, Math.min(1, (startPoint - rect.top) / (startPoint - endPoint)));

                if (foregroundWrapper) {
                    foregroundWrapper.style.setProperty('--progress', (progress * 100) + '%');
                }
            });
        });
    }
}

// ======================================================================
// == 5. VIDEO LIGHTBOX ==
// ======================================================================
const lightbox = document.querySelector('.video-lightbox');
if (lightbox) {
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    const lightboxVideo = lightbox.querySelector('.lightbox-video');
    const closeButton = lightbox.querySelector('.lightbox-close');
    const customLoader = lightbox.querySelector('.custom-loader');
    const lightboxOverlay = lightbox.querySelector('.lightbox-overlay');
    const cutsRow = lightbox.querySelector('.lightbox-cuts');
    const portfolioItems = document.querySelectorAll('.grid-item');
    let cutsLabel = lightbox.querySelector('.lightbox-cuts-label');
    if (!cutsLabel && cutsRow) {
        cutsLabel = document.createElement('p');
        cutsLabel.className = 'lightbox-cuts-label';
        cutsRow.before(cutsLabel);
    }

    let playToken = 0;

    function stopVideo() {
        playToken += 1;
        if (!lightboxVideo) return;
        lightboxVideo.pause();
        lightboxVideo.removeAttribute('src');
        lightboxVideo.load();
    }

    function cutCountWords(count) {
        const words = ['two', 'three', 'four', 'five', 'six'];
        return words[count - 2] || String(count);
    }

    function readCuts(item) {
        const raw = item.dataset.cuts;
        if (!raw) return [];
        try {
            const cuts = JSON.parse(raw);
            return Array.isArray(cuts) ? cuts.filter(cut => cut && cut.src) : [];
        } catch (error) {
            return [];
        }
    }

    function applyAspect(aspectRatio) {
        if (aspectRatio === '9:16') {
            lightboxVideo.classList.add('controls-hidden');
            lightboxContent.classList.add('is-vertical');
        } else {
            lightboxContent.classList.remove('is-vertical');
        }
    }

    function clearCuts() {
        if (!cutsRow) return;
        cutsRow.innerHTML = '';
        cutsRow.classList.remove('is-visible');
        lightbox.classList.remove('has-cuts');
        if (cutsLabel) {
            cutsLabel.textContent = '';
            cutsLabel.classList.remove('is-visible');
        }
    }

    function playSource(videoSrc, aspectRatio) {
        if (!videoSrc) return;
        const token = ++playToken;
        lightboxVideo.pause();
        applyAspect(aspectRatio);
        if (customLoader) customLoader.classList.add('is-loading');
        lightbox.classList.add('is-loading');
        lightboxVideo.src = videoSrc;
        lightbox.classList.add('is-visible');
        const playPromise = lightboxVideo.play();
        if (playPromise && typeof playPromise.then === 'function') {
            playPromise.then(() => {
                if (token !== playToken) lightboxVideo.pause();
            }).catch(() => {});
        }
    }

    function renderCuts(cuts, activeIndex) {
        if (!cutsRow) return;
        cutsRow.innerHTML = '';
        if (!cuts || cuts.length < 2) {
            clearCuts();
            return;
        }

        if (cutsLabel) {
            cutsLabel.textContent = 'Choose from ' + cutCountWords(cuts.length) + ' videos below';
            cutsLabel.classList.add('is-visible');
        }

        cuts.forEach((cut, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'lightbox-cut' + (cut.aspect === '9:16' ? ' is-vertical' : '');
            button.setAttribute('aria-label', 'Play cut ' + (index + 1));
            button.setAttribute('aria-pressed', index === activeIndex ? 'true' : 'false');
            if (index === activeIndex) button.classList.add('is-active');

            const image = document.createElement('img');
            image.src = cut.poster || '';
            image.alt = '';
            image.draggable = false;
            button.appendChild(image);

            button.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                if (button.classList.contains('is-active')) return;
                cutsRow.querySelectorAll('.lightbox-cut').forEach((el) => {
                    el.classList.remove('is-active');
                    el.setAttribute('aria-pressed', 'false');
                });
                button.classList.add('is-active');
                button.setAttribute('aria-pressed', 'true');
                playSource(cut.src, cut.aspect);
            });

            cutsRow.appendChild(button);
        });

        cutsRow.classList.add('is-visible');
        lightbox.classList.add('has-cuts');
    }

    function openLightbox(videoSrc, aspectRatio, cuts) {
        const list = Array.isArray(cuts) && cuts.length > 1 ? cuts : [];
        let activeIndex = 0;
        if (list.length && videoSrc) {
            const match = list.findIndex((cut) => cut.src === videoSrc);
            if (match >= 0) activeIndex = match;
        }
        renderCuts(list, activeIndex);
        const activeCut = list[activeIndex];
        playSource(videoSrc, activeCut ? activeCut.aspect : aspectRatio);
    }

    function closeLightbox() {
        lightbox.classList.remove('is-visible');
        stopVideo();
        setTimeout(() => {
            if(customLoader) customLoader.classList.remove('is-loading');
            lightbox.classList.remove('is-loading');
            lightboxContent.classList.remove('is-vertical');
            clearCuts();
        }, 300);
    }
    
    if (customLoader) {
        lightboxVideo.addEventListener('waiting', () => {
            customLoader.classList.add('is-loading');
            lightbox.classList.add('is-loading');
        });
        lightboxVideo.addEventListener('canplay', () => {
            customLoader.classList.remove('is-loading');
            lightbox.classList.remove('is-loading');
        });
    }

    lightboxVideo.addEventListener('playing', () => lightboxVideo.classList.add('controls-hidden'));
    lightboxContent.addEventListener('mouseenter', () => lightboxVideo.classList.remove('controls-hidden'));
    lightboxContent.addEventListener('mouseleave', () => {
        if (!lightboxVideo.paused) lightboxVideo.classList.add('controls-hidden');
    });
    lightboxContent.addEventListener('click', () => {
        if (!lightboxVideo.paused) lightboxVideo.classList.toggle('controls-hidden');
    });
    lightboxVideo.addEventListener('pause', () => lightboxVideo.classList.remove('controls-hidden'));

    portfolioItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            openLightbox(item.dataset.videoSrc, item.dataset.aspectRatio, readCuts(item));
        });
    });

    closeButton.addEventListener('click', closeLightbox);
    if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
    window.addEventListener('pagehide', stopVideo);
}

// ======================================================================
// == 6. RELLAX PARALLAX (Smart Detection) ==
// ======================================================================
var rellax = null;
const portfolioPage = document.body.classList.contains('portfolio-page');

if (!portfolioPage && typeof Rellax !== 'undefined' && window.innerWidth > 600 && document.querySelector('.rellax')) {
    let options = {
        center: false, 
        speed: -2,
        wrapper: null, 
        round: true, 
        vertical: true, 
        horizontal: false
    };

    if (document.body.classList.contains('homepage')) {
        options.center = true; 
    }

    rellax = new Rellax('.rellax', options);
}

let workParallaxOn = true;
const WORK_PARALLAX_DELAY = 260;
let workColumnsRafId = 0;
let workColumnsLatestScrollY = 0;

function updateWorkColumns() {
    const columns = document.querySelectorAll('.portfolio-page .portfolio-column');
    if (!columns.length) return;

    const traveled = (!workParallaxOn || window.innerWidth <= 600)
        ? 0
        : Math.max(0, workColumnsLatestScrollY - WORK_PARALLAX_DELAY);

    columns.forEach((column) => {
        if (!traveled) {
            column.style.transform = '';
            return;
        }
        const speed = parseFloat(column.getAttribute('data-rellax-speed')) || 0;
        const offset = Math.round(-speed * traveled * 0.02);
        column.style.transform = 'translate3d(0,' + offset + 'px,0)';
    });
}

function scheduleWorkColumnsUpdate() {
    workColumnsLatestScrollY = window.scrollY;
    if (workColumnsRafId) return;
    workColumnsRafId = requestAnimationFrame(function () {
        workColumnsRafId = 0;
        updateWorkColumns();
    });
}

if (portfolioPage) {
    window.addEventListener('scroll', scheduleWorkColumnsUpdate, { passive: true });
    window.addEventListener('resize', function () {
        workColumnsLatestScrollY = window.scrollY;
        updateWorkColumns();
    });
    workColumnsLatestScrollY = window.scrollY;
    updateWorkColumns();
}

function restartWorkParallax(enabled) {
    workParallaxOn = enabled;
    if (rellax) {
        rellax.destroy();
        rellax = null;
    }
    workColumnsLatestScrollY = window.scrollY;
    updateWorkColumns();
}

// Work page panel entrance: shared by first paint and filter clicks.
// Stagger is compressed into a fixed window so All (~25 panels) feels as
// snappy as a small filter — per-panel duration stays 0.6s.
const WORK_FILTER_STAGGER_WINDOW_MS = 400;
const WORK_FILTER_ENTER_MS = 600;
let workFilterEnterTimer = null;
let animateWorkPanelsEntrance = null;

if (portfolioPage) {
    const workGridContainer = document.querySelector('.portfolio-grid-container-new');
    const workGridItems = [...document.querySelectorAll('.portfolio-page .portfolio-grid-section .grid-item')];

    const clearWorkFilterEnter = (item) => {
        item.classList.remove('work-filter-enter', 'work-filter-enter-animate', 'is-entered');
        item.style.removeProperty('--work-filter-enter-delay');
    };

    animateWorkPanelsEntrance = (visibleItems) => {
        if (workFilterEnterTimer) {
            clearTimeout(workFilterEnterTimer);
            workFilterEnterTimer = null;
        }

        workGridItems.forEach(clearWorkFilterEnter);

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion || !visibleItems.length) return;

        document.body.classList.add('js-work-filter-motion');

        const lastIndex = Math.max(0, visibleItems.length - 1);
        visibleItems.forEach((item, index) => {
            const delayMs = lastIndex === 0
                ? 0
                : (index / lastIndex) * WORK_FILTER_STAGGER_WINDOW_MS;
            item.classList.add('work-filter-enter');
            item.style.setProperty('--work-filter-enter-delay', (delayMs / 1000) + 's');
        });

        // Paint the hidden pose before enabling the transition (matches About)
        if (workGridContainer) void workGridContainer.offsetWidth;

        visibleItems.forEach((item) => {
            item.classList.add('work-filter-enter-animate');
            void item.offsetWidth;
            item.classList.add('is-entered');
        });

        workFilterEnterTimer = setTimeout(() => {
            visibleItems.forEach(clearWorkFilterEnter);
            workFilterEnterTimer = null;
        }, WORK_FILTER_STAGGER_WINDOW_MS + WORK_FILTER_ENTER_MS + 40);
    };
}

const workFilters = document.querySelector('.work-filters');
if (workFilters && portfolioPage) {
    const container = document.querySelector('.portfolio-grid-container-new');
    const columns = [...document.querySelectorAll('.portfolio-page .portfolio-column')];
    const items = [...document.querySelectorAll('.portfolio-page .portfolio-grid-section .grid-item')];
    const origins = items.map((item) => ({
        item,
        column: item.closest('.portfolio-column'),
        index: [...item.parentElement.children].indexOf(item)
    }));
    let currentFilter = 'all';
    const mobileQuery = window.matchMedia('(max-width: 768px)');

    const applyWorkFilter = (filter, animate) => {
        currentFilter = filter;

        if (filter === 'all') {
            columns.forEach((column) => {
                column.hidden = false;
                origins
                    .filter((entry) => entry.column === column)
                    .sort((a, b) => a.index - b.index)
                    .forEach((entry) => {
                        entry.item.hidden = false;
                        column.appendChild(entry.item);
                    });
            });
            container.removeAttribute('data-columns');
        } else {
            const matching = origins.filter((entry) =>
                (entry.item.dataset.cats || '').split(/\s+/).includes(filter)
            );
            origins.forEach((entry) => {
                entry.item.hidden = true;
            });
            const mobile = mobileQuery.matches;
            columns.forEach((column) => {
                column.hidden = false;
            });
            matching.forEach((entry, index) => {
                entry.item.hidden = false;
                const target = mobile ? columns[0] : columns[index % columns.length];
                target.appendChild(entry.item);
            });
            container.removeAttribute('data-columns');
        }

        restartWorkParallax(filter === 'all');

        if (animate && animateWorkPanelsEntrance) {
            const visibleItems = items.filter((item) => !item.hidden);
            animateWorkPanelsEntrance(visibleItems);
        }
    };

    workFilters.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-filter]');
        if (!button || button.classList.contains('is-active')) return;
        workFilters.querySelectorAll('button').forEach((item) => {
            const active = item === button;
            item.classList.toggle('is-active', active);
            item.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        applyWorkFilter(button.dataset.filter, true);
    });

    mobileQuery.addEventListener('change', () => {
        if (currentFilter !== 'all') applyWorkFilter(currentFilter, false);
    });
}

// Homepage films stay in one row while the white section first covers the hero.
// Their existing speeds only start once that row is on screen.
const workSection = document.querySelector('#work');
const workFilms = workSection ? workSection.querySelectorAll('.grid-item') : [];

if (workSection && workFilms.length) {
    const workFilmQuery = window.matchMedia('(min-width: 769px)');

    function updateWorkFilms() {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            && document.body.classList.contains('homepage');

        if (reduceMotion || !workFilmQuery.matches) {
            workFilms.forEach((film) => {
                film.style.transform = '';
            });
            return;
        }

        const rect = workSection.getBoundingClientRect();
        const viewH = window.innerHeight;
        const traveled = Math.max(0, -rect.top);
        const progress = Math.min(1, traveled / (viewH * 0.85));

        workFilms.forEach((film) => {
            const speed = parseFloat(film.getAttribute('data-rellax-speed')) || 0;
            const offset = Math.round(speed * 55 * progress);
            film.style.transform = 'translate3d(0, ' + offset + 'px, 0)';
        });
    }

    window.addEventListener('scroll', updateWorkFilms, { passive: true });
    window.addEventListener('resize', updateWorkFilms);
    if (workFilmQuery.addEventListener) {
        workFilmQuery.addEventListener('change', updateWorkFilms);
    }
    updateWorkFilms();
}

// ======================================================================
// == 7. TESTIMONIALS SLIDESHOW ==
// ======================================================================
const testimonialsViewport = document.querySelector('.testimonials-viewport');
if (testimonialsViewport) {
    const testimonialsSection = testimonialsViewport.closest('.testimonials-section');
    const track = testimonialsViewport.querySelector('.testimonials-track');
    const cards = Array.from(testimonialsViewport.querySelectorAll('.testimonial-card'));
    const prevBtn = testimonialsSection && testimonialsSection.querySelector('.testimonials-arrow-prev');
    const nextBtn = testimonialsSection && testimonialsSection.querySelector('.testimonials-arrow-next');
    const dotsContainer = testimonialsSection && testimonialsSection.querySelector('.testimonials-dots');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia('(max-width: 768px)');

    let index = 0;
    let cardWidth = 0;
    let gap = 0;

    function getVisibleCount() {
        return mobileQuery.matches ? 1 : 3;
    }

    function getMaxIndex() {
        return Math.max(0, cards.length - getVisibleCount());
    }

    function getStride() {
        return cardWidth + gap;
    }

    function measure() {
        if (!cards.length) return;
        const trackStyles = window.getComputedStyle(track);
        gap = parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;

        const viewportStyles = window.getComputedStyle(testimonialsViewport);
        const padL = parseFloat(viewportStyles.paddingLeft) || 0;
        const padR = parseFloat(viewportStyles.paddingRight) || 0;
        const windowWidth = Math.max(0, testimonialsViewport.clientWidth - padL - padR);
        const visible = getVisibleCount();

        // Fill the clipping window: 1 card on mobile, 3 equal cards on desktop.
        const nextCardWidth = visible <= 1
            ? windowWidth
            : (windowWidth - (visible - 1) * gap) / visible;

        cards.forEach((card) => {
            card.style.width = nextCardWidth + 'px';
        });
        cardWidth = cards[0].offsetWidth;
    }

    function renderDots() {
        if (!dotsContainer) return;
        const stopCount = getMaxIndex() + 1;
        dotsContainer.innerHTML = '';
        for (let i = 0; i < stopCount; i++) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'testimonials-dot' + (i === index ? ' is-active' : '');
            dot.setAttribute('aria-label', `Go to review set ${i + 1}`);
            dot.setAttribute('aria-current', i === index ? 'true' : 'false');
            dot.addEventListener('click', () => setIndex(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateControls() {
        const maxIndex = getMaxIndex();
        if (prevBtn) prevBtn.disabled = index <= 0;
        if (nextBtn) nextBtn.disabled = index >= maxIndex;
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.testimonials-dot');
            if (dots.length !== maxIndex + 1) {
                renderDots();
                return;
            }
            dots.forEach((dot, i) => {
                const active = i === index;
                dot.classList.toggle('is-active', active);
                dot.setAttribute('aria-current', active ? 'true' : 'false');
            });
        }
    }

    function applyTransform() {
        const x = -(index * getStride());
        track.style.transform = 'translateX(' + x + 'px)';
        updateControls();
    }

    function setIndex(nextIndex) {
        const maxIndex = getMaxIndex();
        index = Math.max(0, Math.min(maxIndex, nextIndex));
        applyTransform();
    }

    function refresh() {
        measure();
        index = Math.max(0, Math.min(getMaxIndex(), index));
        renderDots();
        applyTransform();
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => setIndex(index - 1));
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => setIndex(index + 1));
    }

    // Touch swipe on the viewport (mobile).
    let touchStartX = null;
    testimonialsViewport.addEventListener('touchstart', (e) => {
        if (!e.touches || !e.touches.length) return;
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    testimonialsViewport.addEventListener('touchend', (e) => {
        if (touchStartX === null || !e.changedTouches || !e.changedTouches.length) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        touchStartX = null;
        if (Math.abs(deltaX) < 40) return;
        if (deltaX < 0) setIndex(index + 1);
        else setIndex(index - 1);
    }, { passive: true });

    window.addEventListener('resize', refresh);
    if (mobileQuery.addEventListener) {
        mobileQuery.addEventListener('change', refresh);
    } else if (mobileQuery.addListener) {
        mobileQuery.addListener(refresh);
    }

    if (reducedMotionQuery.matches) {
        track.style.transition = 'none';
    }

    refresh();
}

// ======================================================================
// == 9. PAGE EXTRAS (Scroll Down + Hero Hide) ==
// ======================================================================
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.style.transition = 'opacity 0.3s ease-out';
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '0.8';
        }
    });
}

const scrollLink = document.querySelector('.scroll-indicator-link');
if (scrollLink) {
    scrollLink.addEventListener('click', function(event) {
        event.preventDefault();
        const targetSection = document.querySelector(scrollLink.getAttribute('href')) || document.querySelector('#mission') || document.querySelector('#profile-start');
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

if (document.body.classList.contains('homepage')) {
    const heroVideoSection = document.querySelector('.hero-video');
    if (heroVideoSection) {
        window.addEventListener('scroll', function() {
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;
            const scrollTop = window.scrollY;
            const maxScroll = scrollHeight - clientHeight;
            if (scrollTop >= (maxScroll - 100)) {
                heroVideoSection.classList.add('is-hidden');
            } else {
                heroVideoSection.classList.remove('is-hidden');
            }
        });
    }
}

// ======================================================================
// == 10. GPU CURSOR ENGINE (Zero Lag) ==
// ======================================================================
const customCursor = document.querySelector('.custom-cursor');
const menuCursor = document.querySelector('.menu-cursor');
const bodyForCursor = document.querySelector('body');
const htmlForCursor = document.documentElement;

const setCursorModeClass = (className, isOn) => {
    if (isOn && !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        return;
    }
    htmlForCursor.classList.toggle(className, isOn);
    if (bodyForCursor) bodyForCursor.classList.toggle(className, isOn);
};

const leftForRelated = (root, related) => {
    // true when the pointer left the root (not just moved to a child)
    return !related || !root.contains(related);
};

if (customCursor && !customCursor.querySelector('.cursor-visual')) {
    const content = customCursor.innerHTML;
    customCursor.innerHTML = `<div class="cursor-visual">${content}</div>`;
}
if (menuCursor && !menuCursor.querySelector('.menu-cursor-visual')) {
    const content = menuCursor.innerHTML;
    menuCursor.innerHTML = `<div class="menu-cursor-visual">${content}</div>`;
}

// Followers must never steal hit-testing from the page under the pointer
[customCursor, menuCursor].forEach((el) => {
    if (!el) return;
    el.style.pointerEvents = 'none';
    el.querySelectorAll('*').forEach((child) => {
        child.style.pointerEvents = 'none';
    });
});

// Sit the custom icons beside the OS arrow (down-right), not under the hotspot
const CURSOR_FOLLOW_OFFSET_X = 12;
const CURSOR_FOLLOW_OFFSET_Y = 12;

let mouseX = 0;
let mouseY = 0;
let isMoving = false;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isMoving) {
        isMoving = true;
        requestAnimationFrame(animateCursors);
    }
});

function animateCursors() {
    if (customCursor) {
        customCursor.style.transform =
            `translate3d(${mouseX + CURSOR_FOLLOW_OFFSET_X}px, ${mouseY + CURSOR_FOLLOW_OFFSET_Y}px, 0)`;
    }
    if (menuCursor) {
        menuCursor.style.transform =
            `translate3d(${mouseX + CURSOR_FOLLOW_OFFSET_X}px, ${mouseY + CURSOR_FOLLOW_OFFSET_Y}px, 0)`;
    }
    requestAnimationFrame(animateCursors);
}

if (htmlForCursor) {
    const portfolioItemsForCursor = document.querySelectorAll('.portfolio-grid-section .grid-item');
    portfolioItemsForCursor.forEach((item) => {
        item.addEventListener('pointerover', (e) => {
            if (leftForRelated(item, e.relatedTarget)) {
                setCursorModeClass('cursor-hover', true);
            }
        });
        item.addEventListener('pointerout', (e) => {
            if (leftForRelated(item, e.relatedTarget)) {
                setCursorModeClass('cursor-hover', false);
            }
        });
    });

    const navRoot = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav a');
    const navList = navRoot ? navRoot.querySelector('ul') : null;
    const navItems = navRoot ? navRoot.querySelectorAll('li') : [];
    const isMenuLinkNode = (node) =>
        !!(node && node.nodeType === 1 && node.closest && node.closest('.main-nav a'));
    const activateMenuCursor = (e, root) => {
        if (navRoot && !navRoot.classList.contains('nav-open')) return;
        if (leftForRelated(root, e.relatedTarget)) {
            setCursorModeClass('menu-cursor-active', true);
        }
    };
    const deactivateMenuCursor = (e, root) => {
        if (leftForRelated(root, e.relatedTarget)) {
            // Keep active when moving between the four words
            if (isMenuLinkNode(e.relatedTarget)) return;
            setCursorModeClass('menu-cursor-active', false);
        }
    };
    const clearMenuLinkHover = () => {
        if (!navRoot) return;
        navRoot.classList.remove('has-menu-hover');
        navLinks.forEach((a) => a.classList.remove('is-current'));
    };
    const setMenuLinkCurrent = (link) => {
        if (!navRoot || !navRoot.classList.contains('nav-open')) return;
        navRoot.classList.add('has-menu-hover');
        navLinks.forEach((a) => a.classList.toggle('is-current', a === link));
    };

    // Menu arrow cursor ONLY on the four words — not the empty black panel.
    navLinks.forEach((link) => {
        link.addEventListener('pointerover', (e) => activateMenuCursor(e, link));
        link.addEventListener('pointerout', (e) => deactivateMenuCursor(e, link));
    });

    // Dim while pointer is inside the list (including gaps); highlight only the current word.
    // Class-based colors — not :hover — so the menu-cursor follower cannot flicker a:hover.
    if (navList) {
        navList.addEventListener('pointerover', (e) => {
            if (!navRoot.classList.contains('nav-open')) return;
            if (leftForRelated(navList, e.relatedTarget)) {
                navRoot.classList.add('has-menu-hover');
            }
        });
        navList.addEventListener('pointerout', (e) => {
            if (leftForRelated(navList, e.relatedTarget)) {
                clearMenuLinkHover();
            }
        });
    }
    navItems.forEach((item) => {
        const link = item.querySelector('a');
        if (!link) return;
        item.addEventListener('pointerover', (e) => {
            if (!leftForRelated(item, e.relatedTarget)) return;
            setMenuLinkCurrent(link);
        });
        item.addEventListener('pointerout', (e) => {
            if (!leftForRelated(item, e.relatedTarget)) return;
            link.classList.remove('is-current');
            // Stay dimmed if still inside the list (gap / another li); clear only when leaving ul
            if (!navList || !navList.contains(e.relatedTarget)) {
                clearMenuLinkHover();
            }
        });
    });
}

// ======================================================================
// == 11. AJAX CONTACT FORM (No Redirect) ==
// ======================================================================
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const statusBtn = contactForm.querySelector('button');
        const originalText = statusBtn.textContent;
        statusBtn.textContent = 'SENDING...';
        statusBtn.disabled = true;
        statusBtn.style.opacity = '0.7';

        const formData = new FormData(contactForm);
        fetch(contactForm.action, {
            method: contactForm.method,
            body: formData,
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            if (response.ok) {
                fadeToPage('success.html');
            } else {
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        alert(data["errors"].map(error => error["message"]).join(", "));
                    } else {
                        alert("Oops! There was a problem submitting your form");
                    }
                    statusBtn.textContent = originalText;
                    statusBtn.disabled = false;
                    statusBtn.style.opacity = '1';
                });
            }
        }).catch(error => {
            alert("Oops! There was a problem submitting your form");
            statusBtn.textContent = originalText;
            statusBtn.disabled = false;
            statusBtn.style.opacity = '1';
        });
    });
}

// ======================================================================
// == 12. UNIVERSAL PAGE TRANSITIONS (Short fade, no loader) ==
// ======================================================================
var PAGE_FADE_MS = 150;

function fadeToPage(url) {
    var curtain = document.querySelector('.page-transition-curtain');
    if (!curtain) {
        window.location.href = url;
        return;
    }

    curtain.classList.add('is-active');
    setTimeout(function() {
        window.location.href = url;
    }, PAGE_FADE_MS);
}

document.addEventListener('DOMContentLoaded', function() {
    
    var curtain = document.querySelector('.page-transition-curtain');

    if (!curtain) {
        curtain = document.createElement('div');
        curtain.classList.add('page-transition-curtain', 'is-active');
        document.body.appendChild(curtain);
    }

    function playPageIntro() {
        var aboutTitle = document.querySelector('.about-hero-title');
        if (aboutTitle) {
            aboutTitle.classList.add('allow-intro-transition');

            setTimeout(function() {
                aboutTitle.classList.add('intro-visible');
            }, 100);

            setTimeout(function() {
                aboutTitle.classList.remove('allow-intro-transition');
            }, 1300);
        }

        // Work page: same fade/rise as filter clicks (not the old column slide)
        var portfolioGrid = document.querySelector('body.portfolio-page .portfolio-grid-section');
        if (portfolioGrid && typeof animateWorkPanelsEntrance === 'function') {
            var visiblePanels = Array.prototype.slice.call(
                portfolioGrid.querySelectorAll('.grid-item')
            ).filter(function(item) {
                return !item.hidden;
            });
            animateWorkPanelsEntrance(visiblePanels);
        }
    }

    function revealPage() {
        window.requestAnimationFrame(function() {
            window.requestAnimationFrame(function() {
                curtain.classList.remove('is-active');
                playPageIntro();
            });
        });
    }

    revealPage();

    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            revealPage();
        }
    });

    var internalLinks = document.querySelectorAll('a[href="index.html"], a[href="about.html"], a[href="portfolio.html"], a[href="contact.html"], a[href="./"]');

    internalLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            
            var targetUrl = this.getAttribute('href');

            if (!targetUrl || targetUrl.charAt(0) === '#') return;
            if (link.target === '_blank') return;
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

            e.preventDefault();

            // Keep the open menu over the old page until the curtain is
            // opaque. Removing it here reveals the page during the fade.
            fadeToPage(targetUrl);
        });
    });
});

// ======================================================================
// == 13. ABOUT PAGE: Intro Sequence (Images + Text) ==
// ======================================================================
const scrollTrigger = document.querySelector('.about-scroll-trigger');

if (scrollTrigger) {
    const title = scrollTrigger.querySelector('.about-hero-title');
    const paragraph = scrollTrigger.querySelector('.about-intro-paragraph');
    const image1 = scrollTrigger.querySelector('.intro-flying-image-1');
    const image2 = scrollTrigger.querySelector('.intro-flying-image-2'); 
    const profileText = scrollTrigger.querySelector('.intro-flying-text');
    const indicator = scrollTrigger.querySelector('.scroll-indicator');

    window.addEventListener('scroll', function() {
        
        const rect = scrollTrigger.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        const distanceScrolled = -rect.top;
        const totalDistance = rect.height - windowHeight;
        
        let progress = Math.max(0, Math.min(1, distanceScrolled / totalDistance));

        if (rect.bottom > 0) {
            
            // --- PHASE 1: TITLE ---
            let titleOpacity = 1 - (progress * 6.6); 
            titleOpacity = Math.max(0, Math.min(1, titleOpacity));
            
            if (title) {
                title.style.opacity = titleOpacity;
                title.style.transform = 'translateY(calc(-50% - ' + (progress * 400) + 'px))';
            }
            if (indicator) {
                 indicator.style.opacity = titleOpacity;
            }

            // --- PHASE 2: PARAGRAPH ---
            let paraOpacity = 0;
            if (progress > 0.20 && progress < 0.40) {
                if (progress < 0.25) {
                    paraOpacity = (progress - 0.20) * 20; 
                } else if (progress > 0.35) {
                    paraOpacity = 1 - ((progress - 0.35) * 20); 
                } else {
                    paraOpacity = 1; 
                }
            }
            
            let paraMove = (progress - 0.30) * 1000; 

            if (paragraph) {
                paragraph.style.opacity = Math.max(0, Math.min(1, paraOpacity));
                paragraph.style.transform = 'translate(-50%, calc(-65% - ' + paraMove + 'px))';
            }

            // CONSTANTS
            const DURATION = 0.45;
            const ZOOM_AMT = 2.0;  
            const PAN_AMT = 185;   

            // --- PHASE 3: IMAGE 1 ---
            if (image1) {
                let startAt = 0.40;
                let imgOpacity = 0;
                let scale = 0.5;
                let xMove = -50; 
                let blur = 0;

                if (progress > startAt && progress < (startAt + DURATION + 0.1)) {
                    let localProg = (progress - startAt) / DURATION;
                    
                    if (localProg < 0.2) imgOpacity = localProg * 5; 
                    else if (localProg > 0.8) {
                        imgOpacity = 1 - ((localProg - 0.8) * 5); 
                        blur = (localProg - 0.8) * 60; 
                    } else imgOpacity = 1;

                    scale = 0.5 + (localProg * ZOOM_AMT);
                    xMove = -80 - (localProg * PAN_AMT); 
                }
                
                image1.style.opacity = Math.max(0, Math.min(1, imgOpacity));
                image1.style.filter = 'blur(' + blur + 'px)';
                image1.style.transform = 'translate(' + xMove + '%, -50%) scale(' + scale + ')';
            }

            // --- PHASE 4: IMAGE 2 ---
            if (image2) {
                let startAt = 0.50; 
                let imgOpacity = 0;
                let scale = 0.5;
                let xMove = -50; 
                let blur = 0;

                if (progress > startAt && progress < (startAt + DURATION + 0.1)) {
                    let localProg = (progress - startAt) / DURATION;

                    if (localProg < 0.2) imgOpacity = localProg * 5; 
                    else if (localProg > 0.75) {
                        imgOpacity = 1 - ((localProg - 0.75) * 4); 
                        blur = (localProg - 0.75) * 60; 
                    } else imgOpacity = 1;

                    scale = 0.5 + (localProg * ZOOM_AMT);
                    xMove = -20 + (localProg * PAN_AMT); 
                }

                image2.style.opacity = Math.max(0, Math.min(1, imgOpacity));
                image2.style.filter = 'blur(' + blur + 'px)';
                image2.style.transform = 'translate(' + xMove + '%, -50%) scale(' + scale + ')';
            }

            // --- PHASE 5: PROFILE TEXT ---
            if (profileText) {
                let startAt = 0.80; 
                let txtOpacity = 0;
                let scale = 0.5;
                let blur = 0;

                if (progress > 0.80) {
                    
                    let localProg = (progress - 0.80) / 0.20; 
                    if (localProg > 1) localProg = 1;

                    if (localProg < 0.2) {
                        txtOpacity = localProg * 5; 
                    } 
                    else if (localProg > 0.6) {
                        txtOpacity = 1 - ((localProg - 0.6) * 2.5); 
                        blur = (localProg - 0.6) * 40; 
                    } else {
                        txtOpacity = 1;
                    }

                    scale = 0.5 + (localProg * 1.5);
                }

                profileText.style.opacity = Math.max(0, Math.min(1, txtOpacity));
                profileText.style.filter = 'blur(' + blur + 'px)';
                profileText.style.transform = 'translate(-50%, -50%) scale(' + scale + ')';
            }
        }
    });
}
// ======================================================================
// == 14. ABOUT PAGE: Timeline (Longer Hold at End) ==
// ======================================================================

const servicesSection = document.querySelector('.services-section');
const servicesSticky = document.querySelector('.services-sticky-container');
const track = document.querySelector('.services-track');
const items = document.querySelectorAll('.service-item');
const axisLine = document.querySelector('.timeline-axis');
const stickyProfile = document.querySelector('.profile-grid-section') || document.querySelector('.about-scroll-trigger');

if (servicesSection && track && servicesSticky) {
    
    // PHYSICS VARIABLES
    let targetProgress = 0; 
    let smoothProgress = 0; 
    const LERP_FACTOR = 0.1;
    const servicesMotionQuery = window.matchMedia('(min-width: 901px)');
    let servicesMotionEnabled = servicesMotionQuery.matches;

    function clearServicesMotion() {
        servicesSticky.style.transform = '';
        track.style.transform = '';
        if (axisLine) {
            axisLine.style.opacity = '';
            axisLine.style.width = '';
        }
        if (stickyProfile) {
            stickyProfile.style.transform = '';
            stickyProfile.style.filter = '';
        }
        items.forEach((item) => {
            item.style.opacity = '';
            item.classList.remove('has-arrived');
            item.classList.remove('form-grid');
            const label = item.querySelector('.service-label');
            const heading = item.querySelector('h2');
            const paragraph = item.querySelector('p');
            if (label) label.style.transform = '';
            if (heading) heading.style.transform = '';
            if (paragraph) paragraph.style.opacity = '';
            item.querySelectorAll('.collage-box').forEach((box) => {
                box.style.opacity = '';
                box.style.transition = '';
            });
        });
    }

    function setServicesMotion(enabled) {
        servicesMotionEnabled = enabled;
        if (!enabled) {
            targetProgress = 0;
            smoothProgress = 0;
            clearServicesMotion();
        }
    }

    if (servicesMotionQuery.addEventListener) {
        servicesMotionQuery.addEventListener('change', (event) => setServicesMotion(event.matches));
    }

    // 1. LISTEN TO SCROLL
    window.addEventListener('scroll', () => {
        if (!servicesMotionEnabled) return;
        const rect = servicesSection.getBoundingClientRect();
        const incomingPosition = rect.top; 
        const windowHeight = window.innerHeight;
        
        const totalDistance = rect.height + windowHeight;
        const scrolledDistance = (rect.top - windowHeight) * -1;
        
        let rawProg = scrolledDistance / totalDistance;
        targetProgress = Math.max(0, Math.min(1, rawProg));
    });

    // 2. ANIMATION LOOP
    function animateTimeline() {
        if (!servicesMotionEnabled) {
            requestAnimationFrame(animateTimeline);
            return;
        }
        
        smoothProgress += (targetProgress - smoothProgress) * LERP_FACTOR;

        // MAP PHASES
        // Phase 1: Entry (0.0 to 0.15)
        // Phase 2: Expand (0.15 to 0.30)
        // Phase 3: Horizontal (0.30 to 0.85) - CHANGED: Finishes at 85%
        // Phase 4: Hold (0.85 to 1.0) - A solid 15% buffer at the end
        
        let entryLocal = Math.max(0, Math.min(1, smoothProgress / 0.15));
        let expandLocal = Math.max(0, Math.min(1, (smoothProgress - 0.15) / 0.15));
        
        // HORIZONTAL LOGIC
        // Maps the range 0.30 -> 0.85 to 0.0 -> 1.0
        // Divisor is (0.85 - 0.30) = 0.55
        let horizLocal = Math.max(0, Math.min(1, (smoothProgress - 0.30) / 0.55));

        if (items.length > 0) {
            const introHeader = items[0].querySelector('h2');
            const introPara = items[0].querySelector('p');
            const introDot = items[0].querySelector('.timeline-dot');
            const introCollage = items[0].querySelector('.intro-collage');
            const introBoxes = items[0].querySelectorAll('.collage-box');

            // --- PHASE 1: ENTRY & EXPANSION ---
            if (entryLocal < 1) {
                let slowDownOffset = (1 - entryLocal) * (window.innerHeight * 0.3);
                servicesSticky.style.transform = `translate3d(0, ${slowDownOffset}px, 0)`;

                let entryLift = 100 - (entryLocal * 100);
                if (introHeader) {
                    introHeader.style.transformOrigin = "bottom center";
                    introHeader.style.transform = `translate3d(0, ${entryLift}px, 0) scale(2)`;
                }
                items[0].style.opacity = entryLocal;
                if (introPara) introPara.style.opacity = 0;
            } 
            else {
                servicesSticky.style.transform = `translate3d(0, 0px, 0)`;

                let liftHeight = 150;
                if (introPara) liftHeight = introPara.offsetHeight - 25;

                if (introHeader) {
                    introHeader.style.transformOrigin = "bottom center";
                    let currentLift = expandLocal * liftHeight;
                    let currentScale = 2 - expandLocal; 
                    introHeader.style.transform = `translate3d(0, -${currentLift}px, 0) scale(${currentScale})`;
                }
                items[0].style.opacity = 1;
                
                if (introPara) {
                    let fadeStart = 0.5;
                    let textOpacity = 0;
                    if (expandLocal > fadeStart) {
                        textOpacity = (expandLocal - fadeStart) / (1 - fadeStart);
                    }
                    introPara.style.opacity = textOpacity;
                }
            }

            // IMAGES LOGIC
            if (introCollage) {
                if (expandLocal > 0.3) introCollage.classList.add('is-landed');
                else introCollage.classList.remove('is-landed');

                let boxOpacity = 1;
                if (horizLocal > 0) {
                    if (horizLocal < 0.05) boxOpacity = 1 - (horizLocal * 20);
                    else boxOpacity = 0;
                }
                
                introBoxes.forEach(box => {
                    box.style.opacity = boxOpacity;
                    if (horizLocal > 0) box.style.transition = 'none';
                    else box.style.transition = '';
                });
            }

            // DOT LOGIC
            if (introDot) {
                if (expandLocal > 0.85) introDot.classList.add('pop-in');
                else introDot.classList.remove('pop-in');
            }
        }

        // --- PHASE 3: HORIZONTAL SCROLL ---
        if (axisLine) {
            axisLine.style.opacity = (expandLocal >= 1) ? 1 : 0;
            
            const trackWidth = track.scrollWidth;
            const viewportWidth = window.innerWidth;
            
            // Add a 100px buffer to ensure we definitely reach the end
            const moveDistance = trackWidth - viewportWidth + 100;
            
            let xPos = -(horizLocal * moveDistance);
            axisLine.style.width = Math.abs(xPos) + 'px';
            
            track.style.transform = `translate3d(${xPos}px, -50%, 0)`;

            // Active Items
            const startX = items[0].offsetLeft + (items[0].offsetWidth / 2);
            const currentLineLength = Math.abs(xPos);

            items.forEach((item, index) => {
                if (index === 0) return;

                const itemCenterX = item.offsetLeft + (item.offsetWidth / 2);
                const distanceToItem = itemCenterX - startX;
                const label = item.querySelector('.service-label');
                const p = item.querySelector('p');

                if (currentLineLength >= distanceToItem) {
                    item.classList.add('has-arrived');
                    if (label && p && !item.classList.contains('trusted-item')) {
                        const pHeight = p.offsetHeight;
                        const liftAmount = pHeight + 15; 
                        label.style.transform = `translate3d(-50%, -${liftAmount}px, 0)`;
                    }
                } else {
                    item.classList.remove('has-arrived');
                    if (label && !item.classList.contains('trusted-item')) {
                        label.style.transform = `translate3d(-50%, 0px, 0)`;
                    }
                }
            });
        }

        // BACKGROUND PARALLAX
        if (stickyProfile) {
            if (entryLocal < 1) {
                const scale = 1 - (entryLocal * 0.05); 
                const brightness = 1 - (entryLocal * 0.5); 
                const yPos = -(entryLocal * 100);
                stickyProfile.style.transform = `translate3d(0, ${yPos}px, 0) scale(${scale})`;
                stickyProfile.style.filter = `brightness(${brightness})`;
            } else {
                stickyProfile.style.transform = `translate3d(0, -100px, 0) scale(0.95)`;
                stickyProfile.style.filter = `brightness(0.5)`;
            }
        }

        requestAnimationFrame(animateTimeline);
    }

    animateTimeline();
}

// ======================================================================
// == ABOUT PAGE: Opening + scroll reveals ==
// ======================================================================
(function initAboutReveals() {
    if (!document.body.classList.contains('about-page')) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var STAGGER_MS = 100;
    var revealGroups = [];

    function prepareReveal(el, delayIndex) {
        if (!el) return null;
        el.classList.add('about-reveal');
        el.style.setProperty('--about-reveal-delay', ((delayIndex || 0) * STAGGER_MS / 1000) + 's');
        return el;
    }

    function revealAll(els) {
        els.forEach(function(el) {
            if (!el) return;
            // Enable transition only while already at the hidden pose, then reveal
            el.classList.add('about-reveal-animate');
            void el.offsetWidth;
            el.classList.add('is-revealed');
        });
    }

    // Opening copy over the studio photo (photo itself is not animated)
    var openingEls = [];
    var studioCopy = document.querySelector('.about-studio-copy');
    if (studioCopy) {
        var openingHeadline = studioCopy.querySelector('h1');
        var openingParagraph = studioCopy.querySelector('p');
        var openingButtons = studioCopy.querySelectorAll('a.button-outline, a.about-studio-cta, button');
        if (openingHeadline) openingEls.push(prepareReveal(openingHeadline, openingEls.length));
        if (openingParagraph) openingEls.push(prepareReveal(openingParagraph, openingEls.length));
        openingButtons.forEach(function(btn) {
            openingEls.push(prepareReveal(btn, openingEls.length));
        });
        revealGroups.push({ els: openingEls, opening: true });
    }

    // On set: title, then paragraph
    var onsetTitle = document.getElementById('about-onset-title');
    if (onsetTitle) {
        var onsetBlock = onsetTitle.closest('.about-block') || onsetTitle.parentElement;
        var onsetParagraph = onsetBlock ? onsetBlock.querySelector(':scope > p') : null;
        var onsetEls = [];
        onsetEls.push(prepareReveal(onsetTitle, 0));
        if (onsetParagraph) onsetEls.push(prepareReveal(onsetParagraph, 1));
        revealGroups.push({ els: onsetEls.filter(Boolean), root: onsetTitle });
    }

    // From the film: title, then content under it
    var filmBlocks = document.querySelectorAll('.about-selected .about-block');
    filmBlocks.forEach(function(block) {
        if (block.querySelector('#about-onset-title')) return;
        var filmTitle = block.querySelector('h2');
        if (!filmTitle) return;
        var filmContent = null;
        var sibling = filmTitle.nextElementSibling;
        while (sibling) {
            if (sibling.tagName !== 'H2') {
                filmContent = sibling;
                break;
            }
            sibling = sibling.nextElementSibling;
        }
        var filmEls = [];
        filmEls.push(prepareReveal(filmTitle, 0));
        if (filmContent) filmEls.push(prepareReveal(filmContent, 1));
        revealGroups.push({ els: filmEls.filter(Boolean), root: filmTitle });
    });

    // Our Expertise: title, paragraph, then numbered items (staggered)
    var expertiseTitle = document.getElementById('about-expertise-title');
    if (expertiseTitle) {
        var expertiseSection = expertiseTitle.closest('.about-expertise') || expertiseTitle.parentElement;
        var expertiseIntro = expertiseSection ? expertiseSection.querySelector('.about-expertise-intro') : null;
        var expertiseItems = expertiseSection
            ? expertiseSection.querySelectorAll('.about-expertise-stages > li')
            : [];
        var expertiseEls = [];
        expertiseEls.push(prepareReveal(expertiseTitle, 0));
        if (expertiseIntro) expertiseEls.push(prepareReveal(expertiseIntro, 1));
        expertiseItems.forEach(function(item, i) {
            expertiseEls.push(prepareReveal(item, 2 + i));
        });
        revealGroups.push({ els: expertiseEls.filter(Boolean), root: expertiseTitle });
    }

    // Trusted by: title, then logo grid as one group
    var clientsTitle = document.getElementById('about-clients-title');
    if (clientsTitle) {
        var clientsInner = clientsTitle.closest('.about-clients-inner') || clientsTitle.parentElement;
        var clientsGrid = clientsInner ? clientsInner.querySelector('.about-clients-grid') : null;
        var clientsEls = [];
        clientsEls.push(prepareReveal(clientsTitle, 0));
        if (clientsGrid) clientsEls.push(prepareReveal(clientsGrid, 1));
        revealGroups.push({ els: clientsEls.filter(Boolean), root: clientsTitle });
    }

    // Gate CSS hide only after elements are marked (avoids blank page without JS)
    document.body.classList.add('js-about-motion');

    if (reduceMotion) {
        revealGroups.forEach(function(group) {
            group.els.forEach(function(el) {
                if (!el) return;
                el.classList.add('about-reveal-animate', 'is-revealed');
            });
        });
        return;
    }

    // Opening: paint the hidden pose first, then enable transitions and reveal once
    var openingGroup = revealGroups.find(function(g) { return g.opening; });
    if (openingGroup && openingGroup.els.length) {
        openingGroup.els.forEach(function(el) {
            void el.offsetWidth;
        });
        window.requestAnimationFrame(function() {
            window.requestAnimationFrame(function() {
                window.setTimeout(function() {
                    revealAll(openingGroup.els);
                }, 50);
            });
        });
    }

    var scrollGroups = revealGroups.filter(function(g) { return !g.opening && g.root; });
    if (!scrollGroups.length || !('IntersectionObserver' in window)) {
        scrollGroups.forEach(function(group) {
            revealAll(group.els);
        });
        return;
    }

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (!entry.isIntersecting) return;
            var group = scrollGroups.find(function(g) { return g.root === entry.target; });
            if (!group || group.done) return;
            group.done = true;
            revealAll(group.els);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

    scrollGroups.forEach(function(group) {
        observer.observe(group.root);
    });
})();
// ======================================================================
// == ABOUT PAGE: Sub-nav scroll-spy (is-active follows section in view) ==
// ======================================================================
(function initAboutSectionNav() {
    if (!document.body.classList.contains('about-page')) return;

    var nav = document.querySelector('.about-section-nav');
    if (!nav) return;

    var items = [];
    nav.querySelectorAll('a[href^="#"]').forEach(function(link) {
        var id = (link.getAttribute('href') || '').replace(/^#/, '');
        if (!id) return;
        var target = document.getElementById(id);
        if (!target) return;
        var section = document.querySelector('[aria-labelledby="' + id + '"]')
            || target.closest('section')
            || target;
        items.push({ link: link, section: section, id: id });
    });
    if (!items.length) return;

    var activeLink = null;
    var suppressSpy = false;
    var settleTimer = null;
    var PROBE_RATIO = 0.35; // ~30–40% down the viewport

    function setActiveLink(link) {
        if (activeLink === link) return;
        items.forEach(function(item) {
            if (item.link === link) item.link.classList.add('is-active');
            else item.link.classList.remove('is-active');
        });
        activeLink = link || null;
    }

    function pickSectionItem() {
        var vh = window.innerHeight || 0;
        if (!vh) return null;
        var probeY = vh * PROBE_RATIO;

        // Prefer the section whose bounds contain the probe line
        var i;
        for (i = 0; i < items.length; i++) {
            var rect = items[i].section.getBoundingClientRect();
            if (rect.top <= probeY && rect.bottom > probeY) return items[i];
        }

        // Fallback: greatest intersection with the top half of the viewport
        var half = vh * 0.5;
        var best = null;
        var bestVisible = 0;
        for (i = 0; i < items.length; i++) {
            var r = items[i].section.getBoundingClientRect();
            var visible = Math.min(r.bottom, half) - Math.max(r.top, 0);
            if (visible > bestVisible) {
                bestVisible = visible;
                best = items[i];
            }
        }
        if (bestVisible < vh * 0.12) return null;
        return best;
    }

    function updateSpy() {
        if (suppressSpy) return;
        var match = pickSectionItem();
        setActiveLink(match ? match.link : null);
    }

    function endSuppress() {
        suppressSpy = false;
        settleTimer = null;
        updateSpy();
    }

    function scheduleSettle(ms) {
        if (settleTimer) window.clearTimeout(settleTimer);
        settleTimer = window.setTimeout(endSuppress, ms);
    }

    function onScroll() {
        if (suppressSpy) {
            // Keep destination highlight until smooth scroll settles
            scheduleSettle(150);
            return;
        }
        updateSpy();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateSpy);

    items.forEach(function(item) {
        item.link.addEventListener('click', function() {
            suppressSpy = true;
            setActiveLink(item.link);
            // Fallback if no scroll events fire (already at target / reduced motion)
            scheduleSettle(800);
            window.requestAnimationFrame(function() {
                item.link.blur();
            });
        });
    });

    updateSpy();
})();
// ======================================================================
// == HOMEPAGE: Opening + scroll reveals ==
// ======================================================================
(function initHomeReveals() {
    if (!document.body.classList.contains('homepage')) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var STAGGER_MS = 100;
    var revealGroups = [];

    function prepareReveal(el, delayIndex) {
        if (!el) return null;
        el.classList.add('home-reveal');
        el.style.setProperty('--home-reveal-delay', ((delayIndex || 0) * STAGGER_MS / 1000) + 's');
        return el;
    }

    function revealAll(els) {
        els.forEach(function(el) {
            if (!el) return;
            el.classList.add('home-reveal-animate');
            void el.offsetWidth;
            el.classList.add('is-revealed');
        });
    }

    // Hero intro on load (video stays still)
    var heroEls = [];
    var heroHeadline = document.querySelector('.hero-intro-headline');
    var heroSub = document.querySelector('.hero-intro-sub');
    var heroCta = document.querySelector('.hero-intro-cta');
    if (heroHeadline) heroEls.push(prepareReveal(heroHeadline, 0));
    if (heroSub) heroEls.push(prepareReveal(heroSub, 1));
    if (heroCta) heroEls.push(prepareReveal(heroCta, 2));
    if (heroEls.length) {
        revealGroups.push({ els: heroEls, opening: true });
    }

    // Mission image + ABOUT CTA (not the pre-title)
    var missionImage = document.querySelector('.mission-image');
    var missionCta = document.querySelector('.mission-text > a.button-outline');
    var missionEls = [];
    if (missionImage) missionEls.push(prepareReveal(missionImage, 0));
    if (missionCta) missionEls.push(prepareReveal(missionCta, 1));
    if (missionEls.length) {
        var missionRoot = missionImage || missionCta;
        revealGroups.push({ els: missionEls, root: missionRoot });
    }

    // Footer CTA + nav
    var footerCta = document.querySelector('.footer-cta-new');
    var footerNav = document.querySelector('.footer-nav-new');
    var footerEls = [];
    if (footerCta) footerEls.push(prepareReveal(footerCta, 0));
    if (footerNav) footerEls.push(prepareReveal(footerNav, 1));
    if (footerEls.length) {
        var footerRoot = footerCta || footerNav;
        revealGroups.push({ els: footerEls, root: footerRoot });
    }

    document.body.classList.add('js-home-motion');

    if (reduceMotion) {
        revealGroups.forEach(function(group) {
            group.els.forEach(function(el) {
                if (!el) return;
                el.classList.add('home-reveal-animate', 'is-revealed');
            });
        });
        return;
    }

    var openingGroup = revealGroups.find(function(g) { return g.opening; });
    if (openingGroup && openingGroup.els.length) {
        openingGroup.els.forEach(function(el) {
            void el.offsetWidth;
        });
        window.requestAnimationFrame(function() {
            window.requestAnimationFrame(function() {
                window.setTimeout(function() {
                    revealAll(openingGroup.els);
                }, 50);
            });
        });
    }

    var scrollGroups = revealGroups.filter(function(g) { return !g.opening && g.root; });
    if (!scrollGroups.length || !('IntersectionObserver' in window)) {
        scrollGroups.forEach(function(group) {
            revealAll(group.els);
        });
        return;
    }

    var homeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (!entry.isIntersecting) return;
            var group = scrollGroups.find(function(g) { return g.root === entry.target; });
            if (!group || group.done) return;
            group.done = true;
            revealAll(group.els);
            homeObserver.unobserve(entry.target);
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    scrollGroups.forEach(function(group) {
        homeObserver.observe(group.root);
    });
})();
// ======================================================================
// == CONTACT PAGE: On-load fade-and-rise (no scroll reveals) ==
// ======================================================================
(function initContactReveals() {
    if (!document.body.classList.contains('contact-page')) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var STAGGER_MS = 100;
    var openingEls = [];

    function prepareReveal(el, delayIndex) {
        if (!el) return null;
        el.classList.add('contact-reveal');
        el.style.setProperty('--contact-reveal-delay', ((delayIndex || 0) * STAGGER_MS / 1000) + 's');
        return el;
    }

    function revealAll(els) {
        els.forEach(function(el) {
            if (!el) return;
            el.classList.add('contact-reveal-animate');
            void el.offsetWidth;
            el.classList.add('is-revealed');
        });
    }

    var introHeadline = document.querySelector('.contact-intro h1');
    var introSub = document.querySelector('.contact-intro-subheadline');
    var contactDetails = document.querySelector('.contact-details');
    var formGroup = document.querySelector('.contact-form-container') || document.querySelector('.contact-form');

    if (introHeadline) openingEls.push(prepareReveal(introHeadline, 0));
    if (introSub) openingEls.push(prepareReveal(introSub, 1));
    if (contactDetails) openingEls.push(prepareReveal(contactDetails, 2));
    if (formGroup) openingEls.push(prepareReveal(formGroup, 3));

    document.body.classList.add('js-contact-motion');

    if (!openingEls.length) return;

    if (reduceMotion) {
        openingEls.forEach(function(el) {
            if (!el) return;
            el.classList.add('contact-reveal-animate', 'is-revealed');
        });
        return;
    }

    openingEls.forEach(function(el) {
        void el.offsetWidth;
    });
    window.requestAnimationFrame(function() {
        window.requestAnimationFrame(function() {
            window.setTimeout(function() {
                revealAll(openingEls);
            }, 50);
        });
    });
})();
