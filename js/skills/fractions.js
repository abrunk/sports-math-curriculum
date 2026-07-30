/* Fractions domain (5.NF): one skill, ramping add/sub → multiply → divide. */

function lcm(a,b){ return a*b/gcd(a,b); }

/* Level 1: add/subtract, like denominators */
function genFracLike(){
  const p = rnd(PLAYERS);
  const d = rnd([5,6,8,10,12]);
  const isAdd = Math.random()<0.6;
  let n1,n2,ansN,pre,question;
  if(isAdd){
    n1 = ri(1, d-2);
    n2 = ri(1, d-1-n1);
    ansN = n1+n2;
    pre = `${p} made ${n1}/${d} of the team's shots in the first half and ${n2}/${d} in the second half.`;
    question = `What fraction of the team's shots did ${p} make in total?`;
  } else {
    n1 = ri(3, d-1);
    n2 = ri(1, n1-1);
    ansN = n1-n2;
    pre = `${p} made ${n1}/${d} of the team's shots in the first half but only ${n2}/${d} in the second half.`;
    question = `How much greater was ${p}'s first-half fraction than the second half's?`;
  }
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
      <p class="lead">Same denominator? Just add or subtract the tops. <b>Different</b> denominators? Find a common one first. To <b>multiply</b> a whole number by a fraction, split the whole into that many equal parts. To <b>divide</b> a fraction, split it into even smaller pieces.</p>
      <div class="whiteboard">
        <div class="wb-row">Same bottom: <span style="font-family:var(--mono)">2/8 + 3/8 = 5/8</span></div>
        <div class="wb-row">Different bottoms: <span style="font-family:var(--mono)">1/2 + 1/3</span> → common denominator 6 → <span style="font-family:var(--mono)">3/6 + 2/6 = 5/6</span></div>
        <div class="wb-row">Multiply: <span style="font-family:var(--mono)">3/4 of 20 = 15</span> &nbsp;•&nbsp; Divide: <span style="font-family:var(--mono)">3/4 ÷ 3 = 3/12 = 1/4</span></div>
      </div>
      <p class="tip">Coach tip: enter answers as a fraction — top number, then bottom number. Any equivalent fraction counts as correct.</p>`
  }
});
