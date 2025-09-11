const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('nav');

navToggle.addEventListener('click', () => {
    nav.classList.toggle('nav-open');
    // We also need to toggle the class on the button itself for the 'X' animation
    navToggle.classList.toggle('nav-open'); 
});