const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('nav-open');
});
// --- GSAP Parallax Scrolling Logic ---
gsap.registerPlugin(ScrollTrigger);

const columns = gsap.utils.toArray('.grid-column');

columns.forEach((column, i) => {
    // We'll make the middle column move faster
    const yPercent = i === 1 ? -30 : -15;

    gsap.to(column, {
        yPercent: yPercent,
        ease: "none",
        scrollTrigger: {
            trigger: ".parallax-grid-container",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
});
