import { dft, realFFT } from "./fourier.js";

import { epiCycles } from "./epicycles.js";
import { points } from "./main.js ";

export let logoSketch = function (p5) {
  var x = [];
  let y = [];
  let fourierX = [];
  let fourierY = [];
  let time = 0;
  let path = [];

  var pathSketch = points;

  p5.setup = function () {
    p5.createCanvas(window.innerWidth, window.innerHeight);
    const skip = 12; //As we have too many values can skip some points.
    //Push path into x and y arrays.
    for (let i = 0; i < pathSketch.length; i += skip) {
      x.push(pathSketch[i].x);
      y.push(pathSketch[i].y);
    }
    //TODO: Add scale for users to dictate how many epicycles.
    const scale = 1; //A number in the interval (0, 1].
    const minAmplitude = 0.01;

    fourierX = realFFT(x).filter((f) => f.amp > minAmplitude);
    fourierY = realFFT(y).filter((f) => f.amp > minAmplitude);

    //The cycles are being drawn in order of frequency. e.g. C0, C1, ... Where C1 has a frequency. Recall frequency is k and we are calulating Ck.

    fourierX = fourierX.slice(0, Math.floor(scale * fourierX.length));
    fourierY = fourierY.slice(0, Math.floor(scale * fourierY.length));

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
