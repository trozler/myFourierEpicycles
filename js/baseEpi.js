import { epiCycles } from "./epicycles.js";
import { reindeerX, reindeerY } from "./testpaths/reindeer.js";

let logoSketch = function (p5) {
  let fourierX = reindeerX;
  let fourierY = reindeerY;
  let time = 0;
  let path = [];
  p5.setup = function () {
    let cnv = p5.createCanvas(700, 600);
    cnv.parent("startup");
    p5.frameRate(25);
  };

  //Draws pictuer.
  p5.draw = function () {
    p5.background(255, 255, 255);

    //Create the 2 epicycle generaters.
    let vx = epiCycles(p5, time, 300, 450, 0, fourierX, false); //Vector x
    let vy = epiCycles(p5, time, 500, 200, p5.HALF_PI, fourierY, false); //Vector y.
    let v = p5.createVector(vx.x, vy.y); //As we want coordinate from fourierX and y from fourierY.
    path.push(v);
    p5.line(vx.x, vx.y, v.x, v.y); //Draw the x and y of drawing.
    p5.line(vy.x, vy.y, v.x, v.y);
    p5.beginShape();
    p5.noFill();

    //Draw all previouse points of drawing for every frame of animation.
    for (let i = 0; i < path.length; i++) {
      p5.vertex(path[i].x, path[i].y);
    }
    p5.endShape();

    const dt = p5.TWO_PI / fourierY.length; //Amount of time I move each frame of animatoon.
    //Should be 2pi a full cycle per frame / the number of fourier coefficents.
    time += dt;

    //This resets drawing when we complete it.
    if (time > p5.TWO_PI * 2) {
      time = 0;
      path = [];
    }
  };
};

let logoP5 = new p5(logoSketch, "c1");
