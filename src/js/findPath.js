import { ImageTracer } from "./imagetracer_v1.2.6.js";

/**
 * @param {String} imageurl. Image can be .png, .jpeg
 * @param {boolean} draw. True if you want the points dsiplayed.
 * @param {Number} n_points.
 * @return {Array<SVGPointList>} Points array, where arr[k].x and arr[k].y access the x and y coordinates of the kth sampled point.
 */
export function pathfinderImage(imageurl, cback, factor) {
  // This will load an image, trace it when loaded, and execute callback on the tracedata
  ImageTracer.imageToTracedata(
    imageurl,
    function (tracedata) {
      /**@returns svg string*/
      let svgstr = ImageTracer.getsvgstring(tracedata, "grayscale");
      var parser = new DOMParser();
      var doc = parser.parseFromString(svgstr, "image/svg+xml");
      var pathTags = doc.getElementsByTagName("path");

      //Find points
      let arr = [];
      for (let j = 0; j < pathTags.length; j++) {
        //Find points
        arr.push([]);
        let path = pathTags[j];
        let pathLength = path.getTotalLength();
        let n_points = Math.floor(pathLength / factor);

        for (let i = 0; i < n_points; i++) {
          let point = path.getPointAtLength((i / n_points) * pathLength);
          arr[j].push(point);

          // ctx.fillRect(point.x, point.y, 2, 2);
        }
      }
      //console.log(arr);
      cback(arr);
    },
    "grayscale"
  );
}

/**
 * @param {String} pathTags. An HTMLCollection of path elements.
 * @return {Array<SVGPointList>}.
 */
export function pathfinderSVG(pathTags, factor) {

  let arr = [];
  for (let j = 0; j < pathTags.length; j++) {
    //Find points
    arr.push([]);
    let path = pathTags[j];
    let pathLength = path.getTotalLength();
    let n_points = Math.floor(pathLength / factor);

    for (let i = 0; i < n_points; i++) {
      let point = path.getPointAtLength((i / n_points) * pathLength);
      arr[j].push(point);
    }
  }

  return arr;
}
