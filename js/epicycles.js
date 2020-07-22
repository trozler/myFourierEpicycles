export function epiCycles(
  p5,
  time,
  runningX,
  runningY,
  rotation,
  fourier,
  flag
) {
  let color = "#2f4858";
  if (flag) {
    color = "#ffffff";
  }
  for (let i = 0; i < fourier.length; i++) {
    //Retrieve fourier constant.
    let prevx = runningX;
    let prevy = runningY;
    let freq = fourier[i].freq;
    let radius = fourier[i].amp;
    let phase = fourier[i].phase;
    runningX += radius * p5.cos(freq * time + phase + rotation);
    runningY += radius * p5.sin(freq * time + phase + rotation);

    p5.stroke(color);
    p5.noFill();
    p5.ellipse(prevx, prevy, radius * 2);
    p5.stroke(color);
    p5.line(prevx, prevy, runningX, runningY);
  }
  return p5.createVector(runningX, runningY); //Returns the total of the sum. i.e. The coordinate to draw.
}
