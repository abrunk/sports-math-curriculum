/* Ratios & Rates domain (6.RP). Each skill coin-flips between a sports word
   problem and a bare computation rep at the same level, same pattern as the
   other domains. */

/* ---------- Ratios & Equivalent Ratios (6.RP.A.1, 6.RP.A.3.a) ---------- */
function genRatioExpressWord(){
  const p = rnd(PLAYERS);
  const g = ri(2,6);
  const rn = ri(1,6), rd = ri(1,6);
  const a = rn*g, b = rd*g;
  const [an,ab] = reduceFrac(a,b);
  const contexts = [
    { label:`${p}'s team has ${a} wins and ${b} losses this season.`, q:`What is the ratio of wins to losses, in simplest form?` },
    { label:`There are ${a} boys and ${b} girls signed up for the league.`, q:`What is the ratio of boys to girls, in simplest form?` },
    { label:`${p} made ${a} free throws and missed ${b}.`, q:`What is the ratio of makes to misses, in simplest form?` }
  ];
  const c = rnd(contexts);
  return { kind:'ratio', pre:c.label, question:c.q, answer:[an,ab],
    why:`${a}:${b} reduces to <b>${an}:${ab}</b> (divide both sides by ${gcd(a,b)}).` };
}
function genRatioExpressBare(){
  const g = ri(2,6);
  const rn = ri(1,6), rd = ri(1,6);
  const a = rn*g, b = rd*g;
  const [an,ab] = reduceFrac(a,b);
  return { kind:'ratio', question:`Simplify the ratio ${a}:${b}.`, answer:[an,ab],
    why:`Divide both sides by ${gcd(a,b)}: ${a}:${b} = <b>${an}:${ab}</b>.` };
}
function genRatioScaleWord(){
  const p = rnd(PLAYERS);
  const [bn,bd] = reduceFrac(ri(2,6), ri(2,6));
  const scale = ri(2,8);
  const totalA = bn*scale, totalB = bd*scale;
  const askForA = Math.random()<0.5;
  const pre = `The ratio of made shots to attempted shots for ${p} is ${bn}:${bd}.`;
  if(askForA){
    return { kind:'num', pre, question:`If ${p} attempted ${totalB} shots, how many did ${p} make?`, answer:totalA,
      why:`${totalB} ÷ ${bd} = ${scale}. Made = ${bn} × ${scale} = <b>${totalA}</b>.` };
  }
  return { kind:'num', pre, question:`If ${p} made ${totalA} shots, how many did ${p} attempt?`, answer:totalB,
    why:`${totalA} ÷ ${bn} = ${scale}. Attempted = ${bd} × ${scale} = <b>${totalB}</b>.` };
}
function genRatioScaleBare(){
  const [bn,bd] = reduceFrac(ri(2,6), ri(2,6));
  const scale = ri(2,8);
  const totalA = bn*scale, totalB = bd*scale;
  const askForA = Math.random()<0.5;
  if(askForA){
    return { kind:'num', question:`The ratio of A to B is ${bn}:${bd}. If B = ${totalB}, what is A?`, answer:totalA,
      why:`${totalB} ÷ ${bd} = ${scale}. A = ${bn} × ${scale} = <b>${totalA}</b>.` };
  }
  return { kind:'num', question:`The ratio of A to B is ${bn}:${bd}. If A = ${totalA}, what is B?`, answer:totalB,
    why:`${totalA} ÷ ${bn} = ${scale}. B = ${bd} × ${scale} = <b>${totalB}</b>.` };
}
function genRatioTotalWord(rMax, scaleMax){
  const p = rnd(PLAYERS);
  const [bn,bd] = reduceFrac(ri(2,rMax), ri(2,rMax));
  const scale = ri(2,scaleMax);
  const totalA = bn*scale, totalB = bd*scale, total = totalA+totalB;
  return { kind:'num',
    pre:`${p}'s team has a win-to-loss ratio of ${bn}:${bd}. They've won ${totalA} games so far.`,
    question:`How many games have they played in total (wins + losses)?`,
    answer:total,
    why:`${totalA} ÷ ${bn} = ${scale}. Losses = ${bd} × ${scale} = ${totalB}. Total = ${totalA} + ${totalB} = <b>${total}</b>.` };
}
function genRatioTotalBare(rMax, scaleMax){
  const [bn,bd] = reduceFrac(ri(2,rMax), ri(2,rMax));
  const scale = ri(2,scaleMax);
  const totalA = bn*scale, totalB = bd*scale, total = totalA+totalB;
  return { kind:'num', question:`The ratio of A to B is ${bn}:${bd}. If A = ${totalA}, what is A + B?`, answer:total,
    why:`${totalA} ÷ ${bn} = ${scale}. B = ${bd} × ${scale} = ${totalB}. A + B = <b>${total}</b>.` };
}
function genRatioRealWord(){
  const useNBA = Math.random()<0.5;
  const t = useNBA ? rnd(NBA_DATA.teams) : rnd(MLB_DATA.teams);
  const season = useNBA ? '2024-25' : '2025';
  const [an,ab] = reduceFrac(t.wins, t.losses);
  return { kind:'ratio',
    pre:`In the ${season} season, the ${t.name} finished ${t.wins}-${t.losses}.`,
    question:`What is their win-loss ratio, in simplest form?`,
    answer:[an,ab],
    why:`${t.wins}:${t.losses} reduces to <b>${an}:${ab}</b> (divide both sides by ${gcd(t.wins,t.losses)}).` };
}

function genRatiosWord(level){
  if(level===1) return genRatioExpressWord();
  if(level===2) return genRatioScaleWord();
  if(level===3) return genRatioTotalWord(7,9);
  return genRatioTotalWord(9,15);
}
function genRatiosBare(level){
  if(level===1) return genRatioExpressBare();
  if(level===2) return genRatioScaleBare();
  if(level===3) return genRatioTotalBare(7,9);
  return genRatioTotalBare(9,15);
}
function genRatios(level){
  if(level===1 && Math.random()<0.4) return genRatioRealWord();
  return Math.random()<0.5 ? genRatiosWord(level) : genRatiosBare(level);
}

/* ---------- Unit Rates (6.RP.A.2, 6.RP.A.3.b) ---------- */
function genUnitRateWord(level){
  const p = rnd(PLAYERS);
  if(level===1){
    const rate=ri(2,9), games=ri(2,6), total=rate*games;
    return { kind:'num', pre:`${p} scored ${total} points over ${games} games.`, question:`How many points per game is that?`, answer:rate,
      why:`${total} ÷ ${games} = <b>${rate}</b> points per game.` };
  }
  if(level===2){
    const rate=ri(10,60), hours=ri(2,8), total=rate*hours;
    return { kind:'num', pre:`The concession stand sold ${total} hot dogs over ${hours} hours.`, question:`How many hot dogs per hour is that?`, answer:rate,
      why:`${total} ÷ ${hours} = <b>${rate}</b> hot dogs per hour.` };
  }
  if(level===3){
    const others = PLAYERS.filter(x=>x!==p);
    const p2 = rnd(others);
    let r1=ri(3,9), g1=ri(2,5), r2=ri(3,9), g2=ri(2,5);
    if(r1===r2) r2 = r1===9?r1-1:r1+1;
    const t1=r1*g1, t2=r2*g2;
    return { kind:'choice',
      pre:`${p} scored ${t1} points in ${g1} games. ${p2} scored ${t2} points in ${g2} games.`,
      question:`Who has the better points-per-game rate?`,
      choices:[p, p2],
      answer: r1>r2?0:1,
      why:`${p}: ${t1} ÷ ${g1} = ${r1} per game. ${p2}: ${t2} ÷ ${g2} = ${r2} per game. <b>${r1>r2?p:p2}</b> has the better rate.` };
  }
  const price = ri(2,20)/4, units=ri(3,10), total=Math.round(price*units*100)/100;
  return { kind:'num', pre:`${p}'s team sold ${units} team jerseys for a total of $${total.toFixed(2)}.`, question:`What was the price per jersey?`, answer:price,
    why:`$${total.toFixed(2)} ÷ ${units} = <b>$${price.toFixed(2)}</b> per jersey.` };
}
function genUnitRateBare(level){
  if(level===1){ const rate=ri(2,9), n=ri(2,6), total=rate*n;
    return { kind:'num', question:`Find the unit rate: ${total} for ${n}.`, answer:rate, why:`${total} ÷ ${n} = <b>${rate}</b> per 1.` }; }
  if(level===2){ const rate=ri(10,60), n=ri(2,8), total=rate*n;
    return { kind:'num', question:`Find the unit rate: ${total} for ${n}.`, answer:rate, why:`${total} ÷ ${n} = <b>${rate}</b> per 1.` }; }
  if(level===3){
    let r1=ri(3,9), g1=ri(2,5), r2=ri(3,9), g2=ri(2,5);
    if(r1===r2) r2 = r1===9?r1-1:r1+1;
    const t1=r1*g1, t2=r2*g2;
    const label1=`${t1} for ${g1}`, label2=`${t2} for ${g2}`;
    return { kind:'choice', question:`Which is the better rate?`, choices:[label1,label2], answer:r1>r2?0:1,
      why:`${label1} = ${r1} per 1. ${label2} = ${r2} per 1. <b>${r1>r2?label1:label2}</b> is better.` };
  }
  const price = ri(2,20)/4, units=ri(3,10), total=Math.round(price*units*100)/100;
  return { kind:'num', question:`Find the unit rate: $${total.toFixed(2)} for ${units}.`, answer:price, why:`$${total.toFixed(2)} ÷ ${units} = <b>$${price.toFixed(2)}</b> per 1.` };
}
function genUnitRateRealWord(){
  if(Math.random()<0.5){
    const t = rnd(NBA_DATA.teams);
    const totalPoints = t.games.reduce((a,g)=>a+g.points,0);
    const numGames = t.games.length;
    const rate = Math.round((totalPoints/numGames)*10)/10;
    return { kind:'num',
      pre:`In the 2024-25 season, the ${t.name} scored ${totalPoints} total points across ${numGames} games.`,
      question:`What is their scoring rate, in points per game, rounded to the nearest tenth?`,
      answer:rate,
      why:`${totalPoints} ÷ ${numGames} = <b>${rate}</b> points per game.` };
  }
  const p = rnd(MLB_DATA.players);
  const totalHits = p.games.reduce((a,g)=>a+g.hits,0);
  const totalAB = p.games.reduce((a,g)=>a+g.atBats,0);
  const rate = Math.round((totalHits/totalAB)*100)/100;
  return { kind:'num',
    pre:`In the 2025 season, ${p.name} got ${totalHits} hits in ${totalAB} at-bats.`,
    question:`What is that rate, as a decimal rounded to the nearest hundredth?`,
    answer:rate,
    why:`${totalHits} ÷ ${totalAB} = <b>${rate.toFixed(2)}</b>.` };
}
function genUnitRates(level){
  if(level===4 && Math.random()<0.4) return genUnitRateRealWord();
  return Math.random()<0.5 ? genUnitRateWord(level) : genUnitRateBare(level);
}

/* ---------- Percentages (6.RP.A.3.c) ---------- */
const PCT_POOL = [10,20,25,40,50,60,75,80,90];
function genPercentOfWord(){
  const p = rnd(PLAYERS);
  const pct = rnd(PCT_POOL), whole = ri(1,10)*20, part = Math.round(whole*pct/100);
  return { kind:'num', pre:`${p} attempted ${whole} free throws this season.`, question:`${p} made ${pct}% of them. How many did ${p} make?`, answer:part,
    why:`${pct}% of ${whole} = ${pct}/100 × ${whole} = <b>${part}</b>.` };
}
function genPercentFindWord(){
  const p = rnd(PLAYERS);
  const pct = rnd(PCT_POOL), whole = ri(1,10)*20, part = Math.round(whole*pct/100);
  return { kind:'num', pre:`${p} made ${part} out of ${whole} free throw attempts.`, question:`What percent did ${p} make?`, answer:pct,
    why:`${part} ÷ ${whole} = ${(part/whole).toFixed(2)} = <b>${pct}%</b>.` };
}
function genPercentWholeWord(){
  const p = rnd(PLAYERS);
  const pct = rnd(PCT_POOL), whole = ri(1,10)*20, part = Math.round(whole*pct/100);
  return { kind:'num', pre:`${p} made ${part} free throws, which was ${pct}% of ${p}'s attempts.`, question:`How many attempts did ${p} take in total?`, answer:whole,
    why:`${part} ÷ (${pct}/100) = <b>${whole}</b>.` };
}
function genPercentChangeWord(){
  const p = rnd(PLAYERS);
  const pct = rnd([10,20,25,50]), before = ri(1,10)*20, change = Math.round(before*pct/100);
  const isIncrease = Math.random()<0.5;
  const after = isIncrease ? before+change : before-change;
  return { kind:'num',
    pre:`Ticket prices for ${p}'s team ${isIncrease?'went up':'went down'} from $${before} to $${after}.`,
    question:`What percent ${isIncrease?'increase':'decrease'} is that?`,
    answer:pct,
    why:`Change = $${Math.abs(after-before)}. ${Math.abs(after-before)} ÷ ${before} = ${(Math.abs(after-before)/before).toFixed(2)} = <b>${pct}%</b>.` };
}
function genPercentagesWord(level){
  if(level===1) return genPercentOfWord();
  if(level===2) return genPercentFindWord();
  if(level===3) return genPercentWholeWord();
  return genPercentChangeWord();
}
function genPercentagesBare(level){
  if(level===1){ const pct=rnd(PCT_POOL), whole=ri(1,10)*20, part=Math.round(whole*pct/100);
    return { kind:'num', question:`What is ${pct}% of ${whole}?`, answer:part, why:`${pct}% of ${whole} = <b>${part}</b>.` }; }
  if(level===2){ const pct=rnd(PCT_POOL), whole=ri(1,10)*20, part=Math.round(whole*pct/100);
    return { kind:'num', question:`${part} is what percent of ${whole}?`, answer:pct, why:`${part} ÷ ${whole} = <b>${pct}%</b>.` }; }
  if(level===3){ const pct=rnd(PCT_POOL), whole=ri(1,10)*20, part=Math.round(whole*pct/100);
    return { kind:'num', question:`${part} is ${pct}% of what number?`, answer:whole, why:`${part} ÷ (${pct}/100) = <b>${whole}</b>.` }; }
  const pct=rnd([10,20,25,50]), before=ri(1,10)*20, change=Math.round(before*pct/100), isIncrease=Math.random()<0.5;
  const after=isIncrease?before+change:before-change;
  return { kind:'num', question:`A number goes from ${before} to ${after}. What percent ${isIncrease?'increase':'decrease'} is that?`, answer:pct,
    why:`Change = ${Math.abs(after-before)}. ${Math.abs(after-before)} ÷ ${before} = <b>${pct}%</b>.` };
}
function genPercentRealWord(){
  if(Math.random()<0.5){
    const t = rnd(NBA_DATA.teams);
    const pct = Math.round((t.wins/(t.wins+t.losses))*100);
    return { kind:'num',
      pre:`In the 2024-25 season, the ${t.name} went ${t.wins}-${t.losses}.`,
      question:`What percent of their games did they win? Round to the nearest whole percent.`,
      answer:pct,
      why:`${t.wins} ÷ ${t.wins+t.losses} = ${(t.wins/(t.wins+t.losses)).toFixed(3)} ≈ <b>${pct}%</b>.` };
  }
  const p = rnd(MLB_DATA.players);
  const totalHits = p.games.reduce((a,g)=>a+g.hits,0);
  const totalAB = p.games.reduce((a,g)=>a+g.atBats,0);
  const pct = Math.round((totalHits/totalAB)*100);
  return { kind:'num',
    pre:`In the 2025 season, ${p.name} got ${totalHits} hits in ${totalAB} at-bats.`,
    question:`What percent of at-bats resulted in a hit? Round to the nearest whole percent.`,
    answer:pct,
    why:`${totalHits} ÷ ${totalAB} = ${(totalHits/totalAB).toFixed(3)} ≈ <b>${pct}%</b>.` };
}
function genPercentages(level){
  if(level===2 && Math.random()<0.4) return genPercentRealWord();
  return Math.random()<0.5 ? genPercentagesWord(level) : genPercentagesBare(level);
}

/* ---------- register ---------- */
Object.assign(SKILLS, {
  ratios:{
    title:"Ratios & Equivalent Ratios", icon:"⚖️", accent:"#ff6a1a",
    domain:'Ratios & Rates',
    skill:"Express, simplify, and scale ratios using team and player stats.",
    std:"6.RP.A.1, 6.RP.A.3.a", maxLevel:4, gen:genRatios,
    coach:`<p class="lead">A <b>ratio</b> compares two quantities, written A:B. You can simplify a ratio the same way you simplify a fraction — divide both sides by their greatest common factor. Ratios also <b>scale</b>: if you know the ratio and one quantity, you can find the other by figuring out the scale factor first.</p>
      <div class="whiteboard">
        <div class="wb-row">Simplify: <span style="font-family:var(--mono)">8:12 = 2:3</span> (divide both by 4)</div>
        <div class="wb-row">Scale: ratio 2:3, if the "3" side is 15, scale factor = 15÷3 = 5, so the "2" side = 2×5 = <b>10</b></div>
      </div>
      <p class="tip">Coach tip: enter ratio answers as two numbers separated by a colon, just like the notation.</p>`
  },
  unitrates:{
    title:"Unit Rates", icon:"⏱️", accent:"#28d6e6",
    domain:'Ratios & Rates',
    skill:"Find and compare rates: points per game, cost per ticket, and more.",
    std:"6.RP.A.2, 6.RP.A.3.b", maxLevel:4, gen:genUnitRates,
    coach:`<p class="lead">A <b>unit rate</b> tells you how much of something happens for just <b>one</b> of something else — points per game, dollars per ticket. Find it by dividing the total by the number of units.</p>
      <div class="whiteboard">
        <div class="wb-row">36 points in 4 games → 36 ÷ 4 = <b>9</b> points per game</div>
        <div class="wb-row">To compare two rates, find both unit rates and see which is bigger.</div>
      </div>
      <p class="tip">Coach tip: the "per" in "points per game" is always a clue to divide.</p>`
  },
  percentages:{
    title:"Percentages", icon:"💯", accent:"#ffcf3f",
    domain:'Ratios & Rates',
    skill:"Find a percent of a number, what percent one number is of another, and percent change.",
    std:"6.RP.A.3.c", maxLevel:4, gen:genPercentages,
    coach:`<p class="lead">A percent is just a ratio out of 100. To find a percent of a number, turn the percent into a fraction over 100 and multiply. To find what percent one number is of another, divide and read it as a percent.</p>
      <div class="whiteboard">
        <div class="wb-row">75% of 20 = 75/100 × 20 = <b>15</b></div>
        <div class="wb-row">15 out of 20 = 15 ÷ 20 = 0.75 = <b>75%</b></div>
      </div>
      <p class="tip">Coach tip: percent change = (change ÷ original amount), turned into a percent.</p>`
  }
});
