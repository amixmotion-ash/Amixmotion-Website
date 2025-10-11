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

// --- Video Lightbox Functionality (Final, Error-Free Version) ---
const lightbox = document.querySelector('.video-lightbox');

// First, check if the lightbox element actually exists on the page
if (lightbox) {
    // Get all the necessary parts from inside the lightbox
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    const lightboxVideo = lightbox.querySelector('.lightbox-video');
    const closeButton = lightbox.querySelector('.lightbox-close');
    
    // Get all the clickable portfolio items from the page
    const portfolioItems = document.querySelectorAll('.grid-item');

    // --- This function handles OPENING the lightbox ---
    function openLightbox(videoSrc, aspectRatio) {
        // Make sure we have a video file to play
        if (!videoSrc) {
            console.error('No video source provided to openLightbox.');
            return; // Stop the function if there's no video
        }

        // Check the 'tag' from the HTML. Is it a vertical video?
        if (aspectRatio === '9:16') {
            // If yes, add our special CSS class to make the player vertical
            lightboxContent.classList.add('is-vertical');
        }

        // Load the video file into the player
        lightboxVideo.src = videoSrc;
        
        // Make the lightbox visible
        lightbox.classList.add('is-visible');

        // Try to play the video
        lightboxVideo.play().catch(error => {
            // Catch and log any errors if the browser blocks autoplay
            console.warn("Video autoplay was prevented:", error);
        });
    }

    // --- This function handles CLOSING the lightbox ---
    function closeLightbox() {
        // Hide the lightbox
        lightbox.classList.remove('is-visible');
        
        // Stop the video from playing in the background
        lightboxVideo.pause();

        // Remove the video file to free up resources
        lightboxVideo.src = '';
        
        // ALWAYS remove our special class to reset the player for next time
        lightboxContent.classList.remove('is-vertical');
    }

    // --- This sets up the click events ---
    // Loop through every portfolio item on the page
    portfolioItems.forEach(item => {
        item.addEventListener('click', (event) => {
            // Prevent the link from trying to go to a new page
            event.preventDefault();
            
            // Read the video file and the aspect ratio 'tag' from the link
            const videoSrc = item.dataset.videoSrc;
            const aspectRatio = item.dataset.aspectRatio;
            
            // Call our open function with the information we found
            openLightbox(videoSrc, aspectRatio);
        });
    });

    // --- Click events for closing the lightbox ---
    closeButton.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => {
        // Only close if the click is on the dark background, not the video itself
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