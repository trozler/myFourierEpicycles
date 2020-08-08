import { epiCycles } from "./epicycles.js";
import { reindeerX, reindeerY } from "./computedPaths/fourier/reindeer.js";

export let baseSketch = function (pFIVE) {
  let fourierX = reindeerX;
  let fourierY = reindeerY;
  let time = 0;
  let path = [];
  pFIVE.setup = function () {
    let cnv = pFIVE.createCanvas(700, 600);
    cnv.parent("startup");
    pFIVE.frameRate(25);
  };

  //Draws pictuer.
  pFIVE.draw = function () {
    pFIVE.background(255, 255, 255);

    //Create the 2 epicycle generaters.
    let vx = epiCycles(pFIVE, time, 300, 450, 0, fourierX, false); //Vector x
    let vy = epiCycles(pFIVE, time, 500, 200, pFIVE.HALF_PI, fourierY, false); //Vector y.
    let v = pFIVE.createVector(vx.x, vy.y); //As we want coordinate from fourierX and y from fourierY.
    path.push(v);
    pFIVE.line(vx.x, vx.y, v.x, v.y); //Draw the x and y of drawing.
    pFIVE.line(vy.x, vy.y, v.x, v.y);
    pFIVE.beginShape();
    pFIVE.noFill();

    //Draw all previouse points of drawing for every frame of animation.
    for (let i = 0; i < path.length; i++) {
      pFIVE.vertex(path[i].x, path[i].y);
    }
    pFIVE.endShape();

    const dt = pFIVE.TWO_PI / fourierY.length; //Amount of time I move each frame of animatoon.
    //Should be 2pi a full cycle per frame / the number of fourier coefficents.
    time += dt;

    //This resets drawing when we complete it.
    if (time > pFIVE.TWO_PI * 2) {
      time = 0;
      path = [];
    }
  };
};
