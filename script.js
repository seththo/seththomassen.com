// Simple Sidebar Navigation with Typing Effect
document.addEventListener('DOMContentLoaded', function() {
  console.log('Script loaded');
  
  // Ensure scrolling is always enabled
  document.body.style.overflowY = 'auto';
  document.body.style.overflowX = 'hidden';
  document.documentElement.style.overflowY = 'auto';
  document.documentElement.style.overflowX = 'hidden';
  
  const navLinks = document.querySelectorAll('.nav-link');
  console.log('Found nav links:', navLinks.length);
  
  // Navigation click handlers for smooth scrolling
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      console.log('Nav link clicked:', this.getAttribute('href'));
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        console.log('Target found:', target);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
  
  // Typing effect for name
  const nameElement = document.querySelector('.name');
  if (nameElement && !nameElement.querySelector('a')) {
    const originalText = nameElement.textContent;
    nameElement.textContent = '';
    nameElement.style.borderRight = '2px solid #667eea';
    
    let i = 0;
    const typeWriter = () => {
      if (i < originalText.length) {
        nameElement.textContent += originalText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        // Start blinking cursor effect
        setTimeout(() => {
          nameElement.style.borderRight = 'none';
        }, 1000);
      }
    };
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 500);
  }
  
  // Simple hover effects for skill tags
  const skillTags = document.querySelectorAll('.skill-tag');
  skillTags.forEach(tag => {
    tag.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-1px)';
    });
    
    tag.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
  
  // Simple intersection observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe elements for simple scroll animations
  document.querySelectorAll('.education-card, .skill-category, .contact-link, .photo-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    observer.observe(el);
  });
  
  // Touch-friendly interactions for mobile
  if ('ontouchstart' in window) {
    document.querySelectorAll('.nav-link, .contact-link, .skill-tag').forEach(el => {
      el.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
      });
      
      el.addEventListener('touchend', function() {
        this.style.transform = '';
      });
    });
  }
  
  // Keyboard navigation support
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const lightbox = document.getElementById('lightbox');
      if (lightbox && lightbox.style.display === 'flex') {
        closeLightbox();
      }
    }
  });
  
  // Add active state to nav links based on scroll position
  window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('.home-section');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
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
  
  // Additional smooth scrolling for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      console.log('Anchor link clicked:', this.getAttribute('href'));
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      console.log('Anchor target found:', target);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Test scroll functionality
  console.log('Testing scroll functionality...');
  const testSection = document.querySelector('#about');
  console.log('About section found:', testSection);
});

// Utility function for simple animations
function animateElement(element, animation, duration = 300) {
  element.style.animation = `${animation} ${duration}ms ease-out`;
  setTimeout(() => {
    element.style.animation = '';
  }, duration);
}

// Lightbox functions (if on photos page)
function openLightbox(imageSrc, caption) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  
  if (lightbox && lightboxImage && lightboxCaption) {
    lightboxImage.src = imageSrc;
    lightboxCaption.textContent = caption;
    lightbox.style.display = 'flex';
    // Don't hide body overflow on mobile
    if (window.innerWidth > 768) {
      document.body.style.overflow = 'hidden';
    }
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.style.display = 'none';
    // Ensure scrolling is always restored
    document.body.style.overflow = '';
    document.body.style.overflowY = 'auto';
    document.body.style.overflowX = 'hidden';
  }
} 