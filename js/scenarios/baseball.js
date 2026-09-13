/* Coach Mode: baseball situational decision scenarios.
   Same mechanic as js/scenarios/basketball.js (compare a made/attempted
   stat line, pick the best or worst) using the shared pickNames/
   genCandidates/statLines/scenarioLevelParams helpers from js/helpers.js —
   applied to baseball decisions instead of basketball ones.

   Percentage ranges below are widened past strict real-world norms on
   purpose (e.g. batting average as 15-40% rather than the more realistic
   20-36%) — a narrower range doesn't leave genCandidates' retry loop enough
   room to reliably find 3-4 candidates with a clean gap between them, which
   risks silently falling back to a wrong "correct" answer. Checked against
   the same fallback-rate simulation used to tune basketball's ranges. */

const BB_ATBAT_RANGES = [ [40,100], [80,180], [150,300], [250,500] ]; // at-bats: season-scale volume
const BB_SB_RANGES    = [ [5,12], [8,18], [12,25], [18,35] ];         // stolen-base attempts: much smaller volume than at-bats
const BB_K_RANGES     = [ [15,30], [25,50], [40,80], [60,120] ];      // batters faced, for a pitcher's strikeout rate

/* ---------- Pinch Hit Call: best batting average ---------- */
const PINCHHIT_SITUATIONS = [
  "Bottom of the 9th, down by one, runner on second with one out. Who do you send up to pinch hit?",
  "Tie game, bases loaded, two outs in the 8th. Who gets the at-bat?",
  "Down by two, runner on third, nobody out — who's up?"
];
function genPinchHitScenario(level){
  const { n, attLo, attHi, minGap } = scenarioLevelParams(level, BB_ATBAT_RANGES);
  const { candidates, answer } = genCandidates(pickNames(n), attLo, attHi, 15, 40, minGap, 'max');
  const best = candidates[answer];
  const bestPct = Math.round(best.made/best.attempted*100);
  return {
    pre: rnd(PINCHHIT_SITUATIONS),
    question: "Who do you send up to hit?",
    statUnit: "AVG",
    candidates, answer,
    why: `Batting average: ${statLines(candidates,'AVG')}. <b>${best.name}</b> is hitting the best at ${bestPct}%, so that's your at-bat.`
  };
}

/* ---------- Send the Runner: best stolen-base success rate ---------- */
const STEALER_SITUATIONS = [
  "Runner needs to get into scoring position — first and second, nobody out. Who do you send?",
  "Late innings, one-run game. You need a stolen base to get the tying run in scoring position.",
  "Pitcher's got a slow delivery to the plate — good chance to run. Who goes?"
];
function genStealerScenario(level){
  const { n, attLo, attHi, minGap } = scenarioLevelParams(level, BB_SB_RANGES);
  const { candidates, answer } = genCandidates(pickNames(n), attLo, attHi, 55, 92, minGap, 'max');
  const best = candidates[answer];
  const bestPct = Math.round(best.made/best.attempted*100);
  return {
    pre: rnd(STEALER_SITUATIONS),
    question: "Who do you send to steal?",
    statUnit: "SB%",
    candidates, answer,
    why: `Stolen-base success rate: ${statLines(candidates,'SB%')}. <b>${best.name}</b> succeeds the most at ${bestPct}%, so that's your runner.`
  };
}

/* ---------- Bring In The Closer: best strikeout rate ---------- */
const CLOSER_SITUATIONS = [
  "Bases loaded, two outs, one-run lead in the 9th. You need a strikeout. Who comes in?",
  "Tying run on third, two outs — bring in the arm most likely to punch this batter out.",
  "Full count, bases juiced. Who do you trust to get the strikeout?"
];
function genCloserScenario(level){
  const { n, attLo, attHi, minGap } = scenarioLevelParams(level, BB_K_RANGES);
  const { candidates, answer } = genCandidates(pickNames(n), attLo, attHi, 12, 40, minGap, 'max');
  const best = candidates[answer];
  const bestPct = Math.round(best.made/best.attempted*100);
  return {
    pre: rnd(CLOSER_SITUATIONS),
    question: "Who do you bring in to pitch?",
    statUnit: "K rate",
    candidates, answer,
    why: `Strikeout rate, of batters faced: ${statLines(candidates,'K rate')}. <b>${best.name}</b> strikes batters out the most at ${bestPct}%, so that's your pitcher.`
  };
}

/* ---------- Pitch Around: worst batting average (who to actually face) ---------- */
const PITCHAROUND_SITUATIONS = [
  "Their cleanup hitter is up with first base open — instead of walking him, who's the safer out later in the lineup?",
  "You don't want to face their best bat with the game on the line. Who's the easier out coming up next?",
  "First base open, two outs. Who do you actually want to pitch to?"
];
function genPitchAroundScenario(level){
  const { n, attLo, attHi, minGap } = scenarioLevelParams(level, BB_ATBAT_RANGES);
  const { candidates, answer } = genCandidates(pickNames(n), attLo, attHi, 15, 40, minGap, 'min');
  const worst = candidates[answer];
  const worstPct = Math.round(worst.made/worst.attempted*100);
  return {
    pre: rnd(PITCHAROUND_SITUATIONS),
    question: "Who do you pitch to instead?",
    statUnit: "AVG",
    candidates, answer,
    why: `Batting average: ${statLines(candidates,'AVG')}. <b>${worst.name}</b> is hitting the LOWEST at ${worstPct}%, so that's the safer batter to face.`
  };
}

Object.assign(SCENARIOS, {
  pinchhit:    { title:"Pinch Hit Call",      icon:"⚾", maxLevel:4, gen:genPinchHitScenario },
  stealer:     { title:"Send The Runner",     icon:"🏃", maxLevel:4, gen:genStealerScenario },
  closer:      { title:"Bring In The Closer", icon:"🔥", maxLevel:4, gen:genCloserScenario },
  pitcharound: { title:"Pitch Around",        icon:"🚶", maxLevel:4, gen:genPitchAroundScenario }
});
