/* Coach Mode: basketball situational decision scenarios.
   Each scenario shows 3-4 candidates with a made/attempted stat line (not a
   pre-computed percentage — the player has to do the division and compare)
   and asks a game-situation question. Same underlying skill as the
   Percentages generators in js/skills/ratios.js, applied to a decision
   instead of a bare "what percent is this" question.

   Kept as a separate SCENARIOS registry (not merged into SKILLS) so scenario
   ids can never collide with skill ids in state.levels, and so Coach Mode's
   render path can stay fully independent of the domain-play code in
   js/engine.js. Loaded after js/helpers.js (needs PLAYERS/ri/rnd and the
   shared pickNames/genCandidates/statLines/scenarioLevelParams), before
   js/engine.js. */

/* Attempts ranges read as "shots taken" — a single game for hot-hand, a
   season for the rest — so they stay on the small, human-scale end. */
const BBALL_ATT_RANGES = [ [10,30], [20,50], [30,70], [40,100] ];

/* ---------- Pass For The Win: best season 3PT% ---------- */
const THREEPT_SITUATIONS = [
  "Down by 2 with 4 seconds left, you bring the ball up the floor and need a game-tying three.",
  "Down by 3 with the clock under 10 seconds — you need a three just to force overtime.",
  "Last possession of the quarter, and your team needs a three to cut into the lead."
];
function genThreePtScenario(level){
  const { n, attLo, attHi, minGap } = scenarioLevelParams(level, BBALL_ATT_RANGES);
  const { candidates, answer } = genCandidates(pickNames(n), attLo, attHi, 18, 46, minGap, 'max');
  const best = candidates[answer];
  const bestPct = Math.round(best.made/best.attempted*100);
  return {
    pre: rnd(THREEPT_SITUATIONS),
    question: "Who do you get the ball to for the three?",
    statUnit: "3PT",
    candidates, answer,
    why: `Season 3-point shooting: ${statLines(candidates,'3PT')}. <b>${best.name}</b> has the highest percentage at ${bestPct}%, so that's the best look.`
  };
}

/* ---------- Who To Foul: worst season FT% on the OTHER team ---------- */
const FOUL_SITUATIONS = [
  "You're up by 3 with 6 seconds left. The other team is about to attempt a three — foul first and make them earn it from the line instead.",
  "Up by 2, 8 seconds on the clock. You need to foul before they can get a three off.",
  "Up by 1 in the final seconds — you have to foul to stop the clock and keep it to two points."
];
function genFoulScenario(level){
  const { n, attLo, attHi, minGap } = scenarioLevelParams(level, BBALL_ATT_RANGES);
  const { candidates, answer } = genCandidates(pickNames(n), attLo, attHi, 55, 92, minGap, 'min');
  const worst = candidates[answer];
  const worstPct = Math.round(worst.made/worst.attempted*100);
  return {
    pre: rnd(FOUL_SITUATIONS),
    question: "Which opposing player do you send to the line?",
    statUnit: "FT",
    candidates, answer,
    why: `Season free-throw shooting for the other team: ${statLines(candidates,'FT')}. <b>${worst.name}</b> has the LOWEST free-throw percentage at ${worstPct}%, so fouling them gives your team the best chance of getting the ball back.`
  };
}

/* ---------- Technical Foul Shooter: best season FT% on YOUR team ---------- */
const TECHNICAL_SITUATIONS = [
  "The other bench picks up a technical foul. NBA rules let any player on the floor shoot it — who do you pick?",
  "A technical foul gets called on the opposing coach. Any of your players on the floor can take the free throw."
];
function genTechnicalScenario(level){
  const { n, attLo, attHi, minGap } = scenarioLevelParams(level, BBALL_ATT_RANGES);
  const { candidates, answer } = genCandidates(pickNames(n), attLo, attHi, 55, 92, minGap, 'max');
  const best = candidates[answer];
  const bestPct = Math.round(best.made/best.attempted*100);
  return {
    pre: rnd(TECHNICAL_SITUATIONS),
    question: "Who takes the technical free throw?",
    statUnit: "FT",
    candidates, answer,
    why: `Season free-throw shooting: ${statLines(candidates,'FT')}. <b>${best.name}</b> has the highest percentage at ${bestPct}%, so they're the safest bet to make it.`
  };
}

/* ---------- Hot Hand Finish: best FG% TONIGHT (not season-long) ---------- */
const HOTFINISH_SITUATIONS = [
  "Tied game, final possession. Based on how everyone's shooting TONIGHT, who gets the ball?",
  "Score's tied with one possession left. Forget the season averages — who's actually got it going tonight?"
];
function genHotFinishScenario(level){
  const { n, attLo, attHi, minGap } = scenarioLevelParams(level, BBALL_ATT_RANGES);
  // tonight's attempts are a single game, so keep the range smaller regardless of level
  const gameAttLo = Math.max(3, Math.round(attLo/4)), gameAttHi = Math.max(gameAttLo+3, Math.round(attHi/4));
  const { candidates, answer } = genCandidates(pickNames(n), gameAttLo, gameAttHi, 20, 70, minGap, 'max');
  const best = candidates[answer];
  const bestPct = Math.round(best.made/best.attempted*100);
  return {
    pre: rnd(HOTFINISH_SITUATIONS),
    question: "Who do you want taking the last shot?",
    statUnit: "FG tonight",
    candidates, answer,
    why: `Shooting TONIGHT only: ${statLines(candidates,'FG')}. <b>${best.name}</b> has the highest percentage at ${bestPct}%, so they've got the hot hand right now.`
  };
}

/* ---------- register ----------
   Object.assign onto a pre-declared SCENARIOS (same pattern as SKILLS in
   index.html/js/skills/*.js) — `const SCENARIOS = {...}` here wouldn't
   attach to the enclosing scope the way `var`/global assignment does. */
Object.assign(SCENARIOS, {
  threept:   { title:"Pass For The Win",         icon:"🎯", maxLevel:4, gen:genThreePtScenario },
  foul:      { title:"Who To Foul",              icon:"🚫", maxLevel:4, gen:genFoulScenario },
  technical: { title:"Technical Foul Shooter",   icon:"🎽", maxLevel:4, gen:genTechnicalScenario },
  hotfinish: { title:"Hot Hand Finish",          icon:"🔥", maxLevel:4, gen:genHotFinishScenario }
});
