import { imageHandler, BASE } from "./baseEpi.js";
import { mainPathFinder } from "./mainSketcher.js";
import { addScrollEvenListener, optimiseSvg } from "./util.js";

import * as Dropzone from "DropzoneMin/dropzone.min.js";

//Styling
// import "../css/style.css"; //Include as want to minify.
// import "../css/dropzone.css"; //Doesnt work some reason, maybe as already minified?

//Images
import Deer from "../images/Deer.svg";
import Dog from "../images/Dog.svg";
import Tux from "../images/tux.svg";
import Epl from "../images/epl-icon.svg";

const imageNames = { deer: Deer, epl: Epl, tux: Tux, dog: Dog };

for (let n in imageNames) {
  document.getElementById(n).src = imageNames[n]; //Adding source to image, as webpack.

  //Add event listener for click on each image.
  document.getElementById(n).addEventListener("click", (e) => {
    e.preventDefault();
    BASE.removeP5();
    imageHandler(n);
  });
}

//Start with deer being drawn.
window.addEventListener(
  "load",
  (e) => {
    e.preventDefault();
    imageHandler("deer");
  },
  { once: true }
);

//Add event listener to some canvases, only animate when in viewbox.
addScrollEvenListener(BASE);

Dropzone.options.myDropzone = {
  addRemoveLinks: true,
  acceptedFiles: "image/jpeg,image/png,image/svg+xml",
  maxFiles: 1,
  maxThumbnailFilesize: 50,

  init: function () {
    this.on("addedfile", function (file) {
      const preview = new Image();
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        async function (e) {
          if (file.type !== "image/svg+xml") {
            // convert uploaded image file to base64 string
            preview.title = file.name;
            //set source to image.
            preview.src = reader.result;
            //Finally make call to main flow depending on image uploaded.
            mainPathFinder(preview, false);
          } else {
            let svgData = e.target.result;
            const tempRes = optimiseSvg(svgData);
            if (tempRes === null) {
              console.log("Svgo error, returning null");
              svgData = svgData.slice(svgData.indexOf("<svg"));
            } else {
              svgData = tempRes;
            }
            const parser = new DOMParser();
            const doc = parser.parseFromString(svgData, "image/svg+xml");
            const pathTags = doc.getElementsByTagName("path");
            mainPathFinder(pathTags, true);
          }
        },
        false
      );
      if (file) {
        if (file.type !== "image/svg+xml") {
          reader.readAsDataURL(file);
        } else {
          reader.readAsText(file);
        }
      }
    });

    this.on("complete", function (file) {
      this.removeFile(file);
    });
  },
};
