/* ===== ADMIN PANEL ===== */
const ADMIN_PASS = 'admin123';
let adminLoggedIn = false;
let adminCurrentSport = 'calcio';

function renderAdmin() {
  if (!adminLoggedIn) return renderAdminLogin();
  return renderAdminPanel();
}

function renderAdminLogin() {
  return `
    <div class="admin-login">
      <h2>🔐 Pannello Admin</h2>
      <div class="card">
        <div class="input-group">
          <label for="admin-pass">Password</label>
          <input type="password" id="admin-pass" placeholder="Inserisci password" onkeydown="if(event.key==='Enter')doAdminLogin()">
        </div>
        <button class="btn btn-primary btn-block" onclick="doAdminLogin()" id="admin-login-btn">Accedi</button>
        <div id="admin-error" style="color:#dc3545;font-size:0.82rem;margin-top:10px;display:none">Password errata</div>
      </div>
    </div>
  `;
}

function doAdminLogin() {
  const pass = document.getElementById('admin-pass').value;
  if (pass === ADMIN_PASS) {
    adminLoggedIn = true;
    document.getElementById('app-content').innerHTML = renderAdmin();
  } else {
    document.getElementById('admin-error').style.display = 'block';
  }
}

function renderAdminPanel() {
  const cloudUrl = getCloudUrl();
  return `
    <h1 class="page-title">⚙️ Pannello Admin</h1>
    <div class="admin-sport-tabs">
      ${['calcio','pallavolo','basket','balilla'].map(s => `
        <button class="admin-sport-tab ${adminCurrentSport === s ? 'active' : ''}"
          onclick="switchAdminSport('${s}', this)">${sportIcon(s)} ${sportName(s)}</button>
      `).join('')}
    </div>
    <div id="admin-sport-content">
      ${renderAdminSport(adminCurrentSport)}
    </div>

    <!-- Sezione Cloud Sync -->
    <div class="card mt-24">
      <div class="section-title">🌐 Sincronizzazione Cloud (Firebase)</div>
      <p style="font-size:0.82rem;color:rgba(27,42,107,0.6);margin-bottom:12px">
        Inserisci la URL del tuo database Firebase Realtime per consentire a chiunque di vedere i risultati in tempo reale su qualsiasi dispositivo.
      </p>
      <div class="input-group">
        <label for="cloud-url-input">Firebase Database URL</label>
        <input type="url" id="cloud-url-input" value="${cloudUrl}" placeholder="https://tuo-db.europe-west1.firebasedatabase.app/" style="font-family:monospace;font-size:0.82rem">
      </div>
      <div style="display:flex;gap:12px;margin-top:12px">
        <button class="btn btn-primary btn-sm" onclick="saveCloudConfig()">💾 Salva e Connetti</button>
        ${cloudUrl ? `<button class="btn btn-danger btn-sm" onclick="disableCloudSync()">Disattiva</button>` : ''}
      </div>
      <div style="font-size:0.75rem;color:rgba(27,42,107,0.5);margin-top:8px">
        ${cloudUrl ? '🟢 Sincronizzazione Cloud Attiva!' : '⚪️ Cloud Sync non attivo (i dati rimangono in locale su questo browser)'}
      </div>
    </div>

    <div class="mt-24 mb-24" style="text-align:center">
      <button class="btn btn-danger btn-sm" id="reset-all-btn" onclick="doResetAll()">🗑️ Reset Tutti i Dati</button>
    </div>
  `;
}

function saveCloudConfig() {
  const url = document.getElementById('cloud-url-input').value.trim();
  if (!url) {
    showToast('⚠️ Inserisci una URL valida');
    return;
  }
  setCloudUrl(url);
  showToast('✅ Connessione Cloud salvata!');
  document.getElementById('app-content').innerHTML = renderAdminPanel();
}

function disableCloudSync() {
  if (confirm('Vuoi disattivare la sincronizzazione cloud? I dati rimarranno salvati in locale su questo browser.')) {
    setCloudUrl('');
    showToast('⚪️ Sincronizzazione Cloud disattivata');
    document.getElementById('app-content').innerHTML = renderAdminPanel();
  }
}

function doResetAll() {
  if (confirm('Sei sicuro? Tutti i dati verranno cancellati!')) {
    resetAll();
    showToast('Dati resettati');
    document.getElementById('app-content').innerHTML = renderAdminPanel();
  }
}

function switchAdminSport(sport, btn) {
  adminCurrentSport = sport;
  document.querySelectorAll('.admin-sport-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.getElementById('admin-sport-content').innerHTML = renderAdminSport(sport);
}

function sportIcon(s) { return { calcio: '⚽', pallavolo: '🏐', basket: '🏀', balilla: '⚽' }[s]; }
function sportName(s) { return { calcio: 'Calcio', pallavolo: 'Pallavolo', basket: 'Basket', balilla: 'Balilla' }[s]; }

function renderAdminSport(sport) {
  const data = getSport(sport);
  const isGroupSport = sport === 'calcio' || sport === 'pallavolo';

  let teamsHTML = '';
  if (isGroupSport) {
    const groups = data.groups;
    teamsHTML = Object.keys(groups).map(g => `
      <div class="admin-section">
        <div class="section-title"><span class="group-label">Girone ${g}</span></div>
        ${groups[g].map((t, i) => `
          <div class="team-input-row">
            <span class="team-label">${i+1}</span>
            <input type="text" value="${t}" placeholder="Nome squadra ${i+1}"
              id="team_${sport}_${g}_${i}" onchange="updateTeam('${sport}','${g}',${i},this.value)">
          </div>
        `).join('')}
      </div>
    `).join('');
  } else {
    teamsHTML = `
      <div class="admin-section">
        <div class="section-title">👥 Squadre</div>
        ${data.teams.map((t, i) => `
          <div class="team-input-row">
            <span class="team-label">${i+1}</span>
            <input type="text" value="${t}" placeholder="Nome squadra ${i+1}"
              id="team_${sport}_${i}" onchange="updateLeagueTeam('${sport}',${i},this.value)">
          </div>
        `).join('')}
      </div>
    `;
  }

  return `
    <div class="card">
      <div class="section-title">👥 Configura Squadre</div>
      ${teamsHTML}
      <button class="btn btn-gold btn-sm mt-16" onclick="saveTeams('${sport}')">
        💾 Salva e Genera Calendario
      </button>
    </div>
    ${data.configured ? renderAdminMatches(sport, data) : '<div class="card-glass" style="text-align:center;padding:24px;color:var(--white)">Salva le squadre per generare il calendario delle partite</div>'}
  `;
}

function updateTeam(sport, group, idx, value) {
  const data = getSport(sport);
  data.groups[group][idx] = value.trim();
  setSport(sport, data);
}

function updateLeagueTeam(sport, idx, value) {
  const data = getSport(sport);
  data.teams[idx] = value.trim();
  setSport(sport, data);
}

function saveTeams(sport) {
  const data = getSport(sport);
  const isGroupSport = sport === 'calcio' || sport === 'pallavolo';

  if (isGroupSport) {
    const allTeams = Object.values(data.groups).flat();
    if (allTeams.some(t => !t.trim())) {
      showToast('⚠️ Inserisci tutti i nomi delle squadre');
      return;
    }
  } else {
    if (data.teams.some(t => !t.trim())) {
      showToast('⚠️ Inserisci tutti i nomi delle squadre');
      return;
    }
  }

  data.matches = generateAllMatches(sport, data);
  data.configured = true;
  setSport(sport, data);
  showToast('✅ Squadre salvate e calendario generato!');
  document.getElementById('admin-sport-content').innerHTML = renderAdminSport(sport);
}

function renderAdminMatches(sport, data) {
  const matches = data.matches;
  const phases = {};
  matches.forEach(m => {
    const key = m.group ? `${m.phase}_${m.group}` : m.phase;
    if (!phases[key]) phases[key] = [];
    phases[key].push(m);
  });

  let html = '<div class="card mt-16"><div class="section-title">📋 Gestione Partite</div>';

  Object.keys(phases).forEach(key => {
    const ms = phases[key];
    const label = ms[0].group ? `${phaseLabel(ms[0].phase)} ${ms[0].group}` : phaseLabel(ms[0].phase);
    html += `<div class="phase-badge mb-8">${label}</div>`;
    ms.forEach(m => {
      html += renderAdminMatchEdit(m, sport);
    });
  });

  html += '</div>';
  return html;
}

function getFormatHint(sport, phase) {
  if (sport === 'pallavolo') {
    if (phase === 'group') return '📏 Set unico a 15 punti — inserisci il punteggio del set';
    return '📏 Meglio dei 3 set — inserisci i set vinti (es. 2-0 o 2-1)';
  }
  if (sport === 'balilla') return '📏 Inserisci il punteggio della partita';
  if (sport === 'calcio') return '📏 Inserisci i gol segnati';
  if (sport === 'basket') return '📏 Inserisci i punti segnati';
  return '';
}

function renderAdminMatchEdit(m, sport) {
  const showAdv = hasAdvantageScoring(sport);
  const isKnockout = m.phase !== 'group' && m.phase !== 'league';
  const teamsReady = m.team1 && m.team2;
  const hint = getFormatHint(sport, m.phase);

  return `
    <div class="match-edit-card" id="match-edit-${m.id}">
      <div class="match-edit-header">
        ${m.team1 || '❓ TBD'} vs ${m.team2 || '❓ TBD'}
        ${m.played ? '<span style="color:#28a745;font-size:0.72rem;margin-left:auto">✅ Giocata</span>' : ''}
      </div>
      ${teamsReady ? `
        ${hint ? `<div style="font-size:0.72rem;color:rgba(27,42,107,0.5);margin-bottom:8px">${hint}</div>` : ''}
        <div class="match-edit-grid">
          <div class="input-group">
            <label>📅 Data</label>
            <input type="date" value="${m.date}" onchange="updateMatch('${m.id}','date',this.value)">
          </div>
          <div class="input-group">
            <label>⏰ Ora</label>
            <input type="time" value="${m.time}" onchange="updateMatch('${m.id}','time',this.value)">
          </div>
        </div>
        <div class="match-edit-grid mt-8">
          <div class="input-group">
            <label>${m.team1}</label>
            <input type="number" min="0" value="${m.score1 !== null ? m.score1 : ''}"
              onchange="updateMatch('${m.id}','score1',this.value)" placeholder="-">
          </div>
          <div class="input-group">
            <label>${m.team2}</label>
            <input type="number" min="0" value="${m.score2 !== null ? m.score2 : ''}"
              onchange="updateMatch('${m.id}','score2',this.value)" placeholder="-">
          </div>
        </div>
        ${showAdv ? `
          <div class="checkbox-group mt-8">
            <input type="checkbox" id="adv_${m.id}" ${m.isAdvantage ? 'checked' : ''}
              onchange="updateMatch('${m.id}','isAdvantage',this.checked)">
            <label for="adv_${m.id}" style="font-size:0.82rem;font-weight:600">Ai vantaggi</label>
          </div>
        ` : ''}
        <button class="btn btn-primary btn-sm mt-8" onclick="saveMatch('${m.id}')">
          ${m.played ? '🔄 Aggiorna Risultato' : '✅ Salva Risultato'}
        </button>
      ` : `
        <div style="font-size:0.78rem;color:rgba(27,42,107,0.4);padding:8px 0">
          ⏳ Le squadre verranno assegnate automaticamente al completamento della fase precedente
        </div>
        <div class="match-edit-grid">
          <div class="input-group">
            <label>📅 Data</label>
            <input type="date" value="${m.date}" onchange="updateMatch('${m.id}','date',this.value)">
          </div>
          <div class="input-group">
            <label>⏰ Ora</label>
            <input type="time" value="${m.time}" onchange="updateMatch('${m.id}','time',this.value)">
          </div>
        </div>
      `}
    </div>
  `;
}

function updateMatch(matchId, field, value) {
  const state = getState();
  for (const sport of ['calcio','pallavolo','basket','balilla']) {
    const idx = state[sport].matches.findIndex(m => m.id === matchId);
    if (idx !== -1) {
      if (field === 'score1' || field === 'score2') {
        state[sport].matches[idx][field] = value !== '' ? parseInt(value) : null;
      } else if (field === 'isAdvantage') {
        state[sport].matches[idx][field] = !!value;
      } else {
        state[sport].matches[idx][field] = value;
      }
      setState(state);
      return;
    }
  }
}

function saveMatch(matchId) {
  const state = getState();
  for (const sport of ['calcio','pallavolo','basket','balilla']) {
    const idx = state[sport].matches.findIndex(m => m.id === matchId);
    if (idx !== -1) {
      const m = state[sport].matches[idx];
      if (m.score1 === null || m.score2 === null) {
        showToast('⚠️ Inserisci entrambi i punteggi');
        return;
      }
      if (m.score1 === m.score2 && (sport === 'pallavolo' || sport === 'balilla')) {
        showToast('⚠️ Non è possibile un pareggio in questo sport');
        return;
      }
      state[sport].matches[idx].played = true;
      setState(state);

      // Update knockout brackets
      const updated = updateKnockoutBrackets(sport, state[sport]);
      setSport(sport, updated);

      showToast('✅ Punteggio salvato!');
      document.getElementById('admin-sport-content').innerHTML = renderAdminSport(sport);
      return;
    }
  }
}
