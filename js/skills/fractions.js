/* Fractions domain (5.NF): one skill, ramping add/sub → multiply → divide. */

function lcm(a,b){ return a*b/gcd(a,b); }

/* Level 1: add/subtract, like denominators.
   The denominator must be ONE explicitly-shared whole ("attempted d shots
   this game") — earlier wording split it across "the first half" and "the
   second half" separately, which read like two different totals and
   nudged kids toward adding denominators too (1/8 + 3/8 -> wrongly "4/16"). */
function genFracLike(){
  const p = rnd(PLAYERS);
  const d = rnd([5,6,8,10,12]);
  const isAdd = Math.random()<0.6;
  let n1,n2,ansN,question;
  if(isAdd){
    n1 = ri(1, d-2);
    n2 = ri(1, d-1-n1);
    ansN = n1+n2;
    question = `What fraction of ${p}'s shots did ${p} make in total?`;
  } else {
    n1 = ri(2, d-2);
    n2 = ri(1, Math.min(n1-1, d-n1));
    ansN = n1-n2;
    question = `What fraction MORE of ${p}'s shots did ${p} make in the first half than the second half?`;
  }
  const pre = `${p} attempted ${d} shots this game, making ${n1} in the first half and ${n2} in the second half.`;
  const [an,ad] = reduceFrac(ansN, d);
  return { kind:'frac', pre, question, answer:[an,ad],
    why: `Same denominator, so just ${isAdd?'add':'subtract'} the tops: ${n1}/${d} ${isAdd?'+':'−'} ${n2}/${d} = ${ansN}/${d} = <b>${fracLabel(an,ad)}</b>.`
  };
}

/* Level 2: add/subtract, unlike denominators */
function genFracUnlike(){
  const p = rnd(PLAYERS);
  const denoms = [2,3,4,5,6,8];
  let d1,d2;
  do{ d1=rnd(denoms); d2=rnd(denoms); } while(d1===d2);
  let n1=ri(1,d1-1), n2=ri(1,d2-1);
  const isAdd = Math.random()<0.6;
  if(!isAdd && n1*d2 < n2*d1){ [d1,d2]=[d2,d1]; [n1,n2]=[n2,n1]; }
  const L = lcm(d1,d2);
  const c1 = n1*(L/d1), c2 = n2*(L/d2);
  const resultNum = isAdd ? c1+c2 : c1-c2;
  const [an,ad] = reduceFrac(resultNum, L);
  let pre, question;
  if(isAdd){
    pre = `${p} ran ${n1}/${d1} of a mile in the morning and ${n2}/${d2} of a mile in the evening.`;
    question = `What is the TOTAL distance ${p} ran that day, as a fraction of a mile?`;
  } else {
    pre = `${p}'s water bottle holds ${n1}/${d1} of a liter. During practice, ${p} drank ${n2}/${d2} of a liter.`;
    question = `How much water is LEFT in the bottle, as a fraction of a liter?`;
  }
  return { kind:'frac', pre, question, answer:[an,ad],
    why: `Common denominator is ${L}: ${n1}/${d1} = ${c1}/${L}, ${n2}/${d2} = ${c2}/${L}. ${isAdd?'Add':'Subtract'} the tops: ${c1} ${isAdd?'+':'−'} ${c2} = ${resultNum}, so the answer is ${resultNum}/${L} = <b>${fracLabel(an,ad)}</b>.`
  };
}

/* Level 3: multiply a whole number by a fraction */
function genFracMultiply(){
  const p = rnd(PLAYERS);
  const d = rnd([2,3,4,5,6,8]);
  const n = ri(1,d-1);
  const multiplier = ri(2,6);
  const whole = d*multiplier;
  const ans = (whole/d)*n;
  return { kind:'num',
    pre: `${p}'s team took ${whole} shots this game.`,
    question: `${n}/${d} of the shots were makes. How many shots did they MAKE?`,
    answer: ans,
    why: `${whole} ÷ ${d} = ${whole/d} shots per "part." ${n}/${d} of ${whole} = ${n} × ${whole/d} = <b>${ans}</b>.`
  };
}

/* Level 4: divide a fraction by a whole number */
function genFracDivide(){
  const d = rnd([2,3,4,5,6]);
  const n = ri(1,d-1);
  const divisor = ri(2,5);
  const [an,ad] = reduceFrac(n, d*divisor);
  return { kind:'frac',
    pre: `The team has ${n}/${d} of an hour left for practice, split evenly across ${divisor} drills.`,
    question: `How much time (as a fraction of an hour) is each drill?`,
    answer:[an,ad],
    why: `Dividing by ${divisor} means multiplying the bottom by ${divisor}: ${n}/${d} ÷ ${divisor} = ${n}/${d*divisor} = <b>${fracLabel(an,ad)}</b>.`
  };
}

/* Bare computation reps — same math as above, no sports story. Interleaved into
   Play mode as extra repetition, per the user's request for Kumon-style drilling
   folded into the skill itself rather than a separate area. */
function genFracBare(level){
  if(level===1){
    const d = rnd([4,5,6,8,10,12]);
    const isAdd = Math.random()<0.6;
    let n1,n2,ansN;
    if(isAdd){ n1=ri(1,d-2); n2=ri(1,d-1-n1); ansN=n1+n2; }
    else { n1=ri(3,d-1); n2=ri(1,n1-1); ansN=n1-n2; }
    const [an,ad]=reduceFrac(ansN,d);
    return { kind:'frac', question:`${n1}/${d} ${isAdd?'+':'−'} ${n2}/${d} = ?`, answer:[an,ad],
      why:`Same denominator: ${n1} ${isAdd?'+':'−'} ${n2} = ${ansN}, over ${d} → <b>${fracLabel(an,ad)}</b>.` };
  }
  if(level===2){
    const denoms=[2,3,4,5,6,8];
    let d1,d2; do{ d1=rnd(denoms); d2=rnd(denoms); }while(d1===d2);
    let n1=ri(1,d1-1), n2=ri(1,d2-1);
    const isAdd = Math.random()<0.6;
    if(!isAdd && n1*d2<n2*d1){ [d1,d2]=[d2,d1]; [n1,n2]=[n2,n1]; }
    const L=lcm(d1,d2);
    const c1=n1*(L/d1), c2=n2*(L/d2);
    const resultNum = isAdd ? c1+c2 : c1-c2;
    const [an,ad]=reduceFrac(resultNum,L);
    return { kind:'frac', question:`${n1}/${d1} ${isAdd?'+':'−'} ${n2}/${d2} = ?`, answer:[an,ad],
      why:`Common denominator ${L}: ${n1}/${d1}=${c1}/${L}, ${n2}/${d2}=${c2}/${L}. ${c1} ${isAdd?'+':'−'} ${c2} = ${resultNum} → <b>${fracLabel(an,ad)}</b>.` };
  }
  if(level===3){
    const d1=rnd([2,3,4,5]), n1=ri(1,d1-1);
    const d2=rnd([2,3,4,5]), n2=ri(1,d2-1);
    const [an,ad]=reduceFrac(n1*n2, d1*d2);
    return { kind:'frac', question:`${n1}/${d1} × ${n2}/${d2} = ?`, answer:[an,ad],
      why:`Multiply straight across: (${n1}×${n2})/(${d1}×${d2}) = ${n1*n2}/${d1*d2} → <b>${fracLabel(an,ad)}</b>.` };
  }
  const d1=rnd([2,3,4,5]), n1=ri(1,d1-1);
  const d2=rnd([2,3,4,5]), n2=ri(1,d2-1);
  const [an,ad]=reduceFrac(n1*d2, d1*n2);
  return { kind:'frac', question:`${n1}/${d1} ÷ ${n2}/${d2} = ?`, answer:[an,ad],
    why:`Flip the second fraction and multiply: ${n1}/${d1} × ${d2}/${n2} = ${n1*d2}/${d1*n2} → <b>${fracLabel(an,ad)}</b>.` };
}

function genFractionOpsWord(level){
  if(level===1) return genFracLike();
  if(level===2) return genFracUnlike();
  if(level===3) return genFracMultiply();
  return genFracDivide();
}

function genFractionOps(level){
  return Math.random()<0.5 ? genFractionOpsWord(level) : genFracBare(level);
}

Object.assign(SKILLS, {
  fractionops:{
    title:"Fraction Operations", icon:"🥎", accent:"#ffcf3f",
    domain:'Fractions',
    skill:"Add, subtract, multiply, and divide fractions using sports stats.",
    std:"5.NF", maxLevel:4,
    gen:genFractionOps,
    coach:`
      <p class="lead">Fractions with the <b>same denominator</b> are already talking about equal-sized pieces, so you can add or subtract the top numbers directly and leave the bottom alone. When the denominators are <b>different</b>, the pieces are different sizes — you have to rewrite both fractions using a shared, common denominator before you can combine them at all.</p>
      <div class="whiteboard">
        <div class="wb-row">Same bottom (free throws): <span style="font-family:var(--mono)">2/8 + 3/8 = 5/8</span> of attempts made</div>
        <div class="wb-row">Same bottom, subtracting (goals): <span style="font-family:var(--mono)">5/6 − 2/6 = 3/6 = 1/2</span></div>
        <div class="wb-row">Different bottoms (distance run): <span style="font-family:var(--mono)">1/2 + 1/3</span> → common denominator 6 → <span style="font-family:var(--mono)">3/6 + 2/6 = 5/6</span> mile</div>
      </div>
      <p class="lead">To <b>multiply</b> a whole number by a fraction, split the whole into that many equal parts and take however many the numerator says. To <b>divide</b> a fraction by a whole number, split it into even smaller pieces — the denominator gets bigger, not smaller.</p>
      <div class="whiteboard">
        <div class="wb-row">Multiply (shots made): <span style="font-family:var(--mono)">3/4 of 20 shots = 15</span> makes</div>
        <div class="wb-row">Multiply (season wins): <span style="font-family:var(--mono)">2/3 of 18 games = 12</span> wins</div>
        <div class="wb-row">Divide (practice time): <span style="font-family:var(--mono)">3/4 hour ÷ 3 drills = 3/12 = 1/4</span> hour each</div>
      </div>
      <p class="tip">Coach tip: enter answers as a fraction — top number, then bottom number. Any equivalent fraction counts as correct.</p>`
  }
});
