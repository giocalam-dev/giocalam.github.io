/* ===== DATA STORE - localStorage + Cloud Sync ===== */
const STORAGE_KEY = 'torneo-lam-data';

// 🌐 LA TUA URL DI FIREBASE (IMPORTANTE!)
// Inserisci qui la URL del tuo database Firebase tra gli apici.
// Esempio: 'https://tuo-torneo-default-rtdb.europe-west1.firebasedatabase.app/torneo-state.json'
// In questo modo, l'indirizzo del database sarà scritto direttamente nel codice
// e TUTTI i dispositivi del pubblico sapranno dove connettersi in automatico!
const CLOUD_URL = 'https://giocalam-default-rtdb.europe-west1.firebasedatabase.app/';

const DEFAULT_STATE = {
  version: 4,
  lastUpdated: 0,
  calcio: {
    configured: true,
    groups: {
      A: ['I Mani', 'Hellas Madonna', 'Badonkalonk FC'],
      B: ['Bastardi senza neuroni', 'New Barcellona Boobs 34', 'Real Bevitores']
    },
    matches: [
      { id: 'calcio_gA_0', team1: 'I Mani', team2: 'Hellas Madonna', score1: null, score2: null, date: '2026-05-24', time: '15:00', phase: 'group', group: 'A', isAdvantage: false, played: false, sport: 'calcio' },
      { id: 'calcio_gB_0', team1: 'Bastardi senza neuroni', team2: 'New Barcellona Boobs 34', score1: null, score2: null, date: '2026-05-24', time: '15:30', phase: 'group', group: 'B', isAdvantage: false, played: false, sport: 'calcio' },
      { id: 'calcio_gA_1', team1: 'Badonkalonk FC', team2: 'I Mani', score1: null, score2: null, date: '2026-05-24', time: '16:00', phase: 'group', group: 'A', isAdvantage: false, played: false, sport: 'calcio' },
      { id: 'calcio_gB_1', team1: 'Real Bevitores', team2: 'Bastardi senza neuroni', score1: null, score2: null, date: '2026-05-24', time: '16:30', phase: 'group', group: 'B', isAdvantage: false, played: false, sport: 'calcio' },
      { id: 'calcio_gA_2', team1: 'Hellas Madonna', team2: 'Badonkalonk FC', score1: null, score2: null, date: '2026-05-24', time: '17:00', phase: 'group', group: 'A', isAdvantage: false, played: false, sport: 'calcio' },
      { id: 'calcio_gB_2', team1: 'New Barcellona Boobs 34', team2: 'Real Bevitores', score1: null, score2: null, date: '2026-05-24', time: '17:30', phase: 'group', group: 'B', isAdvantage: false, played: false, sport: 'calcio' },
      { id: 'calcio_semiFinal_0', team1: '', team2: '', score1: null, score2: null, date: '2026-05-24', time: '18:15', phase: 'semiFinal', group: null, isAdvantage: false, played: false, sport: 'calcio' },
      { id: 'calcio_semiFinal_1', team1: '', team2: '', score1: null, score2: null, date: '2026-05-24', time: '18:45', phase: 'semiFinal', group: null, isAdvantage: false, played: false, sport: 'calcio' },
      { id: 'calcio_consolation_0', team1: '', team2: '', score1: null, score2: null, date: '2026-05-24', time: '19:15', phase: 'consolation', group: null, isAdvantage: false, played: false, sport: 'calcio' },
      { id: 'calcio_thirdPlace_0', team1: '', team2: '', score1: null, score2: null, date: '2026-05-24', time: '19:55', phase: 'thirdPlace', group: null, isAdvantage: false, played: false, sport: 'calcio' },
      { id: 'calcio_final_0', team1: '', team2: '', score1: null, score2: null, date: '2026-05-24', time: '20:35', phase: 'final', group: null, isAdvantage: false, played: false, sport: 'calcio' }
    ]
  },
  pallavolo: {
    configured: true,
    groups: {
      A: ['4 Salti in Barella', 'Cussine', 'Alby & the diamonds', 'I Cavalli di Fabio'],
      B: ['I muratori della domenica', 'Volley ma no ghe rivo', 'Potenziali Ritardati', 'Astreo']
    },
    matches: [
      { id: 'pallavolo_gA_0', team1: '4 Salti in Barella', team2: 'Cussine', score1: null, score2: null, date: '2026-05-24', time: '15:00', phase: 'group', group: 'A', isAdvantage: false, played: false, sport: 'pallavolo' },
      { id: 'pallavolo_gB_0', team1: 'I muratori della domenica', team2: 'Volley ma no ghe rivo', score1: null, score2: null, date: '2026-05-24', time: '15:15', phase: 'group', group: 'B', isAdvantage: false, played: false, sport: 'pallavolo' },
      { id: 'pallavolo_gA_1', team1: 'Alby & the diamonds', team2: 'I Cavalli di Fabio', score1: null, score2: null, date: '2026-05-24', time: '15:30', phase: 'group', group: 'A', isAdvantage: false, played: false, sport: 'pallavolo' },
      { id: 'pallavolo_gB_1', team1: 'Potenziali Ritardati', team2: 'Astreo', score1: null, score2: null, date: '2026-05-24', time: '15:45', phase: 'group', group: 'B', isAdvantage: false, played: false, sport: 'pallavolo' },
      { id: 'pallavolo_gA_2', team1: '4 Salti in Barella', team2: 'Alby & the diamonds', score1: null, score2: null, date: '2026-05-24', time: '16:00', phase: 'group', group: 'A', isAdvantage: false, played: false, sport: 'pallavolo' },
      { id: 'pallavolo_gB_2', team1: 'I muratori della domenica', team2: 'Potenziali Ritardati', score1: null, score2: null, date: '2026-05-24', time: '16:15', phase: 'group', group: 'B', isAdvantage: false, played: false, sport: 'pallavolo' },
      { id: 'pallavolo_gA_3', team1: 'Cussine', team2: 'I Cavalli di Fabio', score1: null, score2: null, date: '2026-05-24', time: '16:30', phase: 'group', group: 'A', isAdvantage: false, played: false, sport: 'pallavolo' },
      { id: 'pallavolo_gB_3', team1: 'Volley ma no ghe rivo', team2: 'Astreo', score1: null, score2: null, date: '2026-05-24', time: '16:45', phase: 'group', group: 'B', isAdvantage: false, played: false, sport: 'pallavolo' },
      { id: 'pallavolo_gA_4', team1: '4 Salti in Barella', team2: 'I Cavalli di Fabio', score1: null, score2: null, date: '2026-05-24', time: '17:00', phase: 'group', group: 'A', isAdvantage: false, played: false, sport: 'pallavolo' },
      { id: 'pallavolo_gB_4', team1: 'I muratori della domenica', team2: 'Astreo', score1: null, score2: null, date: '2026-05-24', time: '17:15', phase: 'group', group: 'B', isAdvantage: false, played: false, sport: 'pallavolo' },
      { id: 'pallavolo_gA_5', team1: 'Cussine', team2: 'Alby & the diamonds', score1: null, score2: null, date: '2026-05-24', time: '17:30', phase: 'group', group: 'A', isAdvantage: false, played: false, sport: 'pallavolo' },
      { id: 'pallavolo_gB_5', team1: 'Volley ma no ghe rivo', team2: 'Potenziali Ritardati', score1: null, score2: null, date: '2026-05-24', time: '17:45', phase: 'group', group: 'B', isAdvantage: false, played: false, sport: 'pallavolo' },
      { id: 'pallavolo_quarterFinal_0', team1: '', team2: '', score1: null, score2: null, date: '2026-05-24', time: '18:05', phase: 'quarterFinal', group: null, isAdvantage: false, played: false, sport: 'pallavolo' },
      { id: 'pallavolo_quarterFinal_1', team1: '', team2: '', score1: null, score2: null, date: '2026-05-24', time: '18:20', phase: 'quarterFinal', group: null, isAdvantage: false, played: false, sport: 'pallavolo' },
      { id: 'pallavolo_quarterFinal_2', team1: '', team2: '', score1: null, score2: null, date: '2026-05-24', time: '18:35', phase: 'quarterFinal', group: null, isAdvantage: false, played: false, sport: 'pallavolo' },
      { id: 'pallavolo_quarterFinal_3', team1: '', team2: '', score1: null, score2: null, date: '2026-05-24', time: '18:50', phase: 'quarterFinal', group: null, isAdvantage: false, played: false, sport: 'pallavolo' },
      { id: 'pallavolo_semiFinal_0', team1: '', team2: '', score1: null, score2: null, date: '2026-05-24', time: '19:10', phase: 'semiFinal', group: null, isAdvantage: false, played: false, sport: 'pallavolo' },
      { id: 'pallavolo_semiFinal_1', team1: '', team2: '', score1: null, score2: null, date: '2026-05-24', time: '19:40', phase: 'semiFinal', group: null, isAdvantage: false, played: false, sport: 'pallavolo' },
      { id: 'pallavolo_thirdPlace_0', team1: '', team2: '', score1: null, score2: null, date: '2026-05-24', time: '20:15', phase: 'thirdPlace', group: null, isAdvantage: false, played: false, sport: 'pallavolo' },
      { id: 'pallavolo_final_0', team1: '', team2: '', score1: null, score2: null, date: '2026-05-24', time: '20:50', phase: 'final', group: null, isAdvantage: false, played: false, sport: 'pallavolo' }
    ]
  },
  basket: {
    configured: true,
    groups: {
      A: ['Patochi', 'Galli Cedroni', 'Penicotteri', 'Random six'],
      B: ['Le bimbe di Stank', 'Movimento 5 Falli', 'Falli Quantici', 'Economia']
    },
    matches: [
      { id: 'basket_gA_0', team1: 'Patochi', team2: 'Galli Cedroni', score1: null, score2: null, date: '2026-05-24', time: '15:00', phase: 'group', group: 'A', isAdvantage: false, played: false, sport: 'basket' },
      { id: 'basket_gB_0', team1: 'Le bimbe di Stank', team2: 'Movimento 5 Falli', score1: null, score2: null, date: '2026-05-24', time: '15:10', phase: 'group', group: 'B', isAdvantage: false, played: false, sport: 'basket' },
      { id: 'basket_gA_1', team1: 'Penicotteri', team2: 'Random six', score1: null, score2: null, date: '2026-05-24', time: '15:20', phase: 'group', group: 'A', isAdvantage: false, played: false, sport: 'basket' },
      { id: 'basket_gB_1', team1: 'Falli Quantici', team2: 'Economia', score1: null, score2: null, date: '2026-05-24', time: '15:30', phase: 'group', group: 'B', isAdvantage: false, played: false, sport: 'basket' },
      { id: 'basket_gA_2', team1: 'Patochi', team2: 'Penicotteri', score1: null, score2: null, date: '2026-05-24', time: '15:40', phase: 'group', group: 'A', isAdvantage: false, played: false, sport: 'basket' },
      { id: 'basket_gB_2', team1: 'Le bimbe di Stank', team2: 'Falli Quantici', score1: null, score2: null, date: '2026-05-24', time: '15:50', phase: 'group', group: 'B', isAdvantage: false, played: false, sport: 'basket' },
      { id: 'basket_gA_3', team1: 'Galli Cedroni', team2: 'Random six', score1: null, score2: null, date: '2026-05-24', time: '16:00', phase: 'group', group: 'A', isAdvantage: false, played: false, sport: 'basket' },
      { id: 'basket_gB_3', team1: 'Movimento 5 Falli', team2: 'Economia', score1: null, score2: null, date: '2026-05-24', time: '16:10', phase: 'group', group: 'B', isAdvantage: false, played: false, sport: 'basket' },
      { id: 'basket_gA_4', team1: 'Patochi', team2: 'Random six', score1: null, score2: null, date: '2026-05-24', time: '16:20', phase: 'group', group: 'A', isAdvantage: false, played: false, sport: 'basket' },
      { id: 'basket_gB_4', team1: 'Le bimbe di Stank', team2: 'Economia', score1: null, score2: null, date: '2026-05-24', time: '16:30', phase: 'group', group: 'B', isAdvantage: false, played: false, sport: 'basket' },
      { id: 'basket_gA_5', team1: 'Galli Cedroni', team2: 'Penicotteri', score1: null, score2: null, date: '2026-05-24', time: '16:40', phase: 'group', group: 'A', isAdvantage: false, played: false, sport: 'basket' },
      { id: 'basket_gB_5', team1: 'Movimento 5 Falli', team2: 'Falli Quantici', score1: null, score2: null, date: '2026-05-24', time: '16:50', phase: 'group', group: 'B', isAdvantage: false, played: false, sport: 'basket' },
      { id: 'basket_quarterFinal_0', team1: '', team2: '', score1: null, score2: null, date: '2026-05-24', time: '17:10', phase: 'quarterFinal', group: null, isAdvantage: false, played: false, sport: 'basket' },
      { id: 'basket_quarterFinal_1', team1: '', team2: '', score1: null, score2: null, date: '2026-05-24', time: '17:20', phase: 'quarterFinal', group: null, isAdvantage: false, played: false, sport: 'basket' },
      { id: 'basket_quarterFinal_2', team1: '', team2: '', score1: null, score2: null, date: '2026-05-24', time: '17:30', phase: 'quarterFinal', group: null, isAdvantage: false, played: false, sport: 'basket' },
      { id: 'basket_quarterFinal_3', team1: '', team2: '', score1: null, score2: null, date: '2026-05-24', time: '17:40', phase: 'quarterFinal', group: null, isAdvantage: false, played: false, sport: 'basket' },
      { id: 'basket_semiFinal_0', team1: '', team2: '', score1: null, score2: null, date: '2026-05-24', time: '18:00', phase: 'semiFinal', group: null, isAdvantage: false, played: false, sport: 'basket' },
      { id: 'basket_semiFinal_1', team1: '', team2: '', score1: null, score2: null, date: '2026-05-24', time: '18:15', phase: 'semiFinal', group: null, isAdvantage: false, played: false, sport: 'basket' },
      { id: 'basket_thirdPlace_0', team1: '', team2: '', score1: null, score2: null, date: '2026-05-24', time: '18:40', phase: 'thirdPlace', group: null, isAdvantage: false, played: false, sport: 'basket' },
      { id: 'basket_final_0', team1: '', team2: '', score1: null, score2: null, date: '2026-05-24', time: '19:10', phase: 'final', group: null, isAdvantage: false, played: false, sport: 'basket' }
    ]
  },
  billiardino: {
    configured: true,
    teams: ['Ostreghéta', 'Scarsenal', 'Pings', 'paSquali', 'Torciti Testiculati', 'Foot', 'Pasta e Pesto', 'DNA-miche', 'Snicky Team', 'Aston Birra'],
    matches: [
      { id: 'billiardino_league_0', team1: 'Ostreghéta', team2: 'Scarsenal', score1: null, score2: null, date: '2026-05-24', time: '15:30 - Campo 1', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_1', team1: 'Pings', team2: 'paSquali', score1: null, score2: null, date: '2026-05-24', time: '15:30 - Campo 2', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_2', team1: 'Torciti Testiculati', team2: 'Foot', score1: null, score2: null, date: '2026-05-24', time: '15:45 - Campo 1', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_3', team1: 'Pasta e Pesto', team2: 'DNA-miche', score1: null, score2: null, date: '2026-05-24', time: '15:45 - Campo 2', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_4', team1: 'Ostreghéta', team2: 'Pings', score1: null, score2: null, date: '2026-05-24', time: '16:00 - Campo 1', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_5', team1: 'Snicky Team', team2: 'Aston Birra', score1: null, score2: null, date: '2026-05-24', time: '16:00 - Campo 2', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_6', team1: 'Scarsenal', team2: 'paSquali', score1: null, score2: null, date: '2026-05-24', time: '16:15 - Campo 1', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_7', team1: 'Torciti Testiculati', team2: 'Pasta e Pesto', score1: null, score2: null, date: '2026-05-24', time: '16:15 - Campo 2', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_8', team1: 'Ostreghéta', team2: 'Snicky Team', score1: null, score2: null, date: '2026-05-24', time: '16:30 - Campo 1', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_9', team1: 'Foot', team2: 'DNA-miche', score1: null, score2: null, date: '2026-05-24', time: '16:30 - Campo 2', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_10', team1: 'Scarsenal', team2: 'Aston Birra', score1: null, score2: null, date: '2026-05-24', time: '16:45 - Campo 1', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_11', team1: 'Pings', team2: 'Torciti Testiculati', score1: null, score2: null, date: '2026-05-24', time: '16:45 - Campo 2', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_12', team1: 'paSquali', team2: 'Foot', score1: null, score2: null, date: '2026-05-24', time: '17:00 - Campo 1', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_13', team1: 'Pasta e Pesto', team2: 'Snicky Team', score1: null, score2: null, date: '2026-05-24', time: '17:00 - Campo 2', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_14', team1: 'Ostreghéta', team2: 'paSquali', score1: null, score2: null, date: '2026-05-24', time: '17:15 - Campo 1', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_15', team1: 'DNA-miche', team2: 'Aston Birra', score1: null, score2: null, date: '2026-05-24', time: '17:15 - Campo 2', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_16', team1: 'Scarsenal', team2: 'Torciti Testiculati', score1: null, score2: null, date: '2026-05-24', time: '17:30 - Campo 1', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_17', team1: 'Pings', team2: 'Foot', score1: null, score2: null, date: '2026-05-24', time: '17:30 - Campo 2', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_18', team1: 'Pasta e Pesto', team2: 'Aston Birra', score1: null, score2: null, date: '2026-05-24', time: '17:45 - Campo 1', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_19', team1: 'DNA-miche', team2: 'Snicky Team', score1: null, score2: null, date: '2026-05-24', time: '17:45 - Campo 2', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_20', team1: 'Ostreghéta', team2: 'Torciti Testiculati', score1: null, score2: null, date: '2026-05-24', time: '18:00 - Campo 1', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_21', team1: 'Scarsenal', team2: 'Foot', score1: null, score2: null, date: '2026-05-24', time: '18:00 - Campo 2', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_22', team1: 'Pings', team2: 'Pasta e Pesto', score1: null, score2: null, date: '2026-05-24', time: '18:15 - Campo 1', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_23', team1: 'paSquali', team2: 'DNA-miche', score1: null, score2: null, date: '2026-05-24', time: '18:15 - Campo 2', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_24', team1: 'Ostreghéta', team2: 'Foot', score1: null, score2: null, date: '2026-05-24', time: '18:30 - Campo 1', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_25', team1: 'Scarsenal', team2: 'Pasta e Pesto', score1: null, score2: null, date: '2026-05-24', time: '18:30 - Campo 2', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_26', team1: 'Pings', team2: 'DNA-miche', score1: null, score2: null, date: '2026-05-24', time: '18:45 - Campo 1', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_27', team1: 'Torciti Testiculati', team2: 'Snicky Team', score1: null, score2: null, date: '2026-05-24', time: '18:45 - Campo 2', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_28', team1: 'Ostreghéta', team2: 'Pasta e Pesto', score1: null, score2: null, date: '2026-05-24', time: '19:00 - Campo 1', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_29', team1: 'paSquali', team2: 'Aston Birra', score1: null, score2: null, date: '2026-05-24', time: '19:00 - Campo 2', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_30', team1: 'Scarsenal', team2: 'DNA-miche', score1: null, score2: null, date: '2026-05-24', time: '19:15 - Campo 1', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_31', team1: 'Foot', team2: 'Snicky Team', score1: null, score2: null, date: '2026-05-24', time: '19:15 - Campo 2', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_32', team1: 'Ostreghéta', team2: 'DNA-miche', score1: null, score2: null, date: '2026-05-24', time: '19:30 - Campo 1', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_33', team1: 'Torciti Testiculati', team2: 'Aston Birra', score1: null, score2: null, date: '2026-05-24', time: '19:30 - Campo 2', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_34', team1: 'Pings', team2: 'Snicky Team', score1: null, score2: null, date: '2026-05-24', time: '19:45 - Campo 1', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_35', team1: 'paSquali', team2: 'Pasta e Pesto', score1: null, score2: null, date: '2026-05-24', time: '19:45 - Campo 2', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_36', team1: 'Scarsenal', team2: 'Snicky Team', score1: null, score2: null, date: '2026-05-24', time: '20:00 - Campo 1', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_37', team1: 'Pings', team2: 'Aston Birra', score1: null, score2: null, date: '2026-05-24', time: '20:00 - Campo 2', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_38', team1: 'Ostreghéta', team2: 'Aston Birra', score1: null, score2: null, date: '2026-05-24', time: '20:15 - Campo 1', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_39', team1: 'paSquali', team2: 'Torciti Testiculati', score1: null, score2: null, date: '2026-05-24', time: '20:15 - Campo 2', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_40', team1: 'Torciti Testiculati', team2: 'DNA-miche', score1: null, score2: null, date: '2026-05-24', time: '20:30 - Campo 1', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_41', team1: 'Foot', team2: 'Pasta e Pesto', score1: null, score2: null, date: '2026-05-24', time: '20:30 - Campo 2', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_42', team1: 'Scarsenal', team2: 'Pings', score1: null, score2: null, date: '2026-05-24', time: '20:45 - Campo 1', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_43', team1: 'paSquali', team2: 'Snicky Team', score1: null, score2: null, date: '2026-05-24', time: '20:45 - Campo 2', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' },
      { id: 'billiardino_league_44', team1: 'Foot', team2: 'Aston Birra', score1: null, score2: null, date: '2026-05-24', time: '21:00 - Campo 1', phase: 'league', group: null, isAdvantage: false, played: false, sport: 'billiardino' }
    ]
  }
};

function getState() {
  try {
    const d = localStorage.getItem(STORAGE_KEY);
    if (d) {
      const parsed = JSON.parse(d);
      if (parsed && typeof parsed === 'object') {
        // Se la versione è corretta, controlla la presenza di tutte le chiavi
        if (
          parsed.version === DEFAULT_STATE.version &&
          parsed.calcio &&
          parsed.pallavolo &&
          parsed.basket &&
          parsed.billiardino
        ) {
          return parsed;
        }
        
        // Se la versione è precedente o mancano chiavi fondamentali, esegui una migrazione NON DISTRUTTIVA
        console.log('🔄 Trovata versione precedente dello stato. Eseguo la migrazione non distruttiva...');
        const migrated = JSON.parse(JSON.stringify(DEFAULT_STATE));
        
        // Preserva i dati del torneo precedentemente configurato solo se ha risultati reali inseriti,
        // altrimenti carichiamo il nuovo calendario ufficiale precompilato!
        if (parsed.calcio && parsed.calcio.configured) {
          migrated.calcio = parsed.calcio;
        }
        if (parsed.pallavolo && parsed.pallavolo.configured) {
          migrated.pallavolo = parsed.pallavolo;
        }
        if (parsed.basket && parsed.basket.configured) {
          migrated.basket = parsed.basket;
        }
        if (parsed.billiardino && parsed.billiardino.configured && parsed.billiardino.teams && parsed.billiardino.teams.length === 10) {
          migrated.billiardino = parsed.billiardino;
        }
        
        migrated.version = DEFAULT_STATE.version;
        migrated.lastUpdated = typeof parsed.lastUpdated === 'number' ? parsed.lastUpdated : 0;
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
    }
    
    const fresh = JSON.parse(JSON.stringify(DEFAULT_STATE));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  } catch { 
    return JSON.parse(JSON.stringify(DEFAULT_STATE)); 
  }
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
      let activeState = cloudState;
      
      // Valida la struttura dello stato scaricato dal cloud prima di applicarlo
      if (
        !cloudState.calcio ||
        !cloudState.pallavolo ||
        !cloudState.basket ||
        !cloudState.billiardino
      ) {
        console.warn('⚠️ Lo stato del database cloud è corrotto o non compatibile. Ignorato.');
        return;
      }
      
      // Se lo stato cloud ha una versione diversa, lo migra in-place non distruttivamente
      if (cloudState.version !== DEFAULT_STATE.version) {
        console.log('🔄 Trovato stato cloud di una versione precedente. Eseguo migrazione in memoria...');
        activeState = JSON.parse(JSON.stringify(DEFAULT_STATE));
        
        if (cloudState.calcio && cloudState.calcio.configured) activeState.calcio = cloudState.calcio;
        if (cloudState.pallavolo && cloudState.pallavolo.configured) activeState.pallavolo = cloudState.pallavolo;
        if (cloudState.basket && cloudState.basket.configured) activeState.basket = cloudState.basket;
        
        if (cloudState.billiardino && cloudState.billiardino.configured && cloudState.billiardino.teams && cloudState.billiardino.teams.length === 10) {
          activeState.billiardino = cloudState.billiardino;
        }
        
        activeState.version = DEFAULT_STATE.version;
        activeState.lastUpdated = typeof cloudState.lastUpdated === 'number' ? cloudState.lastUpdated : Date.now();
        // Non scriviamo sul cloud direttamente per evitare loop o scritture dai client spettatori
      }

      const localState = getState();
      
      // Sincronizza solo se i dati del cloud sono effettivamente più recenti
      const localTS = typeof localState.lastUpdated === 'number' ? localState.lastUpdated : 0;
      const activeTS = typeof activeState.lastUpdated === 'number' ? activeState.lastUpdated : 0;
      
      if (activeTS > localTS) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(activeState));
        console.log('🔄 Dati aggiornati e migrati dal database cloud!');
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
