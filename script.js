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

// --- Video Lightbox Functionality (Final, with Loader and Bug Fixes) ---
const lightbox = document.querySelector('.video-lightbox');

if (lightbox) {
    // Get all the parts we need
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    const lightboxVideo = lightbox.querySelector('.lightbox-video');
    const closeButton = lightbox.querySelector('.lightbox-close');
    const customLoader = lightbox.querySelector('.custom-loader');
    const lightboxOverlay = lightbox.querySelector('.lightbox-overlay'); // For closing
    const portfolioItems = document.querySelectorAll('.grid-item');

    // --- This function handles OPENING the lightbox ---
    function openLightbox(videoSrc, aspectRatio) {
        if (videoSrc) {
            // Apply the correct aspect ratio class FIRST
            if (aspectRatio === '9:16') {
                lightboxContent.classList.add('is-vertical');
            } else {
                lightboxContent.classList.remove('is-vertical');
            }

            // Show our custom loader and hide the video player's container
            if(customLoader) customLoader.classList.add('is-loading');
            lightbox.classList.add('is-loading');
            
            lightboxVideo.src = videoSrc;
            lightbox.classList.add('is-visible');
        }
    }

    // --- This function handles CLOSING the lightbox ---
    function closeLightbox() {
        lightbox.classList.remove('is-visible');
        lightboxVideo.pause();
        lightboxVideo.src = '';
        
        // Clean up our classes on close
        if(customLoader) customLoader.classList.remove('is-loading');
        lightbox.classList.remove('is-loading');

        // THIS IS THE FIX for the flashing bug.
        // We delay removing the class slightly to allow the fade-out animation to finish.
        setTimeout(() => {
            lightboxContent.classList.remove('is-vertical');
        }, 300); // 300ms matches your CSS transition duration
    }
    
    // --- Event Listeners for the video itself ---
    if (customLoader) {
        // When the video starts buffering/loading, show the loader
        lightboxVideo.addEventListener('waiting', () => {
            customLoader.classList.add('is-loading');
            lightbox.classList.add('is-loading');
        });

        // When the video has loaded enough to play, hide the loader
        lightboxVideo.addEventListener('canplay', () => {
            customLoader.classList.remove('is-loading');
            lightbox.classList.remove('is-loading');
        });
    }

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
    // Add the event listener for the overlay
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
if (bodyForCursor && bodyForCursor.classList.contains('homepage')) {
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
        // We position from the center, so subtract half the width/height
        const cursorX = e.clientX - 40; 
        const cursorY = e.clientY - 40;
        menuCursor.style.left = cursorX + 'px';
        menuCursor.style.top = cursorY + 'px';
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