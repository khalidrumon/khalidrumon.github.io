// Navigation with fade transitions
const sections = document.querySelectorAll('.panel');
const menuItems = document.querySelectorAll('.menu-item');
const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
const mobileMenuItems = document.querySelectorAll('.mobile-menu-item');
const sideMenu = document.getElementById('sideMenu');
const mobileBottomNav = document.getElementById('mobileBottomNav');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileSideMenu = document.getElementById('mobileSideMenu');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const socialBox = document.getElementById('socialBox');
let currentIndex = 0;
let isAnimating = false;
const totalSections = sections.length;
let touchStartY = 0;
let touchEndY = 0;
let wheelTimeout;

// Check if mobile view
function isMobileView() {
  return window.innerWidth <= 1024;
}

// Function to navigate to specific section
function scrollToSection(index) {
  if (isAnimating || index < 0 || index >= totalSections) return;
  
  isAnimating = true;
  
  // Store previous index for desktop transitions
  const prevIndex = currentIndex;
  currentIndex = index;
  
  // Update active section
  if (isMobileView()) {
    // MOBILE VIEW: Show/hide sections
    sections.forEach((section, i) => {
      if (i === index) {
        // Show and activate target section
        section.style.display = 'flex';
        setTimeout(() => {
          section.classList.add('active');
          // Scroll to top on mobile
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }, 10);
      } else {
        // Hide and deactivate other sections
        section.classList.remove('active');
        // Small delay before hiding to allow fade out
        setTimeout(() => {
          if (i !== index) {
            section.style.display = 'none';
          }
        }, 300);
      }
    });
  } else {
    // DESKTOP VIEW: Use opacity transitions
    sections.forEach((section, i) => {
      section.classList.remove('active');
      if (i === index) {
        setTimeout(() => {
          section.classList.add('active');
        }, 50);
      }
    });
  }
  
  // Update desktop menu items
  menuItems.forEach((item, i) => {
    item.classList.remove('active');
    item.classList.add('inactive');
    if (i === index) {
      item.classList.add('active');
      item.classList.remove('inactive');
    }
  });
  
  // Update mobile bottom nav items
  mobileNavItems.forEach((item, i) => {
    item.classList.remove('active');
    if (i === index) {
      item.classList.add('active');
    }
  });
  
  // Update mobile side menu items
  mobileMenuItems.forEach((item, i) => {
    item.classList.remove('active');
    if (i === index) {
      item.classList.add('active');
    }
  });
  
  // Close mobile side menu if open
  if (isMobileView() && mobileSideMenu.classList.contains('active')) {
    closeMobileMenu();
  }
  
  // Reset animation lock
  setTimeout(() => {
    isAnimating = false;
  }, 600);
}

// Desktop: Menu click events
menuItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    scrollToSection(index);
  });
  
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollToSection(index);
    }
  });
  
  item.setAttribute('tabindex', '0');
});

// Mobile: Bottom nav click events
mobileNavItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    scrollToSection(index);
  });
});

// Mobile: Side menu click events
mobileMenuItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    scrollToSection(index);
  });
});

// Toggle mobile menu
function toggleMobileMenu() {
  if (isMobileView()) {
    mobileMenuToggle.classList.toggle('active');
    mobileSideMenu.classList.toggle('active');
  }
}

// Close mobile menu
function closeMobileMenu() {
  mobileMenuToggle.classList.remove('active');
  mobileSideMenu.classList.remove('active');
}

// Mobile menu toggle events
mobileMenuToggle.addEventListener('click', toggleMobileMenu);
closeMenuBtn.addEventListener('click', closeMobileMenu);

// Close menu when clicking outside on mobile
document.addEventListener('click', (e) => {
  if (isMobileView() && 
      mobileSideMenu.classList.contains('active') &&
      !mobileSideMenu.contains(e.target) &&
      !mobileMenuToggle.contains(e.target)) {
    closeMobileMenu();
  }
});

// Keyboard navigation (both desktop and mobile)
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'PageDown') {
    e.preventDefault();
    scrollToSection((currentIndex + 1) % totalSections);
  }
  if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    e.preventDefault();
    scrollToSection((currentIndex - 1 + totalSections) % totalSections);
  }
  if (e.key === 'Home') {
    e.preventDefault();
    scrollToSection(0);
  }
  if (e.key === 'End') {
    e.preventDefault();
    scrollToSection(totalSections - 1);
  }
  if (e.key === 'Escape') {
    // Close menus
    if (isMobileView() && mobileSideMenu.classList.contains('active')) {
      closeMobileMenu();
    }
    // Close social widget
    socialBox.classList.remove('open');
  }
});

// Desktop: Mouse wheel navigation
window.addEventListener('wheel', (e) => {
  if (isMobileView()) {
    // Allow normal scrolling on mobile
    return;
  }
  
  e.preventDefault();
  
  if (isAnimating) return;
  
  clearTimeout(wheelTimeout);
  wheelTimeout = setTimeout(() => {
    if (e.deltaY > 0) {
      // Scroll down - next section
      scrollToSection((currentIndex + 1) % totalSections);
    } else if (e.deltaY < 0) {
      // Scroll up - previous section
      scrollToSection((currentIndex - 1 + totalSections) % totalSections);
    }
  }, 120);
}, { passive: false });

// Mobile: Touch/swipe support
document.addEventListener('touchstart', (e) => {
  if (!isMobileView()) return;
  touchStartY = e.changedTouches[0].screenY;
}, {passive: true});

document.addEventListener('touchend', (e) => {
  if (!isMobileView()) return;
  touchEndY = e.changedTouches[0].screenY;
  handleSwipe();
}, {passive: true});

function handleSwipe() {
  if (!isMobileView()) return;
  
  const swipeThreshold = 50;
  const diff = touchStartY - touchEndY;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe up - next section
      scrollToSection((currentIndex + 1) % totalSections);
    } else {
      // Swipe down - previous section
      scrollToSection((currentIndex - 1 + totalSections) % totalSections);
    }
  }
}

// Social widget functionality
socialBox.addEventListener('click', (e) => {
  if (!e.target.closest('a')) {
    socialBox.classList.toggle('open');
  }
});

socialBox.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    socialBox.classList.toggle('open');
  }
});

socialBox.setAttribute('tabindex', '0');

// Close social widget when clicking outside
document.addEventListener('click', (e) => {
  if (!socialBox.contains(e.target)) {
    socialBox.classList.remove('open');
  }
});

// Handle image errors gracefully
document.querySelectorAll('.hero-art img').forEach(img => {
  img.addEventListener('error', function() {
    console.log('Image failed to load:', this.src);
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    
    const sectionIndex = parseInt(this.closest('.panel').dataset.index) || 0;
    const colors = [
      'rgba(124,58,237,0.2), rgba(96,165,250,0.2)',
      'rgba(6,182,212,0.2), rgba(14,165,233,0.2)',
      'rgba(236,72,153,0.2), rgba(249,115,22,0.2)',
      'rgba(79,70,229,0.2), rgba(236,72,153,0.2)',
      'rgba(6,182,212,0.2), rgba(34,197,94,0.2)',
      'rgba(236,72,153,0.2), rgba(124,58,237,0.2)'
    ];
    
    const icons = ['user', 'hashtag', 'laptop-code', 'chart-line', 'palette', 'briefcase'];
    const texts = ['Profile', 'Social Media', 'Web Design', 'SEO', 'Graphics', 'Office'];
    
    placeholder.style.background = `linear-gradient(135deg, ${colors[sectionIndex]})`;
    placeholder.innerHTML = `<i class="fas fa-${icons[sectionIndex]}"></i><span>${texts[sectionIndex]}</span>`;
    
    this.style.display = 'none';
    this.parentElement.appendChild(placeholder);
  });
});

// Make all contact buttons clickable
document.querySelectorAll('button[onclick*="mailto"]').forEach(button => {
  button.style.cursor = 'pointer';
});

// Handle window resize
function handleResize() {
  if (!isMobileView()) {
    // DESKTOP VIEW
    sideMenu.style.display = 'flex';
    mobileMenuToggle.style.display = 'none';
    mobileBottomNav.style.display = 'none';
    mobileSideMenu.style.display = 'none';
    mobileMenuToggle.classList.remove('active');
    mobileSideMenu.classList.remove('active');
    
    // Reset body overflow
    document.body.style.overflow = 'hidden';
    
    // Close social widget
    socialBox.classList.remove('open');
    
    // Show all sections for desktop view
    sections.forEach(section => {
      section.style.display = 'flex';
      section.style.position = 'absolute';
      section.style.height = '100%';
      section.style.opacity = '0';
      section.style.transform = 'translateX(80px)';
      section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Show current section
    sections[currentIndex].style.opacity = '1';
    sections[currentIndex].style.transform = 'translateX(0)';
  } else {
    // MOBILE VIEW
    sideMenu.style.display = 'none';
    mobileMenuToggle.style.display = 'flex';
    mobileBottomNav.style.display = 'flex';
    mobileSideMenu.style.display = 'block';
    
    // Allow scrolling on mobile
    document.body.style.overflow = 'auto';
    
    // Show only active section on mobile
    sections.forEach((section, index) => {
      section.style.position = 'relative';
      section.style.height = 'auto';
      section.style.minHeight = '100vh';
      section.style.opacity = '1';
      section.style.transform = 'none';
      section.style.transition = 'opacity 0.4s ease';
      
      if (index === currentIndex) {
        section.style.display = 'flex';
        section.classList.add('active');
      } else {
        section.style.display = 'none';
        section.classList.remove('active');
      }
    });
  }
}

window.addEventListener('resize', handleResize);

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  handleResize();
  
  // Initialize first section as active
  sections[0].classList.add('active');
  
  // Ensure hero-art containers are square
  document.querySelectorAll('.hero-art').forEach(art => {
    art.style.aspectRatio = '1/1';
  });
  
  // Ensure all images are visible immediately
  document.querySelectorAll('.hero-art img').forEach(img => {
    img.style.opacity = '1';
    img.style.visibility = 'visible';
  });
  
  // Add click event to View Services button
  const viewServicesBtn = document.querySelector('.btn-primary');
  if (viewServicesBtn) {
    viewServicesBtn.addEventListener('click', () => {
      scrollToSection(1);
    });
  }
});

// Global scrollToSection function for button use
window.scrollToSection = scrollToSection;