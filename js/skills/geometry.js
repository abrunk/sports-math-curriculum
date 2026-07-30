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

/* ---------- register ---------- */
Object.assign(SKILLS, {
  coordinateplane:{
    title:"Coordinate Plane", icon:"🎯", accent:"#28d6e6",
    domain:'Geometry',
    skill:"Plot and read points, find distances, and reflect points on a shot chart.",
    std:"5.G.A.1, 5.G.A.2, 6.G.A.3", maxLevel:4, gen:genCoordinatePlane,
    coach:`<p class="lead">A point on the coordinate plane is written (x, y): x is how far right, y is how far up from the origin (0,0). If two points share an x or y coordinate, the distance between them is just the difference of the other coordinate.</p>
      <div class="whiteboard">
        <div class="wb-row">3 right, 4 up from the hoop → <b>(3, 4)</b></div>
        <div class="wb-row">(2, 0) and (2, 6) share an x → distance = |6 − 0| = <b>6</b></div>
        <div class="wb-row">Reflecting (4, 3) across the y-axis flips left/right → <b>(−4, 3)</b></div>
      </div>
      <p class="tip">Coach tip: enter coordinate answers as x, then y — negative numbers are allowed, just type the minus sign.</p>`
  },
  areashapes:{
    title:"Area of Shapes", icon:"📐", accent:"#ff6a1a",
    domain:'Geometry',
    skill:"Find the area of rectangles, triangles, parallelograms, and combined shapes.",
    std:"6.G.A.1", maxLevel:4, gen:genAreaShapes,
    coach:`<p class="lead">Rectangle area = length × width. A triangle is half of that same rectangle, so triangle area = (base × height) ÷ 2. A parallelogram has the same area formula as a rectangle: base × height. For an oddly-shaped field, split it into rectangles you already know how to handle, then add or subtract.</p>
      <div class="whiteboard">
        <div class="wb-row">Rectangle 10 × 6 = <b>60</b></div>
        <div class="wb-row">Triangle, base 10 height 6 → (10 × 6) ÷ 2 = <b>30</b></div>
        <div class="wb-row">L-shape: big rectangle minus the missing corner</div>
      </div>
      <p class="tip">Coach tip: always double-check whether you need to divide by 2 — that's the #1 triangle mistake.</p>`
  },
  volumesa:{
    title:"Volume & Surface Area", icon:"📦", accent:"#ffcf3f",
    domain:'Geometry',
    skill:"Find the volume and surface area of boxes and equipment crates.",
    std:"6.G.A.2, 6.G.A.4", maxLevel:4, gen:genVolumeSurfaceArea,
    coach:`<p class="lead">Volume of a box = length × width × height — how much space is inside. Surface area is how much material covers the <b>outside</b>: add up the area of all 6 faces (there are 3 pairs of matching faces).</p>
      <div class="whiteboard">
        <div class="wb-row">Volume: 4 × 3 × 2 = <b>24</b> cubic feet</div>
        <div class="wb-row">Surface area: 2(lw + lh + wh) = 2(12 + 8 + 6) = <b>52</b> square feet</div>
      </div>
      <p class="tip">Coach tip: volume can have fractional/decimal edge lengths — the multiplication works the same way.</p>`
  }
});
