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
    coach:`<p class="lead">Order of operations is just a shared set of rules mathematicians agree to follow so everyone gets the <b>same answer</b> from the same expression. Without an agreed order, "3 + 4 × 2" could mean 14 or 11 depending on who you ask! The agreed order is: <b>parentheses</b> first, then <b>exponents</b>, then <b>multiply/divide</b> left to right, then <b>add/subtract</b> left to right (PEMDAS).</p>

      <p class="lead">Diego's team runs 3 lineups this quarter, and each lineup scores (5 + 4) points. Using (5 + 4) × 3, what's the total?</p>
      <div class="whiteboard">
        <div class="wb-row">Step 1 — parentheses always go first, even before multiplication: 5 + 4 = 9.</div>
        <div class="wb-row">Step 2 — now multiply: 9 × 3 = <b>27</b> points.</div>
      </div>

      <p class="lead">Now a case with no parentheses at all. Diego's team started with 50 points banked, then gave up 3 baskets worth 6 points each. Using 50 − 6 × 3, what's left?</p>
      <div class="whiteboard">
        <div class="wb-row">Step 1 — it's tempting to subtract first left-to-right, but multiplication always comes before subtraction: 6 × 3 = 18.</div>
        <div class="wb-row">Step 2 — now subtract: 50 − 18 = <b>32</b> points.</div>
      </div>

      <p class="lead">Exponents slot in even before multiplication. Priya's bonus score is 4 squared, plus 5 sets of 3 points. Using 4² + 5 × 3, what's the total?</p>
      <div class="whiteboard">
        <div class="wb-row">Step 1 — exponent first: 4² = 4 × 4 = 16.</div>
        <div class="wb-row">Step 2 — multiply: 5 × 3 = 15.</div>
        <div class="wb-row">Step 3 — now add, since that's all that's left: 16 + 15 = <b>31</b> points.</div>
      </div>

      <p class="lead">A longer chain puts all the rules together. Nina's team scores (6 + 3) points per set, plays 4 sets, then takes a 5-point penalty. Using (6 + 3) × 4 − 5, what's the final total?</p>
      <div class="whiteboard">
        <div class="wb-row">Step 1 — parentheses first: 6 + 3 = 9.</div>
        <div class="wb-row">Step 2 — multiply: 9 × 4 = 36.</div>
        <div class="wb-row">Step 3 — subtract last: 36 − 5 = <b>31</b> points.</div>
      </div>

      <p class="tip">Coach tip: doing the steps out of order is the #1 mistake here — always parentheses first, no matter what.</p>`
  },
  variableexpr:{
    title:"Expressions with Variables", icon:"🅧", accent:"#ff6a1a",
    domain:'Expressions & Equations',
    skill:"Evaluate expressions with a variable, and find equivalent expressions.",
    std:"6.EE.A.2, 6.EE.A.3, 6.EE.A.4", maxLevel:4, gen:genVariableExpr,
    coach:`<p class="lead">A variable like <b>x</b> is just a placeholder for a number you don't know yet — or a number that changes depending on the situation, like how many points a player scored. To <b>evaluate</b> an expression, substitute the actual value in for x and then follow the normal order of operations. The <b>distributive property</b> lets you rewrite a(x + b) as ax + ab — the same value written two different ways, which is handy for simplifying or for checking your work a second way.</p>

      <p class="lead">Marcus earns $5 per point he scores, plus a flat $10 bonus. If Marcus scored 8 points, using 5x + 10, how much did he earn?</p>
      <div class="whiteboard">
        <div class="wb-row">Step 1 — substitute x = 8 into the expression: 5(8) + 10.</div>
        <div class="wb-row">Step 2 — multiply before adding: 5 × 8 = 40.</div>
        <div class="wb-row">Step 3 — add the bonus: 40 + 10 = <b>$50</b>.</div>
      </div>

      <p class="lead">Sofia's team earns $8 per ticket sold, minus $15 in processing fees. If they sold 12 tickets, using 8x − 15, what was their total?</p>
      <div class="whiteboard">
        <div class="wb-row">Step 1 — substitute x = 12: 8(12) − 15.</div>
        <div class="wb-row">Step 2 — multiply first: 8 × 12 = 96.</div>
        <div class="wb-row">Step 3 — subtract the fees: 96 − 15 = <b>$81</b>.</div>
      </div>

      <p class="lead">Sometimes you're not evaluating at all, just rewriting. Leo's coach writes the expression 6(x + 4) for the team's total points. Which expression means the exact same thing?</p>
      <div class="whiteboard">
        <div class="wb-row">Step 1 — the distributive property says a(x + b) = ax + ab. Multiply the 6 into BOTH terms inside the parentheses, not just the x.</div>
        <div class="wb-row">Step 2 — 6 × x = 6x, and 6 × 4 = 24, so 6(x + 4) = <b>6x + 24</b>.</div>
      </div>

      <p class="lead">Theo's bonus formula is 7(x − 3) points, where x is games played. If x = 10, how many bonus points does Theo earn?</p>
      <div class="whiteboard">
        <div class="wb-row">Step 1 — work inside the parentheses first, just like regular order of operations: 10 − 3 = 7.</div>
        <div class="wb-row">Step 2 — multiply: 7 × 7 = <b>49</b> bonus points.</div>
      </div>

      <p class="tip">Coach tip: substitute first, multiply/divide before add/subtract — same order of operations rules apply.</p>`
  },
  equations:{
    title:"One-Step Equations", icon:"⚖️", accent:"#ffcf3f",
    domain:'Expressions & Equations',
    skill:"Solve for x in one-step addition, subtraction, and multiplication equations.",
    std:"6.EE.B.5, 6.EE.B.6, 6.EE.B.7", maxLevel:4, gen:genEquations,
    coach:`<p class="lead">Solving an equation means finding the exact value of x that makes both sides equal. The trick is to <b>undo</b> whatever is being done to x, using the opposite operation — undo addition with subtraction, undo subtraction with addition, undo multiplication with division. Whatever you do to one side of the equation, you have to do to the other side too, so it stays balanced — just like a real balance scale has to keep both pans level.</p>

      <p class="lead">Sofia needs a certain number of points to break the school record. She needs 45 total, and has scored 32 so far. Solve x + 32 = 45 to find how many more points she needs.</p>
      <div class="whiteboard">
        ${balanceHTML('x + 32','45')}
        <div class="wb-row">Step 1 — x is being added to 32, so undo it with the opposite operation: subtract 32 from BOTH sides to keep the scale balanced.</div>
        <div class="wb-row">Step 2 — x = 45 − 32 = <b>13</b> more points needed.</div>
      </div>

      <p class="lead">Diego's team scores 6 points per basket, and finished the game with 48 points. Solve 6x = 48 to find how many baskets they made.</p>
      <div class="whiteboard">
        ${balanceHTML('6x','48')}
        <div class="wb-row">Step 1 — x is being multiplied by 6, so undo it by dividing BOTH sides by 6.</div>
        <div class="wb-row">Step 2 — x = 48 ÷ 6 = <b>8</b> baskets.</div>
      </div>

      <p class="lead">Leo had some number of points, then lost 20 in a penalty, ending with 15. Solve x − 20 = 15 to find how many points he started with.</p>
      <div class="whiteboard">
        ${balanceHTML('x − 20','15')}
        <div class="wb-row">Step 1 — x is having 20 subtracted from it, so undo that by adding 20 to BOTH sides.</div>
        <div class="wb-row">Step 2 — x = 15 + 20 = <b>35</b> points.</div>
      </div>

      <p class="lead">Nina's team needs 150 total wins across the season, and they already have 92. Solve x + 92 = 150 to find how many more wins they need.</p>
      <div class="whiteboard">
        ${balanceHTML('x + 92','150')}
        <div class="wb-row">Subtract 92 from both sides: x = 150 − 92 = <b>58</b> more wins.</div>
      </div>

      <p class="tip">Coach tip: whatever you do to one side of the equation, you have to do to the other side too.</p>`
  }
});
