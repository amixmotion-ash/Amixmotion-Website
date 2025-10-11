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

// --- Video Lightbox Functionality ---
const lightbox = document.querySelector('.video-lightbox');
if (lightbox) {
    const lightboxContent = lightbox.querySelector('.lightbox-content'); // The player container we will change the shape of
    const lightboxVideo = lightbox.querySelector('.lightbox-video');
    const closeButton = lightbox.querySelector('.lightbox-close');
    const portfolioItems = document.querySelectorAll('.grid-item');

    function openLightbox(videoSrc, aspectRatio) {
        if (videoSrc) {
            // First, before we do anything, remove any old "shape" classes
            lightboxContent.classList.remove('aspect-ratio-16-9', 'aspect-ratio-9-16');

            // Now, check the "tag" we read from the HTML
            if (aspectRatio === '9:16') {
                // If it's a vertical video, add the vertical shape class
                lightboxContent.classList.add('aspect-ratio-9-16');
            } else {
                // Otherwise, just use the default widescreen shape class
                lightboxContent.classList.add('aspect-ratio-16-9');
            }
            
            // Now that the player has the right shape, load the video and show it
            lightboxVideo.src = videoSrc;
            lightbox.classList.add('is-visible');
            lightboxVideo.play();
        }
    }

    function closeLightbox() {
        lightbox.classList.remove('is-visible');
        lightboxVideo.pause();
        lightboxVideo.src = '';
        // Also clean up the shape classes when we close the player
        lightboxContent.classList.remove('aspect-ratio-16-9', 'aspect-ratio-9-16');
    }

    // When any portfolio item is clicked...
    portfolioItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();

            // ...get the video file name...
            const videoSrc = item.dataset.videoSrc;
            // ...and get its "tag" (the aspect ratio).
            const aspectRatio = item.dataset.aspectRatio; 

            if (videoSrc) {
                // ...then call our smart openLightbox function with both pieces of information.
                openLightbox(videoSrc, aspectRatio);
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
// --- Accordion Functionality for Process Section (JS-Enhanced) ---
const accordionItems = document.querySelectorAll('.accordion-item');

if (accordionItems.length > 0) {
    accordionItems.forEach(item => {
        const toggle = item.querySelector('.accordion-toggle');
        const content = item.querySelector('.accordion-content');

        toggle.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-open');

            // --- Close all other items ---
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('is-open');
                    otherItem.querySelector('.accordion-toggle').setAttribute('aria-expanded', 'false');
                    // Get the content of the other item and set its max-height to null
                    const otherContent = otherItem.querySelector('.accordion-content');
                    otherContent.style.maxHeight = null;
                }
            });

            // --- Toggle the clicked item ---
            if (isOpen) {
                // If it's already open, close it
                item.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = null; // Collapse the content
            } else {
                // If it's closed, open it
                item.classList.add('is-open');
                toggle.setAttribute('aria-expanded', 'true');
                // Set max-height to the content's actual scrollHeight for a perfect animation
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
}