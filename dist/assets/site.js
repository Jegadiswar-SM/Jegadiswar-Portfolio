// JSM Workbench — Interactive Engine & Micro-Interactions
// Inspired by transitions.dev, animos.app, godly.design & deck.gallery

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Navigation
  const menu = document.querySelector('.menu');
  const links = document.querySelector('.nav-links');
  if (menu && links) {
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      links.classList.toggle('open', open);
      menu.textContent = open ? 'Close −' : 'Menu +';
    });
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.setAttribute('aria-expanded', 'false');
        links.classList.remove('open');
        menu.textContent = 'Menu +';
      });
    });
  }

  // 2. Project Category Filters with Smooth Transitions
  const filters = document.querySelectorAll('.filter');
  const projectRows = document.querySelectorAll('[data-kind]');
  filters.forEach(button => {
    button.addEventListener('click', () => {
      const type = button.dataset.filter;
      filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      projectRows.forEach(item => {
        const match = type === 'all' || item.dataset.kind === type;
        if (match) {
          item.hidden = false;
          item.style.opacity = '0';
          item.style.transform = 'translateY(6px)';
          requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.25s var(--ease-spring), transform 0.25s var(--ease-spring)';
            item.style.opacity = '1';
            item.style.transform = 'none';
          });
        } else {
          item.hidden = true;
        }
      });
    });
  });

  // 3. Staggered Scroll Reveal
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(node => observer.observe(node));
  } else {
    document.querySelectorAll('.reveal').forEach(node => node.classList.add('in'));
  }

  // 4. Magnetic Micro-interactions (Animos style)
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const magneticElements = document.querySelectorAll('.btn-primary, .btn-secondary, .brand-mark, .nav-cta, .wb-btn, .now-mark');
    magneticElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0px, 0px)';
        el.style.transition = 'transform 0.4s var(--ease-spring)';
      });
      el.addEventListener('mouseenter', () => {
        el.style.transition = 'transform 0.1s ease-out';
      });
    });
  }

  // 5. Interactive Silicon Waveform Workbench (Hero Card)
  const cycleElem = document.getElementById('clk-cycles');
  const clkWave = document.getElementById('sig-clk');
  const vldWave = document.getElementById('sig-vld');
  const dataWave = document.getElementById('sig-data');
  const toggleWbBtn = document.getElementById('btn-toggle-wb');

  if (cycleElem && clkWave && vldWave && dataWave) {
    let cycle = 4812;
    let running = true;
    const clkPattern = ['_/‾\\_/‾\\_/‾\\_/‾\\', '‾\\_/‾\\_/‾\\_/‾\\_', '/‾\\_/‾\\_/‾\\_/‾\\/'];
    const dataPattern = ['=0x5A===0xC3===0xFF=', '=0xC3===0xFF===0x10=', '=0xFF===0x10===0x5A='];
    let step = 0;

    const interval = setInterval(() => {
      if (!running) return;
      cycle++;
      step = (step + 1) % clkPattern.length;
      cycleElem.textContent = `#00${cycle}`;
      clkWave.textContent = clkPattern[step];
      dataWave.textContent = dataPattern[step];
      vldWave.textContent = step % 2 === 0 ? '‾‾‾‾‾\\__________/‾‾‾' : '__________/‾‾‾‾‾\\___';
    }, 450);

    if (toggleWbBtn) {
      toggleWbBtn.addEventListener('click', () => {
        running = !running;
        toggleWbBtn.textContent = running ? 'Halt Clock' : 'Resume Clock';
        toggleWbBtn.style.color = running ? 'var(--brand)' : 'var(--status-amber)';
      });
    }
  }

  // 6. Login / Developer Portal System
  const loginTabs = document.querySelectorAll('.login-tab-btn');
  const passkeyGroup = document.getElementById('group-passkey');
  const tokenGroup = document.getElementById('group-token');
  const loginForm = document.getElementById('portal-form');
  const loginStatus = document.getElementById('login-status');
  const togglePass = document.getElementById('toggle-pass');

  if (loginTabs.length > 0 && passkeyGroup && tokenGroup) {
    loginTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        loginTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const mode = tab.dataset.mode;
        if (mode === 'passkey') {
          passkeyGroup.style.display = 'block';
          tokenGroup.style.display = 'none';
        } else {
          passkeyGroup.style.display = 'none';
          tokenGroup.style.display = 'block';
        }
      });
    });
  }

  if (togglePass) {
    togglePass.addEventListener('click', () => {
      const passInput = document.getElementById('auth-token');
      if (passInput) {
        const isPassword = passInput.type === 'password';
        passInput.type = isPassword ? 'text' : 'password';
        togglePass.textContent = isPassword ? 'Hide' : 'Show';
      }
    });
  }

  if (loginForm && loginStatus) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      loginStatus.style.display = 'block';
      loginStatus.className = 'login-status-msg success';
      loginStatus.textContent = '✓ Hardware token authenticated. Redirecting to silicon bench...';
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1200);
    });
  }

  // 7. 404 Clock Recovery Button
  const recoveryBtn = document.getElementById('btn-recover-clock');
  const recoveryConsole = document.getElementById('recovery-console');
  if (recoveryBtn && recoveryConsole) {
    recoveryBtn.addEventListener('click', () => {
      recoveryBtn.disabled = true;
      recoveryBtn.textContent = 'Synchronizing clocks...';
      recoveryConsole.innerHTML += '\n<span class="blue">[OK]</span> Reset vector asserted (0x8000_0000)';
      recoveryConsole.innerHTML += '\n<span class="blue">[OK]</span> Routing bus to index.html...';
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    });
  }
});
