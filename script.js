const PHOTOS_35MM = [
  '000040.jpg', '000045.jpg', '000044.jpg', '000066.jpg', '000065.jpg', '000060.jpg',
  '000043.jpg', '000068.jpg', 'hochiminhvietnam.jpg', 'newyorkcity2.jpg', 'newhampshire3.jpg',
  'florida.jpg', 'massachusetts2.jpg', '3770AA004.jpg', 'massachusetts.jpg', 'newhampshire.jpg',
  'newyorkcity.jpg', 'newhampshire2.jpg', '3770AA006.jpg', '3770AA015.jpg', '3770AA036-2.jpg',
  '3771AA003A.jpg', '3771AA007A.jpg', '3771AA012A.jpg', '3793AA006.jpg', '3793AA013.jpg',
  '3793AA015.jpg', '3793AA016.jpg', '3793AA017.jpg', '3793AA024.jpg', '3793AA025.jpg',
  '000112080006.jpg', '000112080009.jpg', '000112080013.jpg', '000112080015.jpg',
  '000112070005.jpg', '000112080001.jpg', '000112080003.jpg', '000112080007.jpg',
  '3771AA013A.jpg', '000095240011.jpg', '69.jpg', '000051.jpg',
  '000194430021.jpg', '000194430024.jpg',
];

const PHOTOS_DIGITAL = [];

let galleryItems = [];
let closeHomeMenuFn = null;

function init() {
  const photoGrid = document.querySelector('.photo-grid');
  const homeGrid = document.querySelector('.home-grid');

  if (homeGrid) {
    buildHomeGrid(homeGrid);
    galleryItems = Array.from(homeGrid.querySelectorAll('.photo-thumb'));
    bindGallery(homeGrid);
    bindHomeMenu();
  } else if (photoGrid) {
    const category = photoGrid.dataset.category || '35mm';
    buildGallery(photoGrid, category);
    galleryItems = Array.from(photoGrid.querySelectorAll('.photo-thumb'));
    bindGallery(photoGrid);
  }
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
    if (e.key === 'Escape') {
      const lightbox = document.getElementById('lightbox');
      if (lightbox?.style.display === 'flex') {
        closeLightbox();
        return;
      }
      if (closeHomeMenuFn) closeHomeMenuFn();
      return;
    }

    const lightbox = document.getElementById('lightbox');
    if (lightbox?.style.display !== 'flex') return;
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}

function bindHomeMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const sidebar = document.getElementById('home-sidebar');
  if (!toggle || !sidebar) return;

  const close = () => {
    sidebar.classList.remove('is-open');
    document.body.classList.remove('sidebar-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  const open = () => {
    sidebar.classList.add('is-open');
    document.body.classList.add('sidebar-open');
    toggle.setAttribute('aria-expanded', 'true');
  };

  toggle.addEventListener('click', () => {
    if (sidebar.classList.contains('is-open')) close();
    else open();
  });

  closeHomeMenuFn = close;
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
  if (category === 'random' || category === 'all') return [...PHOTOS_35MM, ...PHOTOS_DIGITAL];
  return PHOTOS_35MM;
}

function buildHomeGrid(container) {
  const photos = shuffle(getPhotos('all'));
  const cols = window.innerWidth < 640 ? 5 : window.innerWidth < 900 ? 7 : 10;
  const emptyCount = Math.floor(photos.length * 0.22);
  const totalCells = photos.length + emptyCount;
  const cells = Array(totalCells).fill(null);
  const slots = shuffle([...Array(totalCells).keys()]).slice(0, photos.length);

  slots.forEach((slot, i) => {
    cells[slot] = photos[i];
  });

  container.innerHTML = '';
  container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  cells.forEach((filename) => {
    if (filename) {
      const src = `photos/${filename}`;
      const button = document.createElement('button');
      button.className = 'photo-thumb';
      button.type = 'button';
      button.dataset.src = src;
      button.innerHTML = `<img src="${src}" alt="" loading="lazy">`;
      container.appendChild(button);
    } else {
      const empty = document.createElement('div');
      empty.className = 'home-grid-empty';
      empty.setAttribute('aria-hidden', 'true');
      container.appendChild(empty);
    }
  });
}

function buildGallery(photoGrid, category) {
  const photos = category === 'random'
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
