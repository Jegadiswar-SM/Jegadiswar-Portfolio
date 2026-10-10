const menu = document.querySelector('.menu');
const links = document.querySelector('.nav-links');
if (menu && links) {
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    links.classList.toggle('open', open);
    menu.textContent = open ? 'Close −' : 'Menu +';
  });
  links.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menu.setAttribute('aria-expanded', 'false');
    links.classList.remove('open');
    menu.textContent = 'Menu +';
  }));
}
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  const type = button.dataset.filter;
  document.querySelectorAll('.filter').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.querySelectorAll('[data-kind]').forEach(item => { item.hidden = type !== 'all' && item.dataset.kind !== type; });
}));
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); }
  }), { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(node => observer.observe(node));
} else document.querySelectorAll('.reveal').forEach(node => node.classList.add('in'));
