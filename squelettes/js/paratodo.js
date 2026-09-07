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
  

  