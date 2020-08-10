import { imageHandler } from "./baseEpi.js";
import { mainPathFinder } from "./mainSketcher.js";
import * as Dropzone from "dropzone/dist/min/dropzone.min.js";

//Styling
// import "../css/style.css"; //Include as want to minify.
// import "../css/dropzone.css"; //Doesnt work some reason, maybe as already minified?

//Images
import Deer from "../images/Deer.svg";
import Dog from "../images/Dog.svg";
import Epl from "../images/epl-icon.svg";
import Tux from "../images/tux.svg";

//Add event listener for each image.
const imageNames = { deer: Deer, epl: Epl, tux: Tux, dog: Dog };

for (const n in imageNames) {
  document.getElementById(n).src = imageNames[n];

  document.getElementById(n).addEventListener("click", (e) => {
    e.preventDefault();
    if (document.getElementById("baseCanvas") !== null) {
      removeCanvas("baseCanvas");
    }
    imageHandler(n);
  });
}

window.addEventListener("load", () => imageHandler("deer"), { once: true });

function removeCanvas(id) {
  let el = document.getElementById(id);
  el.parentNode.removeChild(el);
}

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
        function (e) {
          if (file.type !== "image/svg+xml") {
            // convert uploaded image file to base64 string
            preview.title = file.name;
            //set source to image.
            preview.src = reader.result;
            //Finally make call to main flow depending on image uploaded.
            mainPathFinder(preview, false);
          } else {
            var svgData = e.target.result;
            svgData = svgData.slice(svgData.indexOf("<svg"));
            var parser = new DOMParser();
            var doc = parser.parseFromString(svgData, "image/svg+xml");
            var pathTags = doc.getElementsByTagName("path");
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
