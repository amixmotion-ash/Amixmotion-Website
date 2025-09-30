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
    const portfolioItemsForCursor = document.querySelectorAll('.portfolio-grid-section .grid-.item');
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