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
const poss = name => name.endsWith('s') ? `${name}'` : `${name}'s`;

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

/* ---------- real MLB data sampling (data/mlb-2025.js, loaded before this) ---------- */
function pickRealWindow(n){
  const player = rnd(MLB_DATA.players);
  const games = player.games;
  const start = ri(0, Math.max(0, games.length - n));
  return { player, window: games.slice(start, start + n) };
}

/* ---------- real NBA data sampling (data/nba-2024.js, loaded before this) ----------
   Free-tier balldontlie.io only exposes games/teams, not player stats, so this is
   real per-game TEAM point totals and win-loss records (derived from raw game
   results in scripts/fetch-nba-data.js), not individual player stats. */
function pickRealNBAWindow(n){
  const team = rnd(NBA_DATA.teams);
  const games = team.games;
  const start = ri(0, Math.max(0, games.length - n));
  return { team, window: games.slice(start, start + n) };
}

/* ---------- vertical "worksheet" stack for standard-algorithm drills ---------- */
function stackHTML(operands, opChar){
  const rows = operands.map((n,i)=>{
    const isLast = i===operands.length-1;
    return `<div class="stackrow"><span class="op">${isLast?(opChar||''):''}</span><span class="operand">${n}</span></div>`;
  }).join('');
  return `<div class="stack">${rows}<div class="stackline"></div></div>`;
}

/* ---------- Learn-page visualizations ----------
   Small, dependency-free HTML/SVG builders used only by the coach ("Learn")
   content in js/skills/*.js — not by Play mode, which stays as plain text. */

/* A rectangle split into `den` equal segments with `num` of them shaded.
   Pass `num2` to shade a second block of segments in a second color right
   after the first — handy for showing an addition happening in one bar
   (e.g. 3/8 + 4/8, first block orange, second block cyan). */
function fracBarHTML(num, den, label, num2){
  let segs = '';
  for(let i=0;i<den;i++){
    let cls = '';
    if(i<num) cls = ' filled';
    else if(num2!==undefined && i<num+num2) cls = ' filled2';
    segs += `<div class="fracseg${cls}"></div>`;
  }
  return `<div class="fracbarwrap">
    ${label?`<div class="fracbarlabel">${esc(label)}</div>`:''}
    <div class="fracbar-viz">${segs}</div>
  </div>`;
}

/* A horizontal number line plotting `values` as dots, with optional labeled
   markers (e.g. mean/median) as vertical flags. */
function numberLineHTML(values, marks, lo, hi){
  lo = lo===undefined ? Math.floor(Math.min(...values)) : lo;
  hi = hi===undefined ? Math.ceil(Math.max(...values)) : hi;
  const span = (hi-lo) || 1;
  const pct = v => ((v-lo)/span)*100;
  const step = Math.max(1, Math.ceil(span/9)); // keep tick count readable on wide ranges
  const ticks = []; for(let x=lo;x<=hi;x+=step) ticks.push(`<div class="nltick" style="left:${pct(x)}%">${x}</div>`);
  const dots = values.map(v=>`<div class="nldot" style="left:${pct(v)}%"></div>`).join('');
  const markEls = (marks||[]).map(m=>`<div class="nlmark" style="left:${pct(m.value)}%;--mc:${m.color||'var(--cyan)'}"><span>${esc(m.label)}</span></div>`).join('');
  return `<div class="numberline">
    <div class="nlaxis"></div>
    ${ticks.join('')}
    ${dots}
    ${markEls}
  </div>`;
}

/* A small SVG coordinate grid plotting labeled points; set negative:true for
   an axis that spans -range..range instead of 0..range. */
function coordGridHTML(points, range, negative){
  range = range || 10;
  const size = 200, m = 7; // margin keeps edge points (e.g. x=0) from clipping against the SVG border
  const lo = negative ? -range : 0, hi = range, span = hi-lo;
  const toPx = v => ((v-lo)/span)*size;
  const originX = toPx(0)+m, originY = m+size-toPx(0);
  const vb = size + m*2;
  let svg = `<svg viewBox="0 0 ${vb} ${vb}" class="coordgrid">`;
  for(let x=lo;x<=hi;x++){ const px=toPx(x)+m; svg += `<line x1="${px}" y1="${m}" x2="${px}" y2="${m+size}" class="gridline"/>`; }
  for(let y=lo;y<=hi;y++){ const py=m+size-toPx(y); svg += `<line x1="${m}" y1="${py}" x2="${m+size}" y2="${py}" class="gridline"/>`; }
  svg += `<line x1="${m}" y1="${originY}" x2="${m+size}" y2="${originY}" class="axisline"/>`;
  svg += `<line x1="${originX}" y1="${m}" x2="${originX}" y2="${m+size}" class="axisline"/>`;
  points.forEach(p=>{
    const px=toPx(p.x)+m, py=m+size-toPx(p.y);
    svg += `<circle cx="${px}" cy="${py}" r="5" class="gridpoint" style="fill:${p.color||'var(--orange)'}"/>`;
    if(p.label) svg += `<text x="${px+8}" y="${py-6}" class="gridlabel">${esc(p.label)}</text>`;
  });
  svg += `</svg>`;
  return svg;
}

/* A simple isometric box outline with length/width/height labeled. Generous
   margins on all sides so the L/W/H labels never clip against the SVG edge. */
function boxHTML(l,w,h){
  const sx=13, sy=13, skewX=Math.min(w*7,40), skewY=Math.min(w*4,24);
  const fw=Math.min(l*sx,100), fh=Math.min(h*sy,80);
  const mL=46, mR=42, mT=14, mB=28;
  const maxW=fw+skewX+mL+mR, maxH=fh+skewY+mT+mB;
  const ox=mL, oy=mT+skewY;
  const flx=ox, fly=oy+fh, frx=ox+fw, fry=oy+fh, ftlx=ox, ftly=oy, ftrx=ox+fw, ftry=oy;
  const blx=flx+skewX, bly=fly-skewY, brx=frx+skewX, bry=fry-skewY, btlx=ftlx+skewX, btly=ftly-skewY, btrx=ftrx+skewX, btry=ftry-skewY;
  return `<svg viewBox="0 0 ${maxW} ${maxH}" class="boxdiagram">
    <polygon points="${ftlx},${ftly} ${btlx},${btly} ${btrx},${btry} ${ftrx},${ftry}" class="boxtop"/>
    <polygon points="${frx},${fry} ${brx},${bry} ${btrx},${btry} ${ftrx},${ftry}" class="boxside"/>
    <polygon points="${flx},${fly} ${ftlx},${ftly} ${ftrx},${ftry} ${frx},${fry}" class="boxfront"/>
    <text x="${ox+fw/2}" y="${fly+18}" class="boxlabel" text-anchor="middle">L:${l}</text>
    <text x="${flx-8}" y="${(fly+ftly)/2+4}" class="boxlabel" text-anchor="end">H:${h}</text>
    <text x="${(frx+brx)/2+6}" y="${(fry+bry)/2+4}" class="boxlabel" text-anchor="start">W:${w}</text>
  </svg>`;
}

/* A flat rectangle labeled with length and width. */
function rectangleHTML(l,w){
  const sx=Math.min(160/l,14), sy=Math.min(90/w,14);
  const fw=l*sx, fh=w*sy, mL=44,mT=16,mB=30,mR=16;
  const vw=fw+mL+mR, vh=fh+mT+mB;
  return `<svg viewBox="0 0 ${vw} ${vh}" class="areasvg">
    <rect x="${mL}" y="${mT}" width="${fw}" height="${fh}" class="areafill"/>
    <text x="${mL+fw/2}" y="${mT+fh+18}" class="arealabel" text-anchor="middle">L: ${l}</text>
    <text x="${mL-8}" y="${mT+fh/2+4}" class="arealabel" text-anchor="end">W: ${w}</text>
  </svg>`;
}

/* A right triangle drawn inside a dashed outline of its enclosing rectangle,
   to visually reinforce "triangle = half the rectangle." */
function triangleAreaHTML(b,h){
  const sx=Math.min(160/b,14), sy=Math.min(90/h,14);
  const fw=b*sx, fh=h*sy, mL=44,mT=16,mB=30,mR=16;
  const vw=fw+mL+mR, vh=fh+mT+mB;
  const x0=mL, y0=mT+fh, x1=mL+fw, y1=mT+fh, x2=mL, y2=mT;
  return `<svg viewBox="0 0 ${vw} ${vh}" class="areasvg">
    <rect x="${mL}" y="${mT}" width="${fw}" height="${fh}" class="areaoutline"/>
    <polygon points="${x0},${y0} ${x1},${y1} ${x2},${y2}" class="areafill"/>
    <text x="${mL+fw/2}" y="${mT+fh+18}" class="arealabel" text-anchor="middle">b: ${b}</text>
    <text x="${mL-8}" y="${mT+fh/2+4}" class="arealabel" text-anchor="end">h: ${h}</text>
  </svg>`;
}

/* A slanted parallelogram with a dashed height line, so the height is
   visually distinct from the slanted side. */
function parallelogramAreaHTML(b,h){
  const sx=Math.min(140/b,12), sy=Math.min(90/h,12);
  const fw=b*sx, fh=h*sy, skew=Math.min(fw*0.35,30);
  const mL=44+skew, mT=16, mB=30, mR=16;
  const vw=fw+mL+mR, vh=fh+mT+mB;
  const x0=mL, y0=mT+fh, x1=x0+fw, y1=y0, x2=x1+skew, y2=mT, x3=x0+skew, y3=mT;
  return `<svg viewBox="0 0 ${vw} ${vh}" class="areasvg">
    <polygon points="${x0},${y0} ${x1},${y1} ${x2},${y2} ${x3},${y3}" class="areafill"/>
    <line x1="${x3}" y1="${y3}" x2="${x0}" y2="${y0}" class="areadash"/>
    <text x="${(x0+x1)/2}" y="${y0+18}" class="arealabel" text-anchor="middle">b: ${b}</text>
    <text x="${x0-8}" y="${(y0+y3)/2+4}" class="arealabel" text-anchor="end">h: ${h}</text>
  </svg>`;
}

/* A big rectangle with a smaller corner rectangle cut out (darkened), to
   visualize an L-shaped area as "big rectangle minus a corner." */
function lShapeHTML(L,W,sl,sw){
  const sx=Math.min(140/L,10), sy=Math.min(90/W,10);
  const fw=L*sx, fh=W*sy, cw=sl*sx, ch=sw*sy, mL=44,mT=16,mB=30,mR=16;
  const vw=fw+mL+mR, vh=fh+mT+mB;
  return `<svg viewBox="0 0 ${vw} ${vh}" class="areasvg">
    <rect x="${mL}" y="${mT}" width="${fw}" height="${fh}" class="areafill"/>
    <rect x="${mL+fw-cw}" y="${mT}" width="${cw}" height="${ch}" class="areacut"/>
    <text x="${mL+fw/2}" y="${mT+fh+18}" class="arealabel" text-anchor="middle">${L} × ${W} big rectangle</text>
    <text x="${mL+fw-cw/2}" y="${mT+ch/2+4}" class="arealabel" text-anchor="middle" style="font-size:9px">cut: ${sl}×${sw}</text>
  </svg>`;
}

/* A two-pan balance scale for equations — both pans hold arbitrary HTML. */
function balanceHTML(leftHTML, rightHTML){
  return `<div class="balance">
    <div class="balancebar"></div>
    <div class="pan left"><div class="pancontent">${leftHTML}</div></div>
    <div class="pan right"><div class="pancontent">${rightHTML}</div></div>
    <div class="fulcrum"></div>
  </div>`;
}

/* A simple repeated-icon ratio visualization, e.g. basketballs vs. soccer balls. */
function ratioIconsHTML(iconA, countA, labelA, iconB, countB, labelB){
  return `<div class="ratioviz">
    <div class="ratiorow"><span class="ratioicons">${Array(countA).fill(iconA).join(' ')}</span><span class="ratiolabel">${esc(labelA)}</span></div>
    <div class="ratiorow"><span class="ratioicons">${Array(countB).fill(iconB).join(' ')}</span><span class="ratiolabel">${esc(labelB)}</span></div>
  </div>`;
}
