// Modern Professional Website Enhancements
document.addEventListener('DOMContentLoaded', function() {
  // Add loaded class to body for smooth transitions
  document.body.classList.add('loaded');
  
  // Initialize all components
  initializeAnimations();
  initializeScrollEffects();
  initializeNavigation();
  initializeTypingEffect();
  initializeParallaxEffects();
  initializeAnalytics();
});

// Smooth animations and transitions
function initializeAnimations() {
  // Animate elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe all section blocks
  document.querySelectorAll('.section-block').forEach(block => {
    block.style.opacity = '0';
    block.style.transform = 'translateY(30px)';
    block.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(block);
  });

  // Animate skills on hover
  document.querySelectorAll('.skills-info p').forEach(skill => {
    skill.addEventListener('mouseenter', function() {
      this.style.transform = 'translateX(8px) scale(1.02)';
    });
    
    skill.addEventListener('mouseleave', function() {
      this.style.transform = 'translateX(0) scale(1)';
    });
  });
}

// Smooth scroll effects
function initializeScrollEffects() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Parallax effect for sidebar
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
  });
}

// Enhanced navigation
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section-block');
  
  // Update active navigation based on scroll position
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Add hover effects to navigation
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.transform = 'translateX(8px)';
    });
    
    link.addEventListener('mouseleave', function() {
      this.style.transform = 'translateX(0)';
    });
  });
}

// Typing effect for name
function initializeTypingEffect() {
  const nameElement = document.querySelector('.name');
  if (nameElement) {
    const text = nameElement.textContent;
    nameElement.textContent = '';
    nameElement.style.opacity = '1';
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        nameElement.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    };
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 500);
  }
}

// Parallax effects
function initializeParallaxEffects() {
  // Add subtle parallax to background elements
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.section-block');
    
    parallaxElements.forEach((element, index) => {
      const speed = 0.5 + (index * 0.1);
      element.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
    });
  });
}

// Enhanced lightbox functionality
function openLightbox(imageSrc, caption) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  
  if (lightbox && lightboxImage && lightboxCaption) {
    lightboxImage.src = imageSrc;
    lightboxCaption.textContent = caption;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add entrance animation
    lightbox.style.opacity = '0';
    setTimeout(() => {
      lightbox.style.opacity = '1';
    }, 10);
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.style.opacity = '0';
    setTimeout(() => {
      lightbox.style.display = 'none';
      document.body.style.overflow = 'auto';
    }, 300);
  }
}

// Add loading animation
window.addEventListener('load', () => {
  document.body.classList.add('fully-loaded');
  
  // Add subtle entrance animations
  const elements = document.querySelectorAll('.section-block, .nav-link, .social-link');
  elements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, index * 100);
  });
});

// Enhanced contact link interactions
document.addEventListener('DOMContentLoaded', () => {
  const contactLinks = document.querySelectorAll('.contact-link');
  
  contactLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.transform = 'translateX(12px) scale(1.02)';
      this.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.15)';
    });
    
    link.addEventListener('mouseleave', function() {
      this.style.transform = 'translateX(0) scale(1)';
      this.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
    });
  });
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeLightbox();
  }
  
  // Navigation with arrow keys
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.style.display === 'flex') {
      // Add photo navigation logic here if needed
    }
  }
});

// Add smooth page transitions
window.addEventListener('beforeunload', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.3s ease';
});

// Performance optimization
let ticking = false;

function updateOnScroll() {
  // Update scroll-based animations
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateOnScroll);
    ticking = true;
  }
});

// Add modern cursor effects (optional)
document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    background: rgba(37, 99, 235, 0.3);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s ease;
    transform: translate(-50%, -50%);
  `;
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  // Hide cursor on mobile
  if ('ontouchstart' in window) {
    cursor.style.display = 'none';
  }
});

// Enhanced Analytics Tracking
function initializeAnalytics() {
  // Track page views
  if (typeof gtag !== 'undefined') {
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href
    });
  }

  // Track button clicks
  document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('click', function(e) {
      const linkText = this.textContent.trim();
      const linkUrl = this.href || this.getAttribute('href');
      
      if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
          event_category: 'engagement',
          event_label: linkText,
          link_url: linkUrl
        });
      }
    });
  });

  // Track scroll depth
  let maxScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    
    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
      
      // Track scroll milestones
      if (scrollPercent >= 25 && maxScroll < 50) {
        if (typeof gtag !== 'undefined') {
          gtag('event', 'scroll', {
            event_category: 'engagement',
            event_label: '25% scroll depth'
          });
        }
      } else if (scrollPercent >= 50 && maxScroll < 75) {
        if (typeof gtag !== 'undefined') {
          gtag('event', 'scroll', {
            event_category: 'engagement',
            event_label: '50% scroll depth'
          });
        }
      } else if (scrollPercent >= 75 && maxScroll < 100) {
        if (typeof gtag !== 'undefined') {
          gtag('event', 'scroll', {
            event_category: 'engagement',
            event_label: '75% scroll depth'
          });
        }
      } else if (scrollPercent >= 100) {
        if (typeof gtag !== 'undefined') {
          gtag('event', 'scroll', {
            event_category: 'engagement',
            event_label: '100% scroll depth'
          });
        }
      }
    }
  });

  // Track time on page
  let startTime = Date.now();
  window.addEventListener('beforeunload', () => {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);
    if (typeof gtag !== 'undefined') {
      gtag('event', 'timing_complete', {
        name: 'page_view_time',
        value: timeOnPage
      });
    }
  });

  // Track form interactions (if any forms are added later)
  document.addEventListener('submit', function(e) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'form_submit', {
        event_category: 'engagement',
        event_label: e.target.id || 'contact_form'
      });
    }
  });
} 