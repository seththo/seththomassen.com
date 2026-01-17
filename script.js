// Photo Gallery with Captions
document.addEventListener('DOMContentLoaded', () => {
  // Shuffle photos on page load
  shufflePhotos();
  
  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
});

// Shuffle photos using Fisher-Yates algorithm
function shufflePhotos() {
  const photoGrid = document.querySelector('.photo-grid');
  if (!photoGrid) return;
  
  const photos = Array.from(photoGrid.querySelectorAll('.photo-thumb'));
  
  // Fisher-Yates shuffle
  for (let i = photos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [photos[i], photos[j]] = [photos[j], photos[i]];
  }
  
  // Re-append photos in shuffled order
  photos.forEach(photo => photoGrid.appendChild(photo));
}

function openLightbox(imageSrc, caption) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.querySelector('.lightbox-caption');

  if (!lightbox || !lightboxImage || !lightboxCaption) return;

  lightboxImage.src = imageSrc;
  lightboxCaption.textContent = caption || '';
  lightbox.style.display = 'flex';

  // Prevent body scroll on desktop
  if (window.innerWidth > 768) {
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  lightbox.style.display = 'none';
  document.body.style.overflow = '';
}
