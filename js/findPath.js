/**
 * @param {String} HTML representing any number of sibling elements
 * @return {NodeList}
 */
function htmlToElements(html) {
  let template = document.createElement("template");
  template.innerHTML = html;
  return template.content.childNodes[0].firstChild;
}

/**
 * @param {String} image. Image can be .png, .jpeg
 * @return {Array<Number>}
 */
export function pathfinderImage(imageurl, cback) {
  // This will load an image, trace it when loaded, and execute callback on the tracedata
  ImageTracer.imageToTracedata(
    imageurl,
    function (tracedata) {
      let svgstr = ImageTracer.getsvgstring(tracedata, "grayscale");

      let htmlsvg = htmlToElements(svgstr);

      let canvas = document.getElementById("pointscanvas");
      let canvasWidth = canvas.width;
      let canvasHeight = canvas.height;
      let ctx = canvas.getContext("2d");

      let arr = [];
      let path = htmlsvg;
      for (let i = 0, n_points = 100; i < n_points; i++) {
        let point = path.getPointAtLength(
          (i / n_points) * path.getTotalLength()
        );
        arr.push(point);
        ctx.fillRect(point.x, point.y, 2, 2);
      }
      console.log(arr);
      cback(arr);
    },
    "grayscale"
  );
}

//TODO: No back end needed can just use stream.
/**
 * @param {String} svg.
 * @return {Array<Number>}.
 */
export function pathfinderSVG(image) {
  //Will have to make call to backe end, to use node file system to open and return file.

  let htmlsvg = htmlToElements(svgstr);

  let canvas = document.getElementById("pointscanvas");
  let canvasWidth = canvas.width;
  let canvasHeight = canvas.height;
  let ctx = canvas.getContext("2d");

  let arr = [];
  let path = htmlsvg;
  for (let i = 0, n_points = 1000; i < n_points; i++) {
    let point = path.getPointAtLength((i / n_points) * path.getTotalLength());
    arr.push(point);
    // ctx.fillRect(point.x, point.y, 2, 2);
  }
}
