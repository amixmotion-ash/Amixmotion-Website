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

// --- Advanced Header Styling on Scroll (FINAL, CORRECTED LOGIC) ---
const header = document.querySelector('header');
const firstLightSection = document.querySelector('.bridge-section');

// We only run this code on the homepage
if (header && firstLightSection && body.classList.contains('homepage')) {
    
    // THIS IS THE KEY: We wait for the entire page to load before we take measurements
    window.addEventListener('load', () => {
        
        // 1. Now that the page is loaded, our measurements are guaranteed to be accurate
        const heroEndTrigger = window.innerHeight * 0.9;
        const textColorTrigger = firstLightSection.offsetTop;

        // 2. Listen for a 'scroll' event
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;

            // 3. Logic for the LOGO
            if (scrollPosition > heroEndTrigger) {
                header.classList.add('logo-is-hidden');
            } else {
                header.classList.remove('logo-is-hidden');
            }

            // 4. Logic for the TEXT COLOR
            if (scrollPosition > textColorTrigger - 50) { // Using a 50px offset for a smooth transition
                header.classList.add('text-is-dark');
            } else {
                header.classList.remove('text-is-dark');
            }
        });
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

// --- Video Lightbox Functionality ---
// (Your existing, working lightbox code goes here)

// --- Rellax Parallax Functionality ---
// (Your existing, working Rellax code goes here)

// --- Custom Cursor Functionality ---
// (Your existing, working custom cursor code goes here)

// --- Click and Drag Testimonials ---
// (Your existing, working click-and-drag code goes here)