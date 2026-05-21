/* ===== DATA STORE - localStorage + Cloud Sync ===== */
const STORAGE_KEY = 'torneo-lam-data';
const CONFIG_KEY = 'torneo-lam-config';

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

function getCloudUrl() {
  try {
    const config = localStorage.getItem(CONFIG_KEY);
    return config ? JSON.parse(config).cloudUrl || '' : '';
  } catch { return ''; }
}

function setCloudUrl(url) {
  try {
    const config = localStorage.getItem(CONFIG_KEY) ? JSON.parse(localStorage.getItem(CONFIG_KEY)) : {};
    config.cloudUrl = url.trim();
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    // Avvia una sincronizzazione immediata se viene inserita una nuova URL
    if (config.cloudUrl) {
      syncWithCloud();
    }
  } catch (e) {
    console.error(e);
  }
}

function getState() {
  try {
    const d = localStorage.getItem(STORAGE_KEY);
    return d ? JSON.parse(d) : JSON.parse(JSON.stringify(DEFAULT_STATE));
  } catch { return JSON.parse(JSON.stringify(DEFAULT_STATE)); }
}

function setState(s) {
  s.lastUpdated = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  
  // Salva sul cloud in background se configurato
  const url = getCloudUrl();
  if (url) {
    saveToCloud(url, s);
  }
}

async function saveToCloud(url, state) {
  try {
    // Aggiungi .json se manca alla URL di Firebase per compatibilità con la REST API
    let endpoint = url;
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

// Questa funzione scarica i dati aggiornati dal cloud
async function syncWithCloud() {
  const url = getCloudUrl();
  if (!url) return;
  try {
    let endpoint = url;
    if (!endpoint.endsWith('.json')) {
      endpoint = endpoint.endsWith('/') ? endpoint + 'torneo-state.json' : endpoint + '/torneo-state.json';
    }
    
    const res = await fetch(endpoint);
    if (!res.ok) return;
    const cloudState = await res.json();
    
    if (cloudState && typeof cloudState === 'object') {
      const localState = getState();
      
      // Sincronizza solo se i dati del cloud sono più recenti
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
