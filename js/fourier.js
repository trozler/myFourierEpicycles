export function dft(p5, x) {
  const X = [];
  const N = x.length;
  for (let k = 0; k < N; k++) {
    let re = 0;
    let im = 0;
    for (let n = 0; n < N; n++) {
      const phi = (p5.TWO_PI * k * n) / N;
      re += x[n] * p5.cos(phi);
      im -= x[n] * p5.sin(phi);
    }
    re = re / N; //This scalling is need for when we represent each point in the sample as sum of fourier constants.
    im = im / N;

    let freq = k; //If we do k / N we just scale teh frequency down for all complex numbers.
    let amp = p5.sqrt(re * re + im * im); //Magnitued of a vector.
    let phase = p5.atan2(im, re); //Returns phase.
    X[k] = { re, im, freq, amp, phase };
  }
  return X;
}
