/* Number Fluency domain (5.NBT): standard-algorithm arithmetic. Each skill coin-flips
   between a sports word problem and a bare "just compute it" rep of the same
   underlying math at the same level — repeated practice folded into the skill
   itself rather than a separate drills area. */

/* ---------- shared number generators (same math feeds both variants) ---------- */
function needsCarryCount(a,b,digits){
  const ad=String(a).padStart(digits,'0').split('').map(Number).reverse();
  const bd=String(b).padStart(digits,'0').split('').map(Number).reverse();
  let carries=0, carry=0;
  for(let i=0;i<digits;i++){ const s=ad[i]+bd[i]+carry; if(s>=10){carries++;carry=1;} else carry=0; }
  return carries;
}
function needsBorrowCount(a,b,digits){
  const ad=String(a).padStart(digits,'0').split('').map(Number);
  const bd=String(b).padStart(digits,'0').split('').map(Number);
  let borrows=0, borrow=0;
  for(let i=digits-1;i>=0;i--){
    const top = ad[i]-borrow;
    if(top < bd[i]){ borrows++; borrow=1; } else { borrow=0; }
  }
  return borrows;
}
function addNums(level){
  if(level===1){ let a,b; do{ a=ri(1,9); b=ri(1,9); } while((a+b)>9); return [a,b]; }
  if(level===2){ let a,b; do{ a=ri(10,99); b=ri(10,99); } while(needsCarryCount(a,b,2)<1); return [a,b]; }
  if(level===3){ let a,b; do{ a=ri(100,999); b=ri(100,999); } while(needsCarryCount(a,b,3)<2); return [a,b]; }
  const n = ri(3,4);
  return Array.from({length:n}, ()=>ri(10,999));
}
function subNums(level){
  if(level===1){ const a=ri(1,9); return [a, ri(0,a)]; }
  if(level===2){ let a,b; do{ a=ri(20,99); b=ri(10,a); } while(needsBorrowCount(a,b,2)<1); return [a,b]; }
  if(level===3){ let a,b; do{ a=ri(200,999); b=ri(100,a-1); } while(needsBorrowCount(a,b,3)<2); return [a,b]; }
  const a=ri(1000,9999); return [a, ri(100,a-1)];
}
function mulNums(level){
  if(level===1) return [ri(2,9), ri(2,9)];
  if(level===2) return [ri(10,99), ri(2,9)];
  if(level===3) return [ri(10,99), ri(10,99)];
  return [ri(100,999), ri(10,99)];
}
function divProblem(level){
  if(level===1){ const divisor=ri(2,9), quotient=ri(2,9); return {divisor,quotient,remainder:0,dividend:divisor*quotient}; }
  if(level===2){ const divisor=ri(2,9), quotient=ri(11,40); return {divisor,quotient,remainder:0,dividend:divisor*quotient}; }
  if(level===3){ const divisor=ri(3,9), quotient=ri(4,20), remainder=ri(1,divisor-1); return {divisor,quotient,remainder,dividend:divisor*quotient+remainder}; }
  const divisor=ri(11,20), quotient=ri(20,90), remainder=ri(1,divisor-1);
  return {divisor,quotient,remainder,dividend:divisor*quotient+remainder};
}

/* ---------- Multi-Digit Addition & Subtraction (4.NBT.B.4) ---------- */
function genAddSubWord(level){
  const isAdd = Math.random()<0.5;
  const nums = isAdd ? addNums(level) : subNums(level);
  const p = rnd(PLAYERS);
  let pre, question, ans, why;
  if(isAdd){
    ans = nums.reduce((a,b)=>a+b,0);
    if(nums.length>2){
      pre = `${p}'s team scored ${nums.slice(0,-1).join(', ')}, and ${nums[nums.length-1]} points across their last ${nums.length} games.`;
      question = `How many points did they score in total?`;
    } else {
      pre = `${nums[0]} fans came to ${p}'s Friday game, and ${nums[1]} came Saturday.`;
      question = `How many fans came across both games?`;
    }
    why = `Add them: ${nums.join(' + ')} = <b>${ans}</b>.`;
  } else {
    ans = nums[0]-nums[1];
    pre = `${p}'s arena holds ${nums[0]} seats. So far, ${nums[1]} tickets have been sold.`;
    question = `How many seats are still available?`;
    why = `${nums[0]} − ${nums[1]} = <b>${ans}</b>.`;
  }
  return { kind:'num', pre, question, answer:ans, why, stack: stackHTML(nums, isAdd?'+':'−') };
}
function genAddSubBare(level){
  const isAdd = Math.random()<0.5;
  const nums = isAdd ? addNums(level) : subNums(level);
  const ans = isAdd ? nums.reduce((a,b)=>a+b,0) : nums[0]-nums[1];
  const why = isAdd ? `Add them: ${nums.join(' + ')} = <b>${ans}</b>.` : `${nums[0]} − ${nums[1]} = <b>${ans}</b>.`;
  return { kind:'num', question: isAdd?'Add using the standard algorithm:':'Subtract using the standard algorithm:', answer:ans, why, stack: stackHTML(nums, isAdd?'+':'−') };
}
function genAddSub(level){ return Math.random()<0.5 ? genAddSubWord(level) : genAddSubBare(level); }

/* ---------- Multi-Digit Multiplication (5.NBT.B.5) ---------- */
function genMulWord(level){
  const [a,b] = mulNums(level);
  const ans = a*b;
  const p = rnd(PLAYERS);
  const pre = `${p}'s stadium has ${a} sections, with ${b} seats in each section.`;
  const question = `How many seats are there in total?`;
  const why = `${a} × ${b} = <b>${ans}</b>.`;
  return { kind:'num', pre, question, answer:ans, why, stack: stackHTML([a,b],'×') };
}
function genMulBare(level){
  const [a,b] = mulNums(level);
  const ans = a*b;
  if(level===1) return { kind:'num', question:`${a} × ${b} = ?`, answer:ans, why:`${a} × ${b} = <b>${ans}</b>.` };
  return { kind:'num', question:'Multiply using the standard algorithm:', answer:ans, why:`${a} × ${b} = <b>${ans}</b>.`, stack: stackHTML([a,b],'×') };
}
function genMul(level){ return Math.random()<0.5 ? genMulWord(level) : genMulBare(level); }

/* ---------- Long Division (5.NBT.B.6) ---------- */
function genDivWord(level){
  const {divisor,quotient,remainder,dividend} = divProblem(level);
  const p = rnd(PLAYERS);
  const pre = remainder
    ? `${p}'s team scored ${dividend} points total, split evenly across ${divisor} games (with a few extra from a tiebreaker game).`
    : `${p}'s team scored ${dividend} points total, split evenly across ${divisor} games.`;
  const question = remainder
    ? `How many points per game, and how many were left over?`
    : `How many points did they average per game?`;
  const why = remainder
    ? `${divisor} × ${quotient} = ${divisor*quotient}. ${dividend} − ${divisor*quotient} = ${remainder}. So <b>${quotient}</b> per game, <b>${remainder}</b> left over.`
    : `${divisor} × ${quotient} = ${dividend}, so ${dividend} ÷ ${divisor} = <b>${quotient}</b>.`;
  return remainder
    ? { kind:'divrem', pre, question, answer:{q:quotient,r:remainder}, why }
    : { kind:'num', pre, question, answer:quotient, why };
}
function genDivBare(level){
  const {divisor,quotient,remainder,dividend} = divProblem(level);
  const why = remainder
    ? `${divisor} × ${quotient} = ${divisor*quotient}. ${dividend} − ${divisor*quotient} = ${remainder}. Quotient <b>${quotient}</b>, remainder <b>${remainder}</b>.`
    : `${divisor} × ${quotient} = ${dividend}, so ${dividend} ÷ ${divisor} = <b>${quotient}</b>.`;
  return remainder
    ? { kind:'divrem', question:`${dividend} ÷ ${divisor} = ?`, answer:{q:quotient,r:remainder}, why }
    : { kind:'num', question:`${dividend} ÷ ${divisor} = ?`, answer:quotient, why };
}
function genDiv(level){ return Math.random()<0.5 ? genDivWord(level) : genDivBare(level); }

/* ---------- Decimal Operations (5.NBT.B.7) ---------- */
function genDecWord(level){
  const p = rnd(PLAYERS);
  if(level===1){
    const a=ri(1,99)/10, b=ri(1,99)/10, isAdd=Math.random()<0.6;
    const big = isAdd? a : Math.max(a,b), small = isAdd? b : Math.min(a,b);
    let ans = isAdd? a+b : Math.max(a,b)-Math.min(a,b); ans = Math.round(ans*10)/10;
    const pre = isAdd
      ? `${p} ran ${big.toFixed(1)} miles Monday and ${small.toFixed(1)} miles Tuesday.`
      : `${p}'s best 40-yard dash is ${small.toFixed(1)} seconds. Yesterday's run was ${big.toFixed(1)} seconds.`;
    const question = isAdd ? `How many miles did ${p} run in total?` : `How many seconds slower was yesterday's run than ${p}'s best?`;
    const why = `Line up the decimal points and ${isAdd?'add':'subtract'}: <b>${ans.toFixed(1)}</b>.`;
    return { kind:'num', pre, question, answer:ans, why };
  }
  if(level===2){
    const a=ri(10,999)/100, b=ri(1,99)/10, isAdd=Math.random()<0.6;
    let big=a, bigDp=2, small=b, smallDp=1;
    if(!isAdd && b>a){ big=b; bigDp=1; small=a; smallDp=2; }
    let ans = isAdd ? a+b : big-small; ans = Math.round(ans*100)/100;
    const pre = `${p}'s two best race times were ${big.toFixed(bigDp)} seconds and ${small.toFixed(smallDp)} seconds.`;
    const question = isAdd ? `What is the combined time?` : `What is the difference between the two times?`;
    const why = `Line up the decimal points (pad with a trailing zero to match places) and ${isAdd?'add':'subtract'}: <b>${ans}</b>.`;
    return { kind:'num', pre, question, answer:ans, why };
  }
  if(level===3){
    const a=ri(2,90)/10, b=ri(2,9);
    const ans = Math.round(a*b*100)/100;
    const pre = `${p} ran ${a.toFixed(1)} miles per practice, ${b} practices this week.`;
    const question = `How many miles did ${p} run this week in total?`;
    const why = `Multiply as whole numbers, then place the decimal point: ${a.toFixed(1)} × ${b} = <b>${ans}</b>.`;
    return { kind:'num', pre, question, answer:ans, why };
  }
  const divisor = ri(2,9), quotient = ri(2,40)/10;
  const dividend = Math.round(divisor*quotient*10)/10;
  const pre = `${p} ran a total of ${dividend.toFixed(1)} miles evenly across ${divisor} practices.`;
  const question = `How many miles per practice is that?`;
  const why = `${divisor} × ${quotient} = ${dividend.toFixed(1)}, so ${dividend.toFixed(1)} ÷ ${divisor} = <b>${quotient}</b>.`;
  return { kind:'num', pre, question, answer:quotient, why };
}
function genDecBare(level){
  if(level===1){
    const a = ri(1,99)/10, b = ri(1,99)/10;
    const isAdd = Math.random()<0.6;
    const big = isAdd? a : Math.max(a,b);
    const small = isAdd? b : Math.min(a,b);
    let ans = isAdd ? a+b : Math.max(a,b)-Math.min(a,b);
    ans = Math.round(ans*10)/10;
    return { kind:'num', question:`${big.toFixed(1)} ${isAdd?'+':'−'} ${small.toFixed(1)} = ?`, answer:ans,
      why:`Line up the decimal points and ${isAdd?'add':'subtract'}: <b>${ans.toFixed(1)}</b>.` };
  }
  if(level===2){
    const a = ri(10,999)/100, b = ri(1,99)/10;
    const isAdd = Math.random()<0.6;
    let big=a, bigDp=2, small=b, smallDp=1;
    if(!isAdd && b>a){ big=b; bigDp=1; small=a; smallDp=2; }
    let ans = isAdd ? a+b : big-small;
    ans = Math.round(ans*100)/100;
    return { kind:'num', question:`${big.toFixed(bigDp)} ${isAdd?'+':'−'} ${small.toFixed(smallDp)} = ?`, answer:ans,
      why:`Line up the decimal points (add a trailing zero to match places) and ${isAdd?'add':'subtract'}: <b>${ans}</b>.` };
  }
  if(level===3){
    const a = ri(2,90)/10, b = ri(2,9);
    const ans = Math.round(a*b*100)/100;
    return { kind:'num', question:`${a.toFixed(1)} × ${b} = ?`, answer:ans,
      why:`Multiply as whole numbers, then place the decimal point: ${a.toFixed(1)} × ${b} = <b>${ans}</b>.` };
  }
  const divisor = ri(2,9);
  const quotient = ri(2,40)/10;
  const dividend = Math.round(divisor*quotient*10)/10;
  return { kind:'num', question:`${dividend.toFixed(1)} ÷ ${divisor} = ?`, answer:quotient,
    why:`${divisor} × ${quotient} = ${dividend.toFixed(1)}, so ${dividend.toFixed(1)} ÷ ${divisor} = <b>${quotient}</b>.` };
}
function genDec(level){ return Math.random()<0.5 ? genDecWord(level) : genDecBare(level); }

/* ---------- register ---------- */
Object.assign(SKILLS, {
  addsub:{
    title:"Multi-Digit Addition & Subtraction", icon:"➕", accent:"#54e07a",
    domain:'Number Fluency',
    skill:"Standard-algorithm addition and subtraction, from single digits up to 4-digit numbers.",
    std:"4.NBT.B.4", maxLevel:4, gen:genAddSub,
    coach:`<p class="lead">The standard algorithm works because of <b>place value</b> — ones only combine with ones, tens with tens, and so on. Line up the numbers so matching place values sit in the same column, then work from the <b>ones place</b> outward. If a column adds up to 10 or more, write down the ones digit and <b>carry</b> the extra 1 into the next column. If the top digit in a column is smaller than the bottom digit, <b>borrow</b> 1 from the column to its left before subtracting.</p>

      <p class="lead">Riverside Arena sold tickets across two sections tonight: 1,847 in the lower bowl and 956 in the upper deck. How many tickets sold in total?</p>
      <div class="whiteboard">
        ${stackHTML([1847,956],'+')}
        <div class="wb-row">Step 1 — ones: 7 + 6 = 13. Write the 3, carry the 1.</div>
        <div class="wb-row">Step 2 — tens: 4 + 5 + (carried 1) = 10. Write the 0, carry the 1.</div>
        <div class="wb-row">Step 3 — hundreds: 8 + 9 + (carried 1) = 18. Write the 8, carry the 1.</div>
        <div class="wb-row">Step 4 — thousands: 1 + 0 + (carried 1) = 2.</div>
        <div class="wb-row">Result: <b>2,803</b> tickets sold.</div>
      </div>

      <p class="lead">Now a subtraction that borrows across zeros — the trickiest version of this skill. The arena holds 5,000 seats total. So far, 3,214 tickets have been sold. How many seats are still empty?</p>
      <div class="whiteboard">
        ${stackHTML([5000,3214],'−')}
        <div class="wb-row">Step 1 — ones: can't do 0 − 4, so we need to borrow. But the tens and hundreds digits are also 0, so the borrow has to cascade all the way from the thousands place.</div>
        <div class="wb-row">Step 2 — after borrowing, 5,000 becomes "4 (thousands), 9 (hundreds), 9 (tens), 10 (ones)" — same value, just regrouped.</div>
        <div class="wb-row">Step 3 — now subtract column by column: 10 − 4 = 6, 9 − 1 = 8, 9 − 2 = 7, 4 − 3 = 1.</div>
        <div class="wb-row">Result: <b>1,786</b> empty seats.</div>
      </div>
      <p class="tip">Coach tip: writing the numbers in a neat vertical stack — one digit per column — makes it much harder to line things up wrong.</p>`
  },
  multiply:{
    title:"Multi-Digit Multiplication", icon:"✖️", accent:"#28d6e6",
    domain:'Number Fluency',
    skill:"Times tables up through multi-digit standard-algorithm multiplication.",
    std:"5.NBT.B.5", maxLevel:4, gen:genMul,
    coach:`<p class="lead">Multi-digit multiplication is really the <b>distributive property</b> in disguise: break one number into its place values (like 23 = 20 + 3), multiply the other number by each piece separately, then add those <b>partial products</b> together. Shifting each partial product one place to the left accounts for the fact that a tens digit is worth ten times as much as a ones digit.</p>

      <p class="lead">Riverside Arena's lower bowl has 34 rows with 6 seats in each row. How many seats are in the lower bowl?</p>
      <div class="whiteboard">
        ${stackHTML([34,6],'×')}
        <div class="wb-row">Step 1 — multiply the ones digit: 6 × 4 = 24. Write the 4, carry the 2.</div>
        <div class="wb-row">Step 2 — multiply the tens digit: 6 × 3 = 18, plus the carried 2 = 20.</div>
        <div class="wb-row">Result: <b>204</b> seats.</div>
      </div>

      <p class="lead">Now a bigger one where the partial products really show themselves. The upper deck has 247 seats per section, and there are 32 identical sections. How many seats does the upper deck hold?</p>
      <div class="whiteboard">
        ${stackHTML([247,32],'×')}
        <div class="wb-row">Step 1 — break 32 into 30 + 2, and multiply 247 by each piece separately.</div>
        <div class="wb-row">Step 2 — first partial product: 247 × 2 = 494.</div>
        <div class="wb-row">Step 3 — second partial product: 247 × 30 = 7,410 (that's 247 × 3, shifted one place left for the tens place).</div>
        <div class="wb-row">Step 4 — add the two partial products: 494 + 7,410 = <b>7,904</b> seats.</div>
      </div>
      <p class="tip">Coach tip: estimate first (34 × 6 is close to 30 × 6 = 180) — it catches a lot of place-value mistakes before you even check your work.</p>`
  },
  longdivision:{
    title:"Long Division", icon:"➗", accent:"#ffcf3f",
    domain:'Number Fluency',
    skill:"Long division, including remainders.",
    std:"5.NBT.B.6", maxLevel:4, gen:genDiv,
    coach:`<p class="lead">Long division answers one question over and over: "how many times does the divisor fit?" Start with the leftmost digits of the dividend, find the biggest multiple of the divisor that fits, subtract it, bring down the next digit, and repeat. Whatever's left over at the very end — smaller than the divisor — is the <b>remainder</b>.</p>

      <p class="lead">A team scored 96 total points across an 8-game homestand. If every game were exactly the same, how many points would that be per game?</p>
      <div class="whiteboard">
        <div class="wb-row">96 ÷ 8 = ?</div>
        <div class="wb-row">Step 1 — how many times does 8 fit into 9 (the first digit)? Once, with 1 left over.</div>
        <div class="wb-row">Step 2 — bring down the next digit (6): now we have 16. How many times does 8 fit into 16? Exactly 2 times, with nothing left over.</div>
        <div class="wb-row">Result: <b>12</b> points per game, evenly.</div>
      </div>

      <p class="lead">Now one that doesn't divide evenly — which is most real games! Same 8-game homestand, but this time the team scored 100 total points. How many points per game, and how many are "extra"?</p>
      <div class="whiteboard">
        <div class="wb-row">100 ÷ 8 = ?</div>
        <div class="wb-row">Step 1 — how many times does 8 fit into 10 (the first two digits)? Once (8), with 2 left over.</div>
        <div class="wb-row">Step 2 — bring down the next digit (0): now we have 20. How many times does 8 fit into 20? Twice (16), with 4 left over.</div>
        <div class="wb-row">Step 3 — there are no more digits to bring down, so that leftover 4 is the final <b>remainder</b>.</div>
        <div class="wb-row">Result: <b>12</b> points per game, remainder <b>4</b>.</div>
      </div>
      <p class="tip">Coach tip: check your work by multiplying the quotient back by the divisor and adding the remainder — it should land you right back on the original number.</p>`
  },
  decimalops:{
    title:"Decimal Operations", icon:"🔟", accent:"#8b99b2",
    domain:'Number Fluency',
    skill:"Decimal add/subtract/multiply/divide, standard algorithm.",
    std:"5.NBT.B.7", maxLevel:4, gen:genDec,
    coach:`<p class="lead">Decimals follow the same place-value rules as whole numbers — the decimal point just marks where the ones place ends. For <b>adding or subtracting</b>, line up the decimal points so matching places stay together (pad with a trailing zero if one number has fewer decimal places). For <b>multiplying</b>, ignore the decimal points completely, multiply as if they were whole numbers, then count the total decimal places in both factors to know where the point goes in your answer.</p>

      <p class="lead">Priya ran two legs of a relay: her first leg took 12.45 seconds, and her second leg took 9.8 seconds. What was her total time for both legs?</p>
      <div class="whiteboard">
        <div class="wb-row">12.45 + 9.8 = ?</div>
        <div class="wb-row">Step 1 — 9.8 only has one decimal place, but 12.45 has two. Pad 9.8 with a trailing zero so they match: 9.80.</div>
        <div class="wb-row">Step 2 — line up the decimal points and add like whole numbers: 12.45 + 9.80.</div>
        <div class="wb-row">Step 3 — ones/tenths/hundredths add normally: 45 + 80 = 125 (hundredths), which regroups into 1.25; 12 + 9 + 1 (carried) = 22.</div>
        <div class="wb-row">Result: <b>22.25</b> seconds total.</div>
      </div>

      <p class="lead">Priya also runs 3.2 miles every training session. If she trains 4 times this week, how many total miles will she run?</p>
      <div class="whiteboard">
        <div class="wb-row">3.2 × 4 = ?</div>
        <div class="wb-row">Step 1 — ignore the decimal point completely and multiply as whole numbers: 32 × 4 = 128.</div>
        <div class="wb-row">Step 2 — count the decimal places in the problem: 3.2 has exactly one. So the answer needs exactly one decimal place too.</div>
        <div class="wb-row">Step 3 — place the point one digit from the right: 12.8.</div>
        <div class="wb-row">Result: <b>12.8</b> miles this week.</div>
      </div>
      <p class="tip">Coach tip: for multiplication, count decimal places in the PROBLEM, not the answer — 3.2 has one decimal place, so the answer needs exactly one.</p>`
  }
});
