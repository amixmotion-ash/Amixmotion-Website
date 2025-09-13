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

// --- Header Color Change on Scroll ---
const header = document.querySelector('header');
if (header) {
    const scrollThreshold = window.innerHeight * 0.9;
    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
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
        // This is the crucial new line. It tells Rellax to make the 
        // elements perfectly aligned when they are in the vertical center of the screen.
        center: true
    });
}