/**
 * Positive Therapy FL - Main Shared Interactive Utilities
 */
document.addEventListener('DOMContentLoaded', () => {
  const PHONE_DISPLAY = '(954) 408-6684';
  const PHONE_TEL = 'tel:+19544086684';

  // Global phone-number update across every page.
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.setAttribute('href', PHONE_TEL);
  });

  const phonePatterns = [
    /\(201\)\s*555-0123/g,
    /201[.\-\s]555[.\-\s]0123/g
  ];

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach(node => {
    let updated = node.nodeValue;
    phonePatterns.forEach(pattern => {
      updated = updated.replace(pattern, PHONE_DISPLAY);
    });
    if (updated !== node.nodeValue) node.nodeValue = updated;
  });

  // Add a global mobile-only consultation CTA directly below the primary header row.
  const header = document.querySelector('header');
  const primaryHeaderRow = header?.firstElementChild;

  if (header && primaryHeaderRow && !header.querySelector('[data-mobile-call-cta]')) {
    const mobileCallRow = document.createElement('div');
    mobileCallRow.setAttribute('data-mobile-call-cta', '');
    mobileCallRow.className = 'mobile-call-cta';
    mobileCallRow.innerHTML = `
      <a href="${PHONE_TEL}" aria-label="Book a free consultation by phone">
        <span class="material-symbols-outlined" aria-hidden="true">call</span>
        <span>Book Free Consultation</span>
        <span class="mobile-call-number">${PHONE_DISPLAY}</span>
      </a>
    `;
    primaryHeaderRow.insertAdjacentElement('afterend', mobileCallRow);

    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateMobileCallRow = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      if (currentScrollY <= 8) {
        mobileCallRow.classList.remove('is-hidden');
      } else if (delta > 4) {
        mobileCallRow.classList.add('is-hidden');
      } else if (delta < -4) {
        mobileCallRow.classList.remove('is-hidden');
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateMobileCallRow);
        ticking = true;
      }
    }, { passive: true });
  }

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

  // Homepage hero clinical pillar wording
  document.querySelectorAll('span').forEach(span => {
    const text = span.textContent.trim();
    if (text === 'Licensed Psychotherapy Specialists') {
      span.textContent = 'Individual & Couples Therapy';
    }
    if (text === 'GLP-1 & Lab-Informed Programs') {
      span.textContent = 'Weight Loss - GLP-1';
    }
  });

  // Mobile-only: keep the calendar icon directly after the
  // "Request Your Confidential Match" text instead of at the far edge of the pill.
  const centerConfidentialMatchIcon = () => {
    if (!window.matchMedia('(max-width: 639px)').matches) return;

    document.querySelectorAll('a, button').forEach(control => {
      const label = control.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
      if (!label.includes('request your confidential match')) return;

      control.style.display = 'inline-flex';
      control.style.alignItems = 'center';
      control.style.justifyContent = 'center';
      control.style.gap = '0.5rem';

      const icon = control.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.style.position = 'static';
        icon.style.marginLeft = '0';
        icon.style.marginRight = '0';
        icon.style.transform = 'none';
        icon.style.flex = '0 0 auto';
      }
    });
  };

  centerConfidentialMatchIcon();
  window.addEventListener('resize', centerConfidentialMatchIcon, { passive: true });
});
