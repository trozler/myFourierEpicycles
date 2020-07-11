import { complexfft } from "./fourier.js";
import { epiCycles } from "./epicycles.js";

export let userSketch = function (p5) {
  const USER = 0;
  const FOURIER = 1;
  //2 states eitehr we are taking user input or we completing a fourier transform.

  let x = [];
  let fourierCoef = [];
  let time = 0;
  let path = [];
  let drawing = [];
  let state = -1; //To begin width state is negative one i.e. not in user or fft.

  p5.mousePressed = function () {
    state = USER; //Click mouse state user.
    drawing = [];
    x = [];
    time = 0;
    path = [];
  };

  p5.mouseReleased = function () {
    state = FOURIER; //release mouse state fourier.
    const skip = 1; //Skip every other point.
    for (let i = 0; i < drawing.length; i += skip) {
      x.push(drawing[i].x);
      x.push(drawing[i].y);
    }
    fourierCoef = complexfft(x);
    fourierCoef.sort((a, b) => b.amp - a.amp);
  };

  p5.setup = function () {
    p5.createCanvas(800, 600);
  };

  p5.draw = function () {
    p5.background(0);

    if (state == USER) {
      //If drawing need to record the points relative to window. i.e. center.
      let point = p5.createVector(
        p5.mouseX - p5.width / 2,
        p5.mouseY - p5.height / 2
      );
      drawing.push(point); //Push point to drawing.
      p5.stroke(255);
      p5.noFill();
      p5.beginShape(); //Render what the user is drawing.
      for (let p of drawing) {
        p5.vertex(p.x + p5.width / 2, p.y + p5.height / 2); //When we draw we want points to be relative to center. Not 0, 0 topleft.
      }
      p5.endShape();
    } else if (state == FOURIER) {
      let v = epiCycles(p5, time, p5.width / 2, p5.height / 2, 0, fourierCoef);
      path.push(v);
      p5.beginShape();
      p5.noFill();
      for (let i = 0; i < path.length; i++) {
        p5.vertex(path[i].x, path[i].y);
      }
      p5.endShape();

      const dt = p5.TWO_PI / fourierCoef.length;
      time += dt;

      if (time > p5.TWO_PI) {
        time = 0;
        path = [];
      }
    }
  };
};
