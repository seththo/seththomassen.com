// Photo Gallery with Captions
document.addEventListener('DOMContentLoaded', () => {
  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
});

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
