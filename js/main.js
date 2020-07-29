import { pathfinderImage, pathfinderSVG } from "./findPath.js";
import { dft } from "./fourier.js";
import { epiCycles } from "./epicycles.js";

var n_uploads = 0;
var logoP5;
var userP5;

//Upload png here.
Dropzone.options.myDropzone = {
  addRemoveLinks: true,
  acceptedFiles: "image/jpeg,image/png,image/gif,image/svg+xml",
  maxFiles: 1,
  maxThumbnailFilesize: 50,

  init: function () {
    this.on("addedfile", function (file) {
      // console.log(file);
      //const preview = document.getElementById("temp1");
      const preview = new Image();
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        function (e) {
          if (file.type !== "image/svg+xml") {
            // convert uploaded image file to base64 string
            preview.title = file.name;
            //set source to image.
            preview.src = reader.result;
            //Finally make call to main flow depending on image uploaded.
            mainPathFinder(preview, false);
          } else {
            var svgData = e.target.result;
            var parser = new DOMParser();
            var doc = parser.parseFromString(svgData, "image/svg+xml");
            // var pathTags = doc.getElementsByTagName("path");
            mainPathFinder(svgData, true);
          }
        },
        false
      );
      if (file) {
        if (file.type !== "image/svg+xml") {
          reader.readAsDataURL(file);
        } else {
          reader.readAsText(file);
        }
      }
    });

    this.on("complete", function (file) {
      this.removeFile(file);
    });
  },
};

const n_points = 1000;

function mainPathFinder(image, svgBool) {
  if (n_uploads > 0) {
    logoP5.remove();
  } else {
    n_uploads++;
    let el = document.getElementById("placeholder");
    el.parentNode.removeChild(el);
  }
  if (svgBool) {
    var arr = pathfinderSVG(image, n_points);
    myhandler(arr);
  } else {
    pathfinderImage(image.src, myhandler, n_points);
  }
}

function myhandler(arr) {
  let logoSketch = function (p5) {
    var x = [];
    let y = [];
    let fourierX = [];
    let fourierY = [];
    let time = 0;
    let path = [];

    var pathSketch = arr;

    p5.setup = function () {
      let cnv = p5.createCanvas(700, 600);
      cnv.parent("upload-sketch");
      p5.frameRate(25);

      const skip = 2; //As we have too many values can skip some points.
      //Push path into x and y arrays.
      for (let i = 0; i < pathSketch.length; i += skip) {
        x.push(pathSketch[i].x);
        y.push(pathSketch[i].y);
      }
      //TODO: Add scale for users to dictate how many epicycles.
      const scale = 0.9; //A number in the interval (0, 1].
      const minAmplitude = 0.01;
      const maxAmplitude = 120;

      //TODO: USer tinkering,
      //If circles touch outside area don't include. Use size of window.

      fourierX = dft(p5, x).filter(
        (f) => f.amp > minAmplitude && f.amp < maxAmplitude
      );
      fourierY = dft(p5, y).filter(
        (f) => f.amp > minAmplitude && f.amp < maxAmplitude
      );

      //The cycles are being drawn in order of frequency. e.g. C0, C1, ... Where C1 has a frequency. Recall frequency is k and we are calulating Ck.

      fourierX = fourierX.slice(0, Math.floor(scale * fourierX.length));
      fourierY = fourierY.slice(0, Math.floor(scale * fourierY.length));

      fourierX.sort((a, b) => b.amp - a.amp);
      fourierY.sort((a, b) => b.amp - a.amp);
    };

    //Draws pictuer.
    p5.draw = function () {
      p5.background(255, 255, 255);

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

  logoP5 = new p5(logoSketch);
}

let userSketch = function (p5) {
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

  p5.mouseDown = function () {
    state = USER; //Click mouse state user.
    drawing = [];
    x = [];
    y = [];
    time = 0;
    path = [];
  };

  p5.mouseUp = function () {
    state = FOURIER; //release mouse state fourier.
    const skip = 1; //Skip every other point.
    for (let i = 0; i < drawing.length; i += skip) {
      x.push(drawing[i].x);
      y.push(drawing[i].y);
    }
    //TODO: Add scale for users to dictate how many epicycles.
    const scale = 1; //A number in the interval (0, 1].
    const minAmplitude = 0.01;
    const maxAmplitude = 120;

    //TODO: USer tinkering,
    //If circles touch outside area don't include. Use size of window.

    fourierX = dft(p5, x).filter(
      (f) => f.amp > minAmplitude && f.amp < maxAmplitude
    );
    fourierY = dft(p5, y).filter(
      (f) => f.amp > minAmplitude && f.amp < maxAmplitude
    );

    fourierX = fourierX.slice(0, Math.floor(scale * fourierX.length));
    fourierY = fourierY.slice(0, Math.floor(scale * fourierY.length));

    fourierX.sort((a, b) => b.amp - a.amp);
    fourierY.sort((a, b) => b.amp - a.amp);
  };

  p5.setup = function () {
    let cnv = p5.createCanvas(700, 600);
    cnv.parent("draw-yourself");
    p5.frameRate(25);
    cnv.mousePressed(p5.mouseDown);
    cnv.mouseReleased(p5.mouseUp);
  };

  p5.draw = function () {
    p5.background(47, 72, 88);

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
        p5.vertex(p.x + p5.width / 2, p.y + p5.height / 2);
      }
      p5.endShape();
    } else if (state == FOURIER) {
      let vx = epiCycles(p5, time, p5.width / 2, 100, 0, fourierX, true);
      let vy = epiCycles(
        p5,
        time,
        100,
        p5.height / 2,
        p5.HALF_PI,
        fourierY,
        true
      );
      let v = p5.createVector(vx.x, vy.y);
      path.push(v);
      p5.line(vx.x, vx.y, v.x, v.y);
      p5.line(vy.x, vy.y, v.x, v.y);

      p5.beginShape();
      p5.noFill();
      for (let i = 0; i < path.length; i++) {
        p5.vertex(path[i].x, path[i].y);
      }
      p5.endShape();

      const dt = p5.TWO_PI / fourierY.length;
      time += dt;

      if (time > p5.TWO_PI) {
        time = 0;
        path = [];
      }
    }
  };
};

userP5 = new p5(userSketch);

let wave_circle_sketch = function (p5) {
  var speed = 0;
  var strum = 1;
  var centerX = 450;
  var centerY = 215;

  p5.setup = function () {
    let cnv = p5.createCanvas(600, 400);
    cnv.parent("wave-circle-bridge");
    p5.frameRate(46);
  };

  p5.draw = function () {
    p5.background(250);

    // sketchCircle();
    // sin(frequency) * amplitude + center.
    let y_revolve = p5.sin(p5.frameCount / 50) * 58 + centerY;
    let x_revolve = p5.cos(p5.frameCount / 50) * 58 + centerX;

    p5.beginShape(p5.POINTS);
    p5.strokeWeight(10);
    p5.stroke("#ef798a");
    p5.noFill();
    p5.vertex(x_revolve, y_revolve);
    p5.endShape();

    //Draw circle
    p5.strokeWeight(1);
    p5.stroke(47, 72, 88);
    p5.ellipse(centerX, centerY, 115);
    p5.line(centerX, centerY, x_revolve, y_revolve);

    // sketchWave();
    p5.stroke(47, 72, 88);
    p5.noFill();
    p5.beginShape();

    //vertex(0, height);
    //x < 250 means we stop rendering wave at 250 pixels.
    //So for every pixel up to this point we find the corresponding point.
    for (let x = 0; x < 250; x++) {
      let freq = speed + x * 0.05;
      //Map -1 and 1 amplitudes to amplitudes in range 150px and 280px.
      let y = p5.map(p5.sin(freq), -strum, strum, 150, 280);
      p5.vertex(x, y);
    }
    //Gives us line to circle.
    p5.vertex(x_revolve, y_revolve);
    p5.endShape();
    speed += 0.02;
  };
};

let wave_circlep5 = new p5(wave_circle_sketch);
