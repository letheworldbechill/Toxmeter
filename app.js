// app.js — Toxxometer + Early + Reality (eigener Screen) + History + Export + DE/EN + Theme
// Odin-Modus: präzise, robust, ohne Schnickschnack.

const EARLY_QUESTIONS = [
  {de:"Hört die Person mir aktiv zu?", en:"Does the person actively listen to me?"},
  {de:"Akzeptiert sie mein 'Nein' ohne Gegenreaktion?", en:"Does she accept my 'No' without pushback?"},
  {de:"Macht sie Versprechen, die sie nicht hält?", en:"Does she make promises she doesn't keep?"},
  {de:"Versucht sie Kontrolle über Entscheidungen oder Gefühle auszuüben?", en:"Does she try to control decisions or feelings?"},
  {de:"Lässt sie mich mich ausdrücken?", en:"Does she let me express myself?"},
  {de:"Verdreht oder übertreibt sie Tatsachen?", en:"Does she twist or exaggerate facts?"},
  {de:"Reagiert sie manipulativ, wenn sie nicht bekommt, was sie will?", en:"Does she react manipulatively when she doesn't get what she wants?"},
  {de:"Vermeidet sie Verantwortung für ihr Verhalten?", en:"Does she avoid responsibility for her behavior?"},
  {de:"Zeigt sie Empathie für andere oder nur für sich selbst?", en:"Does she show empathy for others or only herself?"},
  {de:"Wiederholt sich ein Muster von Drama oder Schuld?", en:"Does a pattern of drama or blame repeat?"}
];

const TOX_QUESTIONS = [
  {de:"Fühlte ich mich kleiner oder falsch nach dem Kontakt?", en:"Did I feel small or wrong after the encounter?"},
  {de:"Musste ich mich rechtfertigen oder erklären?", en:"Did I have to justify or explain myself?"},
  {de:"Wurde mein 'Nein' ignoriert oder bestraft?", en:"Was my 'No' ignored or punished?"},
  {de:"War das Verhalten abhängig davon, ob die Person etwas bekommt?", en:"Was the behavior dependent on getting something?"},
  {de:"Wurde Schuld verschoben ('wegen dir ...')?", en:"Was blame shifted ('because of you...')?"},
  {de:"Musste ich Energie geben, ohne etwas zurückzubekommen?", en:"Did I give energy without getting anything back?"},
  {de:"Habe ich Angst, ehrlich zu sein?", en:"Am I afraid to be honest?"}
];

const REALITY_QUESTIONS = [
  {de:"Gibt sie konsistente Aussagen (keine Widersprüche)?", en:"Does she make consistent statements (no contradictions)?"},
  {de:"Zeigt sie Reue oder übernimmt Verantwortung für Fehler?", en:"Does she show remorse or take responsibility for mistakes?"},
  {de:"Gibt es klare Beweise für wiederholtes Lügen?", en:"Is there clear evidence of repeated lying?"},
  {de:"Versucht sie systematisch, dich zu isolieren?", en:"Does she try systematically to isolate you?"},
  {de:"Respektiert sie deine Zeit und Verpflichtungen?", en:"Does she respect your time and commitments?"},
  {de:"Dreht sie Gespräche so, dass du dich schuldig fühlst?", en:"Does she twist conversations to make you feel guilty?"},
  {de:"Gibt es Anzeichen von Planung hinter ihrem Verhalten?", en:"Are there signs of planning behind her behavior?"},
  {de:"Nutzt sie deinen guten Willen mehrfach aus?", en:"Does she repeatedly exploit your goodwill?"},
  {de:"Gibt sie ehrliche, nachvollziehbare Erklärungen?", en:"Does she give honest, coherent explanations for her behavior?"},
  {de:"Haben enge Personen ähnliche Probleme mit ihr berichtet?", en:"Do close people report similar problems?"},
  {de:"Versucht sie, andere gegen dich aufzubringen (Triangulation)?", en:"Does she try to turn others against you (triangulation)?"},
  {de:"Gibt es finanzielle oder materielle Ausnutzung?", en:"Is there financial or material exploitation?"},
  {de:"Reagiert sie aggressiv bei Grenzen?", en:"Does she react aggressively to boundaries?"},
  {de:"Profitieren Dritte zu deinen Lasten?", en:"Do third parties benefit at your expense?"},
  {de:"Wird deine Wahrnehmung regelmäßig infrage gestellt?", en:"Is your perception regularly questioned or devalued?"},
  {de:"Wiederholt sich das Muster trotz Absprachen?", en:"Does the pattern repeat despite clear agreements?"},
  {de:"Schiebt sie Verantwortung immer auf äußere Umstände?", en:"Does she always shift responsibility onto circumstances?"},
  {de:"Reagiert sie manipulativ wenn sie Unrecht hat?", en:"Does she react manipulatively when she's wrong?"},
  {de:"Passt sie ihre Geschichten je nach Publikum an?", en:"Does she adapt stories to the audience?"},
  {de:"Fühlst du dich nach Interaktionen körperlich/psychisch schlechter?", en:"Do you feel physically or mentally worse after interactions?"}
];

// State
let lang = 'de';
let stage = 'early';
let earlyAnswers = Array(EARLY_QUESTIONS.length).fill(null);
let toxAnswers = Array(TOX_QUESTIONS.length).fill(null);
let realityAnswers = Array(REALITY_QUESTIONS.length).fill(null);

// DOM refs
const qContainer = document.getElementById('questions');
const resultEl = document.getElementById('result');
const historyList = document.getElementById('history-list');
const themeToggle = document.getElementById('theme-toggle');
const langSelect = document.getElementById('lang-select');
const exportCsvBtn = document.getElementById('export-csv');
const exportPdfBtn = document.getElementById('export-pdf');
const saveRunBtn = document.getElementById('save-run');
const clearHistoryBtn = document.getElementById('clear-history');
const navEarly = document.getElementById('nav-early');
const navTox = document.getElementById('nav-tox');
const navReality = document.getElementById('nav-reality');

// Helpers
function scrollTop(){ window.scrollTo({top:0,behavior:'smooth'}); }
function makeQuestionBlock(text, onYes, onNo){
  const div = document.createElement('div'); div.className='question';
  const txt = document.createElement('div'); txt.className='q-text'; txt.innerText = text;
  const btns = document.createElement('div'); btns.className='q-buttons';
  const yes = document.createElement('button'); yes.className='btn btn-yes'; yes.innerText = (lang==='de'?'JA':'YES');
  const no = document.createElement('button'); no.className='btn btn-no'; no.innerText = (lang==='de'?'NEIN':'NO');
  yes.addEventListener('click', onYes); no.addEventListener('click', onNo);
  btns.appendChild(yes); btns.appendChild(no); div.appendChild(txt); div.appendChild(btns);
  return div;
}

// Navigation hooks
navEarly.addEventListener('click', ()=>{ renderEarlyQuestions(); });
navTox.addEventListener('click', ()=>{ renderToxQuestions(); });
navReality.addEventListener('click', ()=>{ renderRealityQuestions(); });

// Early
function renderEarlyQuestions(){
  stage='early'; earlyAnswers = Array(EARLY_QUESTIONS.length).fill(null);
  qContainer.innerHTML=''; resultEl.innerHTML='';
  EARLY_QUESTIONS.forEach((q,i)=>{
    const block = makeQuestionBlock(q[lang],
      ()=>{ earlyAnswers[i]=true; block.style.opacity=0.6; setTimeout(()=>block.remove(),220); if(earlyAnswers.every(a=>a!==null)) updateEarlyResult(); },
      ()=>{ earlyAnswers[i]=false; block.style.opacity=0.6; setTimeout(()=>block.remove(),220); if(earlyAnswers.every(a=>a!==null)) updateEarlyResult(); }
    );
    qContainer.appendChild(block);
  });
  scrollTop();
}
function updateEarlyResult(){
  const score = earlyAnswers.filter(a=>a===true).length;
  let text='', level='';
  if(score<=2){ text=(lang==='de'?'✅ Frühe Interaktion: Investition wahrscheinlich lohnend':'✅ Early: likely worthwhile'); level='safe'; }
  else if(score<=4){ text=(lang==='de'?'⚠️ Frühe Warnzeichen: Beobachten':'⚠️ Early: watchful'); level='caution'; }
  else if(score<=6){ text=(lang==='de'?'🟠 Hohe Aufmerksamkeit: Energie begrenzen':'🟠 High attention: limit energy'); level='warning'; }
  else { text=(lang==='de'?'🚨 Sehr riskant: Investition überdenken':'🚨 Very risky: reconsider investing'); level='danger'; }
  resultEl.innerHTML = `<div class='result--${level}'>${text}<div style='margin-top:8px;font-size:0.9rem;opacity:0.9'>${(lang==='de'?'Score':'Score')}: ${score}/${EARLY_QUESTIONS.length}</div></div>`;
  const btn = document.createElement('button'); btn.className='btn btn-no'; btn.innerText = (lang==='de'?'Zum Toxxometer':'To Toxxometer');
  btn.style.marginTop='12px'; btn.addEventListener('click', ()=>renderToxQuestions());
  resultEl.appendChild(btn); scrollTop();
}

// Tox
function renderToxQuestions(){
  stage='tox'; toxAnswers = Array(TOX_QUESTIONS.length).fill(null);
  qContainer.innerHTML=''; resultEl.innerHTML='';
  TOX_QUESTIONS.forEach((q,i)=>{
    const block = makeQuestionBlock(q[lang],
      ()=>{ toxAnswers[i]=true; block.style.opacity=0.6; setTimeout(()=>block.remove(),220); if(toxAnswers.every(a=>a!==null)) updateToxResult(); },
      ()=>{ toxAnswers[i]=false; block.style.opacity=0.6; setTimeout(()=>block.remove(),220); if(toxAnswers.every(a=>a!==null)) updateToxResult(); }
    );
    qContainer.appendChild(block);
  });
  scrollTop();
}
function updateToxResult(){
  const score = toxAnswers.filter(a=>a===true).length;
  let text='', level='';
  if(score<=2){ text=(lang==='de'?'✅ Beziehung wirkt gesund.':'✅ Relationship seems healthy.'); level='safe'; }
  else if(score<=4){ text=(lang==='de'?'⚠️ Warnung: toxische Muster beginnen sich zu zeigen.':'⚠️ Warning: toxic patterns appear.'); level='caution'; }
  else if(score<=6){ text=(lang==='de'?'🟠 Hochrisiko: Grenzen setzen.':'🟠 High risk: set boundaries.'); level='warning'; }
  else { text=(lang==='de'?'🚨 Sehr hochtoxisch: Distanz dringend.':'🚨 Extremely toxic: distance needed.'); level='danger'; }
  resultEl.innerHTML = `<div class='result--${level}'>${text}<div style='margin-top:8px;font-size:0.9rem;opacity:0.9'>${(lang==='de'?'Score':'Score')}: ${score}/${TOX_QUESTIONS.length}</div></div>`;
  const btn = document.createElement('button'); btn.className='btn btn-no'; btn.innerText = (lang==='de'?'Reality Check':'Reality Check');
  btn.style.marginTop='12px'; btn.addEventListener('click', ()=>renderRealityQuestions());
  resultEl.appendChild(btn); scrollTop();
}

// Reality (eigener Screen)
function renderRealityQuestions(){
  stage='reality'; realityAnswers = Array(REALITY_QUESTIONS.length).fill(null);
  qContainer.innerHTML=''; resultEl.innerHTML='';
  REALITY_QUESTIONS.forEach((q,i)=>{
    const block = makeQuestionBlock(q[lang],
      ()=>{ realityAnswers[i]=true; block.style.opacity=0.6; setTimeout(()=>block.remove(),220); if(realityAnswers.every(a=>a!==null)) updateRealityResult(); },
      ()=>{ realityAnswers[i]=false; block.style.opacity=0.6; setTimeout(()=>block.remove(),220); if(realityAnswers.every(a=>a!==null)) updateRealityResult(); }
    );
    qContainer.appendChild(block);
  });
  scrollTop();
}
function updateRealityResult(){
  const score = realityAnswers.filter(a=>a===true).length;
  let text='', level='';
  if(score<=3){ text=(lang==='de'?'✅ Reality Check: Geringe Alarmzeichen — Investition lohnt sich.':'✅ Reality Check: Low alarm — invest.'); level='safe'; }
  else if(score<=7){ text=(lang==='de'?'⚠️ Reality Check: Erste Warnzeichen — vorsichtig investieren.':'⚠️ Reality Check: Initial warnings — be cautious.'); level='caution'; }
  else if(score<=13){ text=(lang==='de'?'🟠 Reality Check: Hohe Wahrscheinlichkeit problematischer Dynamiken — Energie schützen.':'🟠 Reality Check: High likelihood of problematic dynamics — protect energy.'); level='warning'; }
  else { text=(lang==='de'?'🚨 Reality Check: Sehr hohes Risiko — Abbruch/Distanz empfohlen.':'🚨 Reality Check: Very high risk — disengage recommended.'); level='danger'; }
  resultEl.innerHTML = `<div class='result--${level}'>${text}<div style='margin-top:8px;font-size:0.9rem;opacity:0.9'>${(lang==='de'?'Score':'Score')}: ${score}/${REALITY_QUESTIONS.length}</div></div>`;
  scrollTop();
}

// History
function saveRun(){
  const history = JSON.parse(localStorage.getItem('toxx_history')||'[]');
  const entry = { timestamp: new Date().toISOString(), stage, earlyAnswers, toxAnswers, realityAnswers };
  history.unshift(entry); localStorage.setItem('toxx_history', JSON.stringify(history)); renderHistory();
}
function renderHistory(){
  const history = JSON.parse(localStorage.getItem('toxx_history')||'[]');
  historyList.innerHTML='';
  if(history.length===0){ historyList.innerText = (lang==='de'?'Keine Einträge':'No entries'); return; }
  history.forEach((h, idx)=> {
    const div = document.createElement('div'); div.className='history-item';
    const meta = document.createElement('div'); meta.className='history-meta';
    const early = h.earlyAnswers ? h.earlyAnswers.filter(a=>a===true).length : 0;
    const tox = h.toxAnswers ? h.toxAnswers.filter(a=>a===true).length : 0;
    const real = h.realityAnswers ? h.realityAnswers.filter(a=>a===true).length : 0;
    meta.innerText = `${new Date(h.timestamp).toLocaleString()} — ${h.stage} — E:${early} T:${tox} R:${real}`;
    const loadBtn = document.createElement('button'); loadBtn.className='btn btn-no'; loadBtn.innerText = (lang==='de'?'Laden':'Load');
    loadBtn.addEventListener('click', ()=> alert((lang==='de'?'Geladener Eintrag: ':'Loaded entry: ')+new Date(h.timestamp).toLocaleString()+` E:${early} T:${tox} R:${real}`));
    const delBtn = document.createElement('button'); delBtn.className='btn btn-yes'; delBtn.innerText = (lang==='de'?'Löschen':'Delete');
    delBtn.addEventListener('click', ()=> { if(!confirm((lang==='de'?'Eintrag löschen?':'Delete entry?'))) return; history.splice(idx,1); localStorage.setItem('toxx_history', JSON.stringify(history)); renderHistory(); });
    div.appendChild(meta); const controls = document.createElement('div'); controls.style.display='flex'; controls.style.gap='8px'; controls.appendChild(loadBtn); controls.appendChild(delBtn); div.appendChild(controls);
    historyList.appendChild(div);
  });
}
function clearHistory(){ if(confirm(lang==='de'?'History löschen?':'Clear history?')){ localStorage.removeItem('toxx_history'); renderHistory(); } }

// Export
function exportCSV(){
  const history = JSON.parse(localStorage.getItem('toxx_history')||'[]');
  if(history.length===0){ alert(lang==='de'?'Keine Einträge zum Exportieren':'No entries to export'); return; }
  const rows = []; rows.push(['timestamp','stage','early','tox','reality'].join(','));
  history.forEach(h => {
    const early = h.earlyAnswers ? h.earlyAnswers.filter(a=>a===true).length : 0;
    const tox = h.toxAnswers ? h.toxAnswers.filter(a=>a===true).length : 0;
    const real = h.realityAnswers ? h.realityAnswers.filter(a=>a===true).length : 0;
    rows.push([h.timestamp,h.stage,early,tox,real].join(','));
  });
  const csv = rows.join('\n'); const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='toxx_history.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}
function exportPDF(){
  const history = JSON.parse(localStorage.getItem('toxx_history')||'[]');
  if(history.length===0){ alert(lang==='de'?'Keine Einträge zum Exportieren':'No entries to export'); return; }
  let html = '<html><head><meta charset="utf-8"><title>Toxxometer Export</title></head><body>';
  html += `<h2>Toxxometer Export — ${new Date().toLocaleString()}</h2>`;
  history.forEach(h => {
    const early = h.earlyAnswers ? h.earlyAnswers.filter(a=>a===true).length : 0;
    const tox = h.toxAnswers ? h.toxAnswers.filter(a=>a===true).length : 0;
    const real = h.realityAnswers ? h.realityAnswers.filter(a=>a===true).length : 0;
    html += `<div style="margin-bottom:12px;padding:8px;border:1px solid #ccc;">${new Date(h.timestamp).toLocaleString()} — ${h.stage}<br/>Early: ${early}/${EARLY_QUESTIONS.length} — Tox: ${tox}/${TOX_QUESTIONS.length} — Reality: ${real}/${REALITY_QUESTIONS.length}</div>`;
  });
  html += '</body></html>'; const w = window.open('about:blank','_blank'); w.document.write(html); w.document.close(); w.focus();
}

// Theme & Language
themeToggle.addEventListener('click', ()=> { document.body.classList.toggle('light'); localStorage.setItem('toxx_theme', document.body.classList.contains('light') ? 'light' : 'dark'); });
langSelect.addEventListener('change', (e) => { lang = e.target.value; if(stage==='early') renderEarlyQuestions(); else if(stage==='tox') renderToxQuestions(); else renderRealityQuestions(); renderHistory(); });

// Buttons
exportCsvBtn.addEventListener('click', exportCSV);
exportPdfBtn.addEventListener('click', exportPDF);
saveRunBtn.addEventListener('click', ()=> { if(stage==='early' && !earlyAnswers.every(a=>a!==null)){ alert(lang==='de'?'Bitte alle Fragen beantworten':'Please answer all questions'); return; } if(stage==='tox' && !toxAnswers.every(a=>a!==null)){ alert(lang==='de'?'Bitte alle Fragen beantworten':'Please answer all questions'); return; } if(stage==='reality' && !realityAnswers.every(a=>a!==null)){ alert(lang==='de'?'Bitte alle Fragen beantworten':'Please answer all questions'); return; } saveRun(); alert(lang==='de'?'Eintrag gespeichert':'Entry saved'); });
clearHistoryBtn.addEventListener('click', clearHistory);

// Init
(function init(){ if(localStorage.getItem('toxx_theme')==='light') document.body.classList.add('light'); renderEarlyQuestions(); renderHistory(); })();