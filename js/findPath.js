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
 * @param {String} imageurl. Image can be .png, .jpeg
 * @param {boolean} draw. True if you want the points dsiplayed.
 * @param {Number} n_points.
 * @return {Array<SVGPointList>} Points array, where arr[k].x and arr[k].y access the x and y coordinates of the kth sampled point.
 */
export function pathfinderImage(imageurl, cback, n_points) {
  // This will load an image, trace it when loaded, and execute callback on the tracedata
  ImageTracer.imageToTracedata(
    imageurl,
    function (tracedata) {
      let svgstr = ImageTracer.getsvgstring(tracedata, "grayscale");

      let htmlsvg = htmlToElements(svgstr);

      // let canvas = document.getElementById("pointscanvas");
      // let canvasWidth = canvas.width;
      // let canvasHeight = canvas.height;
      // let ctx = canvas.getContext("2d");

      let arr = [];
      let path = htmlsvg;
      for (let i = 0; i < n_points; i++) {
        let point = path.getPointAtLength(
          (i / n_points) * path.getTotalLength()
        );
        arr.push(point);
        // ctx.fillRect(point.x, point.y, 2, 2);
      }
      //console.log(arr);
      cback(arr);
    },
    "grayscale"
  );
}

/**
 * @param {String} image. Is an svg.
 * @param {boolean} draw.
 * @return {Array<SVGPointList>}.
 */
export function pathfinderSVG(svgstr, n_points) {
  // var svgstr =
  //   "<svg " +
  //   'width="350px" height="400px"' +
  //   'viewBox="0 0 700 600"' +
  //   'preserveAspectRatio="xMidYMid meet"' +
  //   'version="1.1" xmlns="http://www.w3.org/2000/svg" >';

  // let pathstring = pathTags[0].outerHTML;

  // svgstr +=
  //   '<path d="' + pathstring.split('d="')[1].replace("/>", "").replace('"', "");
  // for (let k = 1; k < pathTags.length; k++) {
  //   let pathstring = pathTags[k].outerHTML;
  //   svgstr += pathstring.split('d="')[1].replace("/>", "").replace('"', "");
  // }
  // svgstr += '"' + " stroke='rgb(0,0,0)' fill='transparent' />";
  // svgstr += "</svg>";

  svgstr = svgstr.slice(svgstr.indexOf("<svg"));
  let container = document.getElementById("svgholder");
  container.innerHTML = svgstr;

  let canvas = document.getElementById("pointscanvas");
  let canvasWidth = canvas.width;
  let canvasHeight = canvas.height;
  var ctx = canvas.getContext("2d");

  let htmlsvg = htmlToElements(svgstr);

  //Find points
  let arr = [];
  let path = htmlsvg;
  for (let i = 0; i < n_points; i++) {
    let point = path.getPointAtLength((i / n_points) * path.getTotalLength());
    arr.push(point);

    ctx.fillRect(point.x, point.y, 2, 2);
  }

  return arr;
}
