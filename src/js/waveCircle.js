export let wave_circle_sketch = function (p5) {
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
