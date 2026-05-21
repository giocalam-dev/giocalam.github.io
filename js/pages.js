/* ===== PAGES ===== */

function renderHome() {
  const state = getState();
  const sports = [
    { key: 'calcio', icon: '⚽', name: 'Calcio', desc: '2 gironi da 3 → Semifinali → Finale', configured: state.calcio.configured },
    { key: 'pallavolo', icon: '🏐', name: 'Pallavolo', desc: '2 gironi da 4 → Quarti → Semi → Finale', configured: state.pallavolo.configured },
    { key: 'basket', icon: '🏀', name: 'Basket', desc: '5 squadre - Campionato', configured: state.basket.configured },
    { key: 'balilla', icon: '⚽', name: 'Calcetto Balilla', desc: '6 squadre - Campionato', configured: state.balilla.configured },
  ];

  // Upcoming matches across all sports
  let upcoming = [];
  ['calcio','pallavolo','basket','balilla'].forEach(sp => {
    const d = state[sp];
    if (d.configured) {
      d.matches.filter(m => !m.played && m.date).forEach(m => {
        upcoming.push({ ...m, sportName: sp });
      });
    }
  });
  upcoming.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  upcoming = upcoming.slice(0, 5);

  return `
    <h1 class="page-title">🏆 GiocaLAM</h1>

    <div class="card-glass mb-24" style="text-align:center;padding:20px">
      <div style="font-family:var(--font-h);font-weight:700;font-size:1rem;color:var(--white);margin-bottom:8px">
        📲 Installa l'app sul tuo dispositivo!
      </div>
      <div style="font-size:0.82rem;color:rgba(255,255,255,0.8);margin-bottom:12px">
        Aggiungi alla schermata Home per accesso rapido
      </div>
      <button class="btn btn-primary btn-sm" onclick="showTutorial()">Come fare →</button>
    </div>

    <div class="section-title" style="color:var(--white)">🏟️ I Tornei</div>
    ${sports.map(s => `
      <a href="#${s.key}" class="sport-card" id="card-${s.key}">
        <div class="sport-card-icon">${s.icon}</div>
        <div class="sport-card-info">
          <div class="sport-card-title">${s.name}</div>
          <div class="sport-card-desc">${s.desc}</div>
          <div style="margin-top:4px;font-size:0.75rem;font-weight:600" class="${s.configured ? 'status-configured' : 'status-pending'}">
            ${s.configured ? '✅ Configurato' : '⏳ Da configurare'}
          </div>
        </div>
        <div class="sport-card-arrow">→</div>
      </a>
    `).join('')}

    ${upcoming.length ? `
      <div class="section-title mt-24" style="color:var(--white)">📅 Prossime Partite</div>
      ${upcoming.map(m => renderMatchCard(m)).join('')}
    ` : ''}
  `;
}

function showTutorial() { window.location.hash = '#tutorial'; }

function renderTutorial() {
  return `
    <h1 class="page-title">📲 Installa l'App</h1>
    <div class="card mb-24">
      <div class="section-title">Questa app funziona su tutti i dispositivi!</div>
      <p style="font-size:0.88rem;color:rgba(27,42,107,0.7);margin-bottom:20px">
        Puoi installarla come un'app nativa direttamente dal browser. Segui le istruzioni per il tuo sistema operativo:
      </p>

      <div class="platform-tabs" id="platform-tabs">
        <button class="platform-tab active" onclick="switchPlatform('ios')">📱 iPhone/iPad</button>
        <button class="platform-tab" onclick="switchPlatform('android')">🤖 Android</button>
        <button class="platform-tab" onclick="switchPlatform('desktop')">💻 PC/Mac</button>
      </div>

      <div id="platform-content">
        ${renderPlatformIOS()}
      </div>
    </div>
    <div style="text-align:center">
      <a href="#home" class="btn btn-primary">← Torna alla Home</a>
    </div>
  `;
}

function switchPlatform(p) {
  document.querySelectorAll('.platform-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  const el = document.getElementById('platform-content');
  if (p === 'ios') el.innerHTML = renderPlatformIOS();
  else if (p === 'android') el.innerHTML = renderPlatformAndroid();
  else el.innerHTML = renderPlatformDesktop();
}

function renderPlatformIOS() {
  return `
    <div class="tutorial-step"><div class="tutorial-num">1</div><div class="tutorial-text">Apri questa pagina con <strong>Safari</strong></div></div>
    <div class="tutorial-step"><div class="tutorial-num">2</div><div class="tutorial-text">Tocca l'icona <strong>Condividi</strong> (quadrato con freccia in su) nella barra inferiore</div></div>
    <div class="tutorial-step"><div class="tutorial-num">3</div><div class="tutorial-text">Scorri e tocca <strong>"Aggiungi alla schermata Home"</strong></div></div>
    <div class="tutorial-step"><div class="tutorial-num">4</div><div class="tutorial-text">Tocca <strong>"Aggiungi"</strong> in alto a destra. L'app apparirà nella schermata Home! 🎉</div></div>
  `;
}

function renderPlatformAndroid() {
  return `
    <div class="tutorial-step"><div class="tutorial-num">1</div><div class="tutorial-text">Apri questa pagina con <strong>Chrome</strong></div></div>
    <div class="tutorial-step"><div class="tutorial-num">2</div><div class="tutorial-text">Tocca il menu <strong>⋮</strong> (tre puntini in alto a destra)</div></div>
    <div class="tutorial-step"><div class="tutorial-num">3</div><div class="tutorial-text">Tocca <strong>"Installa app"</strong> o <strong>"Aggiungi a schermata Home"</strong></div></div>
    <div class="tutorial-step"><div class="tutorial-num">4</div><div class="tutorial-text">Conferma toccando <strong>"Installa"</strong>. L'app apparirà tra le tue app! 🎉</div></div>
  `;
}

function renderPlatformDesktop() {
  return `
    <div class="tutorial-step"><div class="tutorial-num">1</div><div class="tutorial-text">Apri questa pagina con <strong>Chrome</strong> o <strong>Edge</strong></div></div>
    <div class="tutorial-step"><div class="tutorial-num">2</div><div class="tutorial-text">Nella barra degli indirizzi, clicca l'icona <strong>Installa</strong> (⊕ o 📥)</div></div>
    <div class="tutorial-step"><div class="tutorial-num">3</div><div class="tutorial-text">Clicca <strong>"Installa"</strong> nel popup di conferma</div></div>
    <div class="tutorial-step"><div class="tutorial-num">4</div><div class="tutorial-text">L'app si aprirà in una finestra dedicata! Trovala nelle tue applicazioni 🎉</div></div>
  `;
}

/* ===== SPORT PAGES ===== */

function renderCalcio() {
  const data = getSport('calcio');
  if (!data.configured) return renderNotConfigured('Calcio', 'calcio');

  const matches = data.matches;
  const updatedData = updateKnockoutBrackets('calcio', data);
  setSport('calcio', updatedData);

  const stA = getGroupStandings(matches, 'calcio', 'A', data.groups.A);
  const stB = getGroupStandings(matches, 'calcio', 'B', data.groups.B);
  const groupAMatches = matches.filter(m => m.group === 'A' && m.phase === 'group');
  const groupBMatches = matches.filter(m => m.group === 'B' && m.phase === 'group');

  return `
    <h1 class="page-title">⚽ Calcio</h1>
    <div class="sport-tabs">
      <button class="sport-tab active" onclick="switchCalcioTab('gironi')">Gironi</button>
      <button class="sport-tab" onclick="switchCalcioTab('eliminatorie')">Eliminatorie</button>
    </div>
    <div id="calcio-content">
      ${renderCalcioGironi(stA, stB, groupAMatches, groupBMatches)}
    </div>
  `;
}

function switchCalcioTab(tab) {
  document.querySelectorAll('.sport-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  const el = document.getElementById('calcio-content');
  const data = getSport('calcio');
  const matches = data.matches;
  if (tab === 'gironi') {
    const stA = getGroupStandings(matches, 'calcio', 'A', data.groups.A);
    const stB = getGroupStandings(matches, 'calcio', 'B', data.groups.B);
    el.innerHTML = renderCalcioGironi(stA, stB,
      matches.filter(m => m.group === 'A' && m.phase === 'group'),
      matches.filter(m => m.group === 'B' && m.phase === 'group'));
  } else {
    el.innerHTML = renderCalcioBracket(matches);
  }
}

function renderCalcioGironi(stA, stB, matchesA, matchesB) {
  return `
    <div class="group-label">Girone A</div>
    ${renderStandingsTable(stA, 'calcio')}
    ${renderMatchList(matchesA, '📋 Partite Girone A')}
    <div class="group-label mt-24">Girone B</div>
    ${renderStandingsTable(stB, 'calcio')}
    ${renderMatchList(matchesB, '📋 Partite Girone B')}
  `;
}

function renderPallavolo() {
  const data = getSport('pallavolo');
  if (!data.configured) return renderNotConfigured('Pallavolo', 'pallavolo');

  const matches = data.matches;
  const updatedData = updateKnockoutBrackets('pallavolo', data);
  setSport('pallavolo', updatedData);

  const stA = getGroupStandings(matches, 'pallavolo', 'A', data.groups.A);
  const stB = getGroupStandings(matches, 'pallavolo', 'B', data.groups.B);

  return `
    <h1 class="page-title">🏐 Pallavolo</h1>
    <div class="sport-tabs">
      <button class="sport-tab active" onclick="switchPallavoloTab('gironi')">Gironi</button>
      <button class="sport-tab" onclick="switchPallavoloTab('eliminatorie')">Eliminatorie</button>
    </div>
    <div id="pallavolo-content">
      ${renderPallavoloGironi(stA, stB, matches)}
    </div>
  `;
}

function switchPallavoloTab(tab) {
  document.querySelectorAll('.sport-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  const el = document.getElementById('pallavolo-content');
  const data = getSport('pallavolo');
  const matches = data.matches;
  if (tab === 'gironi') {
    const stA = getGroupStandings(matches, 'pallavolo', 'A', data.groups.A);
    const stB = getGroupStandings(matches, 'pallavolo', 'B', data.groups.B);
    el.innerHTML = renderPallavoloGironi(stA, stB, matches);
  } else {
    el.innerHTML = renderPallavoloBracket(matches);
  }
}

function renderPallavoloGironi(stA, stB, matches) {
  return `
    <div class="group-label">Girone A</div>
    ${renderStandingsTable(stA, 'pallavolo')}
    ${renderMatchList(matches.filter(m => m.group === 'A' && m.phase === 'group'), '📋 Partite Girone A')}
    <div class="group-label mt-24">Girone B</div>
    ${renderStandingsTable(stB, 'pallavolo')}
    ${renderMatchList(matches.filter(m => m.group === 'B' && m.phase === 'group'), '📋 Partite Girone B')}
  `;
}

function renderBasket() {
  const data = getSport('basket');
  if (!data.configured) return renderNotConfigured('Basket', 'basket');

  const standings = getLeagueStandings(data.matches, 'basket', data.teams);
  return `
    <h1 class="page-title">🏀 Basket</h1>
    <div class="section-title" style="color:var(--white)">📊 Classifica</div>
    ${renderStandingsTable(standings, 'basket')}
    <div class="mt-24">
      ${renderMatchList(data.matches, '📋 Calendario')}
    </div>
  `;
}

function renderBalilla() {
  const data = getSport('balilla');
  if (!data.configured) return renderNotConfigured('Calcetto Balilla', 'balilla');

  const standings = getLeagueStandings(data.matches, 'balilla', data.teams);
  return `
    <h1 class="page-title">⚽ Calcetto Balilla</h1>
    <div class="section-title" style="color:var(--white)">📊 Classifica</div>
    ${renderStandingsTable(standings, 'balilla')}
    <div class="mt-24">
      ${renderMatchList(data.matches, '📋 Calendario')}
    </div>
  `;
}

function renderNotConfigured(name, key) {
  return `
    <h1 class="page-title">${name}</h1>
    <div class="empty-state">
      <div class="empty-state-icon">⚙️</div>
      <div class="empty-state-text">Torneo non ancora configurato</div>
      <div class="empty-state-sub">L'admin deve inserire le squadre per iniziare</div>
      <a href="#admin" class="btn btn-primary mt-16" style="display:inline-flex">Vai all'Admin →</a>
    </div>
  `;
}
