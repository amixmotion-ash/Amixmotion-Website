const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('nav-open');
});
// --- Header Color Change on Scroll ---

// First, we select the header element from the page
const header = document.querySelector('header');

// We only run this code if a header element actually exists
if (header) {
  // We set a "threshold" for the color change. Let's make it 90% of the screen's height.
  // This means the color will change just before the white section touches the header.
  const scrollThreshold = window.innerHeight * 0.9;

  // Now, we listen for a 'scroll' event on the entire window
  window.addEventListener('scroll', () => {
    // window.scrollY tells us how many pixels we've scrolled from the top
    if (window.scrollY > scrollThreshold) {
      // If we have scrolled PAST the threshold, add the 'header-scrolled' class
      header.classList.add('header-scrolled');
    } else {
      // If we are ABOVE the threshold (back at the top), remove the class
      header.classList.remove('header-scrolled');
    }
  });
}