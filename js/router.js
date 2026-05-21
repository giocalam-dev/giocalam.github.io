/* ===== ROUTER - Hash-based SPA routing ===== */

const routes = {
  home: renderHome,
  tutorial: renderTutorial,
  calcio: renderCalcio,
  pallavolo: renderPallavolo,
  basket: renderBasket,
  balilla: renderBalilla,
  admin: renderAdmin
};

function navigateTo(page) {
  window.location.hash = '#' + page;
}

function handleRoute() {
  const hash = window.location.hash.replace('#', '') || 'home';
  const page = routes[hash] ? hash : 'home';
  const content = document.getElementById('app-content');
  if (!content) return;

  content.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
  content.style.opacity = '0';
  content.style.transform = 'translateY(12px)';

  setTimeout(() => {
    try {
      content.innerHTML = routes[page]();
    } catch (e) {
      console.error('Render error:', e);
      content.innerHTML = '<div class="empty-state"><div class="empty-state-icon">⚠️</div><div class="empty-state-text">Errore nel caricamento</div><div class="empty-state-sub">' + e.message + '</div></div>';
    }
    content.style.opacity = '1';
    content.style.transform = 'translateY(0)';

    // Update active nav
    document.querySelectorAll('.nav-link').forEach(l => {
      l.classList.toggle('active', l.dataset.page === page);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 120);
}

window.addEventListener('hashchange', handleRoute);
