export let wave_circle_sketch = function (pFIVE) {
  var speed = 0;
  var strum = 1;
  var centerX = 450;
  var centerY = 215;

  pFIVE.setup = function () {
    let cnv = pFIVE.createCanvas(600, 400);
    cnv.parent("wave-circle-bridge");
    pFIVE.frameRate(46);
  };

  pFIVE.draw = function () {
    pFIVE.background(250);

    // sketchCircle();
    // sin(frequency) * amplitude + center.
    let y_revolve = pFIVE.sin(pFIVE.frameCount / 50) * 58 + centerY;
    let x_revolve = pFIVE.cos(pFIVE.frameCount / 50) * 58 + centerX;

    pFIVE.beginShape(pFIVE.POINTS);
    pFIVE.strokeWeight(10);
    pFIVE.stroke("#ef798a");
    pFIVE.noFill();
    pFIVE.vertex(x_revolve, y_revolve);
    pFIVE.endShape();

    //Draw circle
    pFIVE.strokeWeight(1);
    pFIVE.stroke(47, 72, 88);
    pFIVE.ellipse(centerX, centerY, 115);
    pFIVE.line(centerX, centerY, x_revolve, y_revolve);

    // sketchWave();
    pFIVE.stroke(47, 72, 88);
    pFIVE.noFill();
    pFIVE.beginShape();

    //vertex(0, height);
    //x < 250 means we stop rendering wave at 250 pixels.
    //So for every pixel up to this point we find the corresponding point.
    for (let x = 0; x < 250; x++) {
      let freq = speed + x * 0.05;
      //Map -1 and 1 amplitudes to amplitudes in range 150px and 280px.
      let y = pFIVE.map(pFIVE.sin(freq), -strum, strum, 150, 280);
      pFIVE.vertex(x, y);
    }
    //Gives us line to circle.
    pFIVE.vertex(x_revolve, y_revolve);
    pFIVE.endShape();
    speed += 0.02;
  };
};
