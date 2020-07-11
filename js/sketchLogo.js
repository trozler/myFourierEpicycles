import { complexfft } from "./fourier.js";
import { logoDrawing } from "./codingtrain.js";
import { epiCycles } from "./epicycles.js";

export let logoSketch = function (p5) {
  var x = [];
  let fourierCoef = [];
  let time = 0;
  let path = [];

  p5.setup = function () {
    p5.createCanvas(window.innerWidth, window.innerHeight);
    const skip = 12; //As we have too many values can skip some points.

    //This is where we will create SVG.
    //Push path into x and y arrays.
    for (let i = 0; i < logoDrawing.length; i += skip) {
      x.push(logoDrawing[i].x);
      x.push(logoDrawing[i].y);
    }
    //Get foureir transfrom.
    fourierCoef = complexfft(x);

    //The cycles are being drawn in order of frequency. e.g. C0, C1, ... Where C1 has a frequency. Recall frequency is k and we are calulating Ck.
    //Instead it would be better of the points are sorted by magitued
    //(a, b) any 2 arbitrary elments.
    //Positive value put one in fornt of other and negative.
    fourierCoef.sort((a, b) => b.amp - a.amp);
  };

  //Draws pictuer.
  p5.draw = function () {
    p5.background(47, 72, 88);
    //47, 72, 88
    //48, 76, 137
    let v = epiCycles(p5, time, p5.width / 2, p5.height / 2, 0, fourierCoef);

    path.push(v);
    p5.beginShape();
    p5.noFill();
    //Draw all previouse points of drawing for every frame of animation.
    for (let i = 0; i < path.length; i++) {
      p5.vertex(path[i].x, path[i].y);
    }
    p5.endShape();

    const dt = p5.TWO_PI / fourierCoef.length; //Amount of time I move each frame of animatoon.
    //Should be 2pi a full cycle per frame / the number of fourier coefficents.
    time += dt;

    //This resets drawing when we complete it.
    if (time > p5.TWO_PI * 2) {
      time = 0;
      path = [];
    }
  };
};
