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

  // Global Services navigation: weight loss CTA on top, then two curated columns.
  if (header) {
    const serviceItems = [
      { label: 'Weight Loss GLP-1', href: '/positivetherapyfl/glp-1-weight-loss/', featured: true },
      { label: 'Individual Therapy', href: '/positivetherapyfl/individual-counseling/', column: 'left' },
      { label: 'Couples And Family Therapy', href: '/positivetherapyfl/couples-counseling/', column: 'left' },
      { label: 'Teen Counselling', href: '/positivetherapyfl/teen-adolescent-therapy/', column: 'left' },
      { label: 'Maternal Mental Wellness', href: '/positivetherapyfl/support-for-new-mothers/', column: 'left' },
      { label: 'ADHD Evaluation Package', href: '/positivetherapyfl/faq/#book', column: 'right' },
      { label: 'Autism Consultation', href: '/positivetherapyfl/faq/#book', column: 'right' },
      { label: 'Couples Retreat', href: '/positivetherapyfl/faq/#book', column: 'right' },
      { label: 'Coming soon - Wedding venue', href: '#', column: 'right', comingSoon: true }
    ];

    const desktopServicesGroup = Array.from(header.querySelectorAll('.group')).find(group => {
      const button = group.querySelector(':scope > button');
      return button && button.textContent.replace(/\s+/g, ' ').trim().startsWith('Services');
    });

    if (desktopServicesGroup) {
      const dropdownShell = desktopServicesGroup.querySelector(':scope > div.absolute');
      const dropdownCard = dropdownShell?.firstElementChild;

      if (dropdownShell && dropdownCard) {
        dropdownShell.style.width = '560px';
        dropdownShell.style.left = '-3rem';
        dropdownCard.innerHTML = `
          <div class="services-priority-menu">
            <div class="services-priority-heading">
              <span class="material-symbols-outlined" aria-hidden="true">psychology</span>
              <span>Services</span>
            </div>
            <div class="services-priority-grid">
              ${serviceItems.map(item => `
                <a href="${item.href}" class="${item.featured ? 'services-priority-featured' : `services-priority-link services-column-${item.column}${item.comingSoon ? ' services-coming-soon' : ''}`}" ${item.comingSoon ? 'aria-disabled="true" tabindex="-1"' : ''}>
                  ${item.featured ? '<img src="/positivetherapyfl/assets/images/team/1x1-pa-c-weight-loss-marie-claude-dubuc.webp" alt="" aria-hidden="true">' : ''}
                  <span>${item.label}</span>
                  ${item.featured ? '<span class="services-priority-cta">Explore</span>' : item.comingSoon ? '' : '<span class="material-symbols-outlined services-priority-arrow" aria-hidden="true">arrow_forward</span>'}
                </a>
              `).join('')}
            </div>
          </div>
        `;
      }
    }

    const mobileMenuCandidate = header.querySelector('[data-mobile-menu]');
    if (mobileMenuCandidate) {
      const servicesHeading = Array.from(mobileMenuCandidate.querySelectorAll('div')).find(element => {
        return element.children.length === 0 && element.textContent.trim().toLowerCase() === 'services';
      });

      const mobileServicesSection = servicesHeading?.parentElement;
      const mobileServicesGrid = mobileServicesSection?.querySelector('.grid');

      if (mobileServicesGrid) {
        mobileServicesGrid.className = 'grid grid-cols-1 gap-1 pl-2';
        mobileServicesGrid.innerHTML = serviceItems.map(item => `
          <a href="${item.href}" class="${item.featured ? 'mobile-priority-weight-loss' : `py-2 text-sm font-medium text-[#1A1C1D] hover:text-[#0A4357]${item.comingSoon ? ' italic opacity-70 pointer-events-none' : ''}`}" ${item.comingSoon ? 'aria-disabled="true" tabindex="-1"' : ''}>
            ${item.featured ? '<span>Weight Loss GLP-1</span><span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span>' : item.label}
          </a>
        `).join('');
      }
    }

    if (!document.getElementById('services-priority-nav-styles')) {
      const servicesPriorityStyles = document.createElement('style');
      servicesPriorityStyles.id = 'services-priority-nav-styles';
      servicesPriorityStyles.textContent = `
        .services-priority-heading {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.25rem 0.4rem 0.75rem;
          margin-bottom: 0.35rem;
          color: #6B5D3E;
          border-bottom: 1px solid rgba(10, 67, 87, 0.08);
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .services-priority-heading .material-symbols-outlined {
          color: #8BA888;
          font-size: 1.05rem;
        }

        .services-priority-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.45rem 0.6rem;
        }

        .services-priority-featured {
          grid-column: 1 / -1;
          min-height: 4.4rem;
          display: grid;
          grid-template-columns: 3rem 1fr auto;
          align-items: center;
          gap: 0.85rem;
          padding: 0.55rem 0.75rem;
          margin-bottom: 0.3rem;
          border-radius: 1.15rem;
          background: #0A4357;
          color: #fff !important;
          box-shadow: 0 12px 26px rgba(10, 67, 87, 0.18);
          font-weight: 800;
          text-decoration: none;
          transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease;
        }

        .services-priority-featured img {
          width: 3rem;
          height: 3rem;
          border-radius: 999px;
          object-fit: cover;
          border: 2px solid rgba(255,255,255,0.68);
        }

        .services-priority-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 2rem;
          padding: 0 0.8rem;
          border-radius: 999px;
          background: #fff;
          color: #0A4357;
          font-size: 0.68rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .services-priority-featured:hover,
        .services-priority-featured:focus-visible {
          transform: translateY(-2px);
          background: #1B3A46;
          box-shadow: 0 16px 34px rgba(10, 67, 87, 0.25);
        }

        .services-priority-link {
          min-height: 2.9rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          padding: 0.65rem 0.75rem;
          border-radius: 0.9rem;
          color: #1A1C1D !important;
          font-size: 0.84rem;
          font-weight: 650;
          line-height: 1.2;
          text-decoration: none;
          transition: background 160ms ease, color 160ms ease, transform 160ms ease;
        }

        .services-column-left { grid-column: 1; }
        .services-column-right { grid-column: 2; }

        .services-column-left:nth-of-type(2), .services-column-right:nth-of-type(6) { grid-row: 2; }
        .services-column-left:nth-of-type(3), .services-column-right:nth-of-type(7) { grid-row: 3; }
        .services-column-left:nth-of-type(4), .services-column-right:nth-of-type(8) { grid-row: 4; }
        .services-column-left:nth-of-type(5), .services-column-right:nth-of-type(9) { grid-row: 5; }

        .services-coming-soon {
          font-style: italic;
          color: #6B5D3E !important;
          opacity: 0.72;
          cursor: default;
          pointer-events: none;
        }

        .services-priority-link:hover,
        .services-priority-link:focus-visible {
          background: #E0F2F1;
          color: #0A4357 !important;
          transform: translateX(2px);
        }

        .services-priority-arrow {
          flex: 0 0 auto;
          color: #8BA888;
          font-size: 1rem;
        }

        .mobile-priority-weight-loss {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin: 0.2rem 0 0.35rem;
          padding: 0.8rem 0.9rem;
          border-radius: 0.9rem;
          background: #0A4357;
          color: #fff !important;
          font-size: 0.9rem;
          font-weight: 800;
          box-shadow: 0 8px 18px rgba(10, 67, 87, 0.14);
        }

        @media (max-width: 639px) {
          .services-priority-menu {
            display: none;
          }
        }
      `;
      document.head.appendChild(servicesPriorityStyles);
    }
  }

  // Mobile navigation drawer toggle
  const menuButtons = document.querySelectorAll('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  // Mobile only: make the open navigation itself finger-scrollable so every
  // menu item remains reachable on short phone screens.
  if (mobileMenu) {
    const enableMobileMenuScroll = () => {
      if (!window.matchMedia('(max-width: 639px)').matches) {
        mobileMenu.style.maxHeight = '';
        mobileMenu.style.overflowY = '';
        mobileMenu.style.webkitOverflowScrolling = '';
        mobileMenu.style.overscrollBehavior = '';
        mobileMenu.style.touchAction = '';
        return;
      }

      mobileMenu.style.maxHeight = 'calc(100dvh - 4.35rem)';
      mobileMenu.style.overflowY = 'auto';
      mobileMenu.style.overflowX = 'hidden';
      mobileMenu.style.webkitOverflowScrolling = 'touch';
      mobileMenu.style.overscrollBehavior = 'contain';
      mobileMenu.style.touchAction = 'pan-y';
    };

    enableMobileMenuScroll();
    window.addEventListener('resize', enableMobileMenuScroll, { passive: true });
  }
  
  if (menuButtons.length && mobileMenu) {
    menuButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        if (!mobileMenu.classList.contains('hidden')) {
          mobileMenu.scrollTop = 0;
        }
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

  // Location page: turn the Private Offices card image into a four-image carousel.
  // It auto-rotates and also supports touch/finger swiping with native momentum scrolling.
  const privateOfficesHeading = Array.from(document.querySelectorAll('h3')).find(h3 => h3.textContent.trim() === 'Private Offices');
  const privateOfficesCard = privateOfficesHeading?.closest('.bg-white.rounded-2xl');
  const privateOfficesMedia = privateOfficesCard?.firstElementChild;

  if (privateOfficesCard && privateOfficesMedia && !privateOfficesCard.querySelector('[data-office-carousel]')) {
    const officeImages = [
      '/positivetherapyfl/assets/images/location/office-445X234-v1.png',
      '/positivetherapyfl/assets/images/location/office-445X234-v2.png',
      '/positivetherapyfl/assets/images/location/office-445X234-v3.png',
      '/positivetherapyfl/assets/images/location/office-445X234-v4.png'
    ];

    privateOfficesMedia.className = 'h-48 relative overflow-hidden';
    privateOfficesMedia.innerHTML = `
      <div data-office-carousel class="office-carousel-track" aria-label="Private office photo carousel">
        ${officeImages.map((src, index) => `
          <div class="office-carousel-slide" data-office-slide>
            <img src="${src}" alt="Positive Therapy FL private office ${index + 1}" draggable="false">
          </div>
        `).join('')}
      </div>
      <div class="office-carousel-dots" aria-hidden="true">
        ${officeImages.map((_, index) => `<span class="office-carousel-dot${index === 0 ? ' is-active' : ''}"></span>`).join('')}
      </div>
    `;

    if (!document.getElementById('office-carousel-styles')) {
      const carouselStyles = document.createElement('style');
      carouselStyles.id = 'office-carousel-styles';
      carouselStyles.textContent = `
        .office-carousel-track {
          display: flex;
          width: 100%;
          height: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-x: contain;
          touch-action: pan-x;
          scrollbar-width: none;
        }

        .office-carousel-track::-webkit-scrollbar {
          display: none;
        }

        .office-carousel-slide {
          flex: 0 0 100%;
          width: 100%;
          height: 100%;
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }

        .office-carousel-slide img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          user-select: none;
          -webkit-user-drag: none;
        }

        .office-carousel-dots {
          position: absolute;
          left: 50%;
          bottom: 0.65rem;
          z-index: 4;
          transform: translateX(-50%);
          display: flex;
          gap: 0.35rem;
          padding: 0.3rem 0.45rem;
          border-radius: 999px;
          background: rgba(10, 67, 87, 0.42);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          pointer-events: none;
        }

        .office-carousel-dot {
          width: 0.42rem;
          height: 0.42rem;
          border-radius: 999px;
          background: rgba(255,255,255,0.55);
          transition: width 180ms ease, background 180ms ease;
        }

        .office-carousel-dot.is-active {
          width: 1rem;
          background: #fff;
        }
      `;
      document.head.appendChild(carouselStyles);
    }

    const track = privateOfficesCard.querySelector('[data-office-carousel]');
    const slides = Array.from(privateOfficesCard.querySelectorAll('[data-office-slide]'));
    const dots = Array.from(privateOfficesCard.querySelectorAll('.office-carousel-dot'));
    let activeOfficeSlide = 0;
    let officeCarouselTimer;

    const setActiveOfficeSlide = index => {
      activeOfficeSlide = (index + slides.length) % slides.length;
      dots.forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === activeOfficeSlide));
    };

    const goToOfficeSlide = index => {
      setActiveOfficeSlide(index);
      track.scrollTo({ left: track.clientWidth * activeOfficeSlide, behavior: 'smooth' });
    };

    const startOfficeCarousel = () => {
      window.clearInterval(officeCarouselTimer);
      officeCarouselTimer = window.setInterval(() => goToOfficeSlide(activeOfficeSlide + 1), 4000);
    };

    let officeScrollTimer;
    track.addEventListener('scroll', () => {
      window.clearTimeout(officeScrollTimer);
      officeScrollTimer = window.setTimeout(() => {
        const index = Math.round(track.scrollLeft / Math.max(track.clientWidth, 1));
        setActiveOfficeSlide(index);
      }, 80);
    }, { passive: true });

    track.addEventListener('pointerdown', () => window.clearInterval(officeCarouselTimer), { passive: true });
    track.addEventListener('pointerup', startOfficeCarousel, { passive: true });
    track.addEventListener('touchend', startOfficeCarousel, { passive: true });
    window.addEventListener('resize', () => goToOfficeSlide(activeOfficeSlide), { passive: true });

    startOfficeCarousel();
  }
});