import { dft } from "./fourier.js";
import { epiCycles } from "./epicycles.js";

export let userSketch = function (pFIVE) {
  const USER = 0;
  const FOURIER = 1;
  //2 states eitehr we are taking user input or we completing a fourier transform.

  let x = [];
  let y = [];
  let fourierX = [];
  let fourierY = [];
  let time = 0;
  let path = [];
  let drawing = [];
  let state = -1; //To begin width state is negative one i.e. not in user or fft.

  pFIVE.mouseDown = function () {
    state = USER; //Click mouse state user.
    drawing = [];
    x = [];
    y = [];
    time = 0;
    path = [];
  };

  pFIVE.mouseUp = function () {
    state = FOURIER; //release mouse state fourier.
    const skip = 1;
    for (let i = 0; i < drawing.length; i += skip) {
      x.push(drawing[i].x);
      y.push(drawing[i].y);
    }
    //TODO: Add scale for users to dictate how many epicycles.
    const scale = 1; //A number in the interval (0, 1].
    const minAmplitude = 0.01;
    const maxAmplitude = 120;

    fourierX = dft(pFIVE, x).filter(
      (f) => f.amp > minAmplitude && f.amp < maxAmplitude
    );
    fourierY = dft(pFIVE, y).filter(
      (f) => f.amp > minAmplitude && f.amp < maxAmplitude
    );

    fourierX = fourierX.slice(0, Math.floor(scale * fourierX.length));
    fourierY = fourierY.slice(0, Math.floor(scale * fourierY.length));

    fourierX.sort((a, b) => b.amp - a.amp);
    fourierY.sort((a, b) => b.amp - a.amp);
  };

  pFIVE.setup = function () {
    let cnv = pFIVE.createCanvas(700, 600);
    cnv.parent("draw-yourself");
    pFIVE.frameRate(35);
    cnv.mousePressed(pFIVE.mouseDown);
    cnv.mouseReleased(pFIVE.mouseUp);
  };

  pFIVE.draw = function () {
    pFIVE.background(47, 72, 88);

    if (state == USER) {
      //If drawing need to record the points relative to window. i.e. center.
      let point = pFIVE.createVector(
        pFIVE.mouseX - pFIVE.width / 2,
        pFIVE.mouseY - pFIVE.height / 2
      );
      drawing.push(point); //Push point to drawing.
      pFIVE.stroke(255);
      pFIVE.noFill();
      pFIVE.beginShape(); //Render what the user is drawing.
      for (let p of drawing) {
        pFIVE.vertex(p.x + pFIVE.width / 2, p.y + pFIVE.height / 2);
      }
      pFIVE.endShape();
    } else if (state == FOURIER) {
      let vx = epiCycles(pFIVE, time, pFIVE.width / 2, 100, 0, fourierX, true);
      let vy = epiCycles(
        pFIVE,
        time,
        100,
        pFIVE.height / 2,
        pFIVE.HALF_PI,
        fourierY,
        true
      );
      let v = pFIVE.createVector(vx.x, vy.y);
      path.push(v);
      pFIVE.line(vx.x, vx.y, v.x, v.y);
      pFIVE.line(vy.x, vy.y, v.x, v.y);

      pFIVE.beginShape();
      pFIVE.noFill();
      for (let i = 0; i < path.length; i++) {
        pFIVE.vertex(path[i].x, path[i].y);
      }
      pFIVE.endShape();

      const dt = pFIVE.TWO_PI / fourierY.length;
      time += dt;

      if (time > pFIVE.TWO_PI) {
        time = 0;
        path = [];
      }
    }
  };
};
