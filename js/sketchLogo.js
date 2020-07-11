import { dft, realFFT } from "./fourier.js";
import { logoDrawing } from "./codingtrain.js";
import { epiCycles } from "./epicycles.js";

export let logoSketch = function (p5) {
  var x = [];
  let y = [];
  let fourierX = [];
  let fourierY = [];
  let time = 0;
  let path = [];

  p5.setup = function () {
    p5.createCanvas(window.innerWidth, window.innerHeight);
    const skip = 12; //As we have too many values can skip some points.
    //Push path into x and y arrays.
    for (let i = 0; i < logoDrawing.length; i += skip) {
      x.push(logoDrawing[i].x);
      y.push(logoDrawing[i].y);
    }
    //Get foureir transfrom.
    let sclae = 1;
    fourierX = dft(p5, x, scale);
    fourierY = dft(p5, y, scale.);

    //The cycles are being drawn in order of frequency. e.g. C0, C1, ... Where C1 has a frequency. Recall frequency is k and we are calulating Ck.
    //Instead it would be better of teh poinst are sorted by magitued
    //(a, b) any 2 arbitrary elments.
    //POsitive value put one in fornt of other and negative.
    fourierX.sort((a, b) => b.amp - a.amp);
    fourierY.sort((a, b) => b.amp - a.amp);
  };

  //Draws pictuer.
  p5.draw = function () {
    p5.background(47, 72, 88);
    //47, 72, 88
    //48, 76, 137

    //Create the 2 epicycle generaters.
    let vx = epiCycles(p5, time, p5.width / 2 + 100, 100, 0, fourierX); //Vector x
    let vy = epiCycles(
      p5,
      time,
      200,
      p5.height / 2 + 100,
      p5.HALF_PI,
      fourierY
    ); //Vector y.
    let v = p5.createVector(vx.x, vy.y); //As we wnat c coordinate from fourierX and y from fourierY.
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
