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
// == 12. UNIVERSAL PAGE TRANSITIONS (Final - No Curtain on Home) ==
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
// == 13. ABOUT PAGE: Intro Sequence (Images + Center Text) ==
// ======================================================================
const scrollTrigger = document.querySelector('.about-scroll-trigger');

if (scrollTrigger) {
    const title = scrollTrigger.querySelector('.about-hero-title');
    const paragraph = scrollTrigger.querySelector('.about-intro-paragraph');
    const image1 = scrollTrigger.querySelector('.intro-flying-image-1');
    const image2 = scrollTrigger.querySelector('.intro-flying-image-2'); 
    const profileText = scrollTrigger.querySelector('.intro-flying-text'); // New Text
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

            // --- PHASE 2: PARAGRAPH (15% - 40%) ---
            let paraOpacity = 0;
            if (progress > 0.15 && progress < 0.45) {
                if (progress < 0.25) {
                    paraOpacity = (progress - 0.15) * 10; 
                } else if (progress > 0.35) {
                    paraOpacity = 1 - ((progress - 0.35) * 10); 
                } else {
                    paraOpacity = 1; 
                }
            }
            
            let currentY = 300 - (progress * 800);
            if (paragraph) {
                paragraph.style.opacity = Math.max(0, Math.min(1, paraOpacity));
                paragraph.style.transform = 'translate(-50%, calc(-30% + ' + currentY + 'px))';
            }

            // --- PHASE 3: IMAGE 1 (Left Lane | 40% - 90%) ---
            if (image1) {
                let imgOpacity = 0;
                let scale = 0.5;
                let xMove = -50; 
                let blur = 0;

                if (progress > 0.4 && progress < 0.90) {
                    let localProg = (progress - 0.4) / 0.5;
                    
                    if (localProg < 0.15) imgOpacity = localProg * 6.6; 
                    else if (localProg > 0.85) {
                        imgOpacity = 1 - ((localProg - 0.85) * 6.6); 
                        blur = (localProg - 0.85) * 60; 
                    } else imgOpacity = 1;

                    scale = 0.5 + (localProg * 2.0);
                    xMove = -80 - (localProg * 200); 
                }
                
                image1.style.opacity = Math.max(0, Math.min(1, imgOpacity));
                image1.style.filter = 'blur(' + blur + 'px)';
                image1.style.transform = 'translate(' + xMove + '%, -50%) scale(' + scale + ')';
            }

            // --- PHASE 4: IMAGE 2 (Right Lane | 50% - 100%) ---
            if (image2) {
                let imgOpacity = 0;
                let scale = 0.5;
                let xMove = -50; 
                let blur = 0;

                if (progress > 0.5) {
                    let localProg = (progress - 0.5) / 0.5;
                    localProg = Math.min(1, localProg);

                    if (localProg < 0.15) imgOpacity = localProg * 6.6; 
                    else if (localProg > 0.85) {
                        imgOpacity = 1 - ((localProg - 0.85) * 6.6); 
                        blur = (localProg - 0.85) * 60; 
                    } else imgOpacity = 1;

                    scale = 0.5 + (localProg * 2.0);
                    xMove = -20 + (localProg * 200); 
                }

                image2.style.opacity = Math.max(0, Math.min(1, imgOpacity));
                image2.style.filter = 'blur(' + blur + 'px)';
                image2.style.transform = 'translate(' + xMove + '%, -50%) scale(' + scale + ')';
            }

            // --- PHASE 5: PROFILE TEXT (Center Lane | 60% - 100%) ---
            if (profileText) {
                let txtOpacity = 0;
                let scale = 0.5;
                let blur = 0;

                // Starts later at 0.60
                if (progress > 0.6) {
                    let localProg = (progress - 0.6) / 0.4; // 0.6 to 1.0 duration
                    localProg = Math.min(1, localProg);

                    // Fade In (Fast) -> Hold -> Fade Out (Slow)
                    if (localProg < 0.15) txtOpacity = localProg * 6.6; 
                    else if (localProg > 0.85) {
                        txtOpacity = 1 - ((localProg - 0.85) * 6.6); 
                        blur = (localProg - 0.85) * 30; // Subtle blur
                    } else txtOpacity = 1;

                    // Zoom: 0.5 -> 1.5
                    scale = 0.5 + (localProg * 1.0);
                }

                profileText.style.opacity = Math.max(0, Math.min(1, txtOpacity));
                profileText.style.filter = 'blur(' + blur + 'px)';
                // Maintain perfectly centered position
                profileText.style.transform = 'translate(-50%, -50%) scale(' + scale + ')';
            }
        }
    });
}

// ======================================================================
// == 14. ABOUT PAGE: Cinematic Scroll Depth (Parallax, No Blur) ==
// ======================================================================
if (document.body.classList.contains('about-page')) {
    const stickySection = document.querySelector('.profile-grid-section');
    const incomingSection = document.querySelector('.services-section');

    if (stickySection && incomingSection) {
        window.addEventListener('scroll', () => {
            const incomingPosition = incomingSection.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (incomingPosition < windowHeight && incomingPosition > 0) {
                let progress = 1 - (incomingPosition / windowHeight);
                const scale = 1 - (progress * 0.05); 
                const brightness = 1 - (progress * 0.4); 
                const yPos = -(progress * 200);
                stickySection.style.transform = `translate3d(0, ${yPos}px, 0) scale(${scale})`;
                stickySection.style.filter = `brightness(${brightness})`;
            } else if (incomingPosition >= windowHeight) {
                stickySection.style.transform = 'translate3d(0, 0, 0) scale(1)';
                stickySection.style.filter = 'brightness(1)';
            }
        });
    }
}