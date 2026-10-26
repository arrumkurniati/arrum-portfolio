// Interaksi portofolio Arrum Kurniati
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.textContent = open ? '×' : '☰';
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  if (menuToggle) menuToggle.textContent = '☰';
}));

// Simpan pilihan tema terang/gelap.
const themeToggle = document.getElementById('themeToggle');
function setTheme(dark) {
  document.body.classList.toggle('dark', dark);
  if (themeToggle) {
    themeToggle.textContent = dark ? '☾' : '☼';
    themeToggle.setAttribute('aria-label', dark ? 'Gunakan tema terang' : 'Gunakan tema gelap');
  }
  try { localStorage.setItem('arrum-theme', dark ? 'dark' : 'light'); } catch (_) {}
}
themeToggle?.addEventListener('click', () => setTheme(!document.body.classList.contains('dark')));
try { if (localStorage.getItem('arrum-theme') === 'dark') setTheme(true); } catch (_) {}
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Animasi kemunculan saat bagian masuk ke layar.
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Garis progres membaca di bagian atas halaman.
const progress = document.createElement('div');
progress.className = 'reading-progress';
progress.setAttribute('aria-hidden', 'true');
document.body.appendChild(progress);
const updateProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// Tilt yang lembut pada kartu di desktop. Nonaktif pada perangkat sentuh/reduced motion.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.timeline-card, .skill-card, .credential-card, .award-card, .project-card, .stats').forEach(card => {
    card.classList.add('interactive-card');
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      card.style.setProperty('--mx', `${x * 100}%`);
      card.style.setProperty('--my', `${y * 100}%`);
      if (card.classList.contains('timeline-card') || card.classList.contains('skill-card') || card.classList.contains('credential-card') || card.classList.contains('award-card')) {
        card.style.transform = `perspective(900px) rotateX(${(0.5-y)*2.2}deg) rotateY(${(x-0.5)*2.2}deg) translateY(-3px)`;
      }
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}

// Klik foto galeri/pengalaman untuk memperbesar dalam lightbox.
const lightbox = document.createElement('div');
lightbox.className = 'photo-lightbox';
lightbox.setAttribute('role', 'dialog');
lightbox.setAttribute('aria-modal', 'true');
lightbox.setAttribute('aria-label', 'Pratinjau foto');
lightbox.innerHTML = '<button class="lightbox-close" type="button" aria-label="Tutup foto">×</button><button class="lightbox-prev" type="button" aria-label="Foto sebelumnya">‹</button><figure><img alt=""><figcaption></figcaption></figure><button class="lightbox-next" type="button" aria-label="Foto berikutnya">›</button><p class="lightbox-hint">Tekan Esc untuk menutup</p>';
document.body.appendChild(lightbox);
const lightboxImg = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('figcaption');
const photos = [...document.querySelectorAll('.gallery-item img, .experience-photo, .about-image img, .project-documentation')];
let activePhoto = 0;
function showPhoto(index) {
  if (!photos.length) return;
  activePhoto = (index + photos.length) % photos.length;
  const photo = photos[activePhoto];
  lightboxImg.src = photo.currentSrc || photo.src;
  lightboxImg.alt = photo.alt || 'Foto portofolio';
  lightboxCaption.textContent = photo.closest('figure')?.querySelector('figcaption')?.textContent || photo.alt || '';
}
function openLightbox(index) {
  showPhoto(index);
  lightbox.classList.add('is-open');
  document.body.classList.add('lightbox-open');
  lightbox.querySelector('.lightbox-close').focus();
}
function closeLightbox() {
  lightbox.classList.remove('is-open');
  document.body.classList.remove('lightbox-open');
}
photos.forEach((photo, index) => {
  photo.classList.add('zoomable-photo');
  photo.setAttribute('tabindex', '0');
  photo.setAttribute('role', 'button');
  photo.setAttribute('aria-label', `Perbesar foto: ${photo.alt || 'foto portofolio'}`);
  photo.addEventListener('click', () => openLightbox(index));
  photo.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openLightbox(index); } });
});
lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showPhoto(activePhoto - 1));
lightbox.querySelector('.lightbox-next').addEventListener('click', () => showPhoto(activePhoto + 1));
lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', event => {
  if (!lightbox.classList.contains('is-open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') showPhoto(activePhoto - 1);
  if (event.key === 'ArrowRight') showPhoto(activePhoto + 1);
});

// Tombol salin email dengan umpan balik.
document.getElementById('copyEmail')?.addEventListener('click', async () => {
  const email = 'arrumkurniati644@gmail.com';
  const message = document.getElementById('copyMessage');
  try {
    await navigator.clipboard.writeText(email);
    message.textContent = 'Email berhasil disalin: ' + email;
  } catch (_) { message.textContent = email; }
});

// Efek ripple kecil pada tombol saat ditekan.
document.querySelectorAll('.button').forEach(button => button.addEventListener('pointerdown', event => {
  if (reduceMotion) return;
  const rect = button.getBoundingClientRect();
  button.style.setProperty('--ripple-x', `${event.clientX - rect.left}px`);
  button.style.setProperty('--ripple-y', `${event.clientY - rect.top}px`);
  button.classList.remove('ripple-active');
  void button.offsetWidth;
  button.classList.add('ripple-active');
  window.setTimeout(() => button.classList.remove('ripple-active'), 650);
}));
