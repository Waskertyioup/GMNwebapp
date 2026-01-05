const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".navbar a");



// ===== LANGUAGE MANAGEMENT =====
let currentLanguageData = {};

// Create a function that runs after language is loaded
function setupVerMasButtons() {
  const verMasBtns = document.querySelectorAll('.ver-mas-btn');
  
  verMasBtns.forEach(button => {
    // Set initial text based on current language AND current state
    const isExpanded = button.classList.contains('expanded');
    button.textContent = getTextFromKey(isExpanded ? 'misc.vermenos' : 'misc.vermas');
    
    button.addEventListener('click', function() {
      const servicio = this.closest('.servicio');
      const hiddenText = servicio.querySelector('.hidden-text');
      
      const isHiddenTextVisible = hiddenText.classList.contains('show');
      
      if (!isHiddenTextVisible) {
        hiddenText.style.display = 'inline';
        setTimeout(() => {
          hiddenText.classList.add('show');
        }, 10);
        
        this.textContent = getTextFromKey('misc.vermenos');
        this.classList.add('expanded');
        servicio.style.minHeight = 'auto';
      } else {
        hiddenText.classList.remove('show');
        setTimeout(() => {
          hiddenText.style.display = 'none';
        }, 300);
        
        this.textContent = getTextFromKey('misc.vermas');
        this.classList.remove('expanded');
      }
    });
  });
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
  const parts = key.split(".");
  let value = currentLanguageData;
  for (const p of parts) {
    if (value?.[p] !== undefined) value = value[p];
    else {
      console.warn(`Missing translation key: ${key}`);
      return key; // fallback to key name
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
// // Function to check if element is in viewport
// function isInViewport(element) {
//   const rect = element.getBoundingClientRect();
//   return (
//     rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
//     rect.bottom >= 0
//   );
// }

// // Function to handle scroll animation
// function handleScrollAnimation() {
//   const cardsContainer = document.querySelector('.cards-container2');
  
//   if (cardsContainer && !cardsContainer.classList.contains('in-view')) {
//     if (isInViewport(cardsContainer)) {
//       cardsContainer.classList.add('in-view');
//     }
//   }
// }

// // Initialize on page load
// document.addEventListener('DOMContentLoaded', function() {
//   // Initial check
//   handleScrollAnimation();
  
//   // Add scroll listener
//   window.addEventListener('scroll', handleScrollAnimation);
// });
// Function to check if element is in viewport
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
        threshold: 0.2, // Trigger when 20% visible
        rootMargin: '0px 0px -100px 0px' // Adjust trigger point
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
































