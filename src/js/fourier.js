// import FFT from "../node_modules/fft.js/lib/fft.js";

/**
 * @function dft Input array of form [x1, x2, ...], output fourier coeff.
 * @param { Array<Number>} points Array of values of some wave. Must be a power of 2.
 */
export function dft(pFIVE, points) {
  const fourierCoef = [];
  const numPoints = points.length;
  for (let k = 0; k < numPoints; k++) {
    let re = 0;
    let im = 0;
    for (let n = 0; n < numPoints; n++) {
      const phi = (pFIVE.TWO_PI * k * n) / numPoints;
      re += points[n] * pFIVE.cos(phi);
      im -= points[n] * pFIVE.sin(phi);
    }
    re /= numPoints; //This scaling is need for when we represent each point in the sample as sum of fourier constants.
    im /= numPoints;

    let freq = k; //If we do k / numPoints we just scale teh frequency down for all complex numbers.
    let amp = pFIVE.sqrt(re * re + im * im); //Magnitued of a vector.
    let phase = pFIVE.atan2(im, re); //Returns phase.
    fourierCoef[k] = { re, im, freq, amp, phase };
  }
  return fourierCoef;
}

/**
 * @function realFFT Input array of form [x1, x2, ...], output fourier coeff.
 * This is the cooley turkey implmentation.
 * @param { Array<Number>} points Array of values of some wave. Must be a power of 2.
 */
export function realFFT(points) {
  if (points.length == 0) {
    return [];
  }
  let numPoints = points.length;

  //Has to be power of 2.
  let power = 1;
  while (power < numPoints) {
    power *= 2;
  }
  if (!(power === numPoints)) {
    for (let i = 0; i < power - numPoints; i++) {
      points.push(0);
    }
  }

  numPoints = points.length;
  const fft = new FFT(points.length);
  const out = fft.createComplexArray();
  fft.realTransform(out, points);
  fft.completeSpectrum(out);

  const fftData = [];
  // We only have to read the first half of this because of symmetry things.
  //If we want to reduce the clarity i.e. use less fourier coefficents then we reduce numPoints.
  for (let k = 0; k < numPoints; k++) {
    const re = out[2 * k] / numPoints;
    const im = out[2 * k + 1] / numPoints;
    const freq = k;
    const amp = 2 * Math.sqrt(re * re + im * im);
    const phase = Math.atan2(im, re);
    fftData[k] = { re, im, freq, amp, phase };
  }
  return fftData;
}
