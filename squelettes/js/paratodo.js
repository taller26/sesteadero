  // Hamburger menu
  const ham = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  ham.addEventListener('click', () => navLinks.classList.toggle('open'));

  // Close on link click
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

  // Smooth active nav
  const sections = document.querySelectorAll('section[id], div[id]');
  const links = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 80) current = s.id; });
    links.forEach(l => { l.classList.remove('active'); if (l.getAttribute('href') === '#' + current) l.classList.add('active'); });
  });

  // Back to top visibility
  const backTop = document.querySelector('.back-top');
  window.addEventListener('scroll', () => {
    backTop.style.opacity = window.scrollY > 300 ? '1' : '0';
    backTop.style.pointerEvents = window.scrollY > 300 ? 'auto' : 'none';
  });
  backTop.style.opacity = '0';
  

  // ============================================================
  // LIGHTBOX DE FOTOS — reutilizable en Aves, Galerías y Artículo
  // Se activa solo si la página tiene el overlay #lightbox.
  // ============================================================
  (function () {
    const lb = document.getElementById('lightbox');
    if (!lb) return;

    const lbImg = document.getElementById('lbImg');
    const lbCounter = document.getElementById('lbCounter');
    let currentGallery = [];
    let currentIndex = 0;

    function renderLightboxImage() {
      const item = currentGallery[currentIndex];
      if (!item) return;
      lbImg.src = item.src;
      lbImg.alt = item.alt || '';
      if (lbCounter) lbCounter.textContent = (currentIndex + 1) + ' / ' + currentGallery.length;
    }

    function openLightbox(gallery, index) {
      if (!gallery || !gallery.length) return;
      currentGallery = gallery;
      currentIndex = index || 0;
      renderLightboxImage();
      lb.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lb.classList.remove('active');
      document.body.style.overflow = '';
    }

    function navigateLightbox(dir) {
      if (currentGallery.length < 2) return;
      currentIndex = (currentIndex + dir + currentGallery.length) % currentGallery.length;
      lbImg.style.opacity = '0';
      setTimeout(() => { renderLightboxImage(); lbImg.style.opacity = '1'; }, 150);
    }
    lbImg.style.transition = 'opacity .18s ease';

    // Caso 1: contenedores con varias miniaturas propias — [data-lightbox-gallery]
    // cada hijo [data-lightbox-src] es una foto de esa misma galería.
    document.querySelectorAll('[data-lightbox-gallery]').forEach(container => {
      const nodes = Array.from(container.querySelectorAll('[data-lightbox-src]'));
      const gallery = nodes.map(el => ({ src: el.dataset.lightboxSrc, alt: el.dataset.lightboxAlt || '' }));
      nodes.forEach((el, idx) => {
        el.style.cursor = 'zoom-in';
        el.addEventListener('click', e => { e.preventDefault(); openLightbox(gallery, idx); });
      });
    });

    // Caso 2: tarjetas independientes con su propio set de fotos en JSON — [data-album]
    // (por ejemplo cada álbum de la página de Galerías).
    document.querySelectorAll('[data-album]').forEach(card => {
      card.style.cursor = 'zoom-in';
      card.addEventListener('click', e => {
        e.preventDefault();
        try {
          const gallery = JSON.parse(card.dataset.album);
          openLightbox(gallery, 0);
        } catch (err) { /* álbum sin datos válidos: no hace nada */ }
      });
    });

    const lbCloseBtn = document.getElementById('lbClose');
    const lbPrevBtn = document.getElementById('lbPrev');
    const lbNextBtn = document.getElementById('lbNext');
    if (lbCloseBtn) lbCloseBtn.addEventListener('click', closeLightbox);
    if (lbPrevBtn) lbPrevBtn.addEventListener('click', () => navigateLightbox(-1));
    if (lbNextBtn) lbNextBtn.addEventListener('click', () => navigateLightbox(1));
    lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });
  })();

  // ============================================================
  // LIGHTBOX DE VIDEO — usado en Producciones.
  // Se activa solo si la página tiene el overlay #videoLightbox.
  // ============================================================
  (function () {
    const vlb = document.getElementById('videoLightbox');
    if (!vlb) return;

    const frameWrap = document.getElementById('vlbFrameWrap');

    function openVideoLightbox(src) {
      if (!frameWrap || !src) return;
      const isFile = /\.(mp4|webm|ogg)(\?.*)?$/i.test(src);
      frameWrap.innerHTML = isFile
        ? '<video src="' + src + '" controls autoplay playsinline></video>'
        : '<iframe src="' + src + '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
      vlb.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeVideoLightbox() {
      vlb.classList.remove('active');
      document.body.style.overflow = '';
      if (frameWrap) frameWrap.innerHTML = '';
    }

    document.querySelectorAll('[data-video-src]').forEach(trigger => {
      trigger.addEventListener('click', e => {
        e.preventDefault();
        openVideoLightbox(trigger.dataset.videoSrc);
      });
    });

    const vlbCloseBtn = document.getElementById('vlbClose');
    if (vlbCloseBtn) vlbCloseBtn.addEventListener('click', closeVideoLightbox);
    vlb.addEventListener('click', e => { if (e.target === vlb) closeVideoLightbox(); });
    document.addEventListener('keydown', e => {
      if (vlb.classList.contains('active') && e.key === 'Escape') closeVideoLightbox();
    });
  })();


  /*
  // ============================================================
  // PAGINACIÓN — usada en Noticias o actividades (de 5 en 5).
  // Se activa solo si la página tiene #paginatedGrid + #pagination.
  // ============================================================
  (function () {
    const grid = document.getElementById('paginatedGrid');
    const paginationEl = document.getElementById('pagination');
    if (!grid || !paginationEl) return;

    const perPage = parseInt(grid.dataset.perPage, 10) || 5;
    const items = Array.from(grid.children);
    const totalPages = Math.max(1, Math.ceil(items.length / perPage));
    let currentPage = 1;

    function showPage(page, shouldScroll) {
      currentPage = Math.min(Math.max(1, page), totalPages);
      items.forEach((item, idx) => {
        const pageOfItem = Math.floor(idx / perPage) + 1;
        item.style.display = (pageOfItem === currentPage) ? '' : 'none';
      });
      paginationEl.querySelectorAll('.page-btn[data-page]').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.page, 10) === currentPage);
      });
      const prevBtn = paginationEl.querySelector('[data-action="prev"]');
      const nextBtn = paginationEl.querySelector('[data-action="next"]');
      if (prevBtn) prevBtn.classList.toggle('disabled', currentPage === 1);
      if (nextBtn) nextBtn.classList.toggle('disabled', currentPage === totalPages);
      if (shouldScroll) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    paginationEl.addEventListener('click', e => {
      const btn = e.target.closest('.page-btn');
      if (!btn || btn.classList.contains('disabled')) return;
      if (btn.dataset.action === 'prev') showPage(currentPage - 1, true);
      else if (btn.dataset.action === 'next') showPage(currentPage + 1, true);
      else if (btn.dataset.page) showPage(parseInt(btn.dataset.page, 10), true);
    });

    showPage(1, false);
  })();

*/

  // El formulario de contacto solo existe en el home; esta comprobación
  // evita un error en las páginas nuevas donde se retiró esa sección.
  if (document.getElementById('contactForm')) {
  document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const responseDiv = document.getElementById('formResponse');
  responseDiv.style.color = '#ff6b6b';
  responseDiv.textContent = '';

  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const asunto = document.getElementById('asunto').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();

  // Validar campos vacíos
  if (!nombre || !email || !telefono || !asunto || !mensaje) {
    responseDiv.textContent = 'Todos los campos son obligatorios.';
    return;
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    responseDiv.textContent = 'Ingresa un correo electrónico válido.';
    return;
  }

  // Validar teléfono exclusivamente numérico
  const phoneRegex = /^[0-9]+$/;
  if (!phoneRegex.test(telefono)) {
    responseDiv.textContent = 'El teléfono debe contener únicamente números.';
    return;
  }

  // Envío de datos vía Fetch a PHP
  const formData = new FormData(this);

  fetch('enviar.php', {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === 'success') {
      responseDiv.style.color = '#2ed573';
      responseDiv.textContent = data.message;
      document.getElementById('contactForm').reset();
    } else {
      responseDiv.textContent = data.message;
    }
  })
  .catch(() => {
    responseDiv.textContent = 'Ocurrió un error al procesar la solicitud.';
  });
});
  }