// ======================================================================
// == 1. MENU TOGGLE ==
// ======================================================================
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
const body = document.querySelector('body');

if (navToggle && mainNav && body) {
    const setMenuToggleLabel = (isOpen) => {
        navToggle.textContent = isOpen ? 'CLOSE' : 'MENU';
        navToggle.setAttribute('aria-label', isOpen ? 'close' : 'menu');
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    setMenuToggleLabel(mainNav.classList.contains('nav-open'));

    navToggle.addEventListener('click', () => {
        mainNav.classList.toggle('nav-open');
        body.classList.toggle('body-no-scroll');
        setMenuToggleLabel(mainNav.classList.contains('nav-open'));
    });
}

// ======================================================================
// == 2. HEADER HIDE ON SCROLL ==
// ======================================================================
const header = document.querySelector('header');
let lastScrollY = window.scrollY;

if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { 
            if (lastScrollY < window.scrollY) {
                header.classList.add('is-hidden');
            } else {
                header.classList.remove('is-hidden');
            }
        } else {
            header.classList.remove('is-hidden');
        }
        lastScrollY = window.scrollY;
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
if (typeof Rellax !== 'undefined' && window.innerWidth > 600 && document.querySelector('.rellax')) {
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

    var rellax = new Rellax('.rellax', options);
}

// Homepage films stay in one row while the white section first covers the hero.
// Their existing speeds only start once that row is on screen.
const workSection = document.querySelector('#work');
const workFilms = workSection ? workSection.querySelectorAll('.grid-item') : [];
if (workSection && workFilms.length) {
    const workFilmQuery = window.matchMedia('(min-width: 769px)');

    function updateWorkFilms() {
        if (!workFilmQuery.matches) {
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
// == 7. TESTIMONIALS DRAG ==
// ======================================================================
const slider = document.querySelector('.testimonials-scroller.draggable');
if (slider) {
    let isDown = false;
    let startX;
    let scrollLeft;
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('is-dragging');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('is-dragging');
    });
    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('is-dragging');
    });
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });
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

if (customCursor && !customCursor.querySelector('.cursor-visual')) {
    const content = customCursor.innerHTML;
    customCursor.innerHTML = `<div class="cursor-visual">${content}</div>`;
}
if (menuCursor && !menuCursor.querySelector('.menu-cursor-visual')) {
    const content = menuCursor.innerHTML;
    menuCursor.innerHTML = `<div class="menu-cursor-visual">${content}</div>`;
}

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
        customCursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }
    if (menuCursor) {
        menuCursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }
    requestAnimationFrame(animateCursors);
}

if (bodyForCursor) {
    const portfolioItemsForCursor = document.querySelectorAll('.portfolio-grid-section .grid-item');
    if (portfolioItemsForCursor.length > 0) {
        portfolioItemsForCursor.forEach(item => {
            item.addEventListener('mouseenter', () => bodyForCursor.classList.add('cursor-hover'));
            item.addEventListener('mouseleave', () => bodyForCursor.classList.remove('cursor-hover'));
        });
    }
    const navLinks = document.querySelectorAll('.main-nav a');
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => bodyForCursor.classList.add('menu-cursor-active'));
            link.addEventListener('mouseleave', () => bodyForCursor.classList.remove('menu-cursor-active'));
        });
    }
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

        var portfolioGrid = document.querySelector('body.portfolio-page .portfolio-grid-section');
        if (portfolioGrid) {
            portfolioGrid.classList.add('animate-in');
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