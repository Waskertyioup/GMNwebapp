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
















// Carrusel automático
// === Fully Adaptive Infinite Carousel ===

(function() {
  const carousels = document.querySelectorAll('.carousel-container');
  if (!carousels.length) return;

  carousels.forEach((container) => {
    const track = container.querySelector('.carousel-track');
    const prevBtn = container.querySelector('.carousel-btn.prev');
    const nextBtn = container.querySelector('.carousel-btn.next');

    if (!track) return;

    let originalCards = Array.from(track.children);
    let cards = [];
    let index = 0;
    let autoSlideInterval;
    let cardsPerView = 1;
    const GAP = 16; // must match CSS gap

    const updateCardsPerView = () => {
      const width = window.innerWidth;
      if (width > 1024) cardsPerView = 4;
      else if (width > 768) cardsPerView = 3;
      else if (width > 480) cardsPerView = 2;
      else cardsPerView = 1;
    };

    const adjustCardWidths = () => {
      const containerWidth = container.clientWidth;
      const totalGap = (cardsPerView - 1) * GAP;
      const cardWidth = (containerWidth - totalGap) / cardsPerView;

      cards.forEach(card => {
        card.style.flex = `0 0 ${cardWidth}px`;
        card.style.width = `${cardWidth}px`;
      });
    };

    const setupClones = () => {
      track.innerHTML = '';

      // Re-add original cards
      originalCards.forEach(card => track.appendChild(card.cloneNode(true)));

      // Add clones on both sides
      const total = originalCards.length;
      for (let i = 0; i < cardsPerView; i++) {
        const firstClone = originalCards[i % total].cloneNode(true);
        const lastClone = originalCards[(total - 1 - i + total) % total].cloneNode(true);
        track.appendChild(firstClone);
        track.insertBefore(lastClone, track.firstChild);
      }

      cards = Array.from(track.children);
      index = cardsPerView;
      track.style.transition = 'none';
      document.documentElement.style.setProperty('--cards-per-view', cardsPerView);
      document.documentElement.style.setProperty('--gap', '16px');

      adjustCardWidths();
      updatePosition();
    };

    const updatePosition = () => {
      const cardWidth = cards[0].offsetWidth + GAP;
      const offset = index * cardWidth;
      track.style.transform = `translateX(-${offset}px)`;
    };

    const moveToNext = () => { index++; slide(); };
    const moveToPrev = () => { index--; slide(); };

    const slide = () => {
      track.style.transition = 'transform 0.6s ease-in-out';
      updatePosition();
    };

    track.addEventListener('transitionend', () => {
      if (index >= cards.length - cardsPerView) {
        index = cardsPerView;
        track.style.transition = 'none';
        updatePosition();
      } else if (index < cardsPerView) {
        index = cards.length - cardsPerView * 2;
        track.style.transition = 'none';
        updatePosition();
      }
    });

    const startAutoSlide = () => {
      stopAutoSlide();
      autoSlideInterval = setInterval(moveToNext, 4000);
    };

    const stopAutoSlide = () => clearInterval(autoSlideInterval);

    nextBtn?.addEventListener('click', () => { moveToNext(); startAutoSlide(); });
    prevBtn?.addEventListener('click', () => { moveToPrev(); startAutoSlide(); });
    track.addEventListener('mouseenter', stopAutoSlide);
    track.addEventListener('mouseleave', startAutoSlide);

    window.addEventListener('resize', () => {
      updateCardsPerView();
      setupClones();
    });

    // Init
    updateCardsPerView();
    setupClones();
    startAutoSlide();
  });
})();




















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









// === Contact Form (Frontend EmailJS) ===
// Contact Form Submission
document.getElementById('contact-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.querySelector('.btn-text').textContent;
  
  // Get form data
  const formData = {
    nombre: form.nombre.value,
    empresa: form.empresa.value,
    correo: form.correo.value,
    telefono: form.telefono.value,
    pais: form.pais.value,
    requerimiento: form.requerimiento.value,
    reunion: form.reunion.checked
  };

  // Show loading state
  if (submitButton.dataset.keySending) {
    const sendingText = document.querySelector(`[data-key="${submitButton.dataset.keySending}"]`);
    if (sendingText) {
      submitButton.querySelector('.btn-text').textContent = sendingText.textContent;
    }
  }
  submitButton.disabled = true;

  try {
    console.log('📤 Sending contact form via backend...');
    
    // Send to YOUR backend endpoint
    const response = await fetch('/send-mail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    
    if (result.ok) {
      console.log('Form sent successfully via backend');
      
      // Show confirmation modal
      const modal = document.getElementById('confirmation-modal');
      modal.style.display = 'block';
      
      // Reset form
      form.reset();
    } else {
      console.error('Backend error:', result.message);
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Error sending form:', error);
    alert('Error de conexión. Por favor, intenta nuevamente.');
  } finally {
    // Reset button state
    submitButton.disabled = false;
    submitButton.querySelector('.btn-text').textContent = originalText;
  }
});




// === Join Form (Frontend EmailJS) ===
// Join Form Submission
// Join Form Submission - USE FORM DATA
document.getElementById('join-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.querySelector('.btn-text').textContent;
  
  // Get form data
  const nombre = form.nombre.value;
  const correo = form.correo.value;
  const pais = form.pais.value;
  const linkedin = form.linkedin.value;
  const area = form.area.value;
  
  // Get file
  const resumeFile = form.resume.files[0];
  
  // Validate file
  if (!resumeFile) {
    alert('Por favor, adjunta tu CV.');
    return;
  }

  // Check file size (5MB max)
  if (resumeFile.size > 5 * 1024 * 1024) {
    alert('El archivo es demasiado grande. Máximo 5MB.');
    return;
  }

  // Show loading state
  if (submitButton.dataset.keySending) {
    const sendingText = document.querySelector(`[data-key="${submitButton.dataset.keySending}"]`);
    if (sendingText) {
      submitButton.querySelector('.btn-text').textContent = sendingText.textContent;
    }
  }
  submitButton.disabled = true;

  try {
    console.log('Sending join form via backend (FormData)...');
    
    // Create FormData (proper way for file uploads)
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('correo', correo);
    formData.append('pais', pais);
    formData.append('linkedin', linkedin);
    formData.append('area', area);
    formData.append('resume', resumeFile); // File is appended directly

    console.log('FormData created, file size:', resumeFile.size, 'bytes');

    // Send to backend using FormData
    const response = await fetch('/send-join-mail', {
      method: 'POST',
      body: formData
      // NO Content-Type header - let browser set it automatically for FormData
    });

    const result = await response.json();
    
    if (result.ok) {
      console.log('Join form sent successfully via backend');
      
      // Show confirmation modal
      const modal = document.getElementById('join-confirmation-modal');
      modal.style.display = 'block';
      
      // Reset form
      form.reset();
    } else {
      console.error('Backend error:', result.message);
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Error sending form:', error);
    
    // Handle 413 error specifically
    if (error.message.includes('Unexpected token') || error.message.includes('Failed to fetch')) {
      alert('Error: El archivo es demasiado grande o hay un problema de conexión.');
    } else {
      alert('Error de conexión. Por favor, intenta nuevamente.');
    }
  } finally {
    // Reset button state
    submitButton.disabled = false;
    submitButton.querySelector('.btn-text').textContent = originalText;
  }
});

// Helper function to convert file to base64
function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove the data:application/pdf;base64, part
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}


//   // Modal close
//   closeModal.addEventListener("click", () => (modal.style.display = "none"));
//   window.addEventListener("click", (e) => {
//     if (e.target === modal) modal.style.display = "none";
//   });
// });

// Close modal handlers
document.getElementById('close-modal')?.addEventListener('click', function() {
  document.getElementById('confirmation-modal').style.display = 'none';
});

document.getElementById('join-close-modal')?.addEventListener('click', function() {
  document.getElementById('join-confirmation-modal').style.display = 'none';
});
// Add escape key support
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const modal = document.getElementById('confirmation-modal');
    if (modal && modal.style.display === 'block') {
      modal.style.display = 'none';
    }
    
    const joinModal = document.getElementById('join-confirmation-modal');
    if (joinModal && joinModal.style.display === 'block') {
      joinModal.style.display = 'none';
    }
  }
});

































//animacion cartas
// Function to check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
    rect.bottom >= 0
  );
}

// Function to handle scroll animation
function handleScrollAnimation() {
  const cardsContainer = document.querySelector('.cards-container2');
  
  if (cardsContainer && !cardsContainer.classList.contains('in-view')) {
    if (isInViewport(cardsContainer)) {
      cardsContainer.classList.add('in-view');
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Initial check
  handleScrollAnimation();
  
  // Add scroll listener
  window.addEventListener('scroll', handleScrollAnimation);
});








// Carousel data with separate images for thumbnails and main display
const carouselData = [
    {
        id: 1,
        title: "BHP",
        getDescription: () => getTextFromKey('exitos.bhp'),
        imageUrl: "images/bhp.png",
        imageUrl2: "images/bhp2.png"
    },
    {
        id: 2,
        title: "Codelco", 
        getDescription: () => getTextFromKey('exitos.codelco'),
        imageUrl: "images/codelco.png",
        imageUrl2: "images/codelco2.png"
    },
    {
        id: 3,
        title: "Cerro Matoso",
        getDescription: () => getTextFromKey('exitos.cerromatoso'),
        imageUrl: "images/Cerro matoso.png",
        imageUrl2: "images/Cerro matoso2.png"
    },
    {
        id: 4,
        title: "Coca-Cola",
        getDescription: () => getTextFromKey('exitos.cocacola'),
        imageUrl: "images/cocacola.png",
        imageUrl2: "images/cocacola2.png"
    },
    {
        id: 5,
        title: "Glencore",
        getDescription: () => getTextFromKey('exitos.glencore'),
        imageUrl: "images/glencore.png",
        imageUrl2: "images/glencore2.png"
    },
    {
        id: 6,
        title: "Antapaccay",
        getDescription: () => getTextFromKey('exitos.antapaccay'),
        imageUrl: "images/antapaccay.png",
        imageUrl2: "images/antapaccay2.png"
    },
    {
        id: 7,
        title: "Spence",
        getDescription: () => getTextFromKey('exitos.spence'),
        imageUrl: "images/spence.png",
        imageUrl2: "images/spence2.png"
    },
    {
        id: 8,
        title: "Sierra Gorda",
        getDescription: () => getTextFromKey('exitos.sierragorda'),
        imageUrl: "images/sierra gorda.png",
        imageUrl2: "images/sierra gorda2.png"
    }


];

let currentSlide = 0;
let autoPlayInterval = null;
let progressInterval = null;
const autoPlayDelay = 4000; // 4 seconds

// DOM Elements
const mainImage = document.getElementById('mainImage');
const mainTitle = document.getElementById('mainTitle');
const mainDescription = document.getElementById('mainDescription');
const thumbnailTrack = document.getElementById('thumbnailTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
});

function initCarousel() {
    renderThumbnails();
    updateMainDisplay();
    setupEventListeners();
    startAutoPlay();
}

function renderThumbnails() {
    thumbnailTrack.innerHTML = '';
    
    carouselData.forEach((slide, index) => {
        const thumbSlide = document.createElement('div');
        thumbSlide.className = `thumbnail-slide ${index === currentSlide ? 'active' : ''}`;
        
        // Use imageUrl for thumbnails
        thumbSlide.innerHTML = `
            <img src="${slide.imageUrl}" alt="${slide.title}" class="thumbnail-image">
            
        `;
        
        thumbSlide.addEventListener('click', () => goToSlide(index));
        thumbnailTrack.appendChild(thumbSlide);
    });
}

function updateMainDisplay() {
    const slide = carouselData[currentSlide];
    
    // Add fade transition
    mainImage.style.opacity = '0';
    
    setTimeout(() => {
        // Use imageUrl2 for main display
        mainImage.src = slide.imageUrl2;
        mainImage.alt = slide.title;
        mainTitle.textContent = slide.title;
        mainDescription.textContent = slide.getDescription();
        mainImage.style.opacity = '1';
    }, 300);
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail-slide').forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentSlide);
    });
    
    // Center the active thumbnail in the track
    centerActiveThumbnail();
    
    // Reset progress bar
    resetProgressBar();
}

function centerActiveThumbnail() {
    const activeThumb = document.querySelector('.thumbnail-slide.active');
    if (activeThumb) {
        const track = document.getElementById('thumbnailTrack');
        const thumbWidth = activeThumb.offsetWidth + 15; // including gap
        const trackWidth = track.offsetWidth;
        const thumbPosition = activeThumb.offsetLeft;
        const scrollPosition = thumbPosition - (trackWidth / 2) + (thumbWidth / 2);
        
        track.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    }
}

function resetProgressBar() {
    // Remove existing progress bar
    const existingProgress = document.querySelector('.progress-container');
    if (existingProgress) {
        existingProgress.remove();
    }
    
    // Create new progress bar
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    
    progressContainer.appendChild(progressBar);
    document.querySelector('.main-display').appendChild(progressContainer);
    
    // Animate progress bar
    let width = 0;
    clearInterval(progressInterval);
    progressInterval = setInterval(() => {
        if (width >= 100) {
            clearInterval(progressInterval);
        } else {
            width += 1;
            progressBar.style.width = width + '%';
        }
    }, autoPlayDelay / 100);
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % carouselData.length;
    updateMainDisplay();
}

function previousSlide() {
    currentSlide = (currentSlide - 1 + carouselData.length) % carouselData.length;
    updateMainDisplay();
}

function goToSlide(index) {
    currentSlide = index;
    updateMainDisplay();
    resetAutoPlay();
}

function startAutoPlay() {
    if (!autoPlayInterval) {
        autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
    }
}

function resetAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }
}

function setupEventListeners() {
    // Navigation buttons
    prevBtn.addEventListener('click', previousSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            previousSlide();
        }
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
        }
    });
    
    // Touch/swipe for mobile
    let touchStartX = 0;
    const mainDisplay = document.querySelector('.main-display');
    
    mainDisplay.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });
    
    mainDisplay.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide(); // Swipe left
            } else {
                previousSlide(); // Swipe right
            }
        }
    });
    
    // Pause auto-play on hover
    mainDisplay.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
        clearInterval(progressInterval);
    });
    
    mainDisplay.addEventListener('mouseleave', () => {
        startAutoPlay();
    });
}

// Add fade transition style
const style = document.createElement('style');
style.textContent = `
    .main-image {
        transition: opacity 0.5s ease-in-out, transform 0.5s ease;
    }
`;
document.head.appendChild(style);


