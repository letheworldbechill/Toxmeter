/* ========================= app.js (erweitert mit Early Investment Check) ========================= */ const EARLY_QUESTIONS = [ {de:"Hört die Person mir aktiv zu?", en:"Does the person actively listen to me?"}, {de:"Akzeptiert sie mein 'Nein' ohne Gegenreaktion?", en:"Does she accept my 'No' without pushback?"}, {de:"Macht sie Versprechen, die sie nicht hält?", en:"Does she make promises she doesn't keep?"}, {de:"Versucht sie Kontrolle über Entscheidungen oder Gefühle auszuüben?", en:"Does she try to control decisions or feelings?"}, {de:"Lässt sie mich mich ausdrücken?", en:"Does she let me express myself?"}, {de:"Verdreht oder übertreibt sie Tatsachen?", en:"Does she twist or exaggerate facts?"}, {de:"Reagiert sie manipulativ, wenn sie nicht bekommt, was sie will?", en:"Does she react manipulatively when she doesn't get what she wants?"}, {de:"Vermeidet sie Verantwortung für ihr Verhalten?", en:"Does she avoid responsibility for her behavior?"}, {de:"Zeigt sie Empathie für andere oder nur für sich selbst?", en:"Does she show empathy for others or only herself?"}, {de:"Wiederholt sich ein Muster von Drama oder Schuld?", en:"Does a pattern of drama or blame repeat?"} ];

let earlyAnswers = Array(EARLY_QUESTIONS.length).fill(null); let earlyScore = 0;

const surveyArea = document.getElementById('survey-area');

function renderEarlyQuestions(){ qContainer.innerHTML=''; EARLY_QUESTIONS.forEach((q,i)=>{ const div = document.createElement('div'); div.className='question'; const txt = document.createElement('div'); txt.className='q-text'; txt.innerText=q[lang]; const btns = document.createElement('div'); btns.className='q-buttons'; const yes = document.createElement('button'); yes.className='btn btn-yes'; yes.innerText='JA'; const no = document.createElement('button'); no.className='btn btn-no'; no.innerText='NEIN';

yes.onclick=()=>{ setEarlyAnswer(i,true); div.style.opacity=0.6; setTimeout(()=>div.remove(),220); };
no.onclick=()=>{ setEarlyAnswer(i,false); div.style.opacity=0.6; setTimeout(()=>div.remove(),220); };

btns.appendChild(yes); btns.appendChild(no); div.appendChild(txt); div.appendChild(btns);
qContainer.appendChild(div);

}); }

function setEarlyAnswer(i,val){ earlyAnswers[i]=val; earlyScore=earlyAnswers.filter(a=>a===true).length; if(earlyAnswers.every(a=>a!==null)) updateEarlyResult(); }

function updateEarlyResult(){ let text='', level=''; if(earlyScore<=2){ text=lang==='de'?'✅ Frühe Interaktion: Wahrscheinlich gesunde Investition':'✅ Early interaction: Likely healthy investment'; level='safe'; } else if(earlyScore<=4){ text=lang==='de'?'⚠️ Frühe Warnzeichen: Beobachten':'⚠️ Early warning signs: Observe'; level='caution'; } else if(earlyScore<=6){ text=lang==='de'?'🟠 Hohe Aufmerksamkeit: Energie zurückhalten':'🟠 High attention needed: Limit energy'; level='warning'; } else { text=lang==='de'?'🚨 Sehr riskant: Investition überdenken':'🚨 Very risky: Reconsider investment'; level='danger'; } resultEl.innerHTML=<div class='result--${level}'>${text}<div style='margin-top:8px;font-size:0.9rem;opacity:0.85'>Score: ${earlyScore}/${EARLY_QUESTIONS.length}</div></div>; }

// Direkt zu Beginn rendern renderEarlyQuestions();
