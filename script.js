const PHOTOS_35MM = [
  '000040.jpg', '000041-2.jpg', '000041.jpg', '000043.jpg', '000044.jpg', '000045.jpg',
  '000051.jpg', '000054.jpg', '000056460015.jpg', '000060.jpg', '000064.jpg', '000065.jpg',
  '000066.jpg', '000068.jpg', '000095240011.jpg', '000112070005.jpg', '000112080001.jpg', '000112080003.jpg',
  '000112080006.jpg', '000112080007.jpg', '000112080009.jpg', '000112080013.jpg', '000112080015.jpg', '000194430021.jpg',
  '000194430024.jpg', '3770AA004.jpg', '3770AA006.jpg', '3770AA015.jpg', '3770AA036-2.jpg', '3771AA003A.jpg',
  '3771AA007A.jpg', '3771AA012A.jpg', '3771AA013A.jpg', '3793AA006.jpg', '3793AA013.jpg', '3793AA015.jpg',
  '3793AA016.jpg', '3793AA017.jpg', '3793AA024.jpg', '3793AA025.jpg', '69.jpg', 'GO5107008727-R1-023-10.jpg',
  'florida.jpg', 'hochiminhvietnam.jpg', 'massachusetts.jpg', 'massachusetts2.jpg', 'newhampshire.jpg', 'newhampshire2.jpg',
  'newhampshire3.jpg', 'newyorkcity.jpg', 'newyorkcity2.jpg',
];

const PHOTOS_DIGITAL = [
  'DSCN3815.jpg', 'DSCN3822.jpg', 'IMG_7453.jpg', 'IMG_8529.jpg',
];

let galleryItems = [];

function init() {
  const photoGrid = document.querySelector('.photo-grid');
  if (!photoGrid) return;

  const category = photoGrid.dataset.category || 'all';
  buildGallery(photoGrid, category);
  galleryItems = Array.from(photoGrid.querySelectorAll('.photo-thumb'));
  bindGallery(photoGrid);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function bindGallery(container) {
  container.addEventListener('click', (e) => {
    const thumb = e.target.closest('.photo-thumb');
    if (!thumb) return;
    openLightbox(thumb.dataset.src, galleryItems.indexOf(thumb));
  });

  document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox?.style.display !== 'flex') return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}

function shuffle(array) {
  const items = [...array];
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function getPhotos(category) {
  if (category === 'digital') return PHOTOS_DIGITAL;
  return [...PHOTOS_35MM, ...PHOTOS_DIGITAL];
}

function buildGallery(photoGrid, category) {
  const photos = category === 'all'
    ? shuffle(getPhotos(category))
    : getPhotos(category);

  photoGrid.innerHTML = '';

  photos.forEach((filename) => {
    const src = `photos/${filename}`;
    const button = document.createElement('button');
    button.className = 'photo-thumb';
    button.type = 'button';
    button.dataset.src = src;
    button.innerHTML = `<img src="${src}" alt="" loading="lazy">`;
    photoGrid.appendChild(button);
  });
}

let currentIndex = 0;

function openLightbox(imageSrc, index = 0) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  if (!lightbox || !lightboxImage) return;

  currentIndex = index;
  lightboxImage.src = imageSrc;
  lightbox.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  lightbox.style.display = 'none';
  document.body.style.overflow = '';
}

function navigateLightbox(direction) {
  if (!galleryItems.length) return;
  currentIndex = (currentIndex + direction + galleryItems.length) % galleryItems.length;
  openLightbox(galleryItems[currentIndex].dataset.src, currentIndex);
}
