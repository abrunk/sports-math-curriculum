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
  const source = rnd(['mlb','nba','mls']);
  if(source==='mls'){
    const t = rnd(MLS_DATA.teams);
    const [an,ab] = reduceFrac(t.goalsFor, t.goalsAgainst);
    return { kind:'ratio',
      pre:`In the 2025 season, the ${t.name} scored ${t.goalsFor} goals and allowed ${t.goalsAgainst}.`,
      question:`What is their goals-for-to-goals-against ratio, in simplest form?`,
      answer:[an,ab],
      why:`${t.goalsFor}:${t.goalsAgainst} reduces to <b>${an}:${ab}</b> (divide both sides by ${gcd(t.goalsFor,t.goalsAgainst)}).` };
  }
  const t = source==='nba' ? rnd(NBA_DATA.teams) : rnd(MLB_DATA.teams);
  const season = source==='nba' ? '2024-25' : '2025';
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
  const source = rnd(['mlb','nba','mls']);
  if(source==='mls'){
    const t = rnd(MLS_DATA.teams);
    const rate = Math.round((t.goalsFor/t.gamesPlayed)*10)/10;
    return { kind:'num',
      pre:`In the 2025 season, the ${t.name} scored ${t.goalsFor} goals across ${t.gamesPlayed} games.`,
      question:`What is their scoring rate, in goals per game, rounded to the nearest tenth?`,
      answer:rate,
      why:`${t.goalsFor} ÷ ${t.gamesPlayed} = <b>${rate}</b> goals per game.` };
  }
  if(source==='nba'){
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
  const source = rnd(['mlb','nba','mls']);
  if(source==='mls'){
    const t = rnd(MLS_DATA.teams);
    const pct = Math.round((t.wins/t.gamesPlayed)*100);
    return { kind:'num',
      pre:`In the 2025 season, the ${t.name} won ${t.wins} of their ${t.gamesPlayed} games.`,
      question:`What percent of their games did they win? Round to the nearest whole percent.`,
      answer:pct,
      why:`${t.wins} ÷ ${t.gamesPlayed} = ${(t.wins/t.gamesPlayed).toFixed(3)} ≈ <b>${pct}%</b>.` };
  }
  if(source==='nba'){
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
    coach:`<p class="lead">A <b>ratio</b> compares two quantities and keeps their relationship the same even when the actual numbers change. You simplify a ratio exactly like a fraction — divide both sides by their greatest common factor. Ratios also <b>scale</b>: if you know the ratio between two things and the real value of one of them, you can find the scale factor and use it to find the other.</p>

      <p class="lead">The Riverside Hawks have played 12 games this month: 8 wins and 4 losses. What is their win-to-loss ratio, in simplest form?</p>
      <div class="whiteboard">
        ${ratioIconsHTML('🏀',8,'Wins (8)','❌',4,'Losses (4)')}
        <div class="wb-row">Step 1 — write the ratio exactly as given: 8:4.</div>
        <div class="wb-row">Step 2 — find the greatest common factor of 8 and 4, which is 4. Divide both sides by it: 8÷4 = 2, and 4÷4 = 1.</div>
        <div class="wb-row">Step 3 — the simplest form is <b>2:1</b> — for every 2 wins, 1 loss.</div>
      </div>

      <p class="lead">Ratios also let you scale up or down. Sofia makes free throws at a ratio of 3 makes for every 5 attempts. If she takes 20 free throws in a tournament, how many should she make to keep that same ratio?</p>
      <div class="whiteboard">
        ${ratioIconsHTML('🏀',3,'Makes (per set of 5 attempts)','⭕',5,'Attempts (one set)')}
        <div class="wb-row">Step 1 — figure out the scale factor by comparing the attempts side: 20 attempts ÷ 5 (the ratio's attempt side) = 4. She's taking 4 full "sets" of the ratio.</div>
        <div class="wb-row">Step 2 — apply that same scale factor to the makes side: 3 × 4 = <b>12</b> makes.</div>
      </div>

      <p class="lead">Sometimes you're given one side of the ratio plus its real value, and asked for the total. Diego's team has a win-to-loss ratio of 3:2 this season, and they've already won 18 games. How many games have they played in total?</p>
      <div class="whiteboard">
        ${ratioIconsHTML('🏆',3,'Ratio: wins side (3)','💔',2,'Ratio: losses side (2)')}
        <div class="wb-row">Step 1 — the wins side of the ratio is 3, and the real number of wins is 18, so the scale factor is 18 ÷ 3 = 6.</div>
        <div class="wb-row">Step 2 — apply the same scale factor to the losses side: 2 × 6 = 12 losses.</div>
        <div class="wb-row">Step 3 — total games = wins + losses = 18 + 12 = <b>30</b> games.</div>
      </div>

      <p class="tip">Coach tip: enter ratio answers as two numbers separated by a colon, just like the notation.</p>`
  },
  unitrates:{
    title:"Unit Rates", icon:"⏱️", accent:"#28d6e6",
    domain:'Ratios & Rates',
    skill:"Find and compare rates: points per game, cost per ticket, and more.",
    std:"6.RP.A.2, 6.RP.A.3.b", maxLevel:4, gen:genUnitRates,
    coach:`<p class="lead">A <b>unit rate</b> tells you how much of something happens for just <b>one</b> of something else — points per game, dollars per ticket, miles per hour. It's what makes two different-sized situations comparable: 36 points in 4 games and 45 points in 5 games both come out to the same 9 points per game. Find any unit rate by dividing the total by the number of units.</p>

      <p class="lead">Diego scored 36 points across 4 games this week. His coach wants to know his scoring rate: how many points per game is that, on average?</p>
      <div class="whiteboard">
        <div class="wb-row">Step 1 — "per game" is the clue to divide: total points ÷ number of games = 36 ÷ 4 = <b>9</b> points per game.</div>
        ${numberLineHTML([9,18,27,36], [], 0, 36)}
        <div class="wb-row">Step 2 — check it: each game's running total lands exactly 9 apart on the number line (9, 18, 27, 36), which confirms a steady rate of 9 points per game.</div>
      </div>

      <p class="lead">The concession stand sold 180 hot dogs over 6 hours during the game. What's the rate, in hot dogs per hour?</p>
      <div class="whiteboard">
        ${numberLineHTML([30,60,90,120,150,180], [], 0, 180)}
        <div class="wb-row">180 hot dogs ÷ 6 hours = <b>30</b> hot dogs per hour.</div>
      </div>

      <p class="lead">Unit rates also let you compare two different situations fairly. Priya scored 27 points in 3 games. Theo scored 32 points in 4 games. Who has the better scoring rate?</p>
      <div class="whiteboard">
        ${ratioIconsHTML('🏀',9,'Priya: 27 ÷ 3 = 9 pts/game','🏀',8,'Theo: 32 ÷ 4 = 8 pts/game')}
        <div class="wb-row">Step 1 — find each unit rate separately: Priya = 27 ÷ 3 = 9 points per game. Theo = 32 ÷ 4 = 8 points per game.</div>
        <div class="wb-row">Step 2 — compare the two unit rates directly, since they're now both "per 1 game": 9 > 8, so <b>Priya</b> has the better rate.</div>
      </div>

      <p class="lead">Unit rates work for prices too. The team sold 8 jerseys for a total of $96. What was the price per jersey?</p>
      <div class="whiteboard">
        <div class="wb-row">$96 ÷ 8 jerseys = <b>$12</b> per jersey.</div>
      </div>

      <p class="tip">Coach tip: the "per" in "points per game" is always a clue to divide.</p>`
  },
  percentages:{
    title:"Percentages", icon:"💯", accent:"#ffcf3f",
    domain:'Ratios & Rates',
    skill:"Find a percent of a number, what percent one number is of another, and percent change.",
    std:"6.RP.A.3.c", maxLevel:4, gen:genPercentages,
    coach:`<p class="lead">A percent is just a special ratio — always out of <b>100</b>. That common base is what makes percents easy to compare, even when the actual totals are totally different sizes (75% of 20 free throws and 75% of 200 free throws both mean "three out of every four"). To find a percent <b>of</b> a number, turn the percent into a fraction over 100 (then simplify) and multiply. To find what percent one number <b>is</b> of another, divide the part by the whole and read the decimal as a percent.</p>

      <p class="lead">Leo attempted 40 free throws this season and made 75% of them. How many did he make?</p>
      <div class="whiteboard">
        <div class="wb-row">Step 1 — 75% means 75/100, which simplifies to 3/4.</div>
        ${fracBarHTML(3,4,"75% simplified to a fraction: 3/4")}
        <div class="wb-row">Step 2 — split the 40 attempts into 4 equal parts (since the denominator is 4): 40 ÷ 4 = 10 per part.</div>
        <div class="wb-row">Step 3 — take 3 of those parts: 3 × 10 = <b>30</b> makes.</div>
      </div>

      <p class="lead">Now the reverse: Maya made 15 out of 20 free throw attempts. What percent did she make?</p>
      <div class="whiteboard">
        ${fracBarHTML(15,20,"Maya's makes: 15 out of 20 attempts")}
        <div class="wb-row">Step 1 — write it as a fraction of the whole: 15/20, which simplifies to 3/4.</div>
        <div class="wb-row">Step 2 — turn the fraction into a percent by scaling it up to a denominator of 100: 100 ÷ 4 = 25, so 3 × 25 = <b>75%</b>.</div>
      </div>

      <p class="lead">Sometimes you know the percent and the part, but need the whole. Jamal made 24 free throws, and that was 60% of all his attempts. How many attempts did he take in total?</p>
      <div class="whiteboard">
        ${fracBarHTML(3,5,"60% simplified to a fraction: 3/5")}
        <div class="wb-row">Step 1 — 60% simplifies to 3/5, and the 24 makes represent the "3" part.</div>
        <div class="wb-row">Step 2 — find the value of one part: 24 ÷ 3 = 8.</div>
        <div class="wb-row">Step 3 — the whole is 5 parts: 8 × 5 = <b>40</b> attempts in total.</div>
      </div>

      <p class="lead">Percents also describe how much something changed. Ticket prices for the team went from $40 to $50. What percent increase is that?</p>
      <div class="whiteboard">
        ${numberLineHTML([40,50], [{value:40,label:'Before: $40',color:'var(--orange)'},{value:50,label:'After: $50',color:'var(--cyan)'}], 35, 55)}
        <div class="wb-row">Step 1 — find the change: $50 − $40 = $10.</div>
        <div class="wb-row">Step 2 — percent change always compares the change to the ORIGINAL amount, not the new one: $10 ÷ $40 = 0.25.</div>
        <div class="wb-row">Step 3 — 0.25 as a percent is <b>25%</b>.</div>
      </div>

      <p class="tip">Coach tip: "what percent OF" means multiply; "what percent IS" means divide; percent change always divides by the ORIGINAL amount.</p>`
  }
});
