/** This class keeps track of all refrences of a p5 sketch.
 * @class
 * @field timeoutID, current timeoutID corresponding to event listener.
 * @field sketchP5, p5 object.
 */
export default class pFiveSketch {
  constructor(timeoutID, sketchP5) {
    this.timeoutID = timeoutID;
    this.sketchP5 = sketchP5;
  }

  removeP5() {
    this.sketchP5.remove();
  }
}
