# 🏆 GiocaLAM

**GiocaLAM** è una Progressive Web App (PWA) moderna, veloce e installabile, progettata per la gestione completa di 4 distinti tornei sportivi (Calcio, Pallavolo, Basket e Biliardino) organizzati da **Lista Autonoma Mente (LAM)**.

L'applicazione presenta un design premium in stile *glassmorphism* ottimizzato per dispositivi mobili e integra un sistema di **sincronizzazione cloud in tempo reale** per consentire al pubblico di seguire risultati e classifiche all'istante su qualsiasi dispositivo.

---

## 🚀 Caratteristiche Principali

*   **📱 PWA Multipiattaforma**: Installabile come un'app nativa su iOS, Android e Desktop. Include un tutorial di installazione interattivo e supporta l'avvio in modalità standalone senza barre del browser.
*   **🏟️ Gestione Multi-Sport**:
    *   **Calcio**: 6 squadre divise in 2 gironi da 3. Calcolo automatico delle semifinali, della finalissima e di una finale di consolazione dedicata alle ultime classificate dei gironi.
    *   **Pallavolo**: 2 gironi da 4 squadre. Quarti di finale incrociati (1A vs 4B, ecc.), semifinali, finale 3°/4° posto e finalissima. Partite dei gironi a set unico ai 15 punti, fasi finali al meglio dei 3 set.
    *   **Basket**: 2 gironi da 4 squadre. Quarti di finale incrociati (1A vs 4B, ecc.), semifinali, finale 3°/4° posto e finalissima.
    *   **Biliardino**: Campionato a girone unico (9 squadre).
*   **📊 Classifiche Automatiche Intelligenti**: Calcolo automatico dei punti e dei criteri di spareggio (differenza reti/punti, gol fatti) in base al regolamento specifico di ogni sport:
    *   *Calcio/Basket*: Vittoria (3 pt), Pareggio (1 pt), Sconfitta (0 pt).
    *   *Pallavolo/Biliardino*: Vittoria netta (3 pt), Vittoria ai vantaggi (2 pt), Sconfitta ai vantaggi (1 pt), Sconfitta netta (0 pt). Pareggio non ammesso.
*   **⚙️ Pannello Amministratore Protetto**: Accesso riservato tramite password per la configurazione dei nomi delle squadre, la pianificazione di date/orari e l'inserimento rapido dei risultati delle partite.
*   **🌐 Sincronizzazione Cloud in Tempo Reale**: Integrazione con Firebase Realtime Database configurabile direttamente dall'interfaccia grafica dell'Admin. I dati inseriti dall'organizzatore si sincronizzano automaticamente sui dispositivi di tutti gli spettatori.
*   **💾 Funzionamento Offline-First**: In caso di perdita temporanea di connessione, l'applicazione continua a funzionare salvando i dati localmente nel `localStorage`, per poi caricarli sul cloud non appena si torna online.

---

## 🛠️ Stack Tecnologico

*   **Core**: HTML5 semantico e Javascript ES6 (Vanilla JS senza build step).
*   **Styling**: CSS3 personalizzato con variabili, glassmorphism avanzato, palette di colori premium (`#64c4c3`) e layout completamente responsivo.
*   **PWA**: Manifest JSON e Service Worker personalizzato per il caching offline.
*   **Database**: Firebase Realtime Database (tramite REST API nativa `fetch`, leggera e ultra-veloce).

---

## 💻 Installazione Locale

Per avviare il progetto sul tuo computer locale, non è necessario installare dipendenze Node.js. È sufficiente avviare un server locale statico.

Ad esempio, se utilizzi Python:
```bash
# Entra nella cartella del progetto
cd torneo-lam

# Avvia il server statico
python3 -m http.server 8080
```
Ora apri il browser e naviga su `http://localhost:8080`.

---

## 🌐 Pubblicazione online (Vercel)

Il progetto è predisposto per essere distribuito su **Vercel** gratuitamente. 
Una volta collegato il repository di GitHub a Vercel, ogni comando di `git push` aggiornerà automaticamente il sito web pubblico in meno di 10 secondi.

---

## 📄 Licenza and Credits

Progetto realizzato con orgoglio per **Lista Autonoma Mente (LAM)**.  
Tutti i diritti sul logo e sul marchio appartengono a Lista Autonoma Mente.
