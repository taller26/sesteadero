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