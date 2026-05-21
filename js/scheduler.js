/* ===== SCHEDULER - Round-robin match generation ===== */

function generateRoundRobin(teams) {
  const pairs = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      pairs.push([teams[i], teams[j]]);
    }
  }
  return pairs;
}

function createGroupMatches(teams, sport, group) {
  return generateRoundRobin(teams).map((p, i) => ({
    id: `${sport}_g${group}_${i}`,
    team1: p[0], team2: p[1],
    score1: null, score2: null,
    date: '', time: '',
    phase: 'group', group: group,
    isAdvantage: false, played: false, sport: sport
  }));
}

function createLeagueMatches(teams, sport) {
  return generateRoundRobin(teams).map((p, i) => ({
    id: `${sport}_league_${i}`,
    team1: p[0], team2: p[1],
    score1: null, score2: null,
    date: '', time: '',
    phase: 'league', group: null,
    isAdvantage: false, played: false, sport: sport
  }));
}

function createKnockoutMatch(sport, phase, idx) {
  return {
    id: `${sport}_${phase}_${idx}`,
    team1: '', team2: '',
    score1: null, score2: null,
    date: '', time: '',
    phase: phase, group: null,
    isAdvantage: false, played: false, sport: sport
  };
}

function generateAllMatches(sport, data) {
  let matches = [];
  if (sport === 'calcio') {
    const gA = data.groups.A.filter(t => t);
    const gB = data.groups.B.filter(t => t);
    if (gA.length >= 2) matches.push(...createGroupMatches(gA, 'calcio', 'A'));
    if (gB.length >= 2) matches.push(...createGroupMatches(gB, 'calcio', 'B'));
    // Knockout: 2 semis + final + consolation
    matches.push(createKnockoutMatch('calcio', 'semiFinal', 0));
    matches.push(createKnockoutMatch('calcio', 'semiFinal', 1));
    matches.push(createKnockoutMatch('calcio', 'final', 0));
    matches.push(createKnockoutMatch('calcio', 'consolation', 0));
  } else if (sport === 'pallavolo') {
    const gA = data.groups.A.filter(t => t);
    const gB = data.groups.B.filter(t => t);
    if (gA.length >= 2) matches.push(...createGroupMatches(gA, 'pallavolo', 'A'));
    if (gB.length >= 2) matches.push(...createGroupMatches(gB, 'pallavolo', 'B'));
    // 4 QF + 2 Semi + 3rd place + final
    for (let i = 0; i < 4; i++) matches.push(createKnockoutMatch('pallavolo', 'quarterFinal', i));
    matches.push(createKnockoutMatch('pallavolo', 'semiFinal', 0));
    matches.push(createKnockoutMatch('pallavolo', 'semiFinal', 1));
    matches.push(createKnockoutMatch('pallavolo', 'thirdPlace', 0));
    matches.push(createKnockoutMatch('pallavolo', 'final', 0));
  } else if (sport === 'basket') {
    const teams = data.teams.filter(t => t);
    if (teams.length >= 2) matches = createLeagueMatches(teams, 'basket');
  } else if (sport === 'balilla') {
    const teams = data.teams.filter(t => t);
    if (teams.length >= 2) matches = createLeagueMatches(teams, 'balilla');
  }
  return matches;
}
