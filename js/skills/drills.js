/* Kumon-style standard-algorithm drills. Untimed, plain worksheet computation — no
   sports narrative on purpose; the point is stripped-down repetition. */

function algoProblem(stack, question, answer, why){
  return { kind:'num', stack, question, answer, why };
}

/* ---------- Addition ---------- */
function needsCarryCount(a,b,digits){
  const ad=String(a).padStart(digits,'0').split('').map(Number).reverse();
  const bd=String(b).padStart(digits,'0').split('').map(Number).reverse();
  let carries=0, carry=0;
  for(let i=0;i<digits;i++){ const s=ad[i]+bd[i]+carry; if(s>=10){carries++;carry=1;} else carry=0; }
  return carries;
}
function genAdd(level){
  if(level===1){
    let a,b; do{ a=ri(1,9); b=ri(1,9); } while((a+b)>9);
    const ans=a+b;
    return algoProblem(stackHTML([a,b],'+'),'Add:',ans,`${a} + ${b} = <b>${ans}</b>. No carrying needed.`);
  }
  if(level===2){
    let a,b; do{ a=ri(10,99); b=ri(10,99); } while(needsCarryCount(a,b,2)<1);
    const ans=a+b;
    return algoProblem(stackHTML([a,b],'+'),'Add using the standard algorithm:',ans,`${a} + ${b} = <b>${ans}</b>. Add the ones, carry, then add the tens.`);
  }
  if(level===3){
    let a,b; do{ a=ri(100,999); b=ri(100,999); } while(needsCarryCount(a,b,3)<2);
    const ans=a+b;
    return algoProblem(stackHTML([a,b],'+'),'Add using the standard algorithm:',ans,`${a} + ${b} = <b>${ans}</b>. Carry every time a column adds to 10 or more.`);
  }
  const n = ri(3,4);
  const nums = Array.from({length:n}, ()=>ri(10,999));
  const ans = nums.reduce((x,y)=>x+y,0);
  return algoProblem(stackHTML(nums,'+'),'Add using the standard algorithm:',ans,`Add them all: ${nums.join(' + ')} = <b>${ans}</b>.`);
}

/* ---------- Subtraction ---------- */
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
function genSub(level){
  if(level===1){
    const a=ri(1,9), b=ri(0,a);
    const ans=a-b;
    return algoProblem(stackHTML([a,b],'−'),'Subtract:',ans,`${a} − ${b} = <b>${ans}</b>. No borrowing needed.`);
  }
  if(level===2){
    let a,b; do{ a=ri(20,99); b=ri(10,a); } while(needsBorrowCount(a,b,2)<1);
    const ans=a-b;
    return algoProblem(stackHTML([a,b],'−'),'Subtract using the standard algorithm:',ans,`${a} − ${b} = <b>${ans}</b>. Borrow from the tens place.`);
  }
  if(level===3){
    let a,b; do{ a=ri(200,999); b=ri(100,a-1); } while(needsBorrowCount(a,b,3)<2);
    const ans=a-b;
    return algoProblem(stackHTML([a,b],'−'),'Subtract using the standard algorithm:',ans,`${a} − ${b} = <b>${ans}</b>. Borrow across as many columns as you need to.`);
  }
  const a=ri(1000,9999), b=ri(100,a-1);
  const ans=a-b;
  return algoProblem(stackHTML([a,b],'−'),'Subtract using the standard algorithm:',ans,`${a} − ${b} = <b>${ans}</b>.`);
}

/* ---------- Multiplication ---------- */
function genMul(level){
  if(level===1){
    const a=ri(2,9), b=ri(2,9), ans=a*b;
    return { kind:'num', question:`${a} × ${b} = ?`, answer:ans, why:`${a} × ${b} = <b>${ans}</b>.` };
  }
  if(level===2){
    const a=ri(10,99), b=ri(2,9), ans=a*b;
    return algoProblem(stackHTML([a,b],'×'),'Multiply using the standard algorithm:',ans,`${a} × ${b} = <b>${ans}</b>.`);
  }
  if(level===3){
    const a=ri(10,99), b=ri(10,99), ans=a*b;
    return algoProblem(stackHTML([a,b],'×'),'Multiply using the standard algorithm:',ans,`${a} × ${b} = <b>${ans}</b>. Multiply by the ones digit, then the tens digit (shifted one place left), then add.`);
  }
  const a=ri(100,999), b=ri(10,99), ans=a*b;
  return algoProblem(stackHTML([a,b],'×'),'Multiply using the standard algorithm:',ans,`${a} × ${b} = <b>${ans}</b>.`);
}

/* ---------- Division ---------- */
function genDiv(level){
  if(level===1){
    const divisor=ri(2,9), quotient=ri(2,9), dividend=divisor*quotient;
    return { kind:'num', question:`${dividend} ÷ ${divisor} = ?`, answer:quotient,
      why:`${divisor} × ${quotient} = ${dividend}, so ${dividend} ÷ ${divisor} = <b>${quotient}</b>.` };
  }
  if(level===2){
    const divisor=ri(2,9), quotient=ri(11,40), dividend=divisor*quotient;
    return { kind:'num', question:`${dividend} ÷ ${divisor} = ?`, answer:quotient,
      why:`${divisor} × ${quotient} = ${dividend}, so ${dividend} ÷ ${divisor} = <b>${quotient}</b>.` };
  }
  if(level===3){
    const divisor=ri(3,9), quotient=ri(4,20), remainder=ri(1,divisor-1), dividend=divisor*quotient+remainder;
    return { kind:'divrem', question:`${dividend} ÷ ${divisor} = ?`, answer:{q:quotient,r:remainder},
      why:`${divisor} × ${quotient} = ${divisor*quotient}. ${dividend} − ${divisor*quotient} = ${remainder}. Quotient <b>${quotient}</b>, remainder <b>${remainder}</b>.` };
  }
  const divisor=ri(11,20), quotient=ri(20,90), remainder=ri(1,divisor-1), dividend=divisor*quotient+remainder;
  return { kind:'divrem', question:`${dividend} ÷ ${divisor} = ?`, answer:{q:quotient,r:remainder},
    why:`${divisor} × ${quotient} = ${divisor*quotient}. ${dividend} − ${divisor*quotient} = ${remainder}. Quotient <b>${quotient}</b>, remainder <b>${remainder}</b>.` };
}

/* ---------- Fraction computation ---------- */
function genFracDrillLevel(level){
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

/* ---------- Decimal computation ---------- */
function genDecDrillLevel(level){
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

/* ---------- register ---------- */
Object.assign(SKILLS, {
  drillAdd:{
    title:"Addition Drill", icon:"➕", accent:"#54e07a",
    section:'drills',
    skill:"Standard-algorithm addition, single-digit up to multi-addend.",
    std:"Fluency", maxLevel:4, gen:genAdd,
    coach:`<p class="lead">Line up the digits by place value. Add each column starting from the ones place. Whenever a column adds to 10 or more, write down the ones digit and <b>carry the 1</b> to the next column.</p>`
  },
  drillSub:{
    title:"Subtraction Drill", icon:"➖", accent:"#ff5d5d",
    section:'drills',
    skill:"Standard-algorithm subtraction, including borrowing across zeros.",
    std:"Fluency", maxLevel:4, gen:genSub,
    coach:`<p class="lead">Line up the digits by place value. Subtract each column starting from the ones place. If the top digit is smaller than the bottom digit, <b>borrow 1</b> from the column to its left.</p>`
  },
  drillMul:{
    title:"Multiplication Drill", icon:"✖️", accent:"#28d6e6",
    section:'drills',
    skill:"Times tables up through multi-digit standard-algorithm multiplication.",
    std:"Fluency", maxLevel:4, gen:genMul,
    coach:`<p class="lead">Multiply the top number by each digit of the bottom number, one at a time, shifting each partial product one place to the left. Add all the partial products together for the final answer.</p>`
  },
  drillDiv:{
    title:"Division Drill", icon:"➗", accent:"#ffcf3f",
    section:'drills',
    skill:"Long division, including remainders.",
    std:"Fluency", maxLevel:4, gen:genDiv,
    coach:`<p class="lead">Long division: figure out how many times the divisor fits into the leading digits, multiply, subtract, bring down the next digit, and repeat. Whatever's left over at the very end is the <b>remainder</b>.</p>`
  },
  drillFrac:{
    title:"Fraction Drill", icon:"🔢", accent:"#ff8c45",
    section:'drills',
    skill:"Bare-computation fraction add/subtract/multiply/divide.",
    std:"Fluency", maxLevel:4, gen:genFracDrillLevel,
    coach:`<p class="lead">Same denominator: add or subtract the tops. Different denominators: find a common one first. Multiply fractions straight across. Divide by flipping the second fraction and multiplying.</p>`
  },
  drillDec:{
    title:"Decimal Drill", icon:"🔟", accent:"#8b99b2",
    section:'drills',
    skill:"Decimal add/subtract/multiply/divide, standard algorithm.",
    std:"Fluency", maxLevel:4, gen:genDecDrillLevel,
    coach:`<p class="lead">Line up the decimal points before adding or subtracting — pad with a trailing zero if the numbers have different numbers of decimal places. For multiplying, ignore the decimal points, multiply as whole numbers, then count the total decimal places to place the point in your answer.</p>`
  }
});
