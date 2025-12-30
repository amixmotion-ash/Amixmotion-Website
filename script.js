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
// == 8. ACCORDION (Process) ==
// ======================================================================
const accordionItems = document.querySelectorAll('.accordion-item');
if (accordionItems.length > 0) {
    accordionItems.forEach(item => {
        const toggle = item.querySelector('.accordion-toggle');
        const content = item.querySelector('.accordion-content');
        toggle.addEventListener('click', () => {
            const currentlyOpenItem = document.querySelector('.accordion-item.is-open');
            if (currentlyOpenItem && currentlyOpenItem === item) {
                item.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = null;
            } else {
                if (currentlyOpenItem) {
                    currentlyOpenItem.classList.remove('is-open');
                    currentlyOpenItem.querySelector('.accordion-toggle').setAttribute('aria-expanded', 'false');
                    currentlyOpenItem.querySelector('.accordion-content').style.maxHeight = null;
                }
                item.classList.add('is-open');
                toggle.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
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
    
    // 1. Setup/Check Curtain
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

    // 2. HANDLE "OUT" ANIMATION (Reveal Page on Load)
    window.addEventListener('load', function() {
        
        if (document.body.classList.contains('homepage')) {
            return;
        }

        setTimeout(function() {
            // Restore animation speed for curtain
            curtain.style.transition = 'transform 0.8s cubic-bezier(0.83, 0, 0.17, 1)'; 
            curtain.style.transform = 'translateX(100%)'; 

            // --- ABOUT PAGE HEADER ANIMATION ---
            var aboutTitle = document.querySelector('.about-hero-title');
            if (aboutTitle) {
                // Step 1: Enable smooth transition temporarily
                aboutTitle.classList.add('allow-intro-transition');
                
                // Step 2: Trigger the move to center (after tiny delay)
                setTimeout(function() {
                    aboutTitle.classList.add('intro-visible');
                }, 100);

                // Step 3: Remove smooth transition so scroll works perfectly
                // We wait 1300ms (1.2s animation + 100ms delay)
                setTimeout(function() {
                    aboutTitle.classList.remove('allow-intro-transition');
                }, 1300);
            }
            // -----------------------------------

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

    // 3. HANDLE "IN" ANIMATION (Link Clicks)
    var internalLinks = document.querySelectorAll('a[href="index.html"], a[href="about.html"], a[href="portfolio.html"], a[href="contact.html"], a[href="./"]');

    internalLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            
            var targetUrl = this.getAttribute('href');

            if (targetUrl.startsWith('#')) return;

            e.preventDefault();

            // --- MENU EXIT SEQUENCE ---
            var exitDelay = 0;
            var parentNav = this.closest('.main-nav');

            if (parentNav) {
                parentNav.classList.add('menu-exiting');
                exitDelay = 500; 
            }
            // --------------------------

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

                    // Start from LEFT
                    curtain.style.transform = 'translateX(-100%)'; 
                    
                    curtain.getBoundingClientRect(); // Force Reflow

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
// == 13. ABOUT PAGE: Intro Sequence (Image 2 Adjusted) ==
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
        
        // Progress 0 to 1
        let progress = Math.max(0, Math.min(1, distanceScrolled / totalDistance));

        if (rect.bottom > 0) {
            
            // --- PHASE 1: TITLE (0% - 15%) ---
            let titleOpacity = 1 - (progress * 6.6); 
            titleOpacity = Math.max(0, Math.min(1, titleOpacity));
            
            if (title) {
                title.style.opacity = titleOpacity;
                title.style.transform = 'translateY(calc(-50% - ' + (progress * 400) + 'px))';
            }
            if (indicator) {
                 indicator.style.opacity = titleOpacity;
            }

            // --- PHASE 2: PARAGRAPH (20% - 40%) ---
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
            
            let paraMove = (progress - 0.20) * 800; 

            if (paragraph) {
                paragraph.style.opacity = Math.max(0, Math.min(1, paraOpacity));
                paragraph.style.transform = 'translate(-50%, calc(-50% - ' + paraMove + 'px))';
            }

            // =========================================================
            // CONSTANT SETTINGS
            // =========================================================
            const DURATION = 0.45;
            const ZOOM_AMT = 2.0;  
            const PAN_AMT = 185;   

            // --- PHASE 3: IMAGE 1 (Left Lane) ---
            // START: 0.40
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

            // --- PHASE 4: IMAGE 2 (Right Lane) ---
            // START: 0.50 (Earlier)
            if (image2) {
                let startAt = 0.50; 
                let imgOpacity = 0;
                let scale = 0.5;
                let xMove = -50; 
                let blur = 0;

                if (progress > startAt && progress < (startAt + DURATION + 0.1)) {
                    let localProg = (progress - startAt) / DURATION;

                    if (localProg < 0.2) imgOpacity = localProg * 5; 
                    // UPDATED: FADE OUT EARLIER (at 0.75 instead of 0.8)
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

            // --- PHASE 5: PROFILE TEXT (Center Lane) ---
            // START: 0.80
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
// == 14. ABOUT PAGE: Services (Perfect Keyline Connection) ==
// ======================================================================

const servicesSection = document.querySelector('.services-section');
const slide1 = document.querySelector('.service-slide.slide-1');
const slide2 = document.querySelector('.service-slide.slide-2');
const keyline = document.querySelector('.connecting-line'); 
const stickyProfile = document.querySelector('.profile-grid-section') || document.querySelector('.about-scroll-trigger');

if (servicesSection && slide1 && slide2) {
    
    function animateServices() {
        const rect = servicesSection.getBoundingClientRect();
        const incomingPosition = rect.top; 
        const windowHeight = window.innerHeight;
        
        // --- PHASE 1: ENTRY (Fade In) ---
        if (incomingPosition > 0 && incomingPosition <= windowHeight) {
            let entryProgress = 1 - (incomingPosition / windowHeight);
            
            // Slide 1 Entry
            slide1.style.opacity = entryProgress;
            let lift = 100 - (entryProgress * 100);
            slide1.style.transform = `translate(-50%, calc(-50% + ${lift}px))`; 
            
            // Reset
            if (keyline) keyline.style.width = '0px';
            slide2.style.opacity = 0;
            slide2.style.transform = `translate(50%, -50%)`; 

            // Background Dimming
            if (stickyProfile) {
                const scale = 1 - (entryProgress * 0.05); 
                const brightness = 1 - (entryProgress * 0.5); 
                const yPos = -(entryProgress * 100);
                stickyProfile.style.transform = `translate3d(0, ${yPos}px, 0) scale(${scale})`;
                stickyProfile.style.filter = `brightness(${brightness})`;
            }
        } 
        
        // --- PHASE 2: SWAP (The Connection) ---
        else if (incomingPosition <= 0) {
            
            const scrolled = Math.abs(incomingPosition);
            const totalScrollable = rect.height - windowHeight;
            let swapProgress = Math.min(1, scrolled / (totalScrollable * 0.95)); 

            // MATH CONSTANTS
            const MOVE_DISTANCE_VW = 60; // How far they move apart (in vw)
            const INITIAL_LINE_PX = 80;  // Initial sprout length

            // 1. KEYLINE GROWTH (0% - 15%)
            // It sprouts out a little bit (80px) before movement starts
            let lineGrowth = 0;
            if (swapProgress < 0.15) {
                lineGrowth = (swapProgress / 0.15) * INITIAL_LINE_PX;
            } else {
                lineGrowth = INITIAL_LINE_PX;
            }

            // 2. SLIDE 1 MOVEMENT (15% - 100%)
            // Moves Left. Line grows to fill the gap.
            let moveProgress = 0;
            if (swapProgress > 0.15) {
                moveProgress = (swapProgress - 0.15) / 0.85;
            }

            // Move Slide 1 Left (from Center to -60vw)
            // -50% is center. We subtract VW units.
            let s1Move = `calc(-50% - ${moveProgress * MOVE_DISTANCE_VW}vw)`;
            slide1.style.transform = `translate(${s1Move}, -50%)`;
            
            // Fade Out Slide 1 (Late - start fading at 50%)
            if (moveProgress > 0.5) {
                slide1.style.opacity = 1 - ((moveProgress - 0.5) * 2);
            } else {
                slide1.style.opacity = 1;
            }

            // Grow Line to match movement
            // Length = Initial Sprout + Distance Traveled
            if (keyline) {
                let extraWidth = moveProgress * window.innerWidth * (MOVE_DISTANCE_VW / 100);
                keyline.style.width = `${lineGrowth + extraWidth}px`;
            }

            // 3. SLIDE 2 ENTRY (From Right)
            // It needs to "meet" the line.
            // Starts at +60vw offset (matching the Move Distance)
            // Moves to Center (-50%)
            
            // We delay slide 2 slightly so the line leads the way
            let s2Progress = 0;
            if (moveProgress > 0.1) {
                s2Progress = (moveProgress - 0.1) / 0.9;
            }

            // Start Position: Center (-50%) + Offset (60vw)
            // End Position: Center (-50%)
            let s2Offset = (1 - s2Progress) * MOVE_DISTANCE_VW;
            
            // We shift it right by the offset amount
            slide2.style.transform = `translate(calc(-50% + ${s2Offset}vw), -50%)`;
            
            // Fade In
            slide2.style.opacity = Math.min(1, s2Progress * 3);
        }
        
        // Reset
        else {
            slide1.style.opacity = 0;
            slide1.style.transform = `translate(-50%, calc(-50% + 100px))`;
        }
    }

    window.addEventListener('scroll', animateServices);
    animateServices();
}