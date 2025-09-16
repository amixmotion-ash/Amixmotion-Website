// --- Full-Screen Menu Toggle ---
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
const body = document.querySelector('body');

if (navToggle && mainNav && body) {
    navToggle.addEventListener('click', () => {
        mainNav.classList.toggle('nav-open');
        body.classList.toggle('body-no-scroll');
        if (mainNav.classList.contains('nav-open')) {
            navToggle.textContent = 'CLOSE x';
        } else {
            navToggle.textContent = 'MENU';
        }
    });
}

// --- Advanced Header Styling on Scroll (Corrected Logic) ---

const header = document.querySelector('header');
// Find the section that comes AFTER the dark mission section
const firstLightSection = document.querySelector('.bridge-section');

// We only run this code on the homepage
if (header && firstLightSection) {
    // 1. Calculate the two important scroll trigger points
    const heroEndTrigger = window.innerHeight * 0.9; // When to hide the logo
    // This is the key: the trigger for the text color change is the TOP of the bridge section
    const textColorTrigger = firstLightSection.offsetTop;

    // 2. Listen for a 'scroll' event
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;

        // 3. Logic for the LOGO
        if (scrollPosition > heroEndTrigger) {
            // If we've scrolled past the hero, hide the logo
            header.classList.add('logo-is-hidden');
        } else {
            // Otherwise, show it
            header.classList.remove('logo-is-hidden');
        }

        // 4. Logic for the TEXT COLOR (Corrected)
        // We add a small offset (e.g., 50px) so the change doesn't happen too early
        if (scrollPosition > textColorTrigger - 50) {
            // If we have reached the top of the first WHITE section, make the text black
            header.classList.add('text-is-dark');
        } else {
            // Otherwise, keep the text white (over the hero and mission sections)
            header.classList.remove('text-is-dark');
        }
    });
}

// --- Animation Trigger on Scroll for Mission Section ---
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

// --- Video Lightbox Functionality ---
const lightbox = document.querySelector('.video-lightbox');
if (lightbox) {
    const lightboxVideo = lightbox.querySelector('.lightbox-video');
    const closeButton = lightbox.querySelector('.lightbox-close');
    const portfolioItems = document.querySelectorAll('.grid-item');

    function openLightbox(videoSrc) {
        if (videoSrc) {
            lightboxVideo.src = videoSrc;
            lightbox.classList.add('is-visible');
        }
    }

    function closeLightbox() {
        lightbox.classList.remove('is-visible');
        lightboxVideo.pause();
        lightboxVideo.src = '';
    }

    portfolioItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            const videoSrc = item.dataset.videoSrc;
            if (videoSrc) {
                openLightbox(videoSrc);
            }
        });
    });

    closeButton.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });
}
// --- Initialize Rellax for Parallax Scrolling ---
if (typeof Rellax !== 'undefined' && window.innerWidth > 600) {
    var rellax = new Rellax('.rellax', {
        center: true
    });
}
// --- Custom Cursor Functionality (Homepage Only) ---

const bodyForCursor = document.querySelector('body');

// This is a gate: it checks if the body has the 'homepage' class.
// This ensures the code ONLY runs on your homepage.
if (bodyForCursor && bodyForCursor.classList.contains('homepage')) {
    
    // If we are on the homepage, find the elements we need
    const customCursor = document.querySelector('.custom-cursor');
    const portfolioItemsForCursor = document.querySelectorAll('.portfolio-grid-section .grid-item');

    // Make sure the elements actually exist before running the code
    if (customCursor && portfolioItemsForCursor.length > 0) {
        
        // This function makes the custom cursor follow the real mouse
        window.addEventListener('mousemove', (e) => {
            customCursor.style.left = e.clientX + 'px';
            customCursor.style.top = e.clientY + 'px';
        });

        // This function detects when the mouse enters or leaves a portfolio panel
        portfolioItemsForCursor.forEach(item => {
            item.addEventListener('mouseenter', () => {
                // When mouse enters, add a class to the body to activate our CSS styles
                bodyForCursor.classList.add('cursor-hover');
            });
            item.addEventListener('mouseleave', () => {
                // When mouse leaves, remove the class to go back to the default state
                bodyForCursor.classList.remove('cursor-hover');
            });
        });
    }
}
// --- Animation Trigger for Testimonials Section ---

const testimonialsSection = document.querySelector('.testimonials-section');

if (testimonialsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, {
        threshold: 0.2 // Trigger when 20% of the section is visible
    });

    observer.observe(testimonialsSection);
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
        if (!isDown) return; // Stop the function from running if mouse is not down
        e.preventDefault(); // Prevent default actions like text selection
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; // The '2' is a multiplier for faster scrolling
        slider.scrollLeft = scrollLeft - walk;
    });
}