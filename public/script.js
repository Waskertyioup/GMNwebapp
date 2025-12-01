const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".navbar a");

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






// === Helper to get text from p5[data-key] ===
function getTextFromKey(key) {
  const el = document.querySelector(`p5[data-key="${key}"]`);
  return el ? el.textContent : key;
}




// === Contact Form ===
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const modal = document.getElementById("confirmation-modal");
  const closeModal = document.getElementById("close-modal");

  if (!form) return;

  const submitBtn = form.querySelector("button[type='submit']");
  const textContainer = submitBtn.querySelector(".btn-text");
  const defaultKey = submitBtn.dataset.keyDefault; // e.g., "contact.sent"
  const sendingKey = submitBtn.dataset.keySending; // e.g., "contact.sending"

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Disable button and set "sending" text
    submitBtn.disabled = true;
    textContainer.textContent = getTextFromKey(sendingKey);

    const data = {
      nombre: form.nombre.value,
      empresa: form.empresa.value,
      correo: form.correo.value,
      telefono: form.telefono.value,
      pais: form.pais.value,
      requerimiento: form.requerimiento.value,
      reunion: form.reunion.checked,
    };

    try {
      const res = await fetch("/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.ok) {
        modal.style.display = "flex";
        form.reset();
      } else {
        alert(" " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert(" No se pudo enviar el formulario.");
    } finally {
      // Re-enable button and restore default text
      submitBtn.disabled = false;
      textContainer.textContent = getTextFromKey(defaultKey);
    }
  });

  // Modal close
  closeModal.addEventListener("click", () => (modal.style.display = "none"));
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
});

// === Join Form ===
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("join-form");
  const modal = document.getElementById("join-confirmation-modal");
  const closeModal = document.getElementById("join-close-modal");

  if (!form) return;

  const submitBtn = form.querySelector("button[type='submit']");
  const textContainer = submitBtn.querySelector(".btn-text");
  const defaultKey = submitBtn.dataset.keyDefault; // e.g., "contact.sent"
  const sendingKey = submitBtn.dataset.keySending; // e.g., "contact.sending"

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Disable button and set "sending" text
    submitBtn.disabled = true;
    
    textContainer.textContent = getTextFromKey(sendingKey);

    const formData = new FormData(form);

    try {
      const res = await fetch("/send-join-mail", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (result.ok) {
        modal.style.display = "flex";
        form.reset();
      } else {
        alert(" " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert(" No se pudo enviar el formulario.");
    } finally {
      // Re-enable button and restore default text
      submitBtn.disabled = false;
      textContainer.textContent = getTextFromKey(defaultKey);
    }
  });

  // Modal close
  closeModal.addEventListener("click", () => (modal.style.display = "none"));
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
});










let currentLanguageData = {};

async function loadLanguage(lang) {
  const res = await fetch(`lang/${lang}.json`);
  const data = await res.json();
  currentLanguageData = data; // store globally

  // Replace text for all elements with data-key
  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.dataset.key.split(".");
    let value = data;
    for (const k of key) value = value[k];
    if (value) el.textContent = value;
  });
}

// Helper to get value from currentLanguageData by key
function getTextFromKey(key) {
  const parts = key.split(".");
  let value = currentLanguageData;
  for (const p of parts) {
    if (value[p] !== undefined) value = value[p];
    else return key; // fallback
  }
  return value;
}

// Default language
loadLanguage("esp");

// Language selector
document.getElementById("language-selector").addEventListener("change", (e) => {
  const selectedLang = e.target.value; // "esp" or "eng"
  loadLanguage(selectedLang);
});

















// Carousel data with separate images for thumbnails and main display
const carouselData = [
    {
        id: 1,
        title: "BHP",
        description: "Global mining and metals company focusing on resources",
        imageUrl: "images/bhp.png",
        imageUrl2: "images/bhp.png"
    },
    {
        id: 2,
        title: "Codelco", 
        description: "Chilean state-owned copper mining company",
        imageUrl: "images/codelco.png",
        imageUrl2: "images/codelco2.png"
    },
    {
        id: 3,
        title: "Cerro Matoso",
        description: "Another mining company with significant operations",
        imageUrl: "images/cerro matoso.png",
        imageUrl2: "images/cerro matoso.png"
    },
    {
        id: 4,
        title: "Coca-Cola",
        description: "Leading producer of precious metals and minerals",
        imageUrl: "images/cocacola.png",
        imageUrl2: "images/cocacola.png"
    },
    {
        id: 5,
        title: "Glencore",
        description: "Diversified natural resources company",
        imageUrl: "images/glencore.png",
        imageUrl2: "images/glencore.png"
    },
    {
        id: 6,
        title: "Antapaccay",
        description: "Specialized in sustainable mining practices",
        imageUrl: "images/antapaccay.png",
        imageUrl2: "images/antapaccay.png"
    },
    {
        id: 7,
        title: "Spence",
        description: "Specialized in sustainable mining practices",
        imageUrl: "images/spence.png",
        imageUrl2: "images/spence.png"
    },
    {
        id: 8,
        title: "Sierra Gorda",
        description: "Specialized in sustainable mining practices",
        imageUrl: "images/sierra gorda.png",
        imageUrl2: "images/sierra gorda.png"
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
        mainDescription.textContent = slide.description;
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
