/* Data & Statistics domain. Retrofit of the original 4 skills with leveled generators. */

/* ---------- Statistical Questions (6.SP.A.1) ---------- */
function genStatQ(level){
  const p = rnd(PLAYERS), s = rnd(SPORTS);
  const notStat1 = [
    `How many ${s.stat} did ${p} get in last night's game?`,
    `How tall is ${p}?`,
    `What was the final score of Saturday's game?`,
    `How old is the team's captain?`,
    `How many ${s.stat} did the team get in the championship game?`
  ];
  const stat1 = [
    `How many ${s.stat} does each player on the team get per game?`,
    `How tall are the players on the team?`,
    `How many ${s.stat} does ${p} get in a typical game?`,
    `How many ${s.stat} do players score in each game this season?`,
    `What are the ages of the players on the team?`
  ];
  const notStat2 = [
    `What is the team's total number of ${s.stat} this season?`,
    `How many games did the team win this season?`,
    `What is the highest number of ${s.stat} anyone scored in a single game this season?`,
    `Who is the team's leading scorer?`
  ];
  const stat2 = [
    `How many ${s.stat} did each player score in last night's game?`,
    `How many ${s.stat} does the team score, game to game, this season?`,
    `How many minutes did each player play in last night's game?`,
    `What were the final scores of each game this season?`
  ];
  const notStat = level>=2 ? notStat2 : notStat1;
  const stat = level>=2 ? stat2 : stat1;
  const isStat = Math.random() < 0.5;
  return { kind:'bool', question: isStat?rnd(stat):rnd(notStat), answer:isStat,
    why: isStat
      ? "It's about a <b>group</b> (or changes game to game), so the answer will be different each time you check."
      : "There's only <b>one</b> possible answer here, so nothing varies." };
}

/* ---------- Reading Dot Plots (5.MD.B.2 → 6.SP.B.4) ---------- */
function genDotWhole(n, hi, subs){
  const p = rnd(PLAYERS), s = rnd(SPORTS);
  const lo = 0;
  const vals = Array.from({length:n}, ()=>ri(lo,hi));
  const freq = {}; for(let x=lo;x<=hi;x++) freq[x]=0; vals.forEach(v=>freq[v]++);
  const mx = Math.max(...vals), mn = Math.min(...vals);
  const sub = rnd(subs);
  let question, answer, why;
  if(sub==='mode'){
    let best=lo, bc=-1; for(let x=lo;x<=hi;x++){ if(freq[x]>bc){bc=freq[x];best=x;} }
    const ties = Object.keys(freq).filter(k=>freq[k]===bc);
    if(ties.length>1){ question=`How many games are shown in total?`; answer=n; why=`Count every dot: <b>${n}</b>.`; }
    else { question=`Which number of ${s.stat} happened most often (the tallest stack)?`; answer=best; why=`${best} ${s.stat} happened ${bc} times — the tallest stack.`; }
  } else if(sub==='range'){
    question=`What is the range (highest − lowest)?`; answer=mx-mn; why=`Highest ${mx}, lowest ${mn}. Range = ${mx} − ${mn} = <b>${mx-mn}</b>.`;
  } else if(sub==='count'){
    const thr=ri(mn+1,Math.max(mn+1,mx)); const c=vals.filter(v=>v>=thr).length;
    question=`In how many games did ${p} get AT LEAST ${thr} ${s.stat}?`; answer=c; why=`Count every dot at ${thr} or higher: <b>${c}</b>.`;
  } else {
    question=`How many games are shown in total?`; answer=n; why=`Count every dot: <b>${n}</b>.`;
  }
  return { kind:'num', dotplot:dotPlotHTML(freq,lo,hi,false), pre:`${p}'s ${s.stat}, game by game:`, question, answer, why };
}

function genDotFrac(){
  const p = rnd(PLAYERS);
  const n = ri(6,9);
  const vals = Array.from({length:n}, ()=>ri(1,4)); // quarters of a mile
  const freq = {}; for(let k=1;k<=4;k++) freq[k]=0; vals.forEach(v=>freq[v]++);
  const totalQuarters = vals.reduce((a,b)=>a+b,0);
  const [an, ad] = reduceFrac(totalQuarters,4);
  return { kind:'frac',
    dotplot: dotPlotHTML(freq,1,4,false,k=>`${k}/4`),
    pre: `${p}'s practice run each day, in miles:`,
    question: `Add up every dot. What TOTAL distance did ${p} run, in miles?`,
    answer: [an, ad],
    why: `There are ${n} runs. Add all the fractions together: total = ${totalQuarters}/4 = <b>${fracLabel(an,ad)}</b>.`
  };
}

/* Real-data variant: same logic as genDotWhole, but the values come from a
   real player's actual game log instead of random numbers. */
function genDotWholeReal(n, subs){
  const { player, window } = pickRealWindow(n);
  const vals = window.map(g => g.hits);
  const lo = 0, hi = Math.max(3, Math.max(...vals));
  const freq = {}; for(let x=lo;x<=hi;x++) freq[x]=0; vals.forEach(v=>freq[v]++);
  const mx = Math.max(...vals), mn = Math.min(...vals);
  const sub = rnd(subs);
  let question, answer, why;
  if(sub==='mode'){
    let best=lo, bc=-1; for(let x=lo;x<=hi;x++){ if(freq[x]>bc){bc=freq[x];best=x;} }
    const ties = Object.keys(freq).filter(k=>freq[k]===bc);
    if(ties.length>1){ question=`How many games are shown in total?`; answer=n; why=`Count every dot: <b>${n}</b>.`; }
    else { question=`Which number of hits happened most often (the tallest stack)?`; answer=best; why=`${best} hits happened ${bc} times — the tallest stack.`; }
  } else if(sub==='range'){
    question=`What is the range (highest − lowest)?`; answer=mx-mn; why=`Highest ${mx}, lowest ${mn}. Range = ${mx} − ${mn} = <b>${mx-mn}</b>.`;
  } else if(sub==='count'){
    const thr=ri(mn+1,Math.max(mn+1,mx)); const c=vals.filter(v=>v>=thr).length;
    question=`In how many games did ${player.name} get AT LEAST ${thr} hits?`; answer=c; why=`Count every dot at ${thr} or higher: <b>${c}</b>.`;
  } else {
    question=`How many games are shown in total?`; answer=n; why=`Count every dot: <b>${n}</b>.`;
  }
  return { kind:'num', dotplot:dotPlotHTML(freq,lo,hi,false), pre:`${player.name}'s real hits, game by game (2025 season):`, question, answer, why };
}

function genDotPlot(level){
  if(level===3) return genDotFrac();
  const useReal = Math.random()<0.4;
  if(level===1) return useReal ? genDotWholeReal(ri(6,8), ['mode','total']) : genDotWhole(ri(6,8), ri(2,3), ['mode','total']);
  if(level===2) return useReal ? genDotWholeReal(ri(8,9), ['count','range']) : genDotWhole(ri(8,9), ri(3,4), ['count','range']);
  return useReal ? genDotWholeReal(ri(8,12), ['mode','range','count','total']) : genDotWhole(ri(8,12), ri(4,6), ['mode','range','count','total']);
}

/* ---------- Mean vs. Median (6.SP.A.3, 6.SP.B.5) ---------- */
function genMeanOrMedian(forceMean, forceMedian){
  const p = rnd(PLAYERS), s = rnd(SPORTS);
  let v; do{ v = Array.from({length:5},()=>ri(4,16)); } while(v.reduce((a,b)=>a+b,0)%5!==0);
  const sum = v.reduce((a,b)=>a+b,0), mean = sum/5;
  const sorted = [...v].sort((a,b)=>a-b), median = sorted[2];
  const askMean = forceMean ? true : forceMedian ? false : Math.random()<0.5;
  return { kind:'num',
    pre:`${p}'s ${s.stat} in 5 games:`,
    data:v.join(', '),
    question:`What is the ${askMean?'MEAN (average)':'MEDIAN (middle value)'}?`,
    answer: askMean?mean:median,
    why: askMean
      ? `Add them: ${v.join(' + ')} = ${sum}. Divide by 5 → <b>${mean}</b>.`
      : `Line them up: ${sorted.join(', ')}. The middle one is <b>${median}</b>.` };
}

function genOutlier(){
  const p = rnd(PLAYERS), s = rnd(SPORTS);
  const base = Array.from({length:4},()=>ri(6,12));
  const out = ri(30,45);
  const v = [...base,out].sort(()=>Math.random()-0.5);
  const sum = v.reduce((a,b)=>a+b,0);
  const mean = Math.round(sum/5*10)/10;
  const median = [...v].sort((a,b)=>a-b)[2];
  return { kind:'choice',
    pre:`${p}'s ${s.stat} in 5 games:`,
    data:v.join(', '),
    question:`The mean is ${mean} and the median is ${median}. Which one better describes a TYPICAL game?`,
    choices:[`Mean (${mean})`,`Median (${median})`],
    answer:1,
    why:`That one huge game (${out}) pulls the <b>mean</b> way up. The <b>median (${median})</b> stays near the normal games, so it describes a typical night better.` };
}

function genDecimalMeanMedian(){
  const p = rnd(PLAYERS);
  const v = Array.from({length:5},()=>ri(1,9)/10);
  const sum = Math.round(v.reduce((a,b)=>a+b,0)*10)/10;
  const mean = Math.round((sum/5)*100)/100;
  const sorted = [...v].sort((a,b)=>a-b), median = sorted[2];
  const askMean = Math.random()<0.5;
  return { kind:'num',
    pre:`${p}'s shooting percentage in 5 games (as a decimal):`,
    data:v.map(x=>x.toFixed(1)).join(', '),
    question:`What is the ${askMean?'MEAN (average)':'MEDIAN (middle value)'}? Round to the nearest hundredth if needed.`,
    answer: askMean?mean:median,
    why: askMean
      ? `Add them: ${v.map(x=>x.toFixed(1)).join(' + ')} = ${sum}. Divide by 5 → <b>${mean}</b>.`
      : `Line them up: ${sorted.map(x=>x.toFixed(1)).join(', ')}. The middle one is <b>${median}</b>.` };
}

/* Real-data variant: 5 real games from a real player's log. Mean is allowed
   to land on a decimal (round to the nearest tenth) — real stats usually
   don't divide evenly, which is itself a fair thing to learn. */
function genMeanMedianReal(forceMean, forceMedian){
  const { player, window } = pickRealWindow(5);
  const v = window.map(g => g.hits);
  const sum = v.reduce((a,b)=>a+b,0);
  const mean = Math.round((sum/5)*10)/10;
  const sorted = [...v].sort((a,b)=>a-b), median = sorted[2];
  const askMean = forceMean ? true : forceMedian ? false : Math.random()<0.5;
  return { kind:'num',
    pre:`${player.name}'s real hits in 5 games (2025 season):`,
    data:v.join(', '),
    question:`What is the ${askMean?'MEAN (average)':'MEDIAN (middle value)'}?${askMean?' Round to the nearest tenth if needed.':''}`,
    answer: askMean?mean:median,
    why: askMean
      ? `Add them: ${v.join(' + ')} = ${sum}. Divide by 5 → <b>${mean}</b>.`
      : `Line them up: ${sorted.join(', ')}. The middle one is <b>${median}</b>.` };
}

function genMeanMedian(level){
  if(level!==3 && Math.random()<0.4){
    if(level===1) return genMeanMedianReal(true,false);
    if(level===2) return genMeanMedianReal(false,true);
    return genMeanMedianReal(false,false);
  }
  if(level===1) return genMeanOrMedian(true,false);
  if(level===2) return genMeanOrMedian(false,true);
  if(level===3) return genOutlier();
  return genDecimalMeanMedian();
}

/* ---------- Spread & Range (6.SP.A.2) ---------- */
function genRangeWhole(loV,hiV){
  const p = rnd(PLAYERS), s = rnd(SPORTS);
  const v = Array.from({length:5},()=>ri(loV,hiV));
  const mx = Math.max(...v), mn = Math.min(...v);
  return { kind:'num',
    pre:`${p}'s ${s.stat} in 5 games:`,
    data:v.join(', '),
    question:`What is the RANGE (highest − lowest)?`,
    answer:mx-mn,
    why:`Highest = ${mx}, lowest = ${mn}. Range = ${mx} − ${mn} = <b>${mx-mn}</b>.` };
}

function genRangeDecimal(){
  const p = rnd(PLAYERS);
  const v = Array.from({length:5},()=>ri(10,50)/10);
  const mx = Math.max(...v), mn = Math.min(...v);
  const range = Math.round((mx-mn)*10)/10;
  return { kind:'num',
    pre:`${p}'s race times (seconds) in 5 races:`,
    data:v.map(x=>x.toFixed(1)).join(', '),
    question:`What is the RANGE (highest − lowest)?`,
    answer:range,
    why:`Highest = ${mx.toFixed(1)}, lowest = ${mn.toFixed(1)}. Range = ${mx.toFixed(1)} − ${mn.toFixed(1)} = <b>${range.toFixed(1)}</b>.` };
}

function genRangeReal(){
  const { player, window } = pickRealWindow(5);
  const v = window.map(g => g.hits);
  const mx = Math.max(...v), mn = Math.min(...v);
  return { kind:'num',
    pre:`${player.name}'s real hits in 5 games (2025 season):`,
    data:v.join(', '),
    question:`What is the RANGE (highest − lowest)?`,
    answer:mx-mn,
    why:`Highest = ${mx}, lowest = ${mn}. Range = ${mx} − ${mn} = <b>${mx-mn}</b>.` };
}

function genSpread(level){
  if(level===1) return Math.random()<0.4 ? genRangeReal() : genRangeWhole(2,10);
  if(level===2) return Math.random()<0.4 ? genRangeReal() : genRangeWhole(2,30);
  return genRangeDecimal();
}

/* ---------- register ---------- */
Object.assign(SKILLS, {
  stat:{
    title:"Statistical Questions", icon:"🏀⚾⚽", accent:"#ff6a1a",
    domain:'Data & Statistics',
    skill:"Tell a real data question from one with a single answer.",
    std:"6.SP.A.1", maxLevel:2,
    gen:genStatQ,
    coach:`
      <p class="lead">A <b>statistical question</b> is one where you expect the answers to be <b>different</b>. If there's only one possible answer, it's <b>not</b> statistical.</p>
      <div class="compare">
        <div class="col not"><span class="badge">NOT statistical</span><p>"How tall is Maya?"</p><small>Just one answer.</small></div>
        <div class="col yes"><span class="badge">Statistical</span><p>"How tall are the players on the team?"</p><small>Lots of different answers.</small></div>
      </div>
      <p class="tip">Coach tip: statistical questions are usually about a <b>group</b>, and you expect <b>variety</b> in the answers. Watch out for "total" questions — they sound big, but they still have only one answer.</p>`
  },
  graphs:{
    title:"Reading Dot Plots", icon:"⚽", accent:"#28d6e6",
    domain:'Data & Statistics',
    skill:"Read a dot plot: most common value, range, and counts.",
    std:"5.MD.B.2 → 6.SP.B.4", maxLevel:4,
    gen:genDotPlot,
    coach:`
      <p class="lead">A <b>dot plot</b> stacks one dot for each value. A <b>tall stack</b> means that number happens a lot.</p>
      <div class="whiteboard">
        <div class="wb-title">Diego's goals in 9 games</div>
        <div class="wb-data">1, 0, 2, 1, 1, 3, 0, 1, 2</div>
        ${dotPlotHTML({0:2,1:4,2:2,3:1},0,3,true)}
        <div class="wb-row">Most common: <b>1 goal</b> (tallest stack) &nbsp;•&nbsp; Highest 3, lowest 0 → range = <b>3</b></div>
      </div>
      <p class="tip">Coach tip: have him point at the tallest stack first, then read left-to-right. Once that's easy, the dots can stand for fractions of a mile instead of whole numbers — same idea, just add them up.</p>`
  },
  meanmedian:{
    title:"Mean vs. Median", icon:"⚾", accent:"#ff6a1a",
    domain:'Data & Statistics',
    skill:"Find the average and the middle value — and know which to trust.",
    std:"6.SP.A.3, 6.SP.B.5", maxLevel:4,
    gen:genMeanMedian,
    coach:`
      <p class="lead"><b>Mean</b> = add them all, divide by how many (the average). <b>Median</b> = line them up and take the <b>middle</b> one.</p>
      <div class="whiteboard">
        <div class="wb-row">Normal games: <span style="font-family:var(--mono)">8, 10, 9, 11, 12</span></div>
        <div class="wb-calc">Mean = 50 ÷ 5 = <b>10</b> &nbsp;•&nbsp; Median = <b>10</b></div>
        <div class="wb-row hot">With one huge game: <span style="font-family:var(--mono)">8, 10, 9, 11, 40</span></div>
        <div class="wb-calc">Mean = 78 ÷ 5 = <b>15.6</b> &nbsp;•&nbsp; Median = <b>10</b></div>
      </div>
      <p class="tip">Coach tip: when one game is way bigger (an <b>outlier</b>), the <b>median</b> describes a normal night better. Later levels use decimals, like shooting percentages.</p>`
  },
  spread:{
    title:"Spread & Range", icon:"🏀", accent:"#28d6e6",
    domain:'Data & Statistics',
    skill:"Measure how spread out the numbers are: steady or streaky?",
    std:"6.SP.A.2", maxLevel:3,
    gen:genSpread,
    coach:`
      <p class="lead">Two players can have the <b>same average</b> but be totally different — one steady, one streaky. <b>Range = highest − lowest</b> shows how spread out they are.</p>
      <div class="whiteboard">
        <div class="wb-row"><span style="font-family:var(--mono)">Player A: 10, 11, 9, 10, 10</span> → mean 10, range <b>2</b> (steady)</div>
        <div class="wb-row"><span style="font-family:var(--mono)">Player B: 2, 18, 4, 16, 10</span> → mean 10, range <b>16</b> (streaky)</div>
      </div>
      <p class="tip">Coach tip: same average, but Player A is Mr. Reliable. In a close game, who do you want shooting?</p>`
  }
});
