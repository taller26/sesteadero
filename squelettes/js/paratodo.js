document.addEventListener("DOMContentLoaded", function () {

  // 1. Menú Hamburguesa
  const ham = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  
  if (ham && navLinks) {
    ham.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // 2. Navegación activa con scroll (solo para enlaces con anclas '#')
  const sections = document.querySelectorAll('section[id], div[id]');
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  
  if (sections.length > 0 && links.length > 0) {
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 80) current = s.id;
      });
      links.forEach(l => {
        l.classList.remove('active');
        if (l.getAttribute('href') === '#' + current) l.classList.add('active');
      });
    });
  }

  // 3. Botón 'Volver arriba' (Back to top)
  const backTop = document.querySelector('.back-top');
  if (backTop) {
    backTop.style.opacity = '0';
    window.addEventListener('scroll', () => {
      const isVisible = window.scrollY > 300;
      backTop.style.opacity = isVisible ? '1' : '0';
      backTop.style.pointerEvents = isVisible ? 'auto' : 'none';
    });
  }

  // 4. Formulario de contacto AJAX
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const responseDiv = document.getElementById('formResponse');
      if (responseDiv) {
        responseDiv.style.color = '#ff6b6b';
        responseDiv.textContent = '';
      }

      const nombre = document.getElementById('nombre')?.value.trim() || '';
      const email = document.getElementById('email')?.value.trim() || '';
      const telefono = document.getElementById('telefono')?.value.trim() || '';
      const asunto = document.getElementById('asunto')?.value.trim() || '';
      const mensaje = document.getElementById('mensaje')?.value.trim() || '';

      // Validaciones
      if (!nombre || !email || !telefono || !asunto || !mensaje) {
        if (responseDiv) responseDiv.textContent = 'Todos los campos son obligatorios.';
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        if (responseDiv) responseDiv.textContent = 'Ingresa un correo electrónico válido.';
        return;
      }

      const phoneRegex = /^[0-9]+$/;
      if (!phoneRegex.test(telefono)) {
        if (responseDiv) responseDiv.textContent = 'El teléfono debe contener únicamente números.';
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
        if (responseDiv) {
          if (data.status === 'success') {
            responseDiv.style.color = '#2ed573';
            responseDiv.textContent = data.message;
            contactForm.reset();
          } else {
            responseDiv.textContent = data.message;
          }
        }
      })
      .catch(() => {
        if (responseDiv) responseDiv.textContent = 'Ocurrió un error al procesar la solicitud.';
      });
    });
  }

  // 5. Inicialización de Fancybox v5
  if (typeof Fancybox !== "undefined") {
    Fancybox.bind("[data-fancybox]", {
      infinite: true,
      keyboard: {
        Escape: "close",
      }
    });
  }

});