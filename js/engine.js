/* Engine: state, adaptive difficulty, persistence, rendering, events.
   Reads from the SKILLS registry populated by js/skills/*.js (loaded before this file). */

const STORAGE_KEY = 'smc_progress';

const state = {
  score:0, streak:0, levels:{},
  view:'home',
  domain:null, skill:null, scenarioKey:null,
  problem:null, answered:false, correct:false, userAnswer:null,
  history:[], testSessions:[], test:null, lastTestSession:null, confirmClear:false
};

/* Test Mode: a fixed-length quiz that starts at level 1 and moves as a single
   shared difficulty dial (up on correct, down on wrong) across a random skill
   drawn from every domain each question — unlike regular Play, which tracks
   each skill's level separately and stays within one domain. */
const TEST_LENGTH = 30;

const HISTORY_CAP = 500;      // bounds localStorage growth from per-question logging
const TESTSESSIONS_CAP = 20;

/* ---------- Math Score: an adaptive ability estimate for Test Mode ----------
   Modeled on how NWEA MAP computes a RIT score — not an equated or validated
   clone of it (there's no norm sample behind this), just the same underlying
   idea: every item has a difficulty, every response updates a running ability
   estimate by how much that response beat or missed the odds implied by the
   gap between ability and that item's difficulty, and the update shrinks as
   more responses accumulate so the estimate settles instead of oscillating.

   Difficulty comes from two things already in the data: which grade(s) a
   skill's CCSS standard names (parsed out of c.std, e.g. "6.RP.A.1" -> 6),
   and how far into that skill's own level range (1..maxLevel) the question
   sits. A skill whose standard spans two grades (e.g. "5.MD.B.2 → 6.SP.B.4")
   is treated as sliding from the lower grade at level 1 to the higher grade
   at maxLevel. Those fractional "grade equivalents" are then placed on a
   fixed RIT-like number line via GRADE_RIT_ANCHORS. */
const GRADE_RIT_ANCHORS = [ // illustrative anchors, not real NWEA norms
  { grade:4, rit:195 },
  { grade:5, rit:205 },
  { grade:6, rit:213 },
  { grade:7, rit:219 }
];
function gradeToRIT(g){
  const A = GRADE_RIT_ANCHORS;
  if(g <= A[0].grade){
    const slope = (A[1].rit-A[0].rit)/(A[1].grade-A[0].grade);
    return A[0].rit + slope*(g-A[0].grade);
  }
  for(let i=0;i<A.length-1;i++){
    if(g>=A[i].grade && g<=A[i+1].grade){
      const t=(g-A[i].grade)/(A[i+1].grade-A[i].grade);
      return A[i].rit + t*(A[i+1].rit-A[i].rit);
    }
  }
  const a=A[A.length-2], b=A[A.length-1];
  const slope=(b.rit-a.rit)/(b.grade-a.grade);
  return b.rit + slope*(g-b.grade);
}
function ritToGrade(rit){
  const A = GRADE_RIT_ANCHORS;
  if(rit <= A[0].rit){
    const slope=(A[1].grade-A[0].grade)/(A[1].rit-A[0].rit);
    return A[0].grade + slope*(rit-A[0].rit);
  }
  for(let i=0;i<A.length-1;i++){
    if(rit>=A[i].rit && rit<=A[i+1].rit){
      const t=(rit-A[i].rit)/(A[i+1].rit-A[i].rit);
      return A[i].grade + t*(A[i+1].grade-A[i].grade);
    }
  }
  const a=A[A.length-2], b=A[A.length-1];
  const slope=(b.grade-a.grade)/(b.rit-a.rit);
  return b.grade + slope*(rit-b.rit);
}
function gradeLabel(g){
  const gr = Math.max(3, Math.min(8, Math.floor(g)));
  const frac = g-Math.floor(g);
  const part = frac<0.34 ? 'early' : frac<0.67 ? 'mid' : 'late';
  const ord = {3:'3rd',4:'4th',5:'5th',6:'6th',7:'7th',8:'8th'}[gr];
  return `${part} ${ord}-grade level`;
}

/* Grades a skill's standard names, e.g. "5.MD.B.2 → 6.SP.B.4" -> [5,6]. */
function parseGradeRange(std){
  const found = Array.from(new Set((std.match(/\b[4-9](?=\.)/g)||[]).map(Number)));
  if(!found.length) return [6,6];
  return [Math.min(...found), Math.max(...found)];
}
/* Most skills carry a single grade in their standard (e.g. "6.RP.A.1" stays
   grade 6 at every level), so without this a skill's own level 1..maxLevel
   escalation — bigger numbers, messier fractions — would be invisible to the
   difficulty model. LEVEL_SPREAD adds a modest same-skill difficulty ramp
   (half a grade-equivalent, tuned to sit well under the size of a real
   cross-grade jump) on top of whatever grade range the standard itself spans. */
const LEVEL_SPREAD = 0.5;
function itemDifficultyRIT(c, level){
  const [lo,hi] = parseGradeRange(c.std);
  const frac = c.maxLevel<=1 ? 0 : (level-1)/(c.maxLevel-1);
  const grade = lo + (hi-lo)*frac + LEVEL_SPREAD*frac;
  return gradeToRIT(grade);
}

const RIT_START = 205;        // initial ability estimate — the grade-5 anchor, roughly the curriculum's center of gravity
const RIT_SENSITIVITY = 12;   // RIT points per logistic "logit" — how sharply P(correct) responds to the ability/difficulty gap
const RIT_K_START = 24;       // update step size on question 1 — large because nothing is known yet
const RIT_K_MIN = 4;          // update step size floor by the last question — keeps the estimate settling, not oscillating
const RIT_CLAMP = [150, 260]; // sanity bounds so one wild early swing can't send the estimate somewhere nonsensical

function probCorrect(theta, difficulty){ return 1/(1+Math.exp(-(theta-difficulty)/RIT_SENSITIVITY)); }
function kFactor(index, total){ const t = index/((total-1)||1); return RIT_K_START + (RIT_K_MIN-RIT_K_START)*t; }

/* One line per top-level category shown on the home screen — keep this at 6
   or fewer so the home screen stays scannable as more skills get added. */
const DOMAIN_META = {
  'Data & Statistics': { icon:'📊', accent:'#ff6a1a', desc:'Dot plots, mean vs. median, spread, and spotting a real data question.' },
  'Fractions': { icon:'🥎', accent:'#ffcf3f', desc:'Add, subtract, multiply, and divide fractions using sports stats.' },
  'Number Fluency': { icon:'🔢', accent:'#54e07a', desc:'Standard-algorithm addition, subtraction, multiplication, division, and decimals.' },
  'Ratios & Rates': { icon:'⚖️', accent:'#28d6e6', desc:'Ratios, unit rates, and percentages — some using real MLB, NBA, and MLS stats.' },
  'Geometry': { icon:'📐', accent:'#ff6a1a', desc:'Coordinate planes, area, volume, and surface area.' },
  'Expressions & Equations': { icon:'🧮', accent:'#ffcf3f', desc:'Order of operations, expressions with variables, and solving equations.' }
};

function getLevel(key){ return state.levels[key] || 1; }

/* Skills flagged as a known gap by the parent (e.g. "he doesn't know long
   division yet" even though the adaptive level system hasn't caught up to
   that fact from in-app answers alone) — these get extra selection weight
   in both regular Play and Test Mode until removed here. Add/remove skill
   keys as gaps get closed or new ones are identified. */
const FOCUS_SKILLS = ['longdivision'];
const FOCUS_BOOST = 3;
function focusWeight(key){ return FOCUS_SKILLS.includes(key) ? FOCUS_BOOST : 1; }

/* Weighted pick among a domain's skills — skills further from mastery get
   proportionally more reps, but nothing ever drops to zero chance, so a
   maxed-out skill still resurfaces occasionally for review. Focus skills
   get an additional flat multiplier on top of the mastery-gap weighting. */
function pickSkillForDomain(domain){
  const entries = Object.entries(SKILLS).filter(([,c])=>c.domain===domain);
  const weights = entries.map(([k,c]) => (c.maxLevel - getLevel(k) + 1) * focusWeight(k));
  const total = weights.reduce((a,b)=>a+b,0);
  let r = Math.random()*total;
  for(let i=0;i<entries.length;i++){
    r -= weights[i];
    if(r<=0) return entries[i][0];
  }
  return entries[entries.length-1][0];
}

/* Weighted pick among Coach Mode's scenarios — same formula as
   pickSkillForDomain, keyed under 'coach_'+id in state.levels so it can
   never collide with a skill id. */
function pickScenario(){
  const entries = Object.entries(SCENARIOS);
  const weights = entries.map(([k,c]) => c.maxLevel - getLevel('coach_'+k) + 1);
  const total = weights.reduce((a,b)=>a+b,0);
  let r = Math.random()*total;
  for(let i=0;i<entries.length;i++){
    r -= weights[i];
    if(r<=0) return entries[i][0];
  }
  return entries[entries.length-1][0];
}

function loadProgress(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){
      const d = JSON.parse(raw);
      if(d && typeof d === 'object'){
        state.levels = d.levels || {};
        state.score = d.score || 0;
        state.history = d.history || [];
        state.testSessions = d.testSessions || [];
      }
    }
  }catch(e){ /* localStorage unavailable — progress just won't persist */ }
}
function saveProgress(){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      levels:state.levels, score:state.score, history:state.history, testSessions:state.testSessions
    }));
  }catch(e){}
}

/* Records one answered question (Play, Coach, or Test) for the Progress
   Report. Capped so an iPad that's been played on for months doesn't grow
   localStorage without bound. */
function logAttempt(rec){
  state.history.push(Object.assign({ ts:Date.now() }, rec));
  if(state.history.length > HISTORY_CAP) state.history.splice(0, state.history.length - HISTORY_CAP);
  saveProgress();
}

/* ---------- rendering ---------- */
const app = document.getElementById('app');
function setLeds(){ document.getElementById('score').textContent=state.score; document.getElementById('streak').textContent=state.streak; }

function render(){
  setLeds();
  if(state.view==='home'){ renderHome(); return; }
  if(state.view==='learn'){ renderLearnView(); return; }
  if(state.view==='coach'){ renderCoachPlay(); return; }
  if(state.view==='test'){ renderTestPlay(); return; }
  if(state.view==='testresults'){ renderTestResults(); return; }
  if(state.view==='report'){ renderReport(); return; }
  renderDomainPlay();
}

function domainCardHTML(domain,i){
  const meta = DOMAIN_META[domain] || { icon:'📚', accent:'#ff6a1a', desc:'' };
  const count = Object.values(SKILLS).filter(c=>c.domain===domain).length;
  return `
    <div class="card" style="--accent:${meta.accent};animation-delay:${i*0.06}s">
      <div class="icon">${meta.icon}</div>
      <h2>${esc(domain)}</h2>
      <p class="skill">${esc(meta.desc)}</p>
      <div class="std">${count} skill${count===1?'':'s'}</div>
      <div class="cardrow">
        <button class="learn" data-action="open-learn" data-domain="${esc(domain)}">📘 Learn</button>
        <button class="go" data-action="open-domain" data-domain="${esc(domain)}">Play →</button>
      </div>
    </div>`;
}

function renderHome(){
  const domainNames = [...new Set(Object.values(SKILLS).map(c=>c.domain))];
  const body = `<div class="grid">${domainNames.map((d,i)=>domainCardHTML(d,i)).join('')}</div>`;
  app.innerHTML = `
    <p class="tagline">Pick a category. <b style="color:var(--cyan)">Learn</b> walks through how it works; <b style="color:var(--orange-soft)">Play</b> jumps straight into practice that adapts to get harder as you go.</p>
    ${body}
    <button class="coachbanner" data-action="open-coach">
      <div class="icon">🏀</div>
      <div class="body">
        <h2>Coach Mode</h2>
        <p>You're the coach. Read the situation, check the stats, make the call.</p>
      </div>
      <span class="go">Play →</span>
    </button>
    <button class="testbanner" data-action="open-test">
      <div class="icon">📝</div>
      <div class="body">
        <h2>Test Mode</h2>
        <p>${TEST_LENGTH} questions, mixed from every category. Starts easy, gets harder if you're on a roll.</p>
      </div>
      <span class="go">Start →</span>
    </button>
    <button class="reportlink" data-action="open-report">📋 Progress report (for grown-ups)</button>`;
}

/* One consolidated instructional page per category — combines every skill's
   coach explanation in that domain, so there's a single place to read
   through a whole category instead of stumbling into pieces one at a time
   during Play. */
function renderLearnView(){
  const domain = state.domain;
  const list = Object.entries(SKILLS).filter(([,c])=>c.domain===domain);
  const sections = list.map(([,c])=>`
    <div class="panel learnsection">
      <h3>${esc(c.title)} <span class="std">${esc(c.std)}</span></h3>
      ${c.coach}
    </div>`).join('');
  app.innerHTML = `
    <div class="topbar">
      <button class="back" data-action="home">← All categories</button>
      <h2>${esc(domain)}</h2>
    </div>
    ${sections}
    <button class="next" data-action="open-domain" data-domain="${esc(domain)}">Start practicing →</button>`;
}

function renderDomainPlay(){
  const c = SKILLS[state.skill];
  const lvl = getLevel(state.skill);
  app.innerHTML = `
    <div class="topbar">
      <button class="back" data-action="home">← All categories</button>
      <h2>${esc(state.domain)}</h2>
      <span class="lvlpill">${esc(c.title)} · Lv ${lvl}/${c.maxLevel}</span>
    </div>
    ${renderPlay(c, lvl)}`;
}

/* ---------- Test Mode: fixed-length quiz, one shared difficulty dial,
   a random skill from ANY domain each question ---------- */
function pickSkillForTest(){
  const keys = Object.keys(SKILLS);
  const weights = keys.map(focusWeight);
  const total = weights.reduce((a,b)=>a+b,0);
  let r = Math.random()*total;
  for(let i=0;i<keys.length;i++){ r -= weights[i]; if(r<=0) return keys[i]; }
  return keys[keys.length-1];
}

function startTest(){
  state.view='test';
  state.test = { level:1, index:0, correct:0, results:[], theta:RIT_START };
  state.skill = pickSkillForTest();
  state.problem = null; state.answered = false;
  render();
}

function renderTestPlay(){
  const c = SKILLS[state.skill];
  const lvl = Math.min(state.test.level, c.maxLevel);
  app.innerHTML = `
    <div class="topbar">
      <button class="back" data-action="home">← Exit test</button>
      <h2>Test Mode</h2>
      <span class="lvlpill">Question ${state.test.index+1}/${TEST_LENGTH} · Lv ${lvl}</span>
    </div>
    ${renderPlay(c, lvl)}`;
}

function testAnswer(correct){
  if(state.answered) return;
  state.correct = correct;
  const c = SKILLS[state.skill];
  const lvl = Math.min(state.test.level, c.maxLevel); // the level this question was actually generated at
  const difficulty = itemDifficultyRIT(c, lvl);
  const expected = probCorrect(state.test.theta, difficulty);
  const k = kFactor(state.test.index, TEST_LENGTH);
  state.test.theta += k * ((correct?1:0) - expected);
  state.test.theta = Math.max(RIT_CLAMP[0], Math.min(RIT_CLAMP[1], state.test.theta));
  if(correct){ state.score++; state.streak++; state.test.correct++; state.test.level = Math.min(4, state.test.level+1); }
  else { state.streak = 0; state.test.level = Math.max(1, state.test.level-1); }
  state.test.results.push({ domain:c.domain, skill:state.skill, title:c.title, correct, difficulty });
  logAttempt({ mode:'test', domain:c.domain, skill:state.skill, title:c.title, correct });
  state.answered = true;
  render();
}

function finishTest(){
  const byDomain = {};
  state.test.results.forEach(r=>{
    byDomain[r.domain] = byDomain[r.domain] || { correct:0, attempts:0 };
    byDomain[r.domain].attempts++;
    if(r.correct) byDomain[r.domain].correct++;
  });
  const mapScore = Math.round(state.test.theta);
  const errorBand = Math.round(40/Math.sqrt(TEST_LENGTH)); // shrinks with more questions, like a real CAT's standard error
  const session = {
    ts:Date.now(), correct:state.test.correct, total:TEST_LENGTH, byDomain,
    mapScore, errorBand, gradeEquiv: ritToGrade(mapScore)
  };
  state.testSessions.push(session);
  if(state.testSessions.length > TESTSESSIONS_CAP) state.testSessions.splice(0, state.testSessions.length - TESTSESSIONS_CAP);
  saveProgress();
  state.lastTestSession = session;
  state.test = null;
  state.view = 'testresults';
  render();
}

function renderTestResults(){
  const s = state.lastTestSession;
  const pct = Math.round(s.correct/s.total*100);
  const domainRows = Object.entries(s.byDomain).map(([d,v])=>`
    <div class="reportrow"><span class="name">${esc(d)}</span>${meterHTML(v.correct, v.attempts)}</div>`).join('');
  app.innerHTML = `
    <div class="topbar">
      <button class="back" data-action="home">← All categories</button>
      <h2>Test Results</h2>
    </div>
    <div class="panel">
      <div class="statrow">
        <div class="stattile wide"><div class="n">${s.mapScore} <span class="pm">± ${s.errorBand}</span></div><div class="lab">Math Score — ${esc(gradeLabel(s.gradeEquiv))}</div></div>
        <div class="stattile"><div class="n">${s.correct}/${s.total}</div><div class="lab">Score</div></div>
        <div class="stattile"><div class="n">${pct}%</div><div class="lab">Accuracy</div></div>
      </div>
      <p class="tip">The Math Score weighs <b>which</b> questions you got right, not just how many — missing a hard one costs less than missing an easy one, and it moves less as the test goes on, the way a real adaptive placement test settles on an estimate.</p>
      <div class="reportdomain"><h3>By category</h3>${domainRows}</div>
      <div class="cardrow">
        <button class="go" data-action="open-test">Take another test →</button>
        <button class="back" data-action="home">Back home</button>
      </div>
    </div>`;
}

/* ---------- Progress Report (parent-facing) ---------- */
function aggregateHistory(mode){
  const map = {};
  state.history.forEach(h=>{
    if(h.mode!==mode) return;
    map[h.skill] = map[h.skill] || { title:h.title, domain:h.domain, correct:0, attempts:0 };
    map[h.skill].attempts++;
    if(h.correct) map[h.skill].correct++;
  });
  return map;
}

function renderReport(){
  const playMap = aggregateHistory('play');
  const coachMap = aggregateHistory('coach');
  const totalAttempts = state.history.length;
  const totalCorrect = state.history.filter(h=>h.correct).length;
  const overallPct = totalAttempts ? Math.round(totalCorrect/totalAttempts*100) : 0;

  const playSections = Object.keys(DOMAIN_META).map(d=>{
    const skillsInDomain = Object.entries(SKILLS).filter(([,c])=>c.domain===d);
    if(!skillsInDomain.length) return '';
    const rows = skillsInDomain.map(([key,c])=>{
      const m = playMap[key] || { correct:0, attempts:0 };
      const focusTag = FOCUS_SKILLS.includes(key) ? `<span class="lvltag focustag">🎯 focus</span>` : '';
      return `<div class="reportrow"><span class="name">${esc(c.title)}</span>${meterHTML(m.correct, m.attempts)}${focusTag}<span class="lvltag">Lv ${getLevel(key)}/${c.maxLevel}</span></div>`;
    }).join('');
    return `<div class="reportdomain"><h3>${esc(d)}</h3>${rows}</div>`;
  }).join('');

  const coachRows = Object.entries(SCENARIOS).map(([key,c])=>{
    const m = coachMap['coach_'+key] || { correct:0, attempts:0 };
    return `<div class="reportrow"><span class="name">${esc(c.title)}</span>${meterHTML(m.correct, m.attempts)}</div>`;
  }).join('');

  const sessions = state.testSessions.slice().reverse().slice(0,10);
  const sessionRows = sessions.length ? sessions.map(s=>{
    const pct = Math.round(s.correct/s.total*100);
    const cls = pct>=80 ? 'good' : pct>=50 ? 'warn' : 'bad';
    const date = new Date(s.ts).toLocaleDateString(undefined,{month:'short',day:'numeric'});
    const scoreTag = s.mapScore!==undefined ? `<span class="mapscore">${s.mapScore} ± ${s.errorBand}</span>` : `<span class="mapscore">—</span>`;
    return `<div class="testsession"><span>${date}</span><span>${s.correct}/${s.total}</span><span class="acc ${cls}">${pct}%</span>${scoreTag}</div>`;
  }).join('') : `<p class="tip">No tests taken yet — Test Mode results will show up here.</p>`;

  app.innerHTML = `
    <div class="topbar">
      <button class="back" data-action="home">← All categories</button>
      <h2>Progress Report</h2>
    </div>
    <div class="panel">
      <div class="statrow">
        <div class="stattile"><div class="n">${totalAttempts}</div><div class="lab">Questions answered</div></div>
        <div class="stattile"><div class="n">${overallPct}%</div><div class="lab">Overall accuracy</div></div>
        <div class="stattile"><div class="n">${state.testSessions.length}</div><div class="lab">Tests taken</div></div>
      </div>
      <div class="reportdomain"><h3>Test Mode history</h3>${sessionRows}</div>
      ${playSections}
      <div class="reportdomain"><h3>Coach Mode</h3>${coachRows}</div>
      <button class="clearhist" data-action="clear-history">${state.confirmClear?'Click again to confirm clear':'Clear report history'}</button>
    </div>`;
}

function renderPlay(c, lvl){
  if(!state.problem){ state.problem = c.gen(lvl); state.answered=false; }
  const p = state.problem;
  const head = `
    ${p.pre?`<div class="pretext">${esc(p.pre)}</div>`:''}
    ${p.data?`<div class="datatext">${esc(p.data)}</div>`:''}
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
  } else if(p.kind==='int'){
    // no inputmode="numeric" — same reasoning as 'point' above: the iPad's
    // numeric keypad has no minus key, so a possibly-negative answer needs
    // the plain keyboard instead.
    controls = `<div class="numrow">
      <input id="numInput" type="text" autocomplete="off" placeholder="e.g. -5 or 5">
      <button class="check" data-action="check">Check</button>
    </div>`;
  } else {
    controls = `<div class="numrow">
      <input id="numInput" type="text" inputmode="numeric" autocomplete="off" placeholder="Type your answer">
      <button class="check" data-action="check">Check</button>
    </div>`;
  }
  return `<div class="panel">${head}${controls}</div>`;
}

/* ---------- Coach Mode: situational decision scenarios ----------
   Parallel to renderDomainPlay/renderPlay rather than reusing them —
   scenarios aren't keyed by state.skill/SKILLS, and the "answer" is always
   a pick among named candidate cards, not one of the existing problem
   kinds, so a small amount of duplication here is lower-risk than bending
   the domain-play code to fit a shape it wasn't built for. */
function renderCoachPlay(){
  const key = state.scenarioKey;
  const c = SCENARIOS[key];
  const lvl = getLevel('coach_'+key);
  app.innerHTML = `
    <div class="topbar">
      <button class="back" data-action="home">← All categories</button>
      <h2>Coach Mode</h2>
      <span class="lvlpill">${esc(c.title)} · Lv ${lvl}/${c.maxLevel}</span>
    </div>
    ${renderCoachPanel(c)}`;
}

function renderCoachPanel(c){
  if(!state.problem){ state.problem = c.gen(getLevel('coach_'+state.scenarioKey)); state.answered=false; }
  const p = state.problem;
  const head = `
    <div class="pretext">${esc(p.pre)}</div>
    <div class="qtext">${esc(p.question)}</div>`;

  const cards = p.candidates.map((cand,i)=>{
    const pct = Math.round(cand.made/cand.attempted*100);
    let cls = '';
    if(state.answered) cls = i===p.answer ? 'right' : (i===state.userAnswer ? 'wrong' : '');
    return `<button class="statcard ${cls}" data-action="ans-coach" data-idx="${i}" ${state.answered?'disabled':''}>
      <span class="name">${esc(cand.name)}</span>
      <span class="stat">${cand.made}/${cand.attempted} (${pct}% ${esc(p.statUnit)})</span>
    </button>`;
  }).join('');

  let feedback = '';
  if(state.answered){
    const head2 = state.correct ? correctHead(state.streak) : "Not quite";
    const lead = state.correct
      ? `<div class="why">Why: ${p.why}</div>`
      : `<div class="why">The right call was <b>${esc(p.candidates[p.answer].name)}</b>. ${p.why}</div>`;
    feedback = `
      <div class="feedback ${state.correct?'good':'bad'}">
        <div class="head">${head2}</div>
        ${lead}
      </div>
      <button class="next" data-action="next-coach">Next scenario →</button>`;
  }

  return `<div class="panel">${head}<div class="statcards">${cards}</div>${feedback}</div>`;
}

function updateCoachResult(key, maxLevel, correct){
  state.correct = correct;
  if(correct){ state.score++; state.streak++; } else { state.streak = 0; }
  const lvlKey = 'coach_'+key;
  let lvl = getLevel(lvlKey);
  lvl = correct ? Math.min(maxLevel, lvl+1) : Math.max(1, lvl-1);
  state.levels[lvlKey] = lvl;
  logAttempt({ mode:'coach', domain:'Coach Mode', skill:lvlKey, title:SCENARIOS[key].title, correct });
}
function coachAnswer(idx){
  if(state.answered) return;
  const correct = idx === state.problem.answer;
  state.userAnswer = idx;
  updateCoachResult(state.scenarioKey, SCENARIOS[state.scenarioKey].maxLevel, correct);
  state.answered = true;
  render();
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
  const head = state.correct ? correctHead(state.streak) : "Not quite";
  const lead = state.correct
    ? `<div class="why">Why: ${p.why}</div>`
    : `<div class="why">The answer is <b>${esc(displayAnswer(p))}</b>. ${p.why}</div>`;
  const isTest = state.view==='test';
  const nextAction = isTest ? 'next-test' : 'next';
  const nextLabel = isTest ? (state.test.index+1>=TEST_LENGTH ? 'See results →' : 'Next question →') : 'Next play →';
  return `${optsBack}
    <div class="feedback ${state.correct?'good':'bad'}">
      <div class="head">${head}</div>
      ${lead}
    </div>
    <button class="next" data-action="${nextAction}">${nextLabel}</button>`;
}

/* ---------- scoring & adaptive level ---------- */
function updateResult(correct){
  state.correct = correct;
  if(correct){ state.score++; state.streak++; } else { state.streak = 0; }
  const key = state.skill, c = SKILLS[key];
  let lvl = getLevel(key);
  lvl = correct ? Math.min(c.maxLevel, lvl+1) : Math.max(1, lvl-1);
  state.levels[key] = lvl;
  logAttempt({ mode:'play', domain:c.domain, skill:key, title:c.title, correct });
}
function answer(correct){ if(state.answered) return; updateResult(correct); state.answered=true; render(); }

/* Routes an answered question to regular scoring or Test Mode scoring
   depending on the current view — every answer control below calls this
   instead of answer() directly so Test Mode doesn't touch per-skill levels. */
function submitAnswer(correct){ if(state.view==='test') testAnswer(correct); else answer(correct); }

/* ---------- events ---------- */
document.addEventListener('click', e=>{
  const el = e.target.closest('[data-action]'); if(!el) return;
  const a = el.dataset.action;
  if(a==='home'){
    state.view='home'; state.domain=null; state.skill=null; state.scenarioKey=null;
    state.problem=null; state.answered=false; state.test=null; state.confirmClear=false;
    render();
  }
  else if(a==='open-learn'){ state.view='learn'; state.domain=el.dataset.domain; render(); }
  else if(a==='open-domain'){
    state.view='play'; state.domain=el.dataset.domain;
    state.skill=pickSkillForDomain(state.domain);
    state.problem=null; state.answered=false;
    render();
  }
  else if(a==='open-coach'){
    state.view='coach'; state.scenarioKey=pickScenario();
    state.problem=null; state.answered=false;
    render();
  }
  else if(a==='ans-coach'){ coachAnswer(+el.dataset.idx); }
  else if(a==='next-coach'){
    state.scenarioKey=pickScenario();
    state.problem=SCENARIOS[state.scenarioKey].gen(getLevel('coach_'+state.scenarioKey));
    state.answered=false;
    render();
  }
  else if(a==='ans-bool'){ state.userAnswer=(el.dataset.val==='true'); submitAnswer(state.userAnswer===state.problem.answer); }
  else if(a==='ans-choice'){ const i=+el.dataset.idx; state.userAnswer=i; submitAnswer(i===state.problem.answer); }
  else if(a==='check'){
    const inp=document.getElementById('numInput'); if(!inp) return;
    const v=inp.value.trim(); if(v===''||isNaN(Number(v))){ inp.focus(); return; }
    state.userAnswer=Number(v);
    submitAnswer(Math.abs(Number(v)-state.problem.answer) < 0.005);
  }
  else if(a==='check-frac'){
    const ni=document.getElementById('numInput'), di=document.getElementById('denInput');
    if(!ni||!di) return;
    if(ni.value.trim()===''||di.value.trim()===''){ (ni.value.trim()===''?ni:di).focus(); return; }
    const un=Number(ni.value.trim()), ud=Number(di.value.trim());
    if(isNaN(un)||isNaN(ud)||ud===0){ di.focus(); return; }
    state.userAnswer=[un,ud];
    const [an,ad] = state.problem.answer;
    submitAnswer(fracEq(un,ud,an,ad));
  }
  else if(a==='check-divrem'){
    const qi=document.getElementById('qInput'), rin=document.getElementById('rInput');
    if(!qi||!rin) return;
    if(qi.value.trim()===''||rin.value.trim()===''){ (qi.value.trim()===''?qi:rin).focus(); return; }
    const uq=Number(qi.value.trim()), ur=Number(rin.value.trim());
    if(isNaN(uq)||isNaN(ur)){ qi.focus(); return; }
    state.userAnswer={q:uq,r:ur};
    submitAnswer(uq===state.problem.answer.q && ur===state.problem.answer.r);
  }
  else if(a==='check-ratio'){
    const ai=document.getElementById('ratioAInput'), bi=document.getElementById('ratioBInput');
    if(!ai||!bi) return;
    if(ai.value.trim()===''||bi.value.trim()===''){ (ai.value.trim()===''?ai:bi).focus(); return; }
    const ua=Number(ai.value.trim()), ub=Number(bi.value.trim());
    if(isNaN(ua)||isNaN(ub)||ub===0){ bi.focus(); return; }
    state.userAnswer=[ua,ub];
    const [aa,ab] = state.problem.answer;
    submitAnswer(fracEq(ua,ub,aa,ab));
  }
  else if(a==='check-point'){
    const xi=document.getElementById('xInput'), yi=document.getElementById('yInput');
    if(!xi||!yi) return;
    if(xi.value.trim()===''||yi.value.trim()===''){ (xi.value.trim()===''?xi:yi).focus(); return; }
    const ux=Number(xi.value.trim()), uy=Number(yi.value.trim());
    if(isNaN(ux)||isNaN(uy)){ xi.focus(); return; }
    state.userAnswer=[ux,uy];
    const [ax,ay] = state.problem.answer;
    submitAnswer(ux===ax && uy===ay);
  }
  else if(a==='next'){
    state.skill=pickSkillForDomain(state.domain);
    state.problem=SKILLS[state.skill].gen(getLevel(state.skill));
    state.answered=false;
    render();
  }
  else if(a==='open-test'){ startTest(); }
  else if(a==='next-test'){
    state.test.index++;
    if(state.test.index >= TEST_LENGTH){ finishTest(); }
    else{
      state.skill = pickSkillForTest();
      const c = SKILLS[state.skill];
      state.problem = c.gen(Math.min(state.test.level, c.maxLevel));
      state.answered = false;
      render();
    }
  }
  else if(a==='open-report'){ state.view='report'; render(); }
  else if(a==='clear-history'){
    if(state.confirmClear){ state.history=[]; state.testSessions=[]; state.confirmClear=false; saveProgress(); render(); }
    else{ state.confirmClear=true; render(); }
  }
  else if(a==='reset'){ state.score=0; state.streak=0; setLeds(); saveProgress(); }
});

document.addEventListener('keydown', e=>{
  if(e.key!=='Enter' || (state.view!=='play' && state.view!=='test') || state.answered) return;
  const p = state.problem; if(!p) return;
  if(p.kind==='frac'){
    const ni=document.getElementById('numInput'), di=document.getElementById('denInput');
    if(ni&&di&&ni.value.trim()!==''&&di.value.trim()!==''){
      const un=Number(ni.value.trim()), ud=Number(di.value.trim());
      if(!isNaN(un)&&!isNaN(ud)&&ud!==0){ state.userAnswer=[un,ud]; submitAnswer(fracEq(un,ud,p.answer[0],p.answer[1])); }
    }
  } else if(p.kind==='divrem'){
    const qi=document.getElementById('qInput'), rin=document.getElementById('rInput');
    if(qi&&rin&&qi.value.trim()!==''&&rin.value.trim()!==''){
      const uq=Number(qi.value.trim()), ur=Number(rin.value.trim());
      if(!isNaN(uq)&&!isNaN(ur)){ state.userAnswer={q:uq,r:ur}; submitAnswer(uq===p.answer.q && ur===p.answer.r); }
    }
  } else if(p.kind==='ratio'){
    const ai=document.getElementById('ratioAInput'), bi=document.getElementById('ratioBInput');
    if(ai&&bi&&ai.value.trim()!==''&&bi.value.trim()!==''){
      const ua=Number(ai.value.trim()), ub=Number(bi.value.trim());
      if(!isNaN(ua)&&!isNaN(ub)&&ub!==0){ state.userAnswer=[ua,ub]; submitAnswer(fracEq(ua,ub,p.answer[0],p.answer[1])); }
    }
  } else if(p.kind==='point'){
    const xi=document.getElementById('xInput'), yi=document.getElementById('yInput');
    if(xi&&yi&&xi.value.trim()!==''&&yi.value.trim()!==''){
      const ux=Number(xi.value.trim()), uy=Number(yi.value.trim());
      if(!isNaN(ux)&&!isNaN(uy)){ state.userAnswer=[ux,uy]; submitAnswer(ux===p.answer[0] && uy===p.answer[1]); }
    }
  } else if(p.kind==='num' || p.kind==='int'){
    const inp=document.getElementById('numInput');
    if(inp){ const v=inp.value.trim(); if(v!==''&&!isNaN(Number(v))){ state.userAnswer=Number(v); submitAnswer(Math.abs(Number(v)-p.answer)<0.005); } }
  }
});

loadProgress();
render();
