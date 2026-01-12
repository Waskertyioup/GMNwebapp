const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".navbar a");



// ===== LANGUAGE MANAGEMENT =====
let currentLanguageData = {};

// Create a function that runs after language is loaded
// function setupVerMasButtons() {
//   const verMasBtns = document.querySelectorAll('.ver-mas-btn');
  
//   verMasBtns.forEach(button => {
//     // Set initial text based on current language AND current state
//     const isExpanded = button.classList.contains('expanded');
//     button.textContent = getTextFromKey(isExpanded ? 'misc.vermenos' : 'misc.vermas');
    
//     button.addEventListener('click', function() {
//       const servicio = this.closest('.servicio');
//       const hiddenText = servicio.querySelector('.hidden-text');
      
//       const isHiddenTextVisible = hiddenText.classList.contains('show');
      
//       if (!isHiddenTextVisible) {
//         hiddenText.style.display = 'inline';
//         setTimeout(() => {
//           hiddenText.classList.add('show');
//         }, 10);
        
//         this.textContent = getTextFromKey('misc.vermenos');
//         this.classList.add('expanded');
//         servicio.style.minHeight = 'auto';
//       } else {
//         hiddenText.classList.remove('show');
//         setTimeout(() => {
//           hiddenText.style.display = 'none';
//         }, 300);
        
//         this.textContent = getTextFromKey('misc.vermas');
//         this.classList.remove('expanded');
//       }
//     });
//   });
// }
function setupVerMasButtons() {
  const verMasBtns = document.querySelectorAll('.ver-mas-btn');
  
  // If no buttons, exit early
  if (verMasBtns.length === 0) {
    console.log('No .ver-mas-btn elements found, skipping setup');
    return;
  }
  
  // Check if modal exists, create it if not
  let modalServices = document.getElementById('modal-services');
  
  if (!modalServices) {
    console.log('Creating modal-services element');
    // Create the modal HTML WITH X button at top, NO bottom button
    const modalHTML = `
      <div id="modal-services" class="modal-services">
        <div class="modal-services__overlay"></div>
        <div class="modal-services__content">
          <button class="modal-services__close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <h3 class="modal-services__title"></h3>
          <div class="modal-services__body"></div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    modalServices = document.getElementById('modal-services');
    
    // Wait a moment for DOM to update
    setTimeout(() => {
      setupVerMasButtons();
    }, 100);
    return;
  }
  
  // Now get the modal elements - with null checks
  const modalServicesOverlay = modalServices.querySelector('.modal-services__overlay');
  const modalServicesClose = modalServices.querySelector('.modal-services__close'); // This is the X button
  const modalServicesTitle = modalServices.querySelector('.modal-services__title');
  const modalServicesBody = modalServices.querySelector('.modal-services__body');
  
  // Check if all required elements exist
  const elements = {
    modalServicesOverlay,
    modalServicesClose,
    modalServicesTitle,
    modalServicesBody
  };
  
  // Log which elements are missing
  for (const [name, element] of Object.entries(elements)) {
    if (!element) {
      console.error(`Missing element: ${name}`);
    }
  }
  
  // If any critical element is missing, recreate modal
  if (!modalServicesOverlay || !modalServicesClose || !modalServicesTitle || !modalServicesBody) {
    console.error('Critical modal elements missing, recreating modal...');
    if (modalServices.parentNode) {
      modalServices.remove();
    }
    setTimeout(() => {
      setupVerMasButtons();
    }, 100);
    return;
  }
  
  // Initialize modal as hidden
  modalServices.style.display = 'none';
  
  // Function to open services modal
  function openServicesModal(servicioElement) {
    // Get title - look for p5 element with data-key inside h3
    const titleP5 = servicioElement.querySelector('h3 p5');
    const titleKey = titleP5?.dataset.key;
    const title = titleKey ? getTextFromKey(titleKey) : servicioElement.querySelector('h3')?.textContent || '';
    
    // Get visible text - look for all p5 elements in visible-text
    const visibleTextP5s = servicioElement.querySelectorAll('.visible-text p5');
    let visibleText = '';
    visibleTextP5s.forEach(p5 => {
      const key = p5.dataset.key;
      if (key) {
        visibleText += getTextFromKey(key) + '<br><br>';
      }
    });
    visibleText = visibleText.replace(/(<br><br>)+$/, '');
    
    // Get hidden text - look for all p5 elements in hidden-text
    const hiddenTextP5s = servicioElement.querySelectorAll('.hidden-text p5');
    let hiddenText = '';
    hiddenTextP5s.forEach(p5 => {
      const key = p5.dataset.key;
      if (key) {
        hiddenText += getTextFromKey(key) + '<br><br>';
      }
    });
    hiddenText = hiddenText.replace(/(<br><br>)+$/, '');
    
    // Set modal content
    modalServicesTitle.textContent = title;
    modalServicesBody.innerHTML = `
      <div class="modal-services__visible-text">${visibleText}</div>
      <div class="modal-services__hidden-text">${hiddenText}</div>
    `;
    
    // Show modal with animation
    modalServices.style.display = 'block';
    // Prevent reflow for smoother animation
    requestAnimationFrame(() => {
      modalServices.classList.add('modal-services--active');
    });
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = window.innerWidth - document.documentElement.clientWidth + 'px'; // Prevent layout shift
    
    // Trap focus inside modal for accessibility
    trapFocus(modalServices);
  }
  
  // Function to close services modal
  function closeServicesModal() {
    modalServices.classList.remove('modal-services--active');
    setTimeout(() => {
      modalServices.style.display = 'none';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }, 300);
  }
  
  // Focus trap for accessibility
  function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) {
      console.warn('No focusable elements in modal');
      return;
    }
    
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    
    firstFocusableElement.focus();
    
    function handleTabKey(e) {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          e.preventDefault();
          lastFocusableElement.focus();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          e.preventDefault();
          firstFocusableElement.focus();
        }
      }
    }
    
    modal.addEventListener('keydown', handleTabKey);
  }
  
  // Add event listeners to all "Ver más" buttons
  verMasBtns.forEach(button => {
    // Remove any existing event listeners first
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    newButton.addEventListener('click', function() {
      const servicio = this.closest('.servicio');
      if (servicio) {
        openServicesModal(servicio);
      }
    });
  });
  
  // Close modal events - with checks
  if (modalServicesOverlay) {
    modalServicesOverlay.addEventListener('click', closeServicesModal);
  }
  
  if (modalServicesClose) {
    modalServicesClose.addEventListener('click', closeServicesModal);
  }
  
  // Close with Escape key
  function handleEscapeKey(e) {
    if (e.key === 'Escape' && modalServices.classList.contains('modal-services--active')) {
      closeServicesModal();
    }
  }
  
  document.addEventListener('keydown', handleEscapeKey);
  
  // Close when clicking outside content (on overlay already handled)
  modalServices.addEventListener('click', (e) => {
    if (e.target === modalServices) {
      closeServicesModal();
    }
  });
  
  console.log('Modal setup completed successfully');
}












async function loadLanguage(lang) {
  try {
    const res = await fetch(`lang/${lang}.json`);
    if (!res.ok) throw new Error(`Language file not found: ${lang}.json`);
    const data = await res.json();
    currentLanguageData = data; // store globally

    // Replace text for all elements with data-key
    document.querySelectorAll("[data-key]").forEach(el => {
      const key = el.dataset.key.split(".");
      let value = data;
      for (const k of key) {
        value = value?.[k];
        if (value === undefined) {
          console.warn(`Missing translation key: ${el.dataset.key}`);
          return;
        }
      }
      if (value) el.textContent = value;
    });

    // Update buttons with data-key attributes
    document.querySelectorAll("button[data-key]").forEach(button => {
      const key = button.dataset.key.split(".");
      let value = data;
      for (const k of key) {
        value = value?.[k];
        if (value === undefined) return;
      }
      if (value && button.querySelector('.btn-text')) {
        button.querySelector('.btn-text').textContent = value;
      }
    });

    // Store language preference in localStorage
    localStorage.setItem('preferredLanguage', lang);
    
    // Update language selector value
    const languageSelector = document.getElementById("language-selector");
    if (languageSelector) {
      languageSelector.value = lang;
    }
    
    console.log(`Language loaded: ${lang}`);
    setupVerMasButtons();

  } catch (error) {
    console.error('Error loading language:', error);
    // Fallback to default language
    if (lang !== 'esp') {
      console.log('Falling back to Spanish');
      loadLanguage('esp');
    }
  }
}

// Helper to get value from currentLanguageData by key
function getTextFromKey(key) {
  if (!currentLanguageData) {
    console.warn('No language data loaded');
    return key;
  }
  
  const parts = key.split(".");
  let value = currentLanguageData;
  for (const p of parts) {
    value = value?.[p];
    if (value === undefined) {
      console.warn(`Missing translation key: ${key}`);
      return key;
    }
  }
  return value || key;
}

// Load initial language
function initLanguage() {
  const savedLang = localStorage.getItem('preferredLanguage');
  const browserLang = navigator.language.split('-')[0]; // 'en' or 'es'
  const defaultLang = savedLang || (browserLang === 'es' ? 'esp' : 'eng');
  loadLanguage(defaultLang);
}

// Language selector
document.addEventListener('DOMContentLoaded', () => {
  const languageSelector = document.getElementById("language-selector");
  if (languageSelector) {
    languageSelector.addEventListener("change", (e) => {
      const selectedLang = e.target.value; // "esp" or "eng"
      loadLanguage(selectedLang);
    });
  }
  
  // Initialize language
  initLanguage();
});


document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#navbar a');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -40% 0px', // tweak which part of section counts as "in view"
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = document.querySelector(`#navbar a[href="#${id}"]`);
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        if (link) link.classList.add('active');
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
});





// Nav Bar Button
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.navbar-toggle');
  const nav = document.querySelector('.navbar-nav');

  // Toggle open/close
  toggle.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent immediate close on click
    nav.classList.toggle('show');
  });

  // Close when clicking a nav link
  nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      nav.classList.remove('show');
    }
  });

  // Close when clicking outside the nav or toggle button
  document.addEventListener('click', (e) => {
    const clickedInsideNav = nav.contains(e.target);
    const clickedToggle = toggle.contains(e.target);
    if (!clickedInsideNav && !clickedToggle) {
      nav.classList.remove('show');
    }
  });
});













// Acordeón Filosofía
// Accordion logic for Filosofía
// Accordion behavior (stacked titles)
(function () {
  const accordion = document.querySelector(".accordion");
  if (!accordion) return;

  const items = Array.from(accordion.querySelectorAll(".accordion-item"));

  items.forEach(item => {
    const header = item.querySelector(".accordion-header");

    header.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all others
      items.forEach(i => {
        i.classList.remove("active");
        const h = i.querySelector(".accordion-header");
        if (h) h.setAttribute("aria-expanded", "false");
      });

      // Toggle this one
      if (!isActive) {
        item.classList.add("active");
        header.setAttribute("aria-expanded", "true");
      }
    });

    // Keyboard accessibility (Enter or Space)
    header.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        header.click();
      }
    });
  });
})();















// //animacion cartas

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  
  // Trigger when element is 20% from the top of viewport
  return (
    rect.top <= windowHeight * 0.8 &&
    rect.bottom >= windowHeight * 0.2
  );
}

// Function to handle scroll animation for cards
function handleScrollAnimation() {
  const cardsContainer = document.querySelector('.cards-container2');
  
  if (cardsContainer && !cardsContainer.classList.contains('in-view')) {
    if (isInViewport(cardsContainer)) {
      cardsContainer.classList.add('in-view');
      
      // Remove scroll listener after animation triggers to improve performance
      window.removeEventListener('scroll', handleScrollAnimation);
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Initial check
  handleScrollAnimation();
  
  // Add scroll listener
  window.addEventListener('scroll', handleScrollAnimation);
  
  // Also check on resize
  window.addEventListener('resize', handleScrollAnimation);
});

// Optional: Add Intersection Observer for better performance
function initIntersectionObserver() {
  const cardsContainer = document.querySelector('.cards-container2');
  
  if ('IntersectionObserver' in window && cardsContainer) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.9, // Trigger when 20% visible
        rootMargin: '0px 0px -200px 0px' // Adjust trigger point
      }
    );
    
    observer.observe(cardsContainer);
    return true; // Observer was used
  }
  
  return false; // Fallback to scroll listener
}

// Use Intersection Observer if available, otherwise use scroll listener
document.addEventListener('DOMContentLoaded', function() {
  const observerUsed = initIntersectionObserver();
  
  if (!observerUsed) {
    // Fallback to scroll-based animation
    handleScrollAnimation();
    window.addEventListener('scroll', handleScrollAnimation);
  }
  
  // Handle resize
  window.addEventListener('resize', handleScrollAnimation);
});









// Add this function for image animations
function animateQueHacemosSection() {
  const section = document.getElementById('quehacemos-intro');
  const imageColumn = section.querySelector('.image-column');
  
  // Create an Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add visible class when section enters viewport
        imageColumn.classList.add('visible');
        
        // Optional: Stop observing after animation triggers
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3, // Trigger when 30% of the section is visible
    rootMargin: '0px 0px -50px 0px' // Adjust trigger point
  });
  
  // Start observing the section
  observer.observe(section);
}

// Call this function when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit for everything to load
  setTimeout(animateQueHacemosSection, 500);
});

// Also call it when navigating to this section (if you're using a single page app)
// Add this to your navigation handler if you have one:
/*
function navigateToQueHacemos() {
  // Your existing navigation code...
  
  // Then trigger animation
  setTimeout(() => {
    animateQueHacemosSection();
  }, 100);
}
*/





























