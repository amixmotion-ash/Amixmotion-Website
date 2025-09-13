// --- Full-Screen Menu Toggle ---

// Select the two elements we need to work with
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
const body = document.querySelector('body');

// Listen for a click on the menu button
navToggle.addEventListener('click', () => {
    // Toggle the .nav-open class on the menu itself
    mainNav.classList.toggle('nav-open');
    
    // Toggle a class on the body to prevent scrolling when the menu is open
    body.classList.toggle('body-no-scroll');

    // Check if the menu is now open
    if (mainNav.classList.contains('nav-open')) {
        // If it's open, change the button text
        navToggle.textContent = 'CLOSE x';
    } else {
        // If it's closed, change the text back
        navToggle.textContent = 'MENU';
    }
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
// --- Animation Trigger on Scroll ---

const animatedSection = document.querySelector('.mission-section');

if (animatedSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, {
        threshold: 0.4 // Trigger when 40% of the section is visible
    });

    observer.observe(animatedSection);
}
// --- Video Lightbox Functionality ---

const lightbox = document.querySelector('.video-lightbox');
const lightboxVideo = lightbox.querySelector('.lightbox-video');
const closeButton = lightbox.querySelector('.lightbox-close');
const portfolioItems = document.querySelectorAll('.portfolio-grid-section .grid-item');

// Function to open the lightbox
function openLightbox(videoSrc) {
    if (videoSrc) {
        lightboxVideo.src = videoSrc;
        lightbox.classList.add('is-visible');
    }
}

// Function to close the lightbox
function closeLightbox() {
    lightbox.classList.remove('is-visible');
    // Important: Pause the video and clear the source to stop it from playing in the background
    lightboxVideo.pause();
    lightboxVideo.src = '';
}

// Add click listeners to all portfolio items
portfolioItems.forEach(item => {
    item.addEventListener('click', (event) => {
        event.preventDefault(); // Stop the link from trying to navigate
        const videoSrc = item.dataset.videoSrc;
        openLightbox(videoSrc);
    });
});

// Add click listener to the close button
closeButton.addEventListener('click', closeLightbox);

// Add click listener to the overlay to also close the lightbox
lightbox.addEventListener('click', (event) => {
    // Only close if the click is on the overlay itself, not the video
    if (event.target === lightbox) {
        closeLightbox();
    }
});