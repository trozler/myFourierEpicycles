export function epiCycles(p5, time, runningX, runningY, rotation, fourier) {
  for (let i = 0; i < fourier.length; i++) {
    //Retrieve fourier constant.
    let prevx = runningX;
    let prevy = runningY;
    let freq = fourier[i].freq;
    let radius = fourier[i].amp;
    let phase = fourier[i].phase;
    runningX += radius * p5.cos(freq * time + phase + rotation);
    runningY += radius * p5.sin(freq * time + phase + rotation);

    p5.stroke(255, 100);
    p5.noFill();
    p5.ellipse(prevx, prevy, radius * 2);
    p5.stroke(255);
    p5.line(prevx, prevy, runningX, runningY);
  }
  return p5.createVector(runningX, runningY); //Returns the last x, y which is f(x) and f(y) of transform used to draw.
}
