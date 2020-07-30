import { pathfinderImage, pathfinderSVG } from "./findPath.js";
import { dft } from "./fourier.js";
import { epiCycles } from "./epicycles.js";
import { wave_circle_sketch } from "./waveCircle.js";
import { userSketch } from "./userSketch.js";

var n_uploads = 0;
var logoP5;

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
            svgData = svgData.slice(svgData.indexOf("<svg"));
            var parser = new DOMParser();
            var doc = parser.parseFromString(svgData, "image/svg+xml");
            var pathTags = doc.getElementsByTagName("path");
            mainPathFinder(pathTags, true);
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

const factor = 2;

function mainPathFinder(image, svgBool) {
  if (n_uploads > 0) {
    logoP5.remove();
  } else {
    n_uploads++;
    let el = document.getElementById("placeholder");
    el.parentNode.removeChild(el);
  }
  if (svgBool) {
    var arr = pathfinderSVG(image, factor);
    myhandler(arr);
  } else {
    pathfinderImage(image.src, myhandler, factor);
  }
}

function myhandler(arr) {
  let customSketch = function (p5) {
    var x = [];
    let y = [];
    let fourierX = [];
    let fourierY = [];
    let allFourierX = [];
    let allFourierY = [];

    let time = 0;
    let path = [];

    p5.setup = function () {
      let cnv = p5.createCanvas(700, 600);
      cnv.parent("upload-sketch");
      p5.frameRate(25);

      for (let subpath of arr) {
        let pathSketch = subpath;
        const skip = 1;
        //Push path into x and y arrays.
        for (let i = 0; i < pathSketch.length; i += skip) {
          x.push(pathSketch[i].x);
          y.push(pathSketch[i].y);
        }
        //TODO: Add scale for users to dictate how many epicycles.
        const scale = 0.9; //A number in the interval (0, 1].
        const minAmplitude = 0.01;
        const maxAmplitude = 120;

        //TODO: User tinkering,
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

        allFourierX.push(fourierX);
        allFourierY.push(fourierY);
      }
    };

    //Draws pictuer.
    p5.draw = function () {
      p5.background(255, 255, 255);

      for (let p = 0; p < allFourierX.length; p++) {
        let vx = epiCycles(p5, time, 300, 450, 0, allFourierX[p], false); //Vector x
        let vy = epiCycles(
          p5,
          time,
          500,
          200,
          p5.HALF_PI,
          allFourierY[p],
          false
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

        const dt = p5.TWO_PI / allFourierY[p].length; //Amount of time I move each frame of animatoon.
        //Should be 2pi a full cycle per frame / the number of fourier coefficents.
        time += dt;

        //This resets drawing when we complete it.
        if (time > p5.TWO_PI * 2) {
          time = 0;
          path = [];
        }
      }
    };
  };

  logoP5 = new p5(customSketch);
}

var userP5 = new p5(userSketch);

var wave_circlep5 = new p5(wave_circle_sketch);
