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
const themeToggle = document.getElementById('themeToggle');
function setTheme(dark) {
  document.body.classList.toggle('dark', dark);
  if (themeToggle) themeToggle.textContent = dark ? '☾' : '☼';
  localStorage.setItem('arrum-theme', dark ? 'dark' : 'light');
}
themeToggle?.addEventListener('click', () => setTheme(!document.body.classList.contains('dark')));
if (localStorage.getItem('arrum-theme') === 'dark') setTheme(true);
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
// Reveal saat elemen masuk ke viewport; fallback untuk browser lama.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.08, rootMargin: '0px 0px -25px 0px' });
  revealItems.forEach((el, i) => { el.style.transitionDelay = `${Math.min(i % 4, 3) * 70}ms`; observer.observe(el); });
} else revealItems.forEach(el => el.classList.add('visible'));
document.getElementById('copyEmail')?.addEventListener('click', async () => {
  const email = 'arrumkurniati644@gmail.com';
  const message = document.getElementById('copyMessage');
  try { await navigator.clipboard.writeText(email); if (message) message.textContent = 'Email berhasil disalin: ' + email; }
  catch (e) { if (message) message.textContent = email; }
});
