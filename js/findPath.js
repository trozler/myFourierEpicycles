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

      // let canvas = document.getElementById("pointscanvas");
      // let canvasWidth = canvas.width;
      // let canvasHeight = canvas.height;
      // let ctx = canvas.getContext("2d");

      //Find points
      let arr = [];
      for (let j = 0; j < pathTags.length; j++) {
        //Find points
        arr.push([]);
        let path = pathTags[j];
        let pathLength = pathLength;
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
  // var svgstr =
  //   "<svg " +
  //   'width="350px" height="400px"' +
  //   'viewBox="0 0 700 600"' +
  //   'preserveAspectRatio="xMidYMid meet"' +
  //   'version="1.1" xmlns="http://www.w3.org/2000/svg" >';

  // svgstr +=
  //   '<path d="' + pathstring.split('d="')[1].replace("/>", "").replace('"', "");
  // for (let k = 1; k < pathTags.length; k++) {
  //   let pathstring = pathTags[k].outerHTML;
  //   svgstr += pathstring.split('d="')[1].replace("/>", "").replace('"', "");
  // }
  // svgstr += '"' + " stroke='rgb(0,0,0)' fill='transparent' />";
  // svgstr += "</svg>";

  // svgstr = svgstr.slice(svgstr.indexOf("<svg"));
  // let container = document.getElementById("svgholder");
  // container.innerHTML = svgstr;
  // let pathstring = pathTags[0].outerHTML;

  // let canvas = document.getElementById("pointscanvas");
  // let canvasWidth = canvas.width;
  // let canvasHeight = canvas.height;
  // var ctx = canvas.getContext("2d");

  // let htmlsvg = htmlToElements(svgstr);
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

  //TODO: Change thsi will return array of arrays. As multiple fourier transforms.
  return arr;
}
