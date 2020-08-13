import SVGO from "svgo";

const svgo = new SVGO();

// export async function optimiseSvg(svgstr) {
//   let val;
//   try {
//     val = await svgo.optimize(svgstr);
//     val = val.data;
//   } catch (err) {
//     console.log(err);
//     val = null;
//   }
//   return val;
// }

export function optimiseSvg(svgstr) {
  return svgo
    .optimize(svgstr)
    .then((val) => val.data)
    .catch((err) => {
      consol.log(err);
      return null;
    });
}

export function removeCanvas(id) {
  let el = document.getElementById(id);
  el.parentNode.removeChild(el);
}

export function addScrollEvenListener(EL) {
  //Add event listener to log canvas, only animate when in viewbox.
  window.addEventListener("scroll", () => {
    //Everytime you scroll set new timeout ID, so dont make costly callback calls.
    if (EL.timeoutID) {
      window.clearTimeout(EL.timeoutID);
    }
    EL.timeoutID = window.setTimeout(function () {
      if (elementInView(EL)) {
        //Should make loop executing, if not already true.
        updateManySketch(true, EL);
      } else {
        //Should stop loop executing if not already the case.
        updateManySketch(false, EL);
      }
    }, 500);
  });
}

function elementInView(EL) {
  const boundingRect = EL.sketchP5.canvas.getBoundingClientRect();
  return (
    boundingRect.bottom >= 0 &&
    boundingRect.top <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    boundingRect.right >= 0 &&
    boundingRect.left <=
      (window.innerWidth || document.documentElement.clientWidth)
  );
}

function updateManySketch(inFrame, EL) {
  if (inFrame) {
    //Want to make canvas loop, if it isn't doing so already.
    if (!EL.sketchP5.isLooping()) {
      EL.sketchP5.loop();
    }
  } else {
    //Stop the drawing, as not in frame.
    if (EL.sketchP5.isLooping()) {
      EL.sketchP5.noLoop();
    }
  }
}
