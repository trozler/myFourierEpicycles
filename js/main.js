import { userSketch } from "./sketchUser.js";
import { logoSketch } from "./sketchLogo.js";
import { fft } from "./fourier.js";

//let logoP5 = new p5(logoSketch, "c1");
//let userP5 = new p5(userSketch, "c2");

let points = [1, 0, 1, 0];
let result = fft(points);
