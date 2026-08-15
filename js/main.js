/**
 * Positive Therapy FL - Main Shared Interactive Utilities
 */
document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation drawer toggle
  const menuButtons = document.querySelectorAll('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  
  if (menuButtons.length && mobileMenu) {
    menuButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    });
  }

  // Smooth anchor link scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Global FAQ accordion toggle helper
  const accordionHeaders = document.querySelectorAll('[data-accordion-header]');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const icon = header.querySelector('[data-accordion-icon]');
      if (content) {
        content.classList.toggle('hidden');
        if (icon) {
          icon.classList.toggle('rotate-180');
        }
      }
    });
  });
});
