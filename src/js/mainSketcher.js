import { pathfinderImage, pathfinderSVG } from "./findPath.js";
import { dft } from "./fourier.js";
import { epiCycles } from "./epicycles.js";
import { wave_circle_sketch } from "./waveCircle.js";
import { userSketch } from "./userSketch.js";
import { removeCanvas, addScrollEvenListener } from "./util.js";
import pFiveSketch from "./pFiveSketch.js";

import * as p5 from "p5";

const factor = 3;
var n_uploads = 0;

const LOGO = new pFiveSketch();
const WAVE = new pFiveSketch();
const USER = new pFiveSketch();

export function mainPathFinder(image, svgBool) {
  if (n_uploads > 0) {
    LOGO.removeP5();
  } else {
    n_uploads++;
    removeCanvas("placeholder");
  }
  if (svgBool) {
    var arr = pathfinderSVG(image, factor);
    myhandler(arr);
  } else {
    pathfinderImage(image.src, myhandler, factor);
  }
  if (n_uploads === 1) {
    //Just uploaded an image for the first time, add event listener.
    addScrollEvenListener(LOGO);
  }
}

function myhandler(arr) {
  let customSketch = function (pFIVE) {
    var x = [];
    let y = [];
    let fourierX = [];
    let fourierY = [];
    let allFourierX = [];
    let allFourierY = [];

    let time = 0;
    let localTime = 0;
    let currPath = [[]];
    let currSVGPath = 0;

    pFIVE.setup = function () {
      let cnv = pFIVE.createCanvas(700, 600);
      cnv.parent("upload-sketch");
      cnv.id("logoCanvas");
      pFIVE.frameRate(20);

      for (let subpath of arr) {
        const skip = 2;
        for (let i = 0; i < subpath.length; i += skip) {
          x.push(subpath[i].x);
          y.push(subpath[i].y);
        }
        //TODO: Add scale for users to dictate how many epicycles.
        const scale = 0.9; //A number in the interval (0, 1].
        const minAmplitude = 0.01;
        const maxAmplitude = 120;

        fourierX = dft(pFIVE, x).filter(
          (f) => f.amp > minAmplitude && f.amp < maxAmplitude
        );
        fourierY = dft(pFIVE, y).filter(
          (f) => f.amp > minAmplitude && f.amp < maxAmplitude
        );

        //The cycles are being drawn in order of frequency. e.g. C0, C1, ... Where C1 has a frequency. Recall frequency is k and we are calulating Ck.

        fourierX = fourierX.slice(0, Math.floor(scale * fourierX.length));
        fourierY = fourierY.slice(0, Math.floor(scale * fourierY.length));

        fourierX.sort((a, b) => b.amp - a.amp);
        fourierY.sort((a, b) => b.amp - a.amp);

        allFourierX.push(fourierX);
        allFourierY.push(fourierY);

        x.length = 0;
        y.length = 0;
      }
    };
    pFIVE.draw = function () {
      pFIVE.background(255, 255, 255);
      let vx = epiCycles(
        pFIVE,
        localTime,
        250,
        500,
        0,
        allFourierX[currSVGPath],
        false
      );
      let vy = epiCycles(
        pFIVE,
        localTime,
        550,
        200,
        pFIVE.HALF_PI,
        allFourierY[currSVGPath],
        false
      );
      let v = pFIVE.createVector(vx.x, vy.y); //As we want coordinate from fourierX and y from fourierY.
      currPath[currSVGPath].push(v);
      pFIVE.line(vx.x, vx.y, v.x, v.y); //Draw the x coordinates of drawing.
      pFIVE.line(vy.x, vy.y, v.x, v.y); //Draw y coordinates of drawing.

      for (let mod = 0; mod < currPath.length; mod++) {
        //When we redraw points. We need a break when we reach the end of an svg path.
        pFIVE.beginShape();
        pFIVE.noFill();
        //Draw all previouse points of drawing for every frame of animation.
        for (let i = 0; i < currPath[mod].length; i++) {
          pFIVE.vertex(currPath[mod][i].x, currPath[mod][i].y);
        }
        pFIVE.endShape();
      }

      const dt = pFIVE.TWO_PI / allFourierY[currSVGPath].length;
      //Should be 2pi a full cycle per frame / the number of fourier coefficents.
      localTime += dt;

      if (localTime >= pFIVE.TWO_PI) {
        //Finsihed one svg path completly.
        time += pFIVE.TWO_PI;
        localTime = 0;
        currSVGPath++;
        currPath.push([]);

        //After we have drawn all paths and been around once, we reset and draw again.
        if (time >= pFIVE.TWO_PI * allFourierX.length) {
          time = 0;
          currPath.length = 0;
          currPath.push([]);
          currSVGPath = 0;
          localTime = 0;
        }
      }
    };
  };
  LOGO.sketchP5 = new p5(customSketch);
}

USER.sketchP5 = new p5(userSketch);
WAVE.sketchP5 = new p5(wave_circle_sketch);

//Adding scroll event listners.
addScrollEvenListener(WAVE);
addScrollEvenListener(USER);
