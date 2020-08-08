export function epiCycles(
  pFIVE,
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
    runningX += radius * Math.cos(freq * time + phase + rotation);
    runningY += radius * Math.sin(freq * time + phase + rotation);

    pFIVE.stroke(color);
    pFIVE.noFill();
    pFIVE.ellipse(prevx, prevy, radius * 2);
    pFIVE.stroke(color);
    pFIVE.line(prevx, prevy, runningX, runningY);
  }
  return pFIVE.createVector(runningX, runningY); //Returns the total of the sum. i.e. The coordinate to draw.
}
