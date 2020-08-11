import { epiCycles } from "./epicycles.js";
import { reindeerX, reindeerY } from "./computedPaths/fourier/reindeer.js";
import { dogX, dogY } from "./computedPaths/fourier/dog.js";
import { eplX, eplY } from "./computedPaths/fourier/epl.js";
import { tuxX, tuxY } from "./computedPaths/fourier/tux.js";
import pFiveSketch from "./pFiveSketch.js";

import * as p5 from "p5";

export const BASE = new pFiveSketch();

export function imageHandler(name) {
  let baseSketch = function (pFIVE) {
    let fourierX;
    let fourierY;

    switch (name) {
      case "deer":
        fourierX = reindeerX;
        fourierY = reindeerY;
        break;

      case "epl":
        fourierX = eplX;
        fourierY = eplY;
        break;

      case "dog":
        fourierX = dogX;
        fourierY = dogY;
        break;

      case "tux":
        fourierX = tuxX;
        fourierY = tuxY;
        break;

      default:
        throw new Error("Error, no match found for the base image selected.");
    }
    let time = 0;
    let path = [];
    pFIVE.setup = function () {
      let cnv = pFIVE.createCanvas(700, 600);
      cnv.parent("startup");
      cnv.id("baseCanvas");
      pFIVE.frameRate(20);
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
  BASE.sketchP5 = new p5(baseSketch);
}
