import { epiCycles } from "./epicycles.js";
import { dft } from "./fourier.js";
import pFiveSketch from "./pFiveSketch.js";
import { pathfinderSVG } from "./findPath.js";
import { cacheHasItem, writeToStorage } from "./util.js";
import * as p5 from "p5";

export const BASE = new pFiveSketch();
const parser = new DOMParser();

export function imageHandler(name, svgData) {
  //get path tags of svg string.
  const doc = parser.parseFromString(svgData, "image/svg+xml");
  const pathTags = doc.getElementsByTagName("path");

  let baseSketch = function (pFIVE) {
    var imFactor = 1;
    var scale, minAmplitude, maxAmplitude;

    switch (name) {
      case "deer":
        imFactor = 4;
        //TODO: Add scale for users to dictate how many epicycles.
        scale = 0.9; //A number in the interval (0, 1].
        minAmplitude = 0.01;
        maxAmplitude = 120;
        break;

      case "epl":
      case "tux":
      case "dragon":
        imFactor = 3;
        //TODO: Add scale for users to dictate how many epicycles.
        scale = 0.9; //A number in the interval (0, 1].
        minAmplitude = 0.01;
        maxAmplitude = 120;
        break;

      default:
        throw new Error("Error, no match found for the base image selected.");
    }

    let pathSketch = pathfinderSVG(pathTags, imFactor)[0];
    let time = 0;
    let path = [];
    var x = [];
    let y = [];
    let fourierX = [];
    let fourierY = [];

    pFIVE.setup = function () {
      let cnv = pFIVE.createCanvas(700, 600);
      cnv.parent("startup");
      cnv.id("baseCanvas");
      pFIVE.frameRate(20);

      const skip = 2; //As we have too many values can skip some points.
      //Push path into x and y arrays.
      for (let i = 0; i < pathSketch.length; i += skip) {
        x.push(pathSketch[i].x);
        y.push(pathSketch[i].y);
      }

      fourierX = dft(pFIVE, x).filter((f) => f.amp > minAmplitude && f.amp < maxAmplitude);
      fourierY = dft(pFIVE, y).filter((f) => f.amp > minAmplitude && f.amp < maxAmplitude);

      //The cycles are being drawn in order of frequency. e.g. C0, C1, ... Where C1 has a frequency. Recall frequency is k and we are calulating Ck.

      fourierX = fourierX.slice(0, Math.floor(scale * fourierX.length));
      fourierY = fourierY.slice(0, Math.floor(scale * fourierY.length));

      fourierX.sort((a, b) => b.amp - a.amp);
      fourierY.sort((a, b) => b.amp - a.amp);

      //Write entry to cache.
      if (cacheHasItem) {
        writeToStorage(name, fourierX, fourierY);
      } else {
        throw new Error("Error, trying to wrote to cache in basHandler.js, but entry already exists.");
      }
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
