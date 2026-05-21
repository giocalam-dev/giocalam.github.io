/* ===== DATA STORE - localStorage + Cloud Sync ===== */
const STORAGE_KEY = 'torneo-lam-data';

// 🌐 LA TUA URL DI FIREBASE (IMPORTANTE!)
// Inserisci qui la URL del tuo database Firebase tra gli apici.
// Esempio: 'https://tuo-torneo-default-rtdb.europe-west1.firebasedatabase.app/torneo-state.json'
// In questo modo, l'indirizzo del database sarà scritto direttamente nel codice
// e TUTTI i dispositivi del pubblico sapranno dove connettersi in automatico!
const CLOUD_URL = 'https://giocalam-db-default-rtdb.europe-west1.firebasedatabase.app/torneo-state.json';

const DEFAULT_STATE = {
  version: 1,
  lastUpdated: 0,
  calcio: {
    configured: false,
    groups: { A: ['','',''], B: ['','',''] },
    matches: []
  },
  pallavolo: {
    configured: false,
    groups: { A: ['','','',''], B: ['','','',''] },
    matches: []
  },
  basket: {
    configured: false,
    teams: ['','','','',''],
    matches: []
  },
  balilla: {
    configured: false,
    teams: ['','','','','',''],
    matches: []
  }
};

function getState() {
  try {
    const d = localStorage.getItem(STORAGE_KEY);
    return d ? JSON.parse(d) : JSON.parse(JSON.stringify(DEFAULT_STATE));
  } catch { return JSON.parse(JSON.stringify(DEFAULT_STATE)); }
}

function setState(s) {
  s.lastUpdated = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  
  // Salva sul cloud in background se configurato nel codice
  if (CLOUD_URL && CLOUD_URL !== '') {
    saveToCloud(s);
  }
}

async function saveToCloud(state) {
  try {
    let endpoint = CLOUD_URL;
    if (!endpoint.endsWith('.json')) {
      endpoint = endpoint.endsWith('/') ? endpoint + 'torneo-state.json' : endpoint + '/torneo-state.json';
    }
    
    await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state)
    });
    console.log('☁️ Sincronizzato con il cloud!');
  } catch (e) {
    console.warn('Impossibile salvare sul cloud (offline?):', e);
  }
}

// Questa funzione scarica i dati aggiornati dal cloud all'avvio dell'app e ogni 15s
async function syncWithCloud() {
  if (!CLOUD_URL || CLOUD_URL === '') return;
  try {
    let endpoint = CLOUD_URL;
    if (!endpoint.endsWith('.json')) {
      endpoint = endpoint.endsWith('/') ? endpoint + 'torneo-state.json' : endpoint + '/torneo-state.json';
    }
    
    const res = await fetch(endpoint);
    if (!res.ok) return;
    const cloudState = await res.json();
    
    if (cloudState && typeof cloudState === 'object') {
      const localState = getState();
      
      // Sincronizza solo se i dati del cloud sono più recenti di quelli locali
      if (!localState.lastUpdated || cloudState.lastUpdated > localState.lastUpdated) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudState));
        console.log('🔄 Dati aggiornati dal database cloud!');
        if (typeof handleRoute === 'function') {
          handleRoute();
        }
      }
    }
  } catch (e) {
    console.warn('Errore di sincronizzazione cloud:', e);
  }
}

function getSport(sport) { return getState()[sport]; }

function setSport(sport, data) {
  const s = getState();
  s[sport] = data;
  setState(s);
}

function resetAll() { 
  setState(JSON.parse(JSON.stringify(DEFAULT_STATE))); 
}

function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}
