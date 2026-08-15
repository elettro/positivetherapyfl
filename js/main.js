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

  // Global Services navigation: give the three priority services a consistent
  // featured treatment without muting or shrinking any of the other services.
  if (header) {
    header.querySelectorAll('a').forEach(link => {
      const label = link.textContent.replace(/\s+/g, ' ').trim();
      const normalized = label.toLowerCase();

      if (normalized === 'individual counseling' || normalized === 'individual therapy') {
        link.textContent = 'Individual Therapy';
        link.classList.add('featured-service-link');
        link.setAttribute('data-featured-label', 'Featured');
      }

      if (normalized === 'couples counseling' || normalized === 'couples & family therapy' || normalized === 'couples and family therapy') {
        link.textContent = 'Couples & Family Therapy';
        link.classList.add('featured-service-link');
        link.setAttribute('data-featured-label', 'Featured');
      }

      if (normalized === 'weight loss') {
        link.classList.add('featured-service-link');
        link.setAttribute('data-featured-label', 'Featured');
      }
    });
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

  // Homepage only: rename "Book a Consultation" to "Request Appointment"
  // and keep the label on one line.
  if (document.querySelector('img[src$="16x9-homepage-telemed-example-women.webp"]')) {
    document.querySelectorAll('a, button, h1, h2, h3, h4, span, p').forEach(element => {
      if (element.textContent.trim() === 'Book a Consultation') {
        element.textContent = 'Request Appointment';
        element.style.whiteSpace = 'nowrap';
      }
    });
  }

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

  // Homepage: replace the old 15+ / 100% / 5.0 stats strip with an interactive
  // five-point care overview. This deliberately uses a card composition rather
  // than retaining the visual language of the removed statistics row.
  if (document.querySelector('img[src$="16x9-homepage-telemed-example-women.webp"]')) {
    const oldStatsSection = Array.from(document.querySelectorAll('section, div')).find(element => {
      const text = element.textContent.replace(/\s+/g, ' ').toUpperCase();
      return text.includes('YEARS EXPERIENCE') &&
             text.includes('ONLINE FLEXIBILITY') &&
             text.includes('PATIENT RATING') &&
             element.querySelectorAll('*').length < 80;
    });

    if (oldStatsSection) {
      oldStatsSection.className = 'homepage-care-highlights';
      oldStatsSection.innerHTML = `
        <div class="care-highlights-inner">
          <div class="care-highlights-heading">
            <span class="care-highlights-kicker">START HERE</span>
            <h2>Support You Can Feel Good About Starting</h2>
          </div>
          <div class="care-highlights-grid" role="list">
            <article class="care-highlight-card" role="listitem" tabindex="0">
              <span class="material-symbols-outlined care-highlight-icon" aria-hidden="true">favorite</span>
              <h3>Individual, Couples &amp; Family Therapy</h3>
              <p>Personalized support for relationships, life transitions, stress and emotional wellbeing.</p>
            </article>
            <article class="care-highlight-card" role="listitem" tabindex="0">
              <span class="material-symbols-outlined care-highlight-icon" aria-hidden="true">family_restroom</span>
              <h3>Teen &amp; Maternal Mental Wellness Support</h3>
              <p>Focused care for adolescents, new mothers and the challenges unique to each stage.</p>
            </article>
            <article class="care-highlight-card" role="listitem" tabindex="0">
              <span class="material-symbols-outlined care-highlight-icon" aria-hidden="true">monitor_weight</span>
              <h3>GLP-1 Weight Loss Programs</h3>
              <p>Whole-person weight support designed to connect medical guidance with sustainable change.</p>
            </article>
            <article class="care-highlight-card" role="listitem" tabindex="0">
              <span class="material-symbols-outlined care-highlight-icon" aria-hidden="true">neurology</span>
              <h3>ADHD &amp; Autism Evaluation Services</h3>
              <p>Clear, thoughtful evaluation and consultation pathways for greater understanding and direction.</p>
            </article>
            <article class="care-highlight-card" role="listitem" tabindex="0">
              <span class="material-symbols-outlined care-highlight-icon" aria-hidden="true">devices</span>
              <h3>Telehealth and In-Person Care</h3>
              <p>Flexible ways to receive care across Florida, with in-person options when they fit your needs.</p>
            </article>
          </div>
        </div>
      `;
    }
  }
});
