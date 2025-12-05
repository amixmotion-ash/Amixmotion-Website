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

// I ADDED '.profile-grid-section' TO THIS LIST:
const elementsToFadeIn = document.querySelectorAll('.fade-in-on-scroll, .mission-section, .testimonials-section, .profile-grid-section');

if (elementsToFadeIn.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // This adds the class that triggers the CSS opacity change
                entry.target.classList.add('is-visible');
                
                // Once it's visible, we stop watching it so it doesn't flicker
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.15 // Trigger when 15% of the element is visible
    });

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
            
            // Start revealing when the text enters the bottom 90% of the screen
            const startPoint = viewportHeight * 0.9;
            const endPoint = viewportHeight * 0.3; // Finish reveal earlier
            
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

    // Controls Logic
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
        center: false, // Default: Start aligned at top
        speed: -2,
        wrapper: null, 
        round: true, 
        vertical: true, 
        horizontal: false
    };

    if (document.body.classList.contains('homepage')) {
        options.center = true; // Homepage: Meet in middle
    }

    // Add animate-in class for Portfolio Page
    if (document.body.classList.contains('portfolio-page')) {
        const gridSection = document.querySelector('.portfolio-grid-section');
        if (gridSection) {
            window.addEventListener('load', function() {
                gridSection.classList.add('animate-in');
            });
        }
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
// == 9. HOMEPAGE EXTRAS (Scroll Down + Hero Hide) ==
// ======================================================================
if (document.body.classList.contains('homepage')) {
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

    const scrollLink = document.querySelector('.scroll-indicator-link');
    if (scrollLink) {
        scrollLink.addEventListener('click', function(event) {
            event.preventDefault();
            const targetSection = document.querySelector('#mission');
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

// Auto-Upgrade Structure
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
// == 12. UNIVERSAL PAGE TRANSITIONS (Final Refined) ==
// ======================================================================
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Setup/Check Curtain
    var curtain = document.querySelector('.page-transition-curtain');
    
    // FAILSAFE: If we are on the Homepage, we NEVER want the curtain to block the view.
    // We check this immediately to prevent any "glitch" or flash of black.
    if (document.body.classList.contains('homepage')) {
        if (curtain) {
            // If it exists (hardcoded), force it off-screen immediately
            curtain.style.transition = 'none';
            curtain.style.transform = 'translateX(100%)';
            curtain.classList.remove('is-active');
        }
    } else {
        // For all other pages, create the curtain if missing
        if (!curtain) {
            curtain = document.createElement('div');
            curtain.classList.add('page-transition-curtain');
            curtain.innerHTML = '<div class="page-loader"></div>';
            document.body.appendChild(curtain);
        }
    }

    // 2. HANDLE "OUT" ANIMATION (Reveal Page on Load)
    window.addEventListener('load', function() {
        
        // Double Check: If Homepage, do nothing (ensure it stays hidden)
        if (document.body.classList.contains('homepage')) {
            if (curtain) {
                curtain.style.transition = 'none';
                curtain.style.transform = 'translateX(100%)';
            }
            return; // Stop here
        }

        // For other pages (About, Portfolio, Contact)...
        setTimeout(function() {
            // Restore animation speed
            curtain.style.transition = 'transform 0.8s cubic-bezier(0.83, 0, 0.17, 1)'; 
            
            // Slide to the Right (Reveal content)
            curtain.style.transform = 'translateX(100%)'; 

            // --- DELAYED TEXT ANIMATION (About Page) ---
            var aboutTitle = document.querySelector('.about-hero-title');
            if (aboutTitle) {
                // Wait 400ms after the curtain starts moving before showing text
                setTimeout(function() {
                    aboutTitle.classList.add('is-visible');
                }, 400); 
            }
            // -------------------------------------------
            
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

            // Ensure curtain exists (in case we are on Homepage where we hid it)
            if (!curtain) {
                 curtain = document.createElement('div');
                 curtain.classList.add('page-transition-curtain');
                 curtain.innerHTML = '<div class="page-loader"></div>';
                 document.body.appendChild(curtain);
            }
            
            // Make sure it's visible again for the transition
            curtain.style.display = 'block';

            // --- MENU EXIT SEQUENCE ---
            var exitDelay = 0;
            var parentNav = this.closest('.main-nav');

            if (parentNav) {
                parentNav.classList.add('menu-exiting');
                exitDelay = 500; 
            }
            // --------------------------

            setTimeout(function() {
                
                // RESET TRANSITION
                curtain.style.transition = 'none'; 
                curtain.classList.add('is-active');

                // Start from LEFT
                curtain.style.transform = 'translateX(-100%)'; 
                
                // FORCE REFLOW
                curtain.getBoundingClientRect();

                // Animate RIGHT to Center
                curtain.style.transition = 'transform 0.6s cubic-bezier(0.83, 0, 0.17, 1)';
                curtain.style.transform = 'translateX(0%)';

                // Navigation
                setTimeout(function() {
                    window.location.href = targetUrl;
                }, 600); 

            }, exitDelay); 
        });
    });
});

// ======================================================================
// == ABOUT PAGE: Cinematic Scroll Depth (Parallax, No Blur) ==
// ======================================================================
if (document.body.classList.contains('about-page')) {
    
    const stickySection = document.querySelector('.profile-grid-section');
    const incomingSection = document.querySelector('.services-section');

    if (stickySection && incomingSection) {
        window.addEventListener('scroll', () => {
            
            const incomingPosition = incomingSection.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (incomingPosition < windowHeight && incomingPosition > 0) {
                
                // Calculate progress (0.0 to 1.0)
                let progress = 1 - (incomingPosition / windowHeight);

                // 1. Scale Effect (Shrink slightly to create depth)
                const scale = 1 - (progress * 0.05); 
                
                // 2. Brightness Effect (Darken as it goes back)
                const brightness = 1 - (progress * 0.4); 

                // 3. Parallax Slide (The "Slow Down" Effect)
                // Move UP by 200px over the course of the scroll.
                const yPos = -(progress * 200);

                // Apply styles (REMOVED BLUR)
                stickySection.style.transform = `translate3d(0, ${yPos}px, 0) scale(${scale})`;
                stickySection.style.filter = `brightness(${brightness})`;

            } else if (incomingPosition >= windowHeight) {
                // RESET
                stickySection.style.transform = 'translate3d(0, 0, 0) scale(1)';
                stickySection.style.filter = 'brightness(1)';
            }
        });
    }
}

// ======================================================================
// == ABOUT PAGE: Intro Text Sequence (Scrollytelling) ==
// ======================================================================

const sequenceSection = document.querySelector('.about-intro-sequence');

if (sequenceSection) {
    const part1 = sequenceSection.querySelector('.sequence-part-1'); // The Title
    const part2 = sequenceSection.querySelector('.sequence-part-2'); // The Paragraph
    const indicator = sequenceSection.querySelector('.sequence-indicator');

    window.addEventListener('scroll', () => {
        
        // 1. Calculate how far we are into the section
        const rect = sequenceSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // This value goes from 0 (start) to ~1.5 (end of section)
        // We use Math.abs because rect.top becomes negative as we scroll down
        const scrollDistance = -rect.top;
        
        if (scrollDistance > 0 && rect.bottom > 0) {
            
            // PHASE 1: Fade Out Title (0px to 400px scroll)
            // Normalized 0 to 1
            let phase1Progress = Math.min(1, Math.max(0, scrollDistance / (windowHeight * 0.5)));
            
            if (part1) {
                // Fade out
                part1.style.opacity = 1 - phase1Progress;
                // Move Up slightly (-50% is center, so we go to -80%)
                part1.style.transform = `translate(-50%, ${-50 - (phase1Progress * 20)}%)`;
            }
            if (indicator) {
                indicator.style.opacity = 1 - phase1Progress;
            }

            // PHASE 2: Fade In Paragraph (400px to 800px scroll)
            // We start this phase later so there is a gap
            let phase2Start = windowHeight * 0.6;
            let phase2Progress = Math.min(1, Math.max(0, (scrollDistance - phase2Start) / (windowHeight * 0.5)));

            if (part2) {
                // Fade In
                part2.style.opacity = phase2Progress;
                // Move Up from slightly lower position
                // Start at -40% (CSS) and move to -50% (Center)
                part2.style.transform = `translate(-50%, ${-40 - (phase2Progress * 10)}%)`;
            }

        }
    });
}