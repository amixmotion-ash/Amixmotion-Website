// --- Full-Screen Menu Toggle ---
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

// --- Animation Trigger for Mission Section ---
const animatedSection = document.querySelector('.mission-section');
if (animatedSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });
    observer.observe(animatedSection);
}

// --- Animation Trigger for Testimonials Section ---
const testimonialsSection = document.querySelector('.testimonials-section');
if (testimonialsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    observer.observe(testimonialsSection);
}

// ======================================================================
// == VIDEO LIGHTBOX (FINAL VERSION with Hover/Tap Controls) ==
// ======================================================================

const lightbox = document.querySelector('.video-lightbox');

if (lightbox) {
    // Get all the parts we need
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    const lightboxVideo = lightbox.querySelector('.lightbox-video');
    const closeButton = lightbox.querySelector('.lightbox-close');
    const customLoader = lightbox.querySelector('.custom-loader');
    const lightboxOverlay = lightbox.querySelector('.lightbox-overlay');
    const portfolioItems = document.querySelectorAll('.grid-item');

    // --- This function handles OPENING the lightbox ---
    function openLightbox(videoSrc, aspectRatio) {
        if (videoSrc) {
            // Apply aspect ratio class
            if (aspectRatio === '9:16') {

                lightboxVideo.classList.add('controls-hidden');
                lightboxContent.classList.add('is-vertical');
            } else {
                lightboxContent.classList.remove('is-vertical');
            }

            // Show loader and open lightbox
            if(customLoader) customLoader.classList.add('is-loading');
            lightbox.classList.add('is-loading');
            lightboxVideo.src = videoSrc;
            lightbox.classList.add('is-visible');

            // Start playing the video
            lightboxVideo.play();
        }
    }

  function closeLightbox() {
    // --- Step 1: Start the fade-out animation ---
    lightbox.classList.remove('is-visible');

    // --- Step 2: WAIT for the animation to finish ---
    // We will set a timeout that is the same duration as your CSS fade animation (300ms)
    setTimeout(() => {
        // --- Step 3: NOW that the video is hidden, we can safely stop it ---
        lightboxVideo.pause();
        lightboxVideo.src = '';

        // Clean up loader and vertical classes
        if(customLoader) customLoader.classList.remove('is-loading');
        lightbox.classList.remove('is-loading');
        lightboxContent.classList.remove('is-vertical');

    }, 300); // 300ms matches your CSS 'transition: opacity 0.3s'
}
    
    // --- Event Listeners for the video's loading state ---
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

    // --- NEW, SIMPLIFIED LOGIC FOR CONTROLS ---

    // When the video starts playing, hide the controls immediately.
    lightboxVideo.addEventListener('playing', () => {
        lightboxVideo.classList.add('controls-hidden');
    });

    // On desktop, when the mouse enters the video area, show the controls.
        lightboxVideo.addEventListener('playing', () => {
        lightboxVideo.classList.add('controls-hidden');
    });
    lightboxContent.addEventListener('mouseenter', () => {
        lightboxVideo.classList.remove('controls-hidden');
    });

    // On desktop, when the mouse leaves the video area, hide them again.
    lightboxContent.addEventListener('mouseleave', () => {
        if (!lightboxVideo.paused) { // Don't hide if the video is paused
            lightboxVideo.classList.add('controls-hidden');
        }
    });

    // On mobile, a single tap on the video will toggle the controls.
    lightboxContent.addEventListener('click', () => {
        // We check if the video is playing to avoid conflicts with the play/pause button
        if (!lightboxVideo.paused) {
            lightboxVideo.classList.toggle('controls-hidden');
        }
    });

    // Always show controls when the video is paused.
    lightboxVideo.addEventListener('pause', () => {
        lightboxVideo.classList.remove('controls-hidden');
    });

    // --- Click events to open and close the lightbox ---
    portfolioItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            const videoSrc = item.dataset.videoSrc;
            const aspectRatio = item.dataset.aspectRatio;
            openLightbox(videoSrc, aspectRatio);
        });
    });

    closeButton.addEventListener('click', closeLightbox);
    if (lightboxOverlay) {
        lightboxOverlay.addEventListener('click', closeLightbox);
    }
}




// --- Rellax Parallax Functionality ---
if (typeof Rellax !== 'undefined' && window.innerWidth > 600) {
    var rellax = new Rellax('.rellax', {
        center: true
    });
}

// --- Custom Cursor Functionality (Homepage Only) ---
const bodyForCursor = document.querySelector('body');
if (bodyForCursor && (bodyForCursor.classList.contains('homepage') || bodyForCursor.classList.contains('portfolio-page'))) {
    const customCursor = document.querySelector('.custom-cursor');
    const portfolioItemsForCursor = document.querySelectorAll('.portfolio-grid-section .grid-item');
    if (customCursor && portfolioItemsForCursor.length > 0) {
        window.addEventListener('mousemove', (e) => {
            customCursor.style.left = e.clientX + 'px';
            customCursor.style.top = e.clientY + 'px';
        });
        portfolioItemsForCursor.forEach(item => {
            item.addEventListener('mouseenter', () => {
                bodyForCursor.classList.add('cursor-hover');
            });
            item.addEventListener('mouseleave', () => {
                bodyForCursor.classList.remove('cursor-hover');
            });
        });
    }
}

// --- Click and Drag Functionality for Testimonials Scroller ---
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

// --- Seamless Image Carousel Duplication for About Page ---
const carouselTrack = document.querySelector('.image-carousel-track');
if (carouselTrack) {
    const images = Array.from(carouselTrack.children);
    images.forEach(image => {
        const duplicate = image.cloneNode(true);
        duplicate.setAttribute('aria-hidden', true);
        carouselTrack.appendChild(duplicate);
    });
}
// --- Accordion Functionality for Process Section (Final, Smooth Version) ---
const accordionItems = document.querySelectorAll('.accordion-item');

if (accordionItems.length > 0) {
    accordionItems.forEach(item => {
        const toggle = item.querySelector('.accordion-toggle');
        const content = item.querySelector('.accordion-content');

        toggle.addEventListener('click', () => {
            // Find the item that is currently open (if any)
            const currentlyOpenItem = document.querySelector('.accordion-item.is-open');

            // --- CASE 1: The user clicked the item that was already open ---
            if (currentlyOpenItem && currentlyOpenItem === item) {
                // Just close it and do nothing else.
                item.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = null;
            }
            // --- CASE 2: The user clicked a new item ---
            else {
                // First, if there IS an open item, close it.
                if (currentlyOpenItem) {
                    currentlyOpenItem.classList.remove('is-open');
                    currentlyOpenItem.querySelector('.accordion-toggle').setAttribute('aria-expanded', 'false');
                    currentlyOpenItem.querySelector('.accordion-content').style.maxHeight = null;
                }

                // Now, open the new item that was clicked.
                item.classList.add('is-open');
                toggle.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
}
// --- Hiding Header on Scroll ---
const header = document.querySelector('header');
let lastScrollY = window.scrollY; // Store the initial scroll position

if (header) {
    window.addEventListener('scroll', () => {
        // Only run the function if the user has scrolled a little bit
        if (window.scrollY > 50) { 
            if (lastScrollY < window.scrollY) {
                // User is scrolling DOWN
                header.classList.add('is-hidden');
            } else {
                // User is scrolling UP
                header.classList.remove('is-hidden');
            }
        } else {
            // If at the very top of the page, always show the header
            header.classList.remove('is-hidden');
        }

        // Update the last scroll position for the next event
        lastScrollY = window.scrollY;
    });
}
// --- Rellax Parallax Functionality ---
if (typeof Rellax !== 'undefined' && window.innerWidth > 600) {
    // THIS IS THE FIX: Initialize Rellax with the "center: true" option.
    // This forces all elements to align in the middle of the screen as you scroll.
    var rellax = new Rellax('.rellax', {
        center: false
    });
}

// --- Custom Menu Cursor ---
const menuCursor = document.querySelector('.menu-cursor');
const navLinks = document.querySelectorAll('.main-nav a');

if (menuCursor && navLinks.length > 0) {
    // 1. Move the cursor
window.addEventListener('mousemove', (e) => {
    // This positions the cursor's top-left corner at the pointer
    menuCursor.style.left = e.clientX + 'px';
    menuCursor.style.top = e.clientY + 'px';
});

    // 2. Show/Hide the cursor on link hover
  navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            document.body.classList.add('menu-cursor-active');
        });
        link.addEventListener('mouseleave', () => {
            document.body.classList.remove('menu-cursor-active');
        });
    });
}

// ======================================================================
// == HOMEPAGE: Fade Out Scroll Indicator ==
// ======================================================================

// This script only runs if we are on the homepage
if (document.body.classList.contains('homepage')) {
    
    const scrollIndicator = document.querySelector('.scroll-indicator');

    // Make sure the element actually exists on the page
    if (scrollIndicator) {
        
        // --- First, add a smooth transition to the CSS ---
        scrollIndicator.style.transition = 'opacity 0.3s ease-out';

        window.addEventListener('scroll', function() {
            // Check if the user has scrolled down more than a tiny amount (e.g., 50 pixels)
            if (window.scrollY > 50) {
                // If they have, fade the indicator out
                scrollIndicator.style.opacity = '0';
            } else {
                // If they scroll back to the very top, fade it back in
                scrollIndicator.style.opacity = '0.8';
            }
        });
    }
}

// ======================================================================
// == HOMEPAGE: Hide Hero Video at Bottom of Page ==
// ======================================================================

if (document.body.classList.contains('homepage')) {
    
    const heroVideoSection = document.querySelector('.hero-video');

    if (heroVideoSection) {
        window.addEventListener('scroll', function() {
            // This is the total height of the entire page
            const scrollHeight = document.documentElement.scrollHeight;
            // This is the height of the visible browser window
            const clientHeight = document.documentElement.clientHeight;
            // This is how far the user has scrolled from the top
            const scrollTop = window.scrollY;

            // This is the total scrollable distance
            const maxScroll = scrollHeight - clientHeight;

            // If the user has scrolled to the last 100px of the page
            if (scrollTop >= (maxScroll - 100)) {
                // Add the class to hide the video
                heroVideoSection.classList.add('is-hidden');
            } else {
                // Otherwise, remove the class to show the video
                heroVideoSection.classList.remove('is-hidden');
            }
        });
    }
}
// ======================================================================
// == GLOBAL: General Purpose Fade-In on Scroll ==
// ======================================================================

// 1. Find all elements that have our new animation class
const elementsToFadeIn = document.querySelectorAll('.fade-in-on-scroll');

// 2. Make sure there are elements to animate
if (elementsToFadeIn.length > 0) {
    
    // 3. Set up the Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If the element is on the screen...
            if (entry.isIntersecting) {
                // ...add the 'is-visible' class to trigger the animation
                entry.target.classList.add('is-visible');
                // ...and then stop watching this element to save resources
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    // 4. Tell the observer to watch each of our elements
    elementsToFadeIn.forEach(element => {
        observer.observe(element);
    });
}

// ======================================================================
// == HOMEPAGE: Smooth Scroll for "Scroll Down" Button ==
// ======================================================================

// 1. Find the link we just created
const scrollLink = document.querySelector('.scroll-indicator-link');

// 2. Make sure the link exists on the page
if (scrollLink) {
    
    // 3. Add a click event listener
    scrollLink.addEventListener('click', function(event) {
        // First, prevent the default "jump" behavior of the link
        event.preventDefault();

        // Find the target section we want to scroll to (the one with id="mission")
        const targetSection = document.querySelector('#mission');

        if (targetSection) {
            // This is the modern, built-in browser command to perform a smooth scroll
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

// ======================================================================
// == HOMEPAGE: Mission Statement FEATHERED Scroll-Wipe Effect ==
// ======================================================================

const missionTextWipe = document.querySelector('.mission-statement-scroll-effect');

if (missionTextWipe) {
    const foregroundWrapper = missionTextWipe.querySelector('.mission-statement-foreground-wrapper');

    window.addEventListener('scroll', function() {
        const rect = missionTextWipe.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Use the same start point as before
        const startPoint = viewportHeight * 0.9;
        const endPoint = 0.5;
        
        const progress = Math.max(0, Math.min(1, (startPoint - rect.top) / (startPoint - endPoint)));

        // --- THIS IS THE NEW LOGIC ---
        // We update the '--progress' CSS variable based on the scroll.
        // The value is passed as a percentage.
        foregroundWrapper.style.setProperty('--progress', (progress * 100) + '%');
    });
}