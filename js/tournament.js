/* ===== TOURNAMENT LOGIC - Standings & bracket generation ===== */

const SCORING = {
  calcio:    { win: 3, draw: 1, loss: 0 },
  pallavolo: { win: 3, winAdv: 2, lossAdv: 1, loss: 0 },
  basket:    { win: 3, draw: 1, loss: 0 },
  balilla:   { win: 3, winAdv: 2, lossAdv: 1, loss: 0 }
};

function hasAdvantageScoring(sport) {
  return sport === 'pallavolo' || sport === 'balilla';
}

function calculateStandings(matches, sport, allTeams) {
  const scoring = SCORING[sport];
  const stats = {};

  // Initialize all teams at 0 points
  if (allTeams) {
    allTeams.filter(t => t).forEach(t => {
      stats[t] = { team: t, pts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, played: 0 };
    });
  }

  const validPhases = ['group', 'league'];
  matches.filter(m => m.played && validPhases.includes(m.phase)).forEach(m => {
    [m.team1, m.team2].forEach(t => {
      if (!stats[t]) stats[t] = { team: t, pts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, played: 0 };
    });
    const s1 = m.score1, s2 = m.score2;
    stats[m.team1].gf += s1; stats[m.team1].ga += s2;
    stats[m.team2].gf += s2; stats[m.team2].ga += s1;
    stats[m.team1].played++; stats[m.team2].played++;

    if (s1 > s2) {
      if (hasAdvantageScoring(sport) && m.isAdvantage) {
        stats[m.team1].pts += scoring.winAdv;
        stats[m.team2].pts += scoring.lossAdv;
      } else {
        stats[m.team1].pts += scoring.win;
        stats[m.team2].pts += scoring.loss;
      }
      stats[m.team1].w++; stats[m.team2].l++;
    } else if (s2 > s1) {
      if (hasAdvantageScoring(sport) && m.isAdvantage) {
        stats[m.team2].pts += scoring.winAdv;
        stats[m.team1].pts += scoring.lossAdv;
      } else {
        stats[m.team2].pts += scoring.win;
        stats[m.team1].pts += scoring.loss;
      }
      stats[m.team2].w++; stats[m.team1].l++;
    } else {
      stats[m.team1].pts += scoring.draw || 0;
      stats[m.team2].pts += scoring.draw || 0;
      stats[m.team1].d++; stats[m.team2].d++;
    }
  });

  Object.values(stats).forEach(s => { s.gd = s.gf - s.ga; });
  return Object.values(stats).sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
}

function getGroupStandings(matches, sport, group, groupTeams) {
  const gm = matches.filter(m => m.group === group && m.phase === 'group');
  return calculateStandings(gm, sport, groupTeams);
}

function getLeagueStandings(matches, sport, allTeams) {
  const lm = matches.filter(m => m.phase === 'league');
  return calculateStandings(lm, sport, allTeams);
}

function getMatchWinner(m) {
  if (!m || !m.played) return null;
  if (m.score1 > m.score2) return m.team1;
  if (m.score2 > m.score1) return m.team2;
  return null;
}

function getMatchLoser(m) {
  if (!m || !m.played) return null;
  if (m.score1 > m.score2) return m.team2;
  if (m.score2 > m.score1) return m.team1;
  return null;
}

/** Auto-populate knockout brackets based on group standings */
function updateKnockoutBrackets(sport, data) {
  const matches = data.matches;
  if (!matches || !matches.length) return data;

  if (sport === 'calcio') {
    updateCalcioBracket(matches, data);
  } else if (sport === 'pallavolo') {
    updatePallavoloBracket(matches, data);
  }

  data.matches = matches;
  return data;
}

function updateCalcioBracket(matches, data) {
  const groupA = matches.filter(m => m.group === 'A' && m.phase === 'group');
  const groupB = matches.filter(m => m.group === 'B' && m.phase === 'group');
  const allGroupsDone = groupA.length > 0 && groupB.length > 0
    && groupA.every(m => m.played) && groupB.every(m => m.played);

  if (allGroupsDone) {
    const stA = getGroupStandings(matches, 'calcio', 'A', data.groups ? data.groups.A : null);
    const stB = getGroupStandings(matches, 'calcio', 'B', data.groups ? data.groups.B : null);

    if (stA.length >= 2 && stB.length >= 2) {
      // Semi 1: 1st A vs 2nd B
      const s0 = matches.find(m => m.phase === 'semiFinal' && m.id.endsWith('_0'));
      if (s0 && !s0.played) { s0.team1 = stA[0].team; s0.team2 = stB[1].team; }
      // Semi 2: 1st B vs 2nd A
      const s1 = matches.find(m => m.phase === 'semiFinal' && m.id.endsWith('_1'));
      if (s1 && !s1.played) { s1.team1 = stB[0].team; s1.team2 = stA[1].team; }
      // Consolation: 3rd A vs 3rd B
      const cons = matches.find(m => m.phase === 'consolation');
      if (cons && !cons.played && stA.length >= 3 && stB.length >= 3) {
        cons.team1 = stA[2].team; cons.team2 = stB[2].team;
      }
    }
  }

  // Final from semi winners
  const sf0 = matches.find(m => m.phase === 'semiFinal' && m.id.endsWith('_0'));
  const sf1 = matches.find(m => m.phase === 'semiFinal' && m.id.endsWith('_1'));
  const fin = matches.find(m => m.phase === 'final');
  if (sf0 && sf0.played && sf1 && sf1.played && fin && !fin.played) {
    fin.team1 = getMatchWinner(sf0);
    fin.team2 = getMatchWinner(sf1);
  }
}

function updatePallavoloBracket(matches, data) {
  const groupA = matches.filter(m => m.group === 'A' && m.phase === 'group');
  const groupB = matches.filter(m => m.group === 'B' && m.phase === 'group');
  const allGroupsDone = groupA.length > 0 && groupB.length > 0
    && groupA.every(m => m.played) && groupB.every(m => m.played);

  if (allGroupsDone) {
    const stA = getGroupStandings(matches, 'pallavolo', 'A', data.groups ? data.groups.A : null);
    const stB = getGroupStandings(matches, 'pallavolo', 'B', data.groups ? data.groups.B : null);

    if (stA.length >= 4 && stB.length >= 4) {
      const qfs = matches.filter(m => m.phase === 'quarterFinal').sort((a,b) => a.id.localeCompare(b.id));
      if (qfs.length >= 4) {
        if (!qfs[0].played) { qfs[0].team1 = stA[0].team; qfs[0].team2 = stB[3].team; }
        if (!qfs[1].played) { qfs[1].team1 = stA[1].team; qfs[1].team2 = stB[2].team; }
        if (!qfs[2].played) { qfs[2].team1 = stB[0].team; qfs[2].team2 = stA[3].team; }
        if (!qfs[3].played) { qfs[3].team1 = stB[1].team; qfs[3].team2 = stA[2].team; }
      }
    }
  }

  // Semis from QF winners
  const qfs = matches.filter(m => m.phase === 'quarterFinal').sort((a,b) => a.id.localeCompare(b.id));
  const semis = matches.filter(m => m.phase === 'semiFinal').sort((a,b) => a.id.localeCompare(b.id));
  if (qfs.length >= 4 && semis.length >= 2) {
    if (qfs[0].played && qfs[1].played && !semis[0].played) {
      semis[0].team1 = getMatchWinner(qfs[0]);
      semis[0].team2 = getMatchWinner(qfs[1]);
    }
    if (qfs[2].played && qfs[3].played && !semis[1].played) {
      semis[1].team1 = getMatchWinner(qfs[2]);
      semis[1].team2 = getMatchWinner(qfs[3]);
    }
  }

  // Final & 3rd place from semi results
  const fin = matches.find(m => m.phase === 'final');
  const third = matches.find(m => m.phase === 'thirdPlace');
  if (semis.length >= 2 && semis[0].played && semis[1].played) {
    if (fin && !fin.played) {
      fin.team1 = getMatchWinner(semis[0]);
      fin.team2 = getMatchWinner(semis[1]);
    }
    if (third && !third.played) {
      third.team1 = getMatchLoser(semis[0]);
      third.team2 = getMatchLoser(semis[1]);
    }
  }
}
