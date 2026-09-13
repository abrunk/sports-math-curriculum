/* Coach Mode: soccer situational decision scenarios.
   Same mechanic as js/scenarios/basketball.js (compare a made/attempted
   stat line, pick the best or worst) using the shared pickNames/
   genCandidates/statLines/scenarioLevelParams helpers from js/helpers.js —
   applied to soccer decisions instead of basketball ones.

   Percentage ranges below are widened past strict real-world norms on
   purpose (e.g. free-kick conversion as 3-30% rather than the more
   realistic 5-20%) — a narrower range doesn't leave genCandidates' retry
   loop enough room to reliably find 3-4 candidates with a clean gap between
   them, which risks silently falling back to a wrong "correct" answer.
   Checked against the same fallback-rate simulation used to tune
   basketball's ranges. */

const SOC_PK_RANGES     = [ [8,20], [15,35], [25,55], [40,90] ];   // penalty attempts: season-scale, but penalties are rare so smaller than shots
const SOC_FK_RANGES     = [ [10,25], [20,45], [35,70], [55,110] ]; // free-kick attempts taken
const SOC_AERIAL_RANGES = [ [15,35], [25,55], [40,80], [60,120] ]; // aerial duels contested
const SOC_PASS_RANGES   = [ [20,40], [35,70], [55,100], [80,160] ]; // passes attempted, for the press-target scenario

/* ---------- Shootout Kicker: best penalty conversion ---------- */
const PENALTY_SITUATIONS = [
  "It's going to penalties. Who do you send up first?",
  "Referee points to the spot — stoppage time penalty. Who takes it?",
  "Down to sudden death in the shootout. Who steps up?"
];
function genPenaltyScenario(level){
  const { n, attLo, attHi, minGap } = scenarioLevelParams(level, SOC_PK_RANGES);
  const { candidates, answer } = genCandidates(pickNames(n), attLo, attHi, 60, 95, minGap, 'max');
  const best = candidates[answer];
  const bestPct = Math.round(best.made/best.attempted*100);
  return {
    pre: rnd(PENALTY_SITUATIONS),
    question: "Who takes the penalty?",
    statUnit: "PK",
    candidates, answer,
    why: `Career penalty conversion: ${statLines(candidates,'PK')}. <b>${best.name}</b> converts the most at ${bestPct}%, so that's your kicker.`
  };
}

/* ---------- Free Kick Specialist: best free-kick conversion ---------- */
const FREEKICK_SITUATIONS = [
  "Foul just outside the box, prime free-kick range. Who takes it?",
  "Dead-ball opportunity 20 yards out with the match tied late. Who steps over the ball?"
];
function genFreeKickScenario(level){
  const { n, attLo, attHi, minGap } = scenarioLevelParams(level, SOC_FK_RANGES);
  const { candidates, answer } = genCandidates(pickNames(n), attLo, attHi, 3, 30, minGap, 'max');
  const best = candidates[answer];
  const bestPct = Math.round(best.made/best.attempted*100);
  return {
    pre: rnd(FREEKICK_SITUATIONS),
    question: "Who takes the free kick?",
    statUnit: "FK",
    candidates, answer,
    why: `Free-kick conversion: ${statLines(candidates,'FK')}. <b>${best.name}</b> scores the most at ${bestPct}%, so that's your set-piece taker.`
  };
}

/* ---------- Target The Header: best aerial duel win rate ---------- */
const AERIAL_SITUATIONS = [
  "Corner kick coming in — who do you want in the box to win the header?",
  "Set piece from wide, ball's going to be crossed in. Who's the target?"
];
function genAerialScenario(level){
  const { n, attLo, attHi, minGap } = scenarioLevelParams(level, SOC_AERIAL_RANGES);
  const { candidates, answer } = genCandidates(pickNames(n), attLo, attHi, 35, 78, minGap, 'max');
  const best = candidates[answer];
  const bestPct = Math.round(best.made/best.attempted*100);
  return {
    pre: rnd(AERIAL_SITUATIONS),
    question: "Who do you target in the box?",
    statUnit: "aerial win rate",
    candidates, answer,
    why: `Aerial duels won: ${statLines(candidates,'aerial')}. <b>${best.name}</b> wins the most at ${bestPct}%, so that's your header target.`
  };
}

/* ---------- Who To Press: worst pass completion on the other team ---------- */
const PRESS_SITUATIONS = [
  "Trying to force a turnover in their defensive third — who do you send the press at?",
  "They're building out of the back. Who's the shakiest on the ball to pressure first?"
];
function genPressScenario(level){
  const { n, attLo, attHi, minGap } = scenarioLevelParams(level, SOC_PASS_RANGES);
  const { candidates, answer } = genCandidates(pickNames(n), attLo, attHi, 58, 92, minGap, 'min');
  const worst = candidates[answer];
  const worstPct = Math.round(worst.made/worst.attempted*100);
  return {
    pre: rnd(PRESS_SITUATIONS),
    question: "Who do you press?",
    statUnit: "pass completion",
    candidates, answer,
    why: `Pass completion rate: ${statLines(candidates,'pass completion')}. <b>${worst.name}</b> completes the LEAST at ${worstPct}%, so they're most likely to cough it up under pressure.`
  };
}

Object.assign(SCENARIOS, {
  penalty: { title:"Shootout Kicker",   icon:"⚽", maxLevel:4, gen:genPenaltyScenario },
  freekick:{ title:"Free Kick Taker",   icon:"🎯", maxLevel:4, gen:genFreeKickScenario },
  aerial:  { title:"Target The Header", icon:"🤾", maxLevel:4, gen:genAerialScenario },
  press:   { title:"Who To Press",      icon:"⚡", maxLevel:4, gen:genPressScenario }
});
