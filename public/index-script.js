

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