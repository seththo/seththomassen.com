const PHOTOS = [
  '000040vie.jpg', '000041vie.jpg', '000043vie.jpg', '000044vie.jpg', '000045vie.jpg',
  '000051vie.jpg', '000054vie.jpg', '000056460015.jpg', '000060vie.jpg', '000064vie.jpg',
  '000065vie.jpg', '000066vie.jpg', '000068vie.jpg', '000095240011.jpg', '000112070005.jpg',
  '000112080001roa.jpg', '000112080003roa.jpg', '000112080006roa.jpg', '000112080007roa.jpg',
  '000112080009roa.jpg', '000112080013.jpg', '000112080015.jpg', '000194430021.jpg',
  '000194430024.jpg', '3770AA004roa.jpg', '3770AA006roa.jpg', '3770AA015roa.jpg',
  '3770AA036-2roa.jpg', '3771AA003A.jpg', '3771AA007A.jpg', '3771AA012A.jpg',
  '3771AA013Aroa.jpg', '3793AA006roa.jpg', '3793AA013roa.jpg', '3793AA015roa.jpg',
  '3793AA016roa.jpg', '3793AA017roa.jpg', '3793AA024roa.jpg', '3793AA025roa.jpg',
  '69vie.jpg', 'DSCN3822.jpg', 'florida.jpg', 'GO5107008727-R1-023-10.jpg',
  'hochiminhvie.jpg', 'IMG_7453.jpg', 'IMG_8529.jpg', 'massachusetts.jpg',
  'massachusetts2.jpg', 'newhampshire.jpg', 'newhampshire2.jpg', 'newhampshire3.jpg',
  'newyorkcity.jpg', 'newyorkcity2.jpg', 'R0000663.jpg', 'R0000680.jpg', 'R0000751.jpg',
  'R0000759.jpg',
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
  if (category === 'vietnam') {
    return PHOTOS.filter((file) => /vie\.(jpe?g|png|webp)$/i.test(file));
  }
  if (category === 'roadtrip') {
    return PHOTOS.filter((file) => /roa\.(jpe?g|png|webp)$/i.test(file));
  }
  return [...PHOTOS];
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
