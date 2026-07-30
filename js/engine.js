/* Engine: state, adaptive difficulty, persistence, rendering, events.
   Reads from the SKILLS registry populated by js/skills/*.js (loaded before this file). */

const STORAGE_KEY = 'smc_progress';

const state = {
  score:0, streak:0, levels:{},
  view:'home',
  skill:null, mode:'coach',
  problem:null, answered:false, correct:false, userAnswer:null
};

function getLevel(key){ return state.levels[key] || 1; }

function loadProgress(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){
      const d = JSON.parse(raw);
      if(d && typeof d === 'object'){
        state.levels = d.levels || {};
        state.score = d.score || 0;
      }
    }
  }catch(e){ /* localStorage unavailable — progress just won't persist */ }
}
function saveProgress(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify({levels:state.levels, score:state.score})); }catch(e){}
}

/* ---------- rendering ---------- */
const app = document.getElementById('app');
function setLeds(){ document.getElementById('score').textContent=state.score; document.getElementById('streak').textContent=state.streak; }

function render(){
  setLeds();
  if(state.view==='home'){ renderHome(); return; }
  renderSkillView();
}

function cardHTML(key,c,i){
  const lvl = getLevel(key);
  return `
    <div class="card" style="--accent:${c.accent};animation-delay:${i*0.06}s" data-action="open" data-skill="${key}">
      <div class="icon">${c.icon}</div>
      <h2>${c.title}</h2>
      <p class="skill">${c.skill}</p>
      <div class="std">${esc(c.std)}</div>
      <div class="lvl">Level ${lvl} of ${c.maxLevel}</div>
      <button class="go" data-action="open" data-skill="${key}">Start →</button>
    </div>`;
}

function renderHome(){
  const domains = {};
  Object.entries(SKILLS).forEach(([k,c])=>{ (domains[c.domain]=domains[c.domain]||[]).push([k,c]); });
  const body = Object.entries(domains).map(([domain, list])=>`
    <h3 class="domain-heading">${esc(domain)}</h3>
    <div class="grid">${list.map(([k,c],i)=>cardHTML(k,c,i)).join('')}</div>
  `).join('');

  app.innerHTML = `
    <p class="tagline">Pick a skill. <b style="color:var(--orange-soft)">Coach</b> mode explains it; <b style="color:var(--cyan)">Play</b> mode gives endless practice that gets harder as you go.</p>
    ${body}`;
}

function renderSkillView(){
  const c = SKILLS[state.skill];
  const lvl = getLevel(state.skill);
  const bodyHTML = state.mode==='coach' ? `<div class="panel">${c.coach}</div>` : renderPlay(c);
  app.innerHTML = `
    <div class="topbar">
      <button class="back" data-action="home">← All skills</button>
      <h2>${esc(c.title)}</h2>
      <span class="lvlpill">Level ${lvl} / ${c.maxLevel}</span>
    </div>
    <div class="toggle">
      <button class="${state.mode==='coach'?'on':''}" data-action="mode" data-mode="coach">Coach</button>
      <button class="${state.mode==='play'?'on':''}" data-action="mode" data-mode="play">Play</button>
    </div>
    ${bodyHTML}`;
}

function renderPlay(c){
  if(!state.problem){ state.problem = c.gen(getLevel(state.skill)); state.answered=false; }
  const p = state.problem;
  const head = `
    ${p.pre?`<div style="color:var(--muted);font-size:14px;margin-bottom:4px">${esc(p.pre)}</div>`:''}
    ${p.data?`<div style="font-family:var(--mono);font-size:22px;font-weight:700;letter-spacing:1px;margin-bottom:12px">${esc(p.data)}</div>`:''}
    ${p.dotplot?p.dotplot:''}
    ${p.stack?p.stack:''}
    <div class="qtext">${esc(p.question)}</div>`;

  let controls;
  if(state.answered){
    controls = feedbackHTML(p);
  } else if(p.kind==='bool'){
    controls = `<div class="answers">
      <button class="opt" data-action="ans-bool" data-val="true">Statistical</button>
      <button class="opt" data-action="ans-bool" data-val="false">Not statistical</button>
    </div>`;
  } else if(p.kind==='choice'){
    controls = `<div class="answers">${p.choices.map((ch,i)=>`<button class="opt" data-action="ans-choice" data-idx="${i}">${esc(ch)}</button>`).join('')}</div>`;
  } else if(p.kind==='frac'){
    controls = `<div class="numrow fracrow">
      <input id="numInput" type="text" inputmode="numeric" autocomplete="off" placeholder="num">
      <span class="fracbar">/</span>
      <input id="denInput" type="text" inputmode="numeric" autocomplete="off" placeholder="denom">
      <button class="check" data-action="check-frac">Check</button>
    </div>`;
  } else if(p.kind==='divrem'){
    controls = `<div class="numrow divremrow">
      <input id="qInput" type="text" inputmode="numeric" autocomplete="off" placeholder="quotient">
      <span class="fracbar">R</span>
      <input id="rInput" type="text" inputmode="numeric" autocomplete="off" placeholder="remainder">
      <button class="check" data-action="check-divrem">Check</button>
    </div>`;
  } else if(p.kind==='ratio'){
    controls = `<div class="numrow fracrow">
      <input id="ratioAInput" type="text" inputmode="numeric" autocomplete="off" placeholder="first">
      <span class="fracbar">:</span>
      <input id="ratioBInput" type="text" inputmode="numeric" autocomplete="off" placeholder="second">
      <button class="check" data-action="check-ratio">Check</button>
    </div>`;
  } else if(p.kind==='point'){
    controls = `<div class="numrow fracrow">
      <input id="xInput" type="text" autocomplete="off" placeholder="x">
      <span class="fracbar">,</span>
      <input id="yInput" type="text" autocomplete="off" placeholder="y">
      <button class="check" data-action="check-point">Check</button>
    </div>`;
  } else {
    controls = `<div class="numrow">
      <input id="numInput" type="text" inputmode="numeric" autocomplete="off" placeholder="Type your answer">
      <button class="check" data-action="check">Check</button>
    </div>`;
  }
  return `<div class="panel">${head}${controls}</div>`;
}

function displayAnswer(p){
  if(p.kind==='bool') return p.answer?'Statistical':'Not statistical';
  if(p.kind==='choice') return p.choices[p.answer];
  if(p.kind==='frac') return fracLabel(p.answer[0], p.answer[1]);
  if(p.kind==='divrem') return `${p.answer.q} R ${p.answer.r}`;
  if(p.kind==='ratio') return `${p.answer[0]}:${p.answer[1]}`;
  if(p.kind==='point') return `(${p.answer[0]}, ${p.answer[1]})`;
  return p.answer;
}

function feedbackHTML(p){
  let optsBack = "";
  if(p.kind==='bool'){
    optsBack = `<div class="answers" style="margin-bottom:4px">
      <button class="opt ${p.answer?'right':(state.userAnswer===true?'wrong':'')}" disabled>Statistical</button>
      <button class="opt ${!p.answer?'right':(state.userAnswer===false?'wrong':'')}" disabled>Not statistical</button>
    </div>`;
  } else if(p.kind==='choice'){
    optsBack = `<div class="answers" style="margin-bottom:4px">${p.choices.map((ch,i)=>{
      const cls = i===p.answer?'right':(i===state.userAnswer?'wrong':'');
      return `<button class="opt ${cls}" disabled>${esc(ch)}</button>`;
    }).join('')}</div>`;
  }
  const head = state.correct ? rnd(PRAISE) : "Not quite";
  const lead = state.correct
    ? `<div class="why">Why: ${p.why}</div>`
    : `<div class="why">The answer is <b>${esc(displayAnswer(p))}</b>. ${p.why}</div>`;
  return `${optsBack}
    <div class="feedback ${state.correct?'good':'bad'}">
      <div class="head">${head}</div>
      ${lead}
    </div>
    <button class="next" data-action="next">Next play →</button>`;
}

/* ---------- scoring & adaptive level ---------- */
function updateResult(correct){
  state.correct = correct;
  if(correct){ state.score++; state.streak++; } else { state.streak = 0; }
  const key = state.skill, c = SKILLS[key];
  let lvl = getLevel(key);
  lvl = correct ? Math.min(c.maxLevel, lvl+1) : Math.max(1, lvl-1);
  state.levels[key] = lvl;
  saveProgress();
}
function answer(correct){ if(state.answered) return; updateResult(correct); state.answered=true; render(); }

/* ---------- events ---------- */
document.addEventListener('click', e=>{
  const el = e.target.closest('[data-action]'); if(!el) return;
  const a = el.dataset.action;
  if(a==='home'){ state.view='home'; state.skill=null; state.problem=null; state.answered=false; state.mode='coach'; render(); }
  else if(a==='open'){ state.view='skill'; state.skill=el.dataset.skill; state.mode='coach'; state.problem=null; state.answered=false; render(); }
  else if(a==='mode'){ state.mode=el.dataset.mode; state.problem=null; state.answered=false; render(); }
  else if(a==='ans-bool'){ state.userAnswer=(el.dataset.val==='true'); answer(state.userAnswer===state.problem.answer); }
  else if(a==='ans-choice'){ const i=+el.dataset.idx; state.userAnswer=i; answer(i===state.problem.answer); }
  else if(a==='check'){
    const inp=document.getElementById('numInput'); if(!inp) return;
    const v=inp.value.trim(); if(v===''||isNaN(Number(v))){ inp.focus(); return; }
    state.userAnswer=Number(v);
    answer(Math.abs(Number(v)-state.problem.answer) < 0.005);
  }
  else if(a==='check-frac'){
    const ni=document.getElementById('numInput'), di=document.getElementById('denInput');
    if(!ni||!di) return;
    if(ni.value.trim()===''||di.value.trim()===''){ (ni.value.trim()===''?ni:di).focus(); return; }
    const un=Number(ni.value.trim()), ud=Number(di.value.trim());
    if(isNaN(un)||isNaN(ud)||ud===0){ di.focus(); return; }
    state.userAnswer=[un,ud];
    const [an,ad] = state.problem.answer;
    answer(fracEq(un,ud,an,ad));
  }
  else if(a==='check-divrem'){
    const qi=document.getElementById('qInput'), rin=document.getElementById('rInput');
    if(!qi||!rin) return;
    if(qi.value.trim()===''||rin.value.trim()===''){ (qi.value.trim()===''?qi:rin).focus(); return; }
    const uq=Number(qi.value.trim()), ur=Number(rin.value.trim());
    if(isNaN(uq)||isNaN(ur)){ qi.focus(); return; }
    state.userAnswer={q:uq,r:ur};
    answer(uq===state.problem.answer.q && ur===state.problem.answer.r);
  }
  else if(a==='check-ratio'){
    const ai=document.getElementById('ratioAInput'), bi=document.getElementById('ratioBInput');
    if(!ai||!bi) return;
    if(ai.value.trim()===''||bi.value.trim()===''){ (ai.value.trim()===''?ai:bi).focus(); return; }
    const ua=Number(ai.value.trim()), ub=Number(bi.value.trim());
    if(isNaN(ua)||isNaN(ub)||ub===0){ bi.focus(); return; }
    state.userAnswer=[ua,ub];
    const [aa,ab] = state.problem.answer;
    answer(fracEq(ua,ub,aa,ab));
  }
  else if(a==='check-point'){
    const xi=document.getElementById('xInput'), yi=document.getElementById('yInput');
    if(!xi||!yi) return;
    if(xi.value.trim()===''||yi.value.trim()===''){ (xi.value.trim()===''?xi:yi).focus(); return; }
    const ux=Number(xi.value.trim()), uy=Number(yi.value.trim());
    if(isNaN(ux)||isNaN(uy)){ xi.focus(); return; }
    state.userAnswer=[ux,uy];
    const [ax,ay] = state.problem.answer;
    answer(ux===ax && uy===ay);
  }
  else if(a==='next'){ state.problem=SKILLS[state.skill].gen(getLevel(state.skill)); state.answered=false; render(); }
  else if(a==='reset'){ state.score=0; state.streak=0; setLeds(); saveProgress(); }
});

document.addEventListener('keydown', e=>{
  if(e.key!=='Enter' || state.view!=='skill' || state.mode!=='play' || state.answered) return;
  const p = state.problem; if(!p) return;
  if(p.kind==='frac'){
    const ni=document.getElementById('numInput'), di=document.getElementById('denInput');
    if(ni&&di&&ni.value.trim()!==''&&di.value.trim()!==''){
      const un=Number(ni.value.trim()), ud=Number(di.value.trim());
      if(!isNaN(un)&&!isNaN(ud)&&ud!==0){ state.userAnswer=[un,ud]; answer(fracEq(un,ud,p.answer[0],p.answer[1])); }
    }
  } else if(p.kind==='divrem'){
    const qi=document.getElementById('qInput'), rin=document.getElementById('rInput');
    if(qi&&rin&&qi.value.trim()!==''&&rin.value.trim()!==''){
      const uq=Number(qi.value.trim()), ur=Number(rin.value.trim());
      if(!isNaN(uq)&&!isNaN(ur)){ state.userAnswer={q:uq,r:ur}; answer(uq===p.answer.q && ur===p.answer.r); }
    }
  } else if(p.kind==='ratio'){
    const ai=document.getElementById('ratioAInput'), bi=document.getElementById('ratioBInput');
    if(ai&&bi&&ai.value.trim()!==''&&bi.value.trim()!==''){
      const ua=Number(ai.value.trim()), ub=Number(bi.value.trim());
      if(!isNaN(ua)&&!isNaN(ub)&&ub!==0){ state.userAnswer=[ua,ub]; answer(fracEq(ua,ub,p.answer[0],p.answer[1])); }
    }
  } else if(p.kind==='point'){
    const xi=document.getElementById('xInput'), yi=document.getElementById('yInput');
    if(xi&&yi&&xi.value.trim()!==''&&yi.value.trim()!==''){
      const ux=Number(xi.value.trim()), uy=Number(yi.value.trim());
      if(!isNaN(ux)&&!isNaN(uy)){ state.userAnswer=[ux,uy]; answer(ux===p.answer[0] && uy===p.answer[1]); }
    }
  } else if(p.kind==='num'){
    const inp=document.getElementById('numInput');
    if(inp){ const v=inp.value.trim(); if(v!==''&&!isNaN(Number(v))){ state.userAnswer=Number(v); answer(Math.abs(Number(v)-p.answer)<0.005); } }
  }
});

loadProgress();
render();
