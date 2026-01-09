// ======================================================================
// == 1. MENU TOGGLE ==
// ======================================================================
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
const body = document.querySelector('body');

if (navToggle && mainNav && body) {
    navToggle.addEventListener('click', () => {
        mainNav.classList.toggle('nav-open');
        body.classList.toggle('body-no-scroll');
        if (mainNav.classList.contains('nav-open')) {
            navToggle.textContent = '× CLOSE';
        } else {
            navToggle.textContent = 'MENU';
        }
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
    const portfolioItems = document.querySelectorAll('.grid-item');

    function openLightbox(videoSrc, aspectRatio) {
        if (videoSrc) {
            if (aspectRatio === '9:16') {
                lightboxVideo.classList.add('controls-hidden');
                lightboxContent.classList.add('is-vertical');
            } else {
                lightboxContent.classList.remove('is-vertical');
            }
            if(customLoader) customLoader.classList.add('is-loading');
            lightbox.classList.add('is-loading');
            lightboxVideo.src = videoSrc;
            lightbox.classList.add('is-visible');
            lightboxVideo.play();
        }
    }

    function closeLightbox() {
        lightbox.classList.remove('is-visible');
        setTimeout(() => {
            lightboxVideo.pause();
            lightboxVideo.src = '';
            if(customLoader) customLoader.classList.remove('is-loading');
            lightbox.classList.remove('is-loading');
            lightboxContent.classList.remove('is-vertical');
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
            openLightbox(item.dataset.videoSrc, item.dataset.aspectRatio);
        });
    });

    closeButton.addEventListener('click', closeLightbox);
    if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
}

// ======================================================================
// == 6. RELLAX PARALLAX (Smart Detection) ==
// ======================================================================
if (typeof Rellax !== 'undefined' && window.innerWidth > 600) {
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
        const targetSection = document.querySelector('#mission') || document.querySelector('#profile-start');
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
                window.location.href = 'success.html';
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
// == 12. UNIVERSAL PAGE TRANSITIONS (Final - With Header Entry) ==
// ======================================================================
document.addEventListener('DOMContentLoaded', function() {
    
    var curtain = document.querySelector('.page-transition-curtain');
    
    if (document.body.classList.contains('homepage')) {
        if (curtain) {
            curtain.style.transition = 'none';
            curtain.style.transform = 'translateX(100%)';
            curtain.classList.remove('is-active');
        }
    } else {
        if (!curtain) {
            curtain = document.createElement('div');
            curtain.classList.add('page-transition-curtain');
            curtain.innerHTML = '<div class="page-loader"></div>';
            document.body.appendChild(curtain);
        }
    }

    window.addEventListener('load', function() {
        
        if (document.body.classList.contains('homepage')) {
            return;
        }

        setTimeout(function() {
            curtain.style.transition = 'transform 0.8s cubic-bezier(0.83, 0, 0.17, 1)'; 
            curtain.style.transform = 'translateX(100%)'; 

            // --- ABOUT PAGE HEADER ANIMATION ---
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

            // Trigger Portfolio Panels
            var portfolioGrid = document.querySelector('.portfolio-grid-section');
            if (portfolioGrid) {
                setTimeout(function() {
                    portfolioGrid.classList.add('animate-in');
                }, 400);
            }
            
            setTimeout(function() {
                curtain.classList.remove('is-active');
            }, 800);
        }, 500);
    });

    var internalLinks = document.querySelectorAll('a[href="index.html"], a[href="about.html"], a[href="portfolio.html"], a[href="contact.html"], a[href="./"]');

    internalLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            
            var targetUrl = this.getAttribute('href');

            if (targetUrl.startsWith('#')) return;

            e.preventDefault();

            var exitDelay = 0;
            var parentNav = this.closest('.main-nav');

            if (parentNav) {
                parentNav.classList.add('menu-exiting');
                exitDelay = 500; 
            }

            var isGoingHome = targetUrl.indexOf('index.html') > -1 || targetUrl === './' || targetUrl === '/';

            setTimeout(function() {
                
                if (isGoingHome) {
                    window.location.href = targetUrl;
                } else {
                    if (!curtain) {
                        curtain = document.createElement('div');
                        curtain.classList.add('page-transition-curtain');
                        curtain.innerHTML = '<div class="page-loader"></div>';
                        document.body.appendChild(curtain);
                    }
                    
                    curtain.style.display = 'block'; 
                    curtain.style.transition = 'none'; 
                    curtain.classList.add('is-active');

                    curtain.style.transform = 'translateX(-100%)'; 
                    
                    curtain.getBoundingClientRect(); 

                    curtain.style.transition = 'transform 0.6s cubic-bezier(0.83, 0, 0.17, 1)';
                    curtain.style.transform = 'translateX(0%)';

                    setTimeout(function() {
                        window.location.href = targetUrl;
                    }, 600); 
                }

            }, exitDelay); 
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
// == 14. ABOUT PAGE: Timeline (Luxury Scroll + End Pause) ==
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

    // 1. LISTEN TO SCROLL
    window.addEventListener('scroll', () => {
        const rect = servicesSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        const totalDistance = rect.height + windowHeight;
        const scrolledDistance = (rect.top - windowHeight) * -1;
        
        let rawProg = scrolledDistance / totalDistance;
        targetProgress = Math.max(0, Math.min(1, rawProg));
    });

    // 2. ANIMATION LOOP
    function animateTimeline() {
        
        // Apply Physics
        smoothProgress += (targetProgress - smoothProgress) * LERP_FACTOR;

        // MAP PHASES
        // Phase 1: Entry (0.0 to 0.15)
        // Phase 2: Expand (0.15 to 0.30)
        // Phase 3: Horizontal (0.30 to 0.90) - CHANGED: Ends at 0.90 instead of 1.0
        // Phase 4: Hold (0.90 to 1.0)
        
        let entryLocal = Math.max(0, Math.min(1, smoothProgress / 0.15));
        let expandLocal = Math.max(0, Math.min(1, (smoothProgress - 0.15) / 0.15));
        
        // UPDATED: Divisor is now 0.60 (0.90 - 0.30). 
        // This ensures movement finishes at 90% scroll.
        let horizLocal = Math.max(0, Math.min(1, (smoothProgress - 0.30) / 0.60));

        if (items.length > 0) {
            const introHeader = items[0].querySelector('h2');
            const introPara = items[0].querySelector('p');
            const introDot = items[0].querySelector('.timeline-dot');
            const introCollage = items[0].querySelector('.intro-collage');
            const introBoxes = items[0].querySelectorAll('.collage-box');

            // --- PHASE 1: ENTRY & EXPANSION ---
            if (entryLocal < 1) {
                // Slow Entry Parallax
                let slowDownOffset = (1 - entryLocal) * (window.innerHeight * 0.3);
                servicesSticky.style.transform = `translate3d(0, ${slowDownOffset}px, 0)`;

                // Header Animation
                let entryLift = 100 - (entryLocal * 100);
                if (introHeader) {
                    introHeader.style.transformOrigin = "bottom center";
                    introHeader.style.transform = `translate3d(0, ${entryLift}px, 0) scale(2)`;
                }
                items[0].style.opacity = entryLocal;
                if (introPara) introPara.style.opacity = 0;
            } 
            else {
                // Reset Sticky Position
                servicesSticky.style.transform = `translate3d(0, 0px, 0)`;

                // Expansion Logic
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
            const moveDistance = trackWidth - viewportWidth;
            
            // Move Track based on horizLocal (which finishes early)
            let xPos = -(horizLocal * moveDistance);
            axisLine.style.width = Math.abs(xPos) + 'px';
            track.style.transform = `translate3d(${xPos}px, -50%, 0)`;

            // 5. ACTIVE ITEMS LOGIC
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

        // 6. BACKGROUND PARALLAX
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