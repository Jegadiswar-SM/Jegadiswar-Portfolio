// Shared navigation, project filtering, and scroll reveal behavior.
document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.menu');
  const links = document.querySelector('.nav-links');

  if (menu && links) {
    const closeMenu = () => {
      menu.setAttribute('aria-expanded', 'false');
      links.classList.remove('open');
      menu.textContent = 'Menu +';
    };

    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      links.classList.toggle('open', open);
      menu.textContent = open ? 'Close −' : 'Menu +';
    });
    links.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  const filters = document.querySelectorAll('.filter');
  const projectRows = document.querySelectorAll('[data-kind]');
  filters.forEach(button => {
    button.addEventListener('click', () => {
      const type = button.dataset.filter;
      filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      projectRows.forEach(row => {
        const show = type === 'all' || row.dataset.kind === type;
        row.hidden = !show;
        if (show) {
          row.classList.add('filter-in');
          requestAnimationFrame(() => row.classList.remove('filter-in'));
        }
      });
    });
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealNodes = document.querySelectorAll('.reveal:not(.in)');
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    revealNodes.forEach(node => observer.observe(node));
  } else {
    revealNodes.forEach(node => node.classList.add('in'));
  }
});
