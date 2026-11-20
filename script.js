// Gallery structure for "all" view - supports sections and captions
// Use { section: 'Title' } for section headers
// Use { file: 'name.jpg', caption: 'Optional caption' } for photos
// 10 newest photos (including uncommitted ones added today)
const NEWEST = [
  { file: '000118940023nyc.jpg', ratio: 1.5 },   // subway police - NEW
  { file: '3771AA011Aroa.jpg', ratio: 1.5 },     // train tracks - NEW
  { file: '000112080011roa.jpg', ratio: 1.5 },   // car at night - NEW
  { file: 'R0000657nyc.jpg', ratio: 1.5 },       // TV on sidewalk - NEW
  { file: '000259350008oth.jpg', ratio: 1.5 },   // boat - NEW
  { file: 'R0000912.jpg', ratio: 1.5 },          // landscape
  { file: 'R0000971.jpg', ratio: 1.5 },          // landscape
  { file: '3793AA023roa.jpg', ratio: 1.5 },      // landscape
  { file: '000309850010nyc.jpg', ratio: 0.67 },  // portrait
  { file: '000309850019nyc.jpg', ratio: 0.67 },  // portrait
];

// Pick 6 photos: first 3 from 10 newest only, next 3 from everything else
// Avoids showing same photos as last refresh
function pickFirst6(newestPhotos, allPhotos) {
  const newestFiles = newestPhotos.map(p => p.file);
  
  // Get last picks from storage to avoid repeats
  let lastFirst3 = [];
  let lastNext3 = [];
  try {
    lastFirst3 = JSON.parse(sessionStorage.getItem('lastFirst3') || '[]');
    lastNext3 = JSON.parse(sessionStorage.getItem('lastNext3') || '[]');
  } catch (e) {}
  
  // First 3: from newest, excluding last picks
  let availableNewest = newestFiles.filter(f => !lastFirst3.includes(f));
  if (availableNewest.length < 3) availableNewest = newestFiles; // reset if not enough
  const first3 = shuffle([...availableNewest]).slice(0, 3);
  
  // Next 3: from others, excluding last picks
  let otherPhotos = allPhotos.filter(f => !newestFiles.includes(f) && !lastNext3.includes(f));
  if (otherPhotos.length < 3) otherPhotos = allPhotos.filter(f => !newestFiles.includes(f));
  const next3 = shuffle(otherPhotos).slice(0, 3);
  
  // Save for next refresh
  try {
    sessionStorage.setItem('lastFirst3', JSON.stringify(first3));
    sessionStorage.setItem('lastNext3', JSON.stringify(next3));
  } catch (e) {}
  
  console.log('First 3 (from newest):', first3);
  console.log('Next 3 (from others):', next3);
  
  return [...first3, ...next3];
}

const GALLERY = [
  { section: 'New York City' },
  { file: 'newyorkcity2nyc.jpg' },
  { file: '000095240011nyc.jpg' },
  { file: '000112070005nyc.jpg' },
  { file: '000194430004nyc.jpg' },
  { file: '000194430021nyc.jpg' },
  { file: '000194430024nyc.jpg' },
  { file: 'R0000663nyc.jpg' },
  { file: 'R0000680nyc.jpg' },
  { file: 'R0000751nyc.jpg' },
  { file: 'R0000759nyc.jpg' },
  { file: '000309850010nyc.jpg' },
  { file: '000309850019nyc.jpg' },

  { section: 'Road Trip' },
  { file: '3793AA006roa.jpg' },
  { file: '3793AA013roa.jpg' },
  { file: '3793AA015roa.jpg' },
  { file: '3793AA016roa.jpg' },
  { file: '3793AA017roa.jpg' },
  { file: '3793AA023roa.jpg' },
  { file: '3793AA024roa.jpg' },
  { file: '3793AA025roa.jpg' },
  { file: '3770AA004roa.jpg' },
  { file: '3770AA006roa.jpg' },
  { file: '3770AA015roa.jpg' },
  { file: '3770AA036-2roa.jpg' },
  { file: '3771AA013Aroa.jpg' },
  { file: '000112080001roa.jpg' },
  { file: '000112080003roa.jpg' },
  { file: '000112080006roa.jpg' },
  { file: '000112080007roa.jpg' },
  { file: '000112080009roa.jpg' },

  { section: 'Vietnam' },
  { file: 'hochiminhvie.jpg' },
  { file: '000040vie.jpg' },
  { file: '000041vie.jpg' },
  { file: '000043vie.jpg' },
  { file: '000044vie.jpg' },
  { file: '000045vie.jpg' },
  { file: '000051vie.jpg' },
  { file: '000054vie.jpg' },
  { file: '000060vie.jpg' },
  { file: '000064vie.jpg' },
  { file: '000065vie.jpg' },
  { file: '000066vie.jpg' },
  { file: '000068vie.jpg' },
  { file: '69vie.jpg' },
  { file: 'DSCN3822vie.jpg' },

  { break: true },

  { file: 'florida.jpg' },
  { file: 'massachusetts.jpg' },
  { file: 'massachusetts2.jpg' },
  { file: 'newhampshire.jpg' },
  { file: 'newhampshire2.jpg' },
  { file: 'newhampshire3.jpg' },
  { file: 'R0000912.jpg' },
  { file: 'R0000971.jpg' },
  { file: '000052780010.jpg' },
  { file: '000052780018.jpg' },
  { file: '000056460015.jpg' },
  { file: '000112080013.jpg' },
  { file: '000112080015.jpg' },
  { file: '3771AA003A.jpg' },
  { file: '3771AA007A.jpg' },
  { file: '3771AA012A.jpg' },
  { file: 'GO5107008727-R1-023-10.jpg' },
  { file: 'IMG_7453.jpg' },
  { file: 'IMG_8529.jpg' },
];

// Flat list of all photo filenames (for category filtering)
const PHOTOS = GALLERY.filter(item => item.file).map(item => item.file);

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
  photoGrid.innerHTML = '';

  if (category === 'all') {
    // First 6: shuffled with similar sizes paired together
    const first6 = pickFirst6(NEWEST, PHOTOS);
    
    first6.forEach((file) => {
      const src = `photos/${file}`;
      const button = document.createElement('button');
      button.className = 'photo-thumb';
      button.type = 'button';
      button.dataset.src = src;
      button.innerHTML = `<img src="${src}" alt="" loading="lazy">`;
      photoGrid.appendChild(button);
    });

    // Track shown photos to avoid repeats within 3 rows (6 photos)
    const shownInTop = [...first6];

    // Rest of gallery with sections
    let recentlyShown = [...shownInTop];
    GALLERY.forEach((item) => {
      if (item.section) {
        const header = document.createElement('h2');
        header.className = 'photo-section';
        header.textContent = item.section;
        photoGrid.appendChild(header);
      } else if (item.break) {
        const spacer = document.createElement('div');
        spacer.className = 'photo-break';
        photoGrid.appendChild(spacer);
      } else if (item.file) {
        // Skip if shown in last 6 photos (3 rows)
        if (recentlyShown.slice(-6).includes(item.file)) {
          return;
        }
        const src = `photos/${item.file}`;
        const button = document.createElement('button');
        button.className = 'photo-thumb';
        button.type = 'button';
        button.dataset.src = src;
        if (item.caption) button.dataset.caption = item.caption;
        button.innerHTML = `<img src="${src}" alt="" loading="lazy">${item.caption ? `<span class="photo-caption">${item.caption}</span>` : ''}`;
        photoGrid.appendChild(button);
        recentlyShown.push(item.file);
      }
    });
  } else {
    // Category pages - flat list, no sections
    const photos = getPhotos(category);
    photos.forEach((filename) => {
      const src = `photos/${filename}`;
      const galleryItem = GALLERY.find(g => g.file === filename);
      const caption = galleryItem?.caption;
      const button = document.createElement('button');
      button.className = 'photo-thumb';
      button.type = 'button';
      button.dataset.src = src;
      if (caption) button.dataset.caption = caption;
      button.innerHTML = `<img src="${src}" alt="" loading="lazy">${caption ? `<span class="photo-caption">${caption}</span>` : ''}`;
      photoGrid.appendChild(button);
    });
  }
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
