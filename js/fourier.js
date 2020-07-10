import FFT from "../node_modules/fft.js/lib/fft.js";

export function dft(points) {
  const fftData = [];
  const N = points.length;
  for (let k = 0; k < N; k++) {
    let re = 0;
    let im = 0;
    for (let n = 0; n < N; n++) {
      const phi = (p5.TWO_PI * k * n) / N;
      re += points[n] * Math.cos(phi);
      im -= points[n] * Math.sin(phi);
    }
    re = re / N; //This scalling is need for when we represent each point in the sample as sum of fourier constants.
    im = im / N;

    let freq = k; //If we do k / N we just scale teh frequency down for all complex numbers.
    let amp = Math.sqrt(re * re + im * im); //Magnitued of a vector.
    let phase = Math.atan2(im, re); //Returns phase.
    fftData[k] = { re, im, freq, amp, phase };
  }
  return fftData;
}

/**
 * @function complexfft Input array of form [x1, y1, x2, y2, ....]. We treat yj as the imaginary component of zj = xj + iyj, for all j. Output complex fourier coeficients.
 * @param { Array<Number>} points Array of values of some wave. Must be a power of 2.
 */

export function complexfft(points) {
  if (points.length == 0) {
    return [];
  }
  const numPoints = points.length / 2;
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

  const fft = new FFT(numPoints);
  const out = fft.createComplexArray();
  fft.transform(out, points);

  // Transform into an API of points I find friendlier.
  const fftData = [];
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

/**
 * Transforms a list of x, y points into input appropriate for a fourier transform.
 * @param { Array<Number>} points  will be an array where each element is an object, storing an x and y tuple. e.g. points[k] = {x:val, y:val}
 * @function resample2dData Outputs array of the from [x1, y1, x2, y2, ...]
 */
export function resample2dData(points) {
  if (points.length == 0) {
    // Can't resample if we don't have ANY points
    return [];
  }
  let newPoints = [];
  for (let i = 0; i < points.length; i++) {
    newPoints.push(points[i].x);
    newPoints.push(points[i].y);
  }
  return newPoints;
}
