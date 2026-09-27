const PHOTOS = [
  '000040vie.jpg', '000041vie.jpg', '000043vie.jpg', '000044vie.jpg', '000045vie.jpg',
  '000051vie.jpg', '000052780010.jpg', '000052780018.jpg', '000054vie.jpg', '000056460015.jpg',
  '000060vie.jpg', '000064vie.jpg', '000065vie.jpg', '000066vie.jpg', '000068vie.jpg',
  '000095240011nyc.jpg', '000112070005nyc.jpg', '000112080001roa.jpg', '000112080003roa.jpg',
  '000309850010nyc.jpg', '000309850019nyc.jpg',
  '000112080006roa.jpg', '000112080007roa.jpg', '000112080009roa.jpg', '000112080013.jpg',
  '000112080015.jpg', '000194430004nyc.jpg', '000194430021nyc.jpg', '000194430024nyc.jpg',
  '3770AA004roa.jpg', '3770AA006roa.jpg', '3770AA015roa.jpg', '3770AA036-2roa.jpg',
  '3771AA003A.jpg', '3771AA007A.jpg', '3771AA012A.jpg', '3771AA013Aroa.jpg',
  '3793AA006roa.jpg', '3793AA013roa.jpg', '3793AA015roa.jpg', '3793AA016roa.jpg',
  '3793AA017roa.jpg', '3793AA024roa.jpg', '3793AA025roa.jpg', '69vie.jpg',
  'DSCN3822vie.jpg', 'florida.jpg', 'GO5107008727-R1-023-10.jpg', 'hochiminhvie.jpg',
  'IMG_7453.jpg', 'IMG_8529.jpg', 'massachusetts.jpg', 'massachusetts2.jpg',
  'newhampshire.jpg', 'newhampshire2.jpg', 'newhampshire3.jpg', 'newyorkcity2nyc.jpg',
  'newyorkcitynyc.jpg', 'R0000663nyc.jpg', 'R0000680nyc.jpg', 'R0000751nyc.jpg',
  'R0000759nyc.jpg',
];

let galleryItems = [];
let currentIndex = 0;
let zoom = 1;
let fitWidth = 0;
let fitHeight = 0;
const MIN_ZOOM = 1;
const MAX_ZOOM = 6;

function init() {
  const photoGrid = document.querySelector('.photo-grid');
  if (!photoGrid) return;

  const category = photoGrid.dataset.category || 'all';
  buildGallery(photoGrid, category);
  galleryItems = Array.from(photoGrid.querySelectorAll('.photo-thumb'));
  bindGallery(photoGrid);
  bindLightboxControls();
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
    if (e.key === 'Escape') {
      if (zoom > 1.01) setZoom(1, true);
      else closeLightbox();
      return;
    }
    if (zoom > 1.01) return;
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
  if (category === 'nyc') {
    return PHOTOS.filter((file) => /nyc\.(jpe?g|png|webp)$/i.test(file));
  }
  if (category === 'other') {
    return PHOTOS.filter((file) => /oth\.(jpe?g|png|webp)$/i.test(file));
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

function getLightboxEls() {
  return {
    lightbox: document.getElementById('lightbox'),
    img: document.getElementById('lightbox-image'),
    stage: document.querySelector('.lightbox-stage'),
  };
}

function measureFitSize() {
  const { img, stage } = getLightboxEls();
  if (!img || !stage || !img.naturalWidth) return;

  const pad = 32;
  const maxW = Math.max(stage.clientWidth - pad, 100);
  const maxH = Math.max(stage.clientHeight - pad, 100);
  const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);
  fitWidth = img.naturalWidth * scale;
  fitHeight = img.naturalHeight * scale;
}

function applyZoom(animate = false) {
  const { img, stage, lightbox } = getLightboxEls();
  if (!img || !stage || !lightbox || !fitWidth) return;

  const width = fitWidth * zoom;
  const height = fitHeight * zoom;

  img.classList.toggle('is-animating', animate);
  img.style.width = `${width}px`;
  img.style.height = `${height}px`;
  lightbox.classList.toggle('is-zoomed', zoom > 1.01);

  // Keep the image centered when it fits; allow scroll when larger
  if (width <= stage.clientWidth && height <= stage.clientHeight) {
    stage.scrollLeft = 0;
    stage.scrollTop = 0;
  }
}

function setZoom(nextZoom, animate = false, anchorX, anchorY) {
  const { img, stage } = getLightboxEls();
  if (!img || !stage || !fitWidth) return;

  const prevZoom = zoom;
  zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom));

  // Point under cursor/finger stays put while zooming
  let relX = 0.5;
  let relY = 0.5;
  if (anchorX != null && anchorY != null && img.offsetWidth) {
    const rect = stage.getBoundingClientRect();
    relX = (stage.scrollLeft + (anchorX - rect.left)) / Math.max(img.offsetWidth, 1);
    relY = (stage.scrollTop + (anchorY - rect.top)) / Math.max(img.offsetHeight, 1);
  }

  applyZoom(animate);

  if (zoom > 1.01) {
    const rect = stage.getBoundingClientRect();
    const viewX = anchorX != null ? anchorX - rect.left : stage.clientWidth / 2;
    const viewY = anchorY != null ? anchorY - rect.top : stage.clientHeight / 2;
    stage.scrollLeft = relX * img.offsetWidth - viewX;
    stage.scrollTop = relY * img.offsetHeight - viewY;
  } else {
    stage.scrollLeft = 0;
    stage.scrollTop = 0;
  }

  void prevZoom;
}

function openLightbox(imageSrc, index = 0) {
  const { lightbox, img, stage } = getLightboxEls();
  if (!lightbox || !img || !stage) return;

  currentIndex = index;
  zoom = 1;
  fitWidth = 0;
  fitHeight = 0;
  img.style.width = '';
  img.style.height = '';
  img.classList.remove('is-animating');
  stage.scrollLeft = 0;
  stage.scrollTop = 0;

  const onLoad = () => {
    measureFitSize();
    applyZoom(false);
  };

  img.onload = onLoad;
  img.src = imageSrc;
  lightbox.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  if (img.complete && img.naturalWidth) onLoad();
}

function closeLightbox() {
  const { lightbox, img } = getLightboxEls();
  if (!lightbox) return;
  zoom = 1;
  if (img) {
    img.onload = null;
    img.style.width = '';
    img.style.height = '';
  }
  lightbox.classList.remove('is-zoomed');
  lightbox.style.display = 'none';
  document.body.style.overflow = '';
}

function navigateLightbox(direction) {
  if (!galleryItems.length) return;
  currentIndex = (currentIndex + direction + galleryItems.length) % galleryItems.length;
  openLightbox(galleryItems[currentIndex].dataset.src, currentIndex);
}

function bindLightboxControls() {
  const { lightbox, img, stage } = getLightboxEls();
  if (!lightbox || !img || !stage || lightbox.dataset.zoomBound) return;
  lightbox.dataset.zoomBound = '1';

  lightbox.addEventListener('wheel', (e) => {
    if (lightbox.style.display !== 'flex') return;
    e.preventDefault();
    e.stopPropagation();
    const factor = Math.exp(-e.deltaY * 0.0018);
    setZoom(zoom * factor, false, e.clientX, e.clientY);
  }, { passive: false });

  img.addEventListener('dblclick', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (zoom > 1.05) setZoom(1, true);
    else setZoom(2.5, true, e.clientX, e.clientY);
  });

  // Click-drag to scroll/pan when zoomed (in addition to native scrollbars)
  let dragging = false;
  let moved = false;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;

  stage.addEventListener('pointerdown', (e) => {
    if (zoom <= 1.01 || e.button !== 0) return;
    dragging = true;
    moved = false;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = stage.scrollLeft;
    startTop = stage.scrollTop;
    stage.classList.add('is-dragging');
    stage.setPointerCapture(e.pointerId);
  });

  stage.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) moved = true;
    stage.scrollLeft = startLeft - dx;
    stage.scrollTop = startTop - dy;
  });

  const endDrag = () => {
    dragging = false;
    stage.classList.remove('is-dragging');
  };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  // Prevent accidental close when finishing a drag on the backdrop path
  img.addEventListener('click', (e) => {
    if (moved) {
      e.preventDefault();
      e.stopPropagation();
      moved = false;
    }
  });

  let pinchDist = 0;
  let pinchZoom = 1;

  stage.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      const [a, b] = e.touches;
      pinchDist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      pinchZoom = zoom;
    }
  }, { passive: true });

  stage.addEventListener('touchmove', (e) => {
    if (e.touches.length !== 2 || !pinchDist) return;
    e.preventDefault();
    const [a, b] = e.touches;
    const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    const midX = (a.clientX + b.clientX) / 2;
    const midY = (a.clientY + b.clientY) / 2;
    setZoom(pinchZoom * (dist / pinchDist), false, midX, midY);
  }, { passive: false });

  window.addEventListener('resize', () => {
    if (lightbox.style.display !== 'flex') return;
    const oldZoom = zoom;
    measureFitSize();
    setZoom(oldZoom, false);
  });
}
