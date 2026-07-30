/* Expressions & Equations domain (5.OA, 6.EE). Each skill coin-flips between a
   sports word problem and a bare computation rep at the same level, same
   pattern as the other domains. */

/* ---------- Order of Operations (5.OA.A.1 → 6.EE.A.1) ---------- */
function genOrderWord(level){
  const p = rnd(PLAYERS);
  if(level===1){
    const a=ri(2,9), b=ri(2,9), c=ri(2,9), ans=(a+b)*c;
    return { kind:'num', pre:`${p}'s team has ${c} lineups. Each lineup scores (${a} + ${b}) points per quarter.`, question:`Using (${a} + ${b}) × ${c}, what is the total?`, answer:ans,
      why:`Parentheses first: ${a} + ${b} = ${a+b}. Then multiply: ${a+b} × ${c} = <b>${ans}</b>.` };
  }
  if(level===2){
    const b=ri(2,9), c=ri(2,9), prod=b*c, a=prod+ri(10,40), ans=a-prod;
    return { kind:'num', pre:`${p}'s team started with ${a} points banked, then gave up ${c} baskets worth ${b} points each.`, question:`Using ${a} − ${b} × ${c}, what is the result?`, answer:ans,
      why:`Multiply first: ${b} × ${c} = ${b*c}. Then subtract: ${a} − ${b*c} = <b>${ans}</b>.` };
  }
  if(level===3){
    const a=ri(2,6), b=ri(2,9), c=ri(2,9), ans=a*a+b*c;
    return { kind:'num', pre:`${p}'s bonus score is ${a} squared, plus ${b} sets of ${c} points.`, question:`Using ${a}² + ${b} × ${c}, what is the total?`, answer:ans,
      why:`Exponent first: ${a}² = ${a*a}. Multiply: ${b} × ${c} = ${b*c}. Add: ${a*a} + ${b*c} = <b>${ans}</b>.` };
  }
  const a=ri(2,9), b=ri(2,9), c=ri(2,5), product=(a+b)*c, d=ri(2,Math.min(9,product-1)), ans=product-d;
  return { kind:'num', pre:`${p}'s team scores (${a} + ${b}) points per set, ${c} sets, minus a ${d}-point penalty.`, question:`Using (${a} + ${b}) × ${c} − ${d}, what is the total?`, answer:ans,
    why:`Parentheses: ${a} + ${b} = ${a+b}. Multiply: ${a+b} × ${c} = ${product}. Subtract: ${product} − ${d} = <b>${ans}</b>.` };
}
function genOrderBare(level){
  if(level===1){ const a=ri(2,9), b=ri(2,9), c=ri(2,9), ans=(a+b)*c;
    return { kind:'num', question:`(${a} + ${b}) × ${c} = ?`, answer:ans, why:`${a} + ${b} = ${a+b}. ${a+b} × ${c} = <b>${ans}</b>.` }; }
  if(level===2){ const b=ri(2,9), c=ri(2,9), prod=b*c, a=prod+ri(10,40), ans=a-prod;
    return { kind:'num', question:`${a} − ${b} × ${c} = ?`, answer:ans, why:`${b} × ${c} = ${b*c}. ${a} − ${b*c} = <b>${ans}</b>.` }; }
  if(level===3){ const a=ri(2,6), b=ri(2,9), c=ri(2,9), ans=a*a+b*c;
    return { kind:'num', question:`${a}² + ${b} × ${c} = ?`, answer:ans, why:`${a}² = ${a*a}. ${b} × ${c} = ${b*c}. <b>${ans}</b>.` }; }
  const a=ri(2,9), b=ri(2,9), c=ri(2,5), product=(a+b)*c, d=ri(2,Math.min(9,product-1)), ans=product-d;
  return { kind:'num', question:`(${a} + ${b}) × ${c} − ${d} = ?`, answer:ans, why:`${a}+${b}=${a+b}. ${a+b}×${c}=${product}. −${d} = <b>${ans}</b>.` };
}
function genOrderOfOps(level){ return Math.random()<0.5 ? genOrderWord(level) : genOrderBare(level); }

/* ---------- Expressions with Variables (6.EE.A.2, 6.EE.A.3, 6.EE.A.4) ---------- */
function genVarEvalWord(level){
  const p = rnd(PLAYERS);
  if(level===1){
    const a=ri(2,9), b=ri(1,9), x=ri(2,9), ans=a*x+b;
    return { kind:'num', pre:`${p} earns $${a} per point scored, plus a $${b} bonus.`, question:`If ${p} scored ${x} points, using ${a}x + ${b}, how much did ${p} earn?`, answer:ans,
      why:`${a} × ${x} + ${b} = ${a*x} + ${b} = <b>${ans}</b>.` };
  }
  if(level===2){
    const a=ri(2,9), x=ri(2,9), prod=a*x, b=ri(1,Math.max(1,Math.min(20,prod))), ans=prod-b;
    return { kind:'num', pre:`${p}'s team earns $${a} per ticket sold, minus $${b} in fees.`, question:`If they sold ${x} tickets, using ${a}x − ${b}, what is the total?`, answer:ans,
      why:`${a} × ${x} − ${b} = ${a*x} − ${b} = <b>${ans}</b>.` };
  }
  if(level===3){
    const a=ri(2,9), b=ri(2,9);
    const choices = [`${a}x + ${a*b}`, `${a}x + ${b}`, `x + ${a*b}`];
    return { kind:'choice', pre:`${p}'s coach writes the expression ${a}(x + ${b}) for total points.`, question:`Which expression is equivalent?`, choices, answer:0,
      why:`Distribute: ${a}(x + ${b}) = ${a}x + ${a}×${b} = <b>${a}x + ${a*b}</b>.` };
  }
  const a=ri(2,9), b=ri(2,9), x=b+ri(2,9), ans=a*(x-b);
  return { kind:'num', pre:`${p}'s bonus formula is ${a}(x − ${b}) points, where x is games played.`, question:`If x = ${x}, how many bonus points is that?`, answer:ans,
    why:`${a}(x − ${b}) = ${a} × (${x} − ${b}) = ${a} × ${x-b} = <b>${ans}</b>.` };
}
function genVarEvalBare(level){
  if(level===1){ const a=ri(2,9), b=ri(1,9), x=ri(2,9), ans=a*x+b;
    return { kind:'num', question:`If x = ${x}, what is ${a}x + ${b}?`, answer:ans, why:`${a}×${x} + ${b} = <b>${ans}</b>.` }; }
  if(level===2){ const a=ri(2,9), x=ri(2,9), prod=a*x, b=ri(1,Math.max(1,Math.min(20,prod))), ans=prod-b;
    return { kind:'num', question:`If x = ${x}, what is ${a}x − ${b}?`, answer:ans, why:`${a}×${x} − ${b} = <b>${ans}</b>.` }; }
  if(level===3){
    const a=ri(2,9), b=ri(2,9);
    const choices=[`${a}x + ${a*b}`, `${a}x + ${b}`, `x + ${a*b}`];
    return { kind:'choice', question:`Which expression is equivalent to ${a}(x + ${b})?`, choices, answer:0,
      why:`Distribute: ${a}(x+${b}) = <b>${a}x + ${a*b}</b>.` };
  }
  const a=ri(2,9), b=ri(2,9), x=b+ri(2,9), ans=a*(x-b);
  return { kind:'num', question:`If x = ${x}, what is ${a}(x − ${b})?`, answer:ans, why:`${a} × (${x}−${b}) = ${a} × ${x-b} = <b>${ans}</b>.` };
}
function genVariableExpr(level){ return Math.random()<0.5 ? genVarEvalWord(level) : genVarEvalBare(level); }

/* ---------- One-Step Equations (6.EE.B.5-7) ---------- */
function genEquationWord(level){
  const p = rnd(PLAYERS);
  if(level===1){
    const x=ri(2,20), add=ri(2,20), q=x+add;
    return { kind:'num', pre:`${p} needs ${q} points to break the school record. ${p} has scored ${add} so far.`, question:`How many more points does ${p} need? (Solve x + ${add} = ${q})`, answer:x,
      why:`x + ${add} = ${q} → x = ${q} − ${add} = <b>${x}</b>.` };
  }
  if(level===2){
    const per=ri(2,9), x=ri(2,15), q=per*x;
    return { kind:'num', pre:`${p}'s team scores ${per} points per basket. They finished with ${q} points.`, question:`How many baskets did they make? (Solve ${per}x = ${q})`, answer:x,
      why:`${per}x = ${q} → x = ${q} ÷ ${per} = <b>${x}</b>.` };
  }
  if(level===3){
    if(Math.random()<0.5){
      const sub=ri(10,60), x=sub+ri(2,40), q=x-sub;
      return { kind:'num', pre:`${p} had some points, then lost ${sub} points in a penalty, ending with ${q}.`, question:`How many points did ${p} start with? (Solve x − ${sub} = ${q})`, answer:x,
        why:`x − ${sub} = ${q} → x = ${q} + ${sub} = <b>${x}</b>.` };
    }
    const per=ri(2,12), x=ri(5,20), q=per*x;
    return { kind:'num', pre:`${p}'s stadium seats are arranged in ${per} equal sections totaling ${q} seats.`, question:`How many seats per section? (Solve ${per}x = ${q})`, answer:x,
      why:`${per}x = ${q} → x = ${q} ÷ ${per} = <b>${x}</b>.` };
  }
  const x=ri(20,100), add=ri(20,100), q=x+add;
  return { kind:'num', pre:`${p}'s team needs ${q} total wins across ${p}'s career. So far they have ${add}.`, question:`How many more wins are needed? (Solve x + ${add} = ${q})`, answer:x,
    why:`x + ${add} = ${q} → x = ${q} − ${add} = <b>${x}</b>.` };
}
function genEquationBare(level){
  if(level===1){ const x=ri(2,20), add=ri(2,20), q=x+add;
    return { kind:'num', question:`Solve for x: x + ${add} = ${q}`, answer:x, why:`x = ${q} − ${add} = <b>${x}</b>.` }; }
  if(level===2){ const per=ri(2,9), x=ri(2,15), q=per*x;
    return { kind:'num', question:`Solve for x: ${per}x = ${q}`, answer:x, why:`x = ${q} ÷ ${per} = <b>${x}</b>.` }; }
  if(level===3){
    if(Math.random()<0.5){ const sub=ri(10,60), x=sub+ri(2,40), q=x-sub;
      return { kind:'num', question:`Solve for x: x − ${sub} = ${q}`, answer:x, why:`x = ${q} + ${sub} = <b>${x}</b>.` }; }
    const per=ri(2,12), x=ri(5,20), q=per*x;
    return { kind:'num', question:`Solve for x: ${per}x = ${q}`, answer:x, why:`x = ${q} ÷ ${per} = <b>${x}</b>.` };
  }
  const x=ri(20,100), add=ri(20,100), q=x+add;
  return { kind:'num', question:`Solve for x: x + ${add} = ${q}`, answer:x, why:`x = ${q} − ${add} = <b>${x}</b>.` };
}
function genEquations(level){ return Math.random()<0.5 ? genEquationWord(level) : genEquationBare(level); }

/* ---------- register ---------- */
Object.assign(SKILLS, {
  orderofops:{
    title:"Order of Operations", icon:"🔢", accent:"#28d6e6",
    domain:'Expressions & Equations',
    skill:"Evaluate expressions with parentheses and exponents in the right order.",
    std:"5.OA.A.1 → 6.EE.A.1", maxLevel:4, gen:genOrderOfOps,
    coach:`<p class="lead">Do the math inside <b>parentheses</b> first, then <b>exponents</b>, then <b>multiply/divide</b> left to right, then <b>add/subtract</b> left to right (PEMDAS).</p>
      <div class="whiteboard">
        <div class="wb-row">(3 + 4) × 2 → parentheses first: 7 × 2 = <b>14</b></div>
        <div class="wb-row">3² + 4 × 2 → exponent first: 9, then multiply: 8, then add: <b>17</b></div>
      </div>
      <p class="tip">Coach tip: doing the steps out of order is the #1 mistake here — always parentheses first, no matter what.</p>`
  },
  variableexpr:{
    title:"Expressions with Variables", icon:"🅧", accent:"#ff6a1a",
    domain:'Expressions & Equations',
    skill:"Evaluate expressions with a variable, and find equivalent expressions.",
    std:"6.EE.A.2, 6.EE.A.3, 6.EE.A.4", maxLevel:4, gen:genVariableExpr,
    coach:`<p class="lead">A variable like x stands for a number you plug in. To evaluate, substitute the value for x and follow order of operations. The <b>distributive property</b> lets you rewrite a(x + b) as ax + ab — same value, different form.</p>
      <div class="whiteboard">
        <div class="wb-row">If x = 5: 3x + 2 = 3×5 + 2 = <b>17</b></div>
        <div class="wb-row">4(x + 3) distributes to <b>4x + 12</b></div>
      </div>
      <p class="tip">Coach tip: substitute first, multiply/divide before add/subtract — same order of operations rules apply.</p>`
  },
  equations:{
    title:"One-Step Equations", icon:"⚖️", accent:"#ffcf3f",
    domain:'Expressions & Equations',
    skill:"Solve for x in one-step addition, subtraction, and multiplication equations.",
    std:"6.EE.B.5, 6.EE.B.6, 6.EE.B.7", maxLevel:4, gen:genEquations,
    coach:`<p class="lead">Solving an equation means finding the value of x that makes it true. Whatever operation is being done to x, do the <b>opposite</b> to undo it: if something is added, subtract; if something is multiplied, divide.</p>
      <div class="whiteboard">
        <div class="wb-row">x + 7 = 12 → subtract 7 from both sides → x = <b>5</b></div>
        <div class="wb-row">4x = 20 → divide both sides by 4 → x = <b>5</b></div>
      </div>
      <p class="tip">Coach tip: whatever you do to one side of the equation, you have to do to the other side too.</p>`
  }
});
