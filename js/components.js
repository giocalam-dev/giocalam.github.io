/* ===== UI COMPONENTS ===== */

function renderStandingsTable(standings, sport) {
  if (!standings.length) return '<div class="empty-state"><div class="empty-state-icon">📊</div><div class="empty-state-text">Nessuna classifica disponibile</div><div class="empty-state-sub">L\'admin deve configurare le squadre</div></div>';
  const showAdv = hasAdvantageScoring(sport);
  return `
    <div class="card" style="overflow-x:auto;padding:16px">
      <table class="standings-table">
        <thead><tr>
          <th>#</th><th>Squadra</th><th>PG</th><th>V</th>${showAdv ? '' : '<th>P</th>'}<th>S</th><th>GF</th><th>GS</th><th>DR</th><th>Punti</th>
        </tr></thead>
        <tbody>${standings.map((s, i) => `
          <tr>
            <td class="pos-${i+1}">${i+1}</td>
            <td>${s.team}</td>
            <td>${s.played}</td>
            <td>${s.w}</td>
            ${showAdv ? '' : `<td>${s.d}</td>`}
            <td>${s.l}</td>
            <td>${s.gf}</td>
            <td>${s.ga}</td>
            <td>${s.gd > 0 ? '+' : ''}${s.gd}</td>
            <td>${s.pts}</td>
          </tr>
        `).join('')}</tbody>
      </table>
    </div>`;
}

function renderMatchCard(m) {
  const played = m.played;
  const dateStr = m.date ? formatDate(m.date) : '';
  const timeStr = m.time || '';
  const advBadge = m.isAdvantage ? '<span class="match-badge badge-adv">Vantaggi</span>' : '';
  return `
    <div class="match-card ${played ? '' : 'match-not-played'}">
      <div class="match-team team-left">${m.team1 || 'TBD'}</div>
      <div style="text-align:center">
        <div class="match-score">
          ${played ? `<span>${m.score1}</span><span class="sep">-</span><span>${m.score2}</span>` : `<span>${dateStr} ${timeStr}</span>`}
        </div>
        ${advBadge}
      </div>
      <div class="match-team team-right">${m.team2 || 'TBD'}</div>
    </div>`;
}

function renderMatchList(matches, title) {
  if (!matches.length) return '';
  return `
    <div class="section-title">${title}</div>
    ${matches.map(m => renderMatchCard(m)).join('')}
  `;
}

function renderBracketMatch(m) {
  if (!m) return '<div class="bracket-match"><div class="bracket-team tbd">TBD</div><div class="bracket-team tbd">TBD</div></div>';
  const w = getMatchWinner(m);
  return `
    <div class="bracket-match">
      <div class="bracket-team ${w === m.team1 ? 'winner' : ''}">${m.team1 || 'TBD'}<span class="bracket-team-score">${m.played ? m.score1 : ''}</span></div>
      <div class="bracket-team ${w === m.team2 ? 'winner' : ''}">${m.team2 || 'TBD'}<span class="bracket-team-score">${m.played ? m.score2 : ''}</span></div>
    </div>`;
}

function renderCalcioBracket(matches) {
  const semis = matches.filter(m => m.phase === 'semiFinal').sort((a,b) => a.id.localeCompare(b.id));
  const final0 = matches.find(m => m.phase === 'final');
  const cons = matches.find(m => m.phase === 'consolation');
  const third = matches.find(m => m.phase === 'thirdPlace');
  return `
    <div class="bracket">
      <div class="bracket-round">
        <div class="bracket-round-title">Semifinali</div>
        ${semis.map(m => renderBracketMatch(m)).join('')}
      </div>
      <div class="bracket-round">
        <div class="bracket-round-title">Finale</div>
        ${renderBracketMatch(final0)}
      </div>
    </div>
    ${third ? `<div class="mt-16"><div class="section-title">🥉 3° / 4° Posto</div>${renderBracketMatch(third)}</div>` : ''}
    ${cons ? `<div class="mt-16"><div class="section-title">🏁 Finale Maglia Nera (5° / 6° Posto)</div>${renderBracketMatch(cons)}</div>` : ''}
  `;
}

function renderPallavoloBracket(matches) {
  const qfs = matches.filter(m => m.phase === 'quarterFinal').sort((a,b) => a.id.localeCompare(b.id));
  const semis = matches.filter(m => m.phase === 'semiFinal').sort((a,b) => a.id.localeCompare(b.id));
  const final0 = matches.find(m => m.phase === 'final');
  const third = matches.find(m => m.phase === 'thirdPlace');
  return `
    <div class="bracket">
      <div class="bracket-round">
        <div class="bracket-round-title">Quarti</div>
        ${qfs.map(m => renderBracketMatch(m)).join('')}
      </div>
      <div class="bracket-round">
        <div class="bracket-round-title">Semifinali</div>
        ${semis.map(m => renderBracketMatch(m)).join('')}
      </div>
      <div class="bracket-round">
        <div class="bracket-round-title">Finale</div>
        ${renderBracketMatch(final0)}
      </div>
    </div>
    ${third ? `<div class="mt-16"><div class="section-title">🥉 3° / 4° Posto</div>${renderBracketMatch(third)}</div>` : ''}
  `;
}

function renderBasketBracketView(matches) {
  const qfs = matches.filter(m => m.phase === 'quarterFinal').sort((a,b) => a.id.localeCompare(b.id));
  const semis = matches.filter(m => m.phase === 'semiFinal').sort((a,b) => a.id.localeCompare(b.id));
  const final0 = matches.find(m => m.phase === 'final');
  const third = matches.find(m => m.phase === 'thirdPlace');
  return `
    <div class="bracket">
      <div class="bracket-round">
        <div class="bracket-round-title">Quarti</div>
        ${qfs.map(m => renderBracketMatch(m)).join('')}
      </div>
      <div class="bracket-round">
        <div class="bracket-round-title">Semifinali</div>
        ${semis.map(m => renderBracketMatch(m)).join('')}
      </div>
      <div class="bracket-round">
        <div class="bracket-round-title">Finale</div>
        ${renderBracketMatch(final0)}
      </div>
    </div>
    ${third ? `<div class="mt-16"><div class="section-title">🥉 3° / 4° Posto</div>${renderBracketMatch(third)}</div>` : ''}
  `;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  const days = ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'];
  const months = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

function phaseLabel(phase) {
  const labels = {
    group: 'Girone', league: 'Campionato',
    quarterFinal: 'Quarti', semiFinal: 'Semifinale',
    final: 'Finale', consolation: 'Finale Ultimi', thirdPlace: '3°/4° Posto'
  };
  return labels[phase] || phase;
}
