/* Shared helpers used by skill files and the engine. Loaded before any skill file. */

const PLAYERS = ["Maya","Diego","Jamal","Lena","Sofia","Marcus","Priya","Leo","Zoe","Aiden","Nina","Theo"];
const SPORTS = [
  {stat:"points", emoji:"🏀"},
  {stat:"hits",   emoji:"⚾"},
  {stat:"goals",  emoji:"⚽"},
];
const PRAISE = ["Swish!","Nothing but net!","Buzzer beater!","Home run!","Grand slam!","GOAL!","Top corner!","Slam dunk!","You're on fire!","Money!"];

const rnd = a => a[Math.floor(Math.random()*a.length)];
const ri  = (lo,hi) => Math.floor(Math.random()*(hi-lo+1))+lo;
const esc = s => String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));

/* ---------- fraction helpers ---------- */
function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ const t=a%b; a=b; b=t; } return a||1; }
function reduceFrac(n,d){ const g = gcd(n,d); return [n/g, d/g]; }
function fracEq(n1,d1,n2,d2){ return n1*d2 === n2*d1; }
function fracLabel(n,d){ return `${n}/${d}`; }

/* ---------- dot / line plot ---------- */
function dotPlotHTML(freq, lo, hi, light, tickFmt){
  let cols = "";
  for(let x=lo;x<=hi;x++){
    let dots = "";
    for(let i=0;i<(freq[x]||0);i++) dots += '<span class="dot"></span>';
    const label = tickFmt ? tickFmt(x) : x;
    cols += `<div class="dpcol">${dots}<div class="dpaxis dpaxisline">${label}</div></div>`;
  }
  return `<div class="dotplot${light?' light':''}">${cols}</div>`;
}

/* ---------- vertical "worksheet" stack for standard-algorithm drills ---------- */
function stackHTML(operands, opChar){
  const rows = operands.map((n,i)=>{
    const isLast = i===operands.length-1;
    return `<div class="stackrow"><span class="op">${isLast?(opChar||''):''}</span><span class="operand">${n}</span></div>`;
  }).join('');
  return `<div class="stack">${rows}<div class="stackline"></div></div>`;
}
