/* ===== APP BOOTSTRAP ===== */

// Clear old caches and re-register SW
if ('serviceWorker' in navigator) {
  if ('caches' in window) {
    caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
  }
  navigator.serviceWorker.getRegistrations().then(regs => {
    regs.forEach(r => r.unregister());
  });
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

document.addEventListener('DOMContentLoaded', () => {
  handleRoute();
  
  // Sincronizza i dati dal cloud in background all'avvio dell'app
  if (typeof syncWithCloud === 'function') {
    syncWithCloud();
    
    // Controlla nuovi aggiornamenti dal cloud ogni 15 secondi per aggiornare la classifica in tempo reale!
    setInterval(syncWithCloud, 15000);
  }
});
