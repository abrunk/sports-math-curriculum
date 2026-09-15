/* Geometry domain (5.G, 6.G). Each skill coin-flips between a sports word
   problem and a bare computation rep at the same level, same pattern as the
   other domains. */

/* ---------- Coordinate Plane (5.G.A.1/A.2, 6.G.A.3) ---------- */
function genCoordReadWord(){
  const p = rnd(PLAYERS);
  const x = ri(1,9), y = ri(1,9);
  return { kind:'point',
    pre:`On the shot chart, the hoop is at the origin (0,0). ${p} took a shot ${x} feet to the right and ${y} feet up from the hoop.`,
    question:`What are the coordinates of ${p}'s shot?`,
    answer:[x,y],
    why:`Right ${x}, up ${y} → <b>(${x}, ${y})</b>.` };
}
function genCoordReadBare(){
  const x = ri(1,9), y = ri(1,9);
  return { kind:'point', question:`A point is ${x} units right and ${y} units up from the origin. What are its coordinates?`, answer:[x,y],
    why:`<b>(${x}, ${y})</b>.` };
}
function genCoordDistWord(){
  const p = rnd(PLAYERS);
  const sameX = Math.random()<0.5;
  const fixed = ri(0,6);
  let y1=ri(0,10), y2; do{ y2=ri(0,10); }while(y2===y1);
  let x1=ri(0,10), x2; do{ x2=ri(0,10); }while(x2===x1);
  const a = sameX ? [fixed,y1] : [x1,fixed];
  const b = sameX ? [fixed,y2] : [x2,fixed];
  const dist = sameX ? Math.abs(y2-y1) : Math.abs(x2-x1);
  return { kind:'num',
    pre:`Two markers on ${p}'s field are at (${a[0]}, ${a[1]}) and (${b[0]}, ${b[1]}).`,
    question:`What is the distance between them?`,
    answer:dist,
    why: sameX ? `Same x-coordinate, so subtract the y's: |${y2} − ${y1}| = <b>${dist}</b>.` : `Same y-coordinate, so subtract the x's: |${x2} − ${x1}| = <b>${dist}</b>.` };
}
function genCoordDistBare(){
  const sameX = Math.random()<0.5;
  const fixed = ri(0,6);
  let y1=ri(0,10), y2; do{ y2=ri(0,10); }while(y2===y1);
  let x1=ri(0,10), x2; do{ x2=ri(0,10); }while(x2===x1);
  const a = sameX ? [fixed,y1] : [x1,fixed];
  const b = sameX ? [fixed,y2] : [x2,fixed];
  const dist = sameX ? Math.abs(y2-y1) : Math.abs(x2-x1);
  return { kind:'num', question:`Find the distance between (${a[0]}, ${a[1]}) and (${b[0]}, ${b[1]}).`, answer:dist,
    why: sameX ? `Same x-coordinate: |${y2} − ${y1}| = <b>${dist}</b>.` : `Same y-coordinate: |${x2} − ${x1}| = <b>${dist}</b>.` };
}
function genCoordAreaWord(){
  const p = rnd(PLAYERS);
  const w = ri(3,10), h = ri(3,10), x0=ri(0,4), y0=ri(0,4);
  return { kind:'num',
    pre:`A rectangular section of ${p}'s practice field has corners at (${x0},${y0}), (${x0+w},${y0}), (${x0+w},${y0+h}), and (${x0},${y0+h}).`,
    question:`What is the area of that section?`,
    answer:w*h,
    why:`Width = ${w}, height = ${h}. Area = ${w} × ${h} = <b>${w*h}</b>.` };
}
function genCoordAreaBare(){
  const w = ri(3,12), h = ri(3,12), x0=ri(0,4), y0=ri(0,4);
  return { kind:'num', question:`A rectangle has corners at (${x0},${y0}), (${x0+w},${y0}), (${x0+w},${y0+h}), (${x0},${y0+h}). What is its area?`, answer:w*h,
    why:`Width = ${w}, height = ${h}. Area = <b>${w*h}</b>.` };
}
function genCoordReflectWord(){
  const p = rnd(PLAYERS);
  const x = ri(1,9), y = ri(1,9);
  const axis = rnd(['x','y']);
  const ans = axis==='y' ? [-x,y] : [x,-y];
  return { kind:'point',
    pre:`${p} shoots from (${x}, ${y}) on the chart, with the hoop at the origin. A teammate shoots from the mirrored spot on the ${axis==='y'?'opposite side of the hoop (flip left/right)':'opposite end (flip up/down)'}.`,
    question:`What are the teammate's coordinates?`,
    answer:ans,
    why: axis==='y' ? `Flipping left/right negates the x-coordinate: (${x},${y}) → <b>(${-x}, ${y})</b>.` : `Flipping up/down negates the y-coordinate: (${x},${y}) → <b>(${x}, ${-y})</b>.` };
}
function genCoordReflectBare(){
  const x = ri(1,9), y = ri(1,9);
  const axis = rnd(['x','y']);
  const ans = axis==='y' ? [-x,y] : [x,-y];
  return { kind:'point', question:`Reflect the point (${x}, ${y}) across the ${axis}-axis. What are the new coordinates?`, answer:ans,
    why: axis==='y' ? `Reflecting across the y-axis negates x: <b>(${-x}, ${y})</b>.` : `Reflecting across the x-axis negates y: <b>(${x}, ${-y})</b>.` };
}
function genCoordWord(level){
  if(level===1) return genCoordReadWord();
  if(level===2) return genCoordDistWord();
  if(level===3) return genCoordAreaWord();
  return genCoordReflectWord();
}
function genCoordBare(level){
  if(level===1) return genCoordReadBare();
  if(level===2) return genCoordDistBare();
  if(level===3) return genCoordAreaBare();
  return genCoordReflectBare();
}
function genCoordinatePlane(level){ return Math.random()<0.5 ? genCoordWord(level) : genCoordBare(level); }

/* ---------- Area of Shapes (6.G.A.1) ---------- */
function genAreaWord(level){
  const p = rnd(PLAYERS);
  if(level===1){
    const l=ri(5,20), w=ri(5,20);
    return { kind:'num', pre:`${p}'s practice field is a rectangle ${l} yards by ${w} yards.`, question:`What is its area, in square yards?`, answer:l*w,
      why:`Area = length × width = ${l} × ${w} = <b>${l*w}</b> square yards.` };
  }
  if(level===2){
    const b=ri(2,10)*2, h=ri(4,20), area=(b*h)/2;
    return { kind:'num', pre:`A triangular team flag has a base of ${b} inches and a height of ${h} inches.`, question:`What is the area of the flag, in square inches?`, answer:area,
      why:`Area of a triangle = (base × height) ÷ 2 = (${b} × ${h}) ÷ 2 = <b>${area}</b>.` };
  }
  if(level===3){
    const b=ri(5,20), h=ri(4,15);
    return { kind:'num', pre:`A parallelogram-shaped section of turf has a base of ${b} feet and a height of ${h} feet.`, question:`What is its area, in square feet?`, answer:b*h,
      why:`Area of a parallelogram = base × height = ${b} × ${h} = <b>${b*h}</b>.` };
  }
  const L=ri(10,20), W=ri(10,20), sl=ri(2,Math.floor(L/2)), sw=ri(2,Math.floor(W/2)), area=L*W-sl*sw;
  return { kind:'num',
    pre:`${p}'s team is painting an L-shaped section of the field: a big rectangle ${L} by ${W} yards, with a ${sl} by ${sw} yard corner cut out.`,
    question:`What is the area of the painted section, in square yards?`,
    answer:area,
    why:`Big rectangle: ${L} × ${W} = ${L*W}. Cut-out corner: ${sl} × ${sw} = ${sl*sw}. Area = ${L*W} − ${sl*sw} = <b>${area}</b>.` };
}
function genAreaBare(level){
  if(level===1){ const l=ri(5,20), w=ri(5,20); return { kind:'num', question:`Find the area of a rectangle with length ${l} and width ${w}.`, answer:l*w, why:`${l} × ${w} = <b>${l*w}</b>.` }; }
  if(level===2){ const b=ri(2,10)*2, h=ri(4,20), area=(b*h)/2; return { kind:'num', question:`Find the area of a triangle with base ${b} and height ${h}.`, answer:area, why:`(${b} × ${h}) ÷ 2 = <b>${area}</b>.` }; }
  if(level===3){ const b=ri(5,20), h=ri(4,15); return { kind:'num', question:`Find the area of a parallelogram with base ${b} and height ${h}.`, answer:b*h, why:`${b} × ${h} = <b>${b*h}</b>.` }; }
  const L=ri(10,20), W=ri(10,20), sl=ri(2,Math.floor(L/2)), sw=ri(2,Math.floor(W/2)), area=L*W-sl*sw;
  return { kind:'num', question:`A big rectangle ${L} by ${W} has a ${sl} by ${sw} rectangle cut out of one corner. What is the remaining area?`, answer:area,
    why:`${L} × ${W} = ${L*W}. ${sl} × ${sw} = ${sl*sw}. ${L*W} − ${sl*sw} = <b>${area}</b>.` };
}
function genAreaShapes(level){ return Math.random()<0.5 ? genAreaWord(level) : genAreaBare(level); }

/* ---------- Volume & Surface Area (6.G.A.2, 6.G.A.4) ---------- */
function genVolSAWord(level){
  const p = rnd(PLAYERS);
  if(level===1){
    const l=ri(2,10), w=ri(2,10), h=ri(2,10);
    return { kind:'num', pre:`${p}'s equipment box is ${l} ft long, ${w} ft wide, and ${h} ft tall.`, question:`What is its volume, in cubic feet?`, answer:l*w*h,
      why:`Volume = l × w × h = ${l} × ${w} × ${h} = <b>${l*w*h}</b> cubic feet.` };
  }
  if(level===2){
    const l=ri(2,8), w=ri(2,8), h=ri(1,8)+0.5, vol=Math.round(l*w*h*10)/10;
    return { kind:'num', pre:`A ball rack is ${l} ft long, ${w} ft wide, and ${h} ft tall.`, question:`What is its volume, in cubic feet?`, answer:vol,
      why:`Volume = ${l} × ${w} × ${h} = <b>${vol}</b> cubic feet.` };
  }
  if(level===3){
    const l=ri(2,10), w=ri(2,10), h=ri(2,10), sa=2*(l*w + l*h + w*h);
    return { kind:'num', pre:`${p}'s equipment box is ${l} ft long, ${w} ft wide, and ${h} ft tall.`, question:`What is its total surface area, in square feet?`, answer:sa,
      why:`Surface area = 2(lw + lh + wh) = 2(${l*w} + ${l*h} + ${w*h}) = <b>${sa}</b> square feet.` };
  }
  const l=ri(2,10), w=ri(2,10), h=ri(2,10), vol=l*w*h;
  return { kind:'num', pre:`A storage box has a volume of ${vol} cubic feet. It is ${l} ft long and ${w} ft wide.`, question:`How tall is the box, in feet?`, answer:h,
    why:`${vol} ÷ (${l} × ${w}) = ${vol} ÷ ${l*w} = <b>${h}</b> feet.` };
}
function genVolSABare(level){
  if(level===1){ const l=ri(2,10), w=ri(2,10), h=ri(2,10); return { kind:'num', question:`Find the volume of a box that is ${l} by ${w} by ${h}.`, answer:l*w*h, why:`${l} × ${w} × ${h} = <b>${l*w*h}</b>.` }; }
  if(level===2){ const l=ri(2,8), w=ri(2,8), h=ri(1,8)+0.5, vol=Math.round(l*w*h*10)/10; return { kind:'num', question:`Find the volume of a box that is ${l} by ${w} by ${h}.`, answer:vol, why:`${l} × ${w} × ${h} = <b>${vol}</b>.` }; }
  if(level===3){ const l=ri(2,10), w=ri(2,10), h=ri(2,10), sa=2*(l*w + l*h + w*h); return { kind:'num', question:`Find the surface area of a box that is ${l} by ${w} by ${h}.`, answer:sa, why:`2(${l*w} + ${l*h} + ${w*h}) = <b>${sa}</b>.` }; }
  const l=ri(2,10), w=ri(2,10), h=ri(2,10), vol=l*w*h;
  return { kind:'num', question:`A box has volume ${vol}, length ${l}, and width ${w}. What is its height?`, answer:h,
    why:`${vol} ÷ (${l} × ${w}) = <b>${h}</b>.` };
}
function genVolumeSurfaceArea(level){ return Math.random()<0.5 ? genVolSAWord(level) : genVolSABare(level); }

/* ---------- Circles & Angles (7.G.B.4, 7.G.B.5) ----------
   Two sub-topics coin-flipped at the harder levels: circle measurement
   (circumference/area, always using pi≈3.14 — the literal 3.14 rather than
   Math.PI, so the accepted answer matches what a kid computes by hand from
   the stated approximation) and angle-pair relationships. Level 4 ties
   angle pairs back to the Two-Step Equations skill (one angle is a multiple
   of the other) rather than reaching for a 9th concept. */
function genCircumferenceWord(){
  const p = rnd(PLAYERS);
  const r = ri(2,10);
  const circ = Math.round(2*3.14*r*10)/10;
  return { kind:'num', pre:`${p}'s team logo is a circle painted at center court with a radius of ${r} feet.`, question:`What is the circumference, using π ≈ 3.14? Round to the nearest tenth.`, answer:circ,
    why:`Circumference = 2 × π × r = 2 × 3.14 × ${r} = <b>${circ}</b> feet.` };
}
function genCircumferenceBare(){
  const r = ri(2,10);
  const circ = Math.round(2*3.14*r*10)/10;
  return { kind:'num', question:`A circle has radius ${r}. Find its circumference, using π ≈ 3.14. Round to the nearest tenth.`, answer:circ,
    why:`2 × 3.14 × ${r} = <b>${circ}</b>.` };
}
function genCircleAreaWord(){
  const p = rnd(PLAYERS);
  const useDiameter = Math.random()<0.5;
  const r = ri(2,12);
  const area = Math.round(3.14*r*r*10)/10;
  if(useDiameter){
    return { kind:'num', pre:`${p}'s team is painting a circular logo at midfield with a diameter of ${r*2} feet.`, question:`What is the area, using π ≈ 3.14? Round to the nearest tenth.`, answer:area,
      why:`Diameter ${r*2} means radius = ${r}. Area = π × r² = 3.14 × ${r}² = 3.14 × ${r*r} = <b>${area}</b> square feet.` };
  }
  return { kind:'num', pre:`${p}'s team is painting a circular logo at midfield with a radius of ${r} feet.`, question:`What is the area, using π ≈ 3.14? Round to the nearest tenth.`, answer:area,
    why:`Area = π × r² = 3.14 × ${r}² = 3.14 × ${r*r} = <b>${area}</b> square feet.` };
}
function genCircleAreaBare(){
  const r = ri(2,12);
  const area = Math.round(3.14*r*r*10)/10;
  return { kind:'num', question:`A circle has radius ${r}. Find its area, using π ≈ 3.14. Round to the nearest tenth.`, answer:area, why:`3.14 × ${r}² = <b>${area}</b>.` };
}
function genAngleComplementary(){
  const a = ri(10,80);
  const b = 90-a;
  return { kind:'num', pre:`Two angles are complementary (they add up to 90°). One of them measures ${a}°.`, question:`What is the measure of the other angle?`, answer:b,
    why:`Complementary angles sum to 90°: 90 − ${a} = <b>${b}</b>°.` };
}
function genAngleSupplementary(){
  const a = ri(20,160);
  const b = 180-a;
  return { kind:'num', pre:`Two angles are supplementary (they add up to 180°, forming a straight line). One of them measures ${a}°.`, question:`What is the measure of the other angle?`, answer:b,
    why:`Supplementary angles sum to 180°: 180 − ${a} = <b>${b}</b>°.` };
}
function genAngleVertical(){
  const a = ri(20,160);
  return { kind:'num', pre:`Two lines cross, forming 4 angles. One angle measures ${a}°, and you need the angle directly across from it (its "vertical angle").`, question:`What is the measure of the vertical angle?`, answer:a,
    why:`Vertical angles (directly across an X from each other) are always EQUAL — no arithmetic needed, it's still <b>${a}</b>°.` };
}
function genAngleRatio(){
  // supplementary angles sum to a fixed 180, so mult (not x) is what's chosen
  // freely — x = 180/(1+mult) has to come out to a clean integer
  const mult = rnd([2,3,4,5]);
  const x = 180/(1+mult);
  return { kind:'num', pre:`Two angles are supplementary. One angle is ${mult} times the other.`, question:`Solve for the smaller angle: x + ${mult}x = 180.`, answer:x,
    why:`x + ${mult}x = 180 → ${1+mult}x = 180 → x = 180 ÷ ${1+mult} = <b>${x}</b>°.` };
}
function genCircleAngle(level){
  if(level===1) return Math.random()<0.5 ? genCircumferenceWord() : genCircumferenceBare();
  if(level===2) return Math.random()<0.5 ? genCircleAreaWord() : genCircleAreaBare();
  if(level===3) return Math.random()<0.5 ? genAngleComplementary() : genAngleSupplementary();
  return Math.random()<0.5 ? genAngleVertical() : genAngleRatio();
}

/* ---------- register ---------- */
Object.assign(SKILLS, {
  coordinateplane:{
    title:"Coordinate Plane", icon:"🎯", accent:"#28d6e6",
    domain:'Geometry',
    skill:"Plot and read points, find distances, and reflect points on a shot chart.",
    std:"5.G.A.1, 5.G.A.2, 6.G.A.3", maxLevel:4, gen:genCoordinatePlane,
    coach:`<p class="lead">Every point on the coordinate plane is written (x, y): <b>x</b> tells you how far to move right (or left, if negative) from the origin (0,0), and <b>y</b> tells you how far to move up (or down). If two points share the same x-coordinate, they're stacked directly above and below each other, so the distance between them is just the difference of their y-coordinates — the same idea works sideways when two points share a y-coordinate.</p>

      <p class="lead">On the team's shot chart, the hoop sits at the origin (0,0). Maya takes a shot 6 feet to the right and 4 feet up from the hoop. What are the coordinates of her shot?</p>
      <div class="whiteboard">
        ${coordGridHTML([{x:6,y:4,label:'Maya',color:'var(--orange)'}], 10, false)}
        <div class="wb-row">Step 1 — right/left is always the x-coordinate: 6 feet right → x = 6.</div>
        <div class="wb-row">Step 2 — up/down is always the y-coordinate: 4 feet up → y = 4.</div>
        <div class="wb-row">Step 3 — the shot is at <b>(6, 4)</b>.</div>
      </div>

      <p class="lead">Two field markers on Diego's practice field are at (2, 1) and (2, 8). What is the distance between them?</p>
      <div class="whiteboard">
        ${coordGridHTML([{x:2,y:1,label:'A',color:'var(--orange)'},{x:2,y:8,label:'B',color:'var(--cyan)'}], 10, false)}
        <div class="wb-row">Step 1 — both points have the same x-coordinate (2), so they sit on the same vertical line — one directly above the other.</div>
        <div class="wb-row">Step 2 — since they're on the same vertical line, just subtract the y-coordinates: |8 − 1| = <b>7</b>.</div>
      </div>

      <p class="lead">A rectangular section of the practice field has corners at (0,0), (8,0), (8,5), and (0,5). What is the area of that section?</p>
      <div class="whiteboard">
        ${coordGridHTML([{x:0,y:0,color:'var(--orange)'},{x:8,y:0,color:'var(--orange)'},{x:8,y:5,color:'var(--orange)'},{x:0,y:5,color:'var(--orange)'}], 10, false)}
        <div class="wb-row">Step 1 — the corners share x-values of 0 and 8, so the width is 8 − 0 = 8. They share y-values of 0 and 5, so the height is 5 − 0 = 5.</div>
        <div class="wb-row">Step 2 — area = width × height = 8 × 5 = <b>40</b> square units.</div>
      </div>

      <p class="lead">Leo shoots from (4, 3), with the hoop at the origin. A teammate stands at the mirrored spot on the opposite side of the hoop — same distance, flipped left-right. What are the teammate's coordinates?</p>
      <div class="whiteboard">
        ${coordGridHTML([{x:4,y:3,label:'Leo',color:'var(--orange)'},{x:-4,y:3,label:'Teammate',color:'var(--cyan)'}], 6, true)}
        <div class="wb-row">Step 1 — flipping left-right across the y-axis keeps the height (y) the same but flips the sign of the sideways distance (x): 4 becomes −4.</div>
        <div class="wb-row">Step 2 — the teammate is at <b>(−4, 3)</b>.</div>
      </div>

      <p class="tip">Coach tip: enter coordinate answers as x, then y — negative numbers are allowed, just type the minus sign.</p>`
  },
  areashapes:{
    title:"Area of Shapes", icon:"📐", accent:"#ff6a1a",
    domain:'Geometry',
    skill:"Find the area of rectangles, triangles, parallelograms, and combined shapes.",
    std:"6.G.A.1", maxLevel:4, gen:genAreaShapes,
    coach:`<p class="lead">Area measures how much surface a shape covers, in square units. Rectangle area = length × width. A right triangle is exactly <b>half</b> of a rectangle built around it, so triangle area = (base × height) ÷ 2 — that division by 2 is the single most common thing to forget. A parallelogram, once you slide the extra triangle off one end onto the other, becomes that same rectangle shape — same formula: base × height. For an oddly-shaped field, split it into rectangles and triangles you already know how to handle, then add or subtract their areas.</p>

      <p class="lead">Nina's practice field is a rectangle, 12 yards by 7 yards. What is its area?</p>
      <div class="whiteboard">
        ${rectangleHTML(12,7)}
        <div class="wb-row">Area of a rectangle = length × width = 12 × 7 = <b>84</b> square yards.</div>
      </div>

      <p class="lead">The team's triangular pennant flag has a base of 10 inches and a height of 6 inches. What is the area of the flag?</p>
      <div class="whiteboard">
        ${triangleAreaHTML(10,6)}
        <div class="wb-row">Step 1 — picture the dashed rectangle drawn around the triangle: it would be 10 × 6 = 60 square inches.</div>
        <div class="wb-row">Step 2 — the triangle is exactly half of that rectangle, so divide by 2: 60 ÷ 2 = <b>30</b> square inches.</div>
      </div>

      <p class="lead">A parallelogram-shaped section of turf has a base of 11 feet and a height of 5 feet. What is its area?</p>
      <div class="whiteboard">
        ${parallelogramAreaHTML(11,5)}
        <div class="wb-row">Step 1 — imagine slicing off the triangle on the slanted left edge and sliding it to the right edge — the shape becomes a plain rectangle with the same base and height.</div>
        <div class="wb-row">Step 2 — so the formula is the same as a rectangle: base × height = 11 × 5 = <b>55</b> square feet.</div>
      </div>

      <p class="lead">The team is painting an L-shaped section of the field: a big rectangle 16 by 10 yards, with a 4 by 3 yard corner cut out. What is the area of the painted section?</p>
      <div class="whiteboard">
        ${lShapeHTML(16,10,4,3)}
        <div class="wb-row">Step 1 — find the area of the big rectangle as if the corner weren't missing: 16 × 10 = 160.</div>
        <div class="wb-row">Step 2 — find the area of the missing corner: 4 × 3 = 12.</div>
        <div class="wb-row">Step 3 — subtract the missing piece: 160 − 12 = <b>148</b> square yards.</div>
      </div>

      <p class="tip">Coach tip: always double-check whether you need to divide by 2 — that's the #1 triangle mistake.</p>`
  },
  volumesa:{
    title:"Volume & Surface Area", icon:"📦", accent:"#ffcf3f",
    domain:'Geometry',
    skill:"Find the volume and surface area of boxes and equipment crates.",
    std:"6.G.A.2, 6.G.A.4", maxLevel:4, gen:genVolumeSurfaceArea,
    coach:`<p class="lead">Volume measures how much <b>space</b> is inside a box, in cubic units: length × width × height. Surface area measures how much material it takes to <b>wrap</b> the outside — a rectangular box has 6 faces in 3 matching pairs (top/bottom, front/back, left/right), so you find the area of one face from each pair, add those three together, then double it.</p>

      <p class="lead">Theo's equipment box is 4 feet long, 3 feet wide, and 2 feet tall. What is its volume?</p>
      <div class="whiteboard">
        ${boxHTML(4,3,2)}
        <div class="wb-row">Volume = length × width × height = 4 × 3 × 2 = <b>24</b> cubic feet.</div>
      </div>

      <p class="lead">A ball rack is 4 feet long, 3 feet wide, and 2.5 feet tall. What is its volume? (Edges don't have to be whole numbers — the formula works exactly the same way.)</p>
      <div class="whiteboard">
        ${boxHTML(4,3,2.5)}
        <div class="wb-row">Volume = 4 × 3 × 2.5 = <b>30</b> cubic feet.</div>
      </div>

      <p class="lead">Priya's equipment box is 4 feet long, 3 feet wide, and 2 feet tall — same box as before. What is its total surface area?</p>
      <div class="whiteboard">
        ${boxHTML(4,3,2)}
        <div class="wb-row">Step 1 — a box has 3 pairs of matching faces. Find the area of one face from each pair: top/bottom = l × w = 4 × 3 = 12. front/back = l × h = 4 × 2 = 8. left/right = w × h = 3 × 2 = 6.</div>
        <div class="wb-row">Step 2 — add those three face areas: 12 + 8 + 6 = 26.</div>
        <div class="wb-row">Step 3 — double it, since each face has a matching twin on the opposite side: 26 × 2 = <b>52</b> square feet.</div>
      </div>

      <p class="lead">A storage box has a volume of 60 cubic feet. It is measured to be 5 feet long and 4 feet wide. How tall is the box?</p>
      <div class="whiteboard">
        ${boxHTML(5,4,3)}
        <div class="wb-row">Step 1 — since volume = length × width × height, dividing the volume by (length × width) leaves just the height: 60 ÷ (5 × 4) = 60 ÷ 20.</div>
        <div class="wb-row">Step 2 — 60 ÷ 20 = <b>3</b> feet tall.</div>
      </div>

      <p class="tip">Coach tip: volume can have fractional/decimal edge lengths — the multiplication works the same way.</p>`
  },
  circleangle:{
    title:"Circles & Angles", icon:"⭕", accent:"#ff6a1a",
    domain:'Geometry',
    skill:"Circumference and area using pi, plus complementary, supplementary, and vertical angles.",
    std:"7.G.B.4, 7.G.B.5", maxLevel:4, gen:genCircleAngle,
    coach:`<p class="lead">Every circle's circumference (distance around) and diameter (distance straight across) have the exact same ratio no matter the circle's size — that ratio is <b>π (pi)</b>, approximately 3.14. Circumference = 2 × π × r (or π × diameter). Area = π × r². For angles: <b>complementary</b> angles add to 90°, <b>supplementary</b> angles add to 180° (a straight line), and <b>vertical</b> angles — the pair directly across an X from each other when two lines cross — are always exactly equal.</p>

      <p class="lead">A team logo painted at center court is a circle with a radius of 6 feet. What is its circumference, using π ≈ 3.14?</p>
      <div class="whiteboard">
        ${circleHTML(6)}
        <div class="wb-row">Circumference = 2 × π × r = 2 × 3.14 × 6 = <b>37.7</b> feet (rounded to the nearest tenth).</div>
      </div>

      <p class="lead">Same logo. What is its area?</p>
      <div class="whiteboard">
        ${circleHTML(6)}
        <div class="wb-row">Area = π × r² = 3.14 × 6² = 3.14 × 36 = <b>113.0</b> square feet.</div>
      </div>

      <p class="lead">Two angles are complementary — they add up to 90°. One measures 35°. What's the other?</p>
      <div class="whiteboard">
        ${angleHTML('35°','?')}
        <div class="wb-row">Complementary means the two together make a right angle (90°): 90 − 35 = <b>55°</b>.</div>
      </div>

      <p class="lead">Two angles are supplementary — they add up to 180°, forming a straight line. One measures 110°. What's the other?</p>
      <div class="whiteboard">
        ${angleHTML('110°','?')}
        <div class="wb-row">Supplementary means the two together make a straight line (180°): 180 − 110 = <b>70°</b>.</div>
      </div>

      <p class="lead">Two lines cross, forming 4 angles. One angle is 65°. What's the vertical angle — the one directly across the X from it?</p>
      <div class="whiteboard">
        <div class="wb-row">Vertical angles don't need any arithmetic at all — the pair directly opposite each other when two lines cross are always exactly <b>equal</b>. The answer is just <b>65°</b>.</div>
      </div>

      <p class="lead">One more, combining angle pairs with the two-step equation skill: two angles are supplementary, and one is 3 times the other. Solve x + 3x = 180 for the smaller angle.</p>
      <div class="whiteboard">
        ${balanceHTML('x + 3x','180')}
        <div class="wb-row">Step 1 — combine the x terms: x + 3x = 4x, so 4x = 180.</div>
        <div class="wb-row">Step 2 — divide both sides by 4: x = 180 ÷ 4 = <b>45°</b> (and the other angle is 3 × 45 = 135°, which checks out: 45 + 135 = 180).</div>
      </div>

      <p class="tip">Coach tip: for circles, always use 3.14 for π unless told otherwise, and round to the nearest tenth. For angles, "complementary" and "90" both start differently but pair up by sound — c comes before s in the alphabet, just like 90 comes before 180.</p>`
  }
});
