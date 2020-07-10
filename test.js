import FFT from "fft.js";

let points = [1, 0, 1, 0];
let fcoeffs = fft(points);

function fft(points) {
  const N = points.length;
  const fftData = [];

  //Has to be power of 2.
  let power = 1;
  while (power < points.length) {
    power *= 2;
  }
  if (!(power === points.length)) {
    for (let i = 0; i <= power - points.length; i++) {
      points.push(0);
    }
  }
  const fft = new FFT(power);
  const formatedPoints = fft.createComplexArray();
  fft.toComplexArray(points, formatedPoints);

  const out = fft.createComplexArray();
  fft.transform(out, formatedPoints);

  // We only have to read the first half of this because of symmetry things.
  for (let k = 0; k < N / 2; k++) {
    const re = out[2 * k] / N;
    const im = out[2 * k + 1] / N;
    const freq = k;
    const amp = 2 * Math.sqrt(re * re + im * im);
    const phase = Math.atan2(im, re);
    fftData[k] = { re, im, freq, amp, phase };
  }
  return fftData;
}
