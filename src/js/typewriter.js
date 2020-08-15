/** @credit https://css-tricks.com/snippets/css/typewriter-effect/ */
export function typewriter() {
  sContents = " ";
  iRow = Math.max(0, iIndex - iScrollAt);
  const destination = document.getElementById("typedtext");

  while (iRow < iIndex) {
    sContents += aText[iRow++] + "<br />";
  }
  destination.innerHTML = sContents + aText[iIndex].substring(0, iTextPos) + "";
  if (iTextPos++ == iArrLength) {
    iTextPos = 0;
    iIndex++;
    if (iIndex != aText.length) {
      iArrLength = aText[iIndex].length;
      setTimeout(typewriter, 500);
    }
  } else {
    setTimeout(typewriter, iSpeed);
  }
}

// set up text to print, each item in array is new line
const aText = new Array("myFourierEpicycles", "By Tony Rosler.");
const iSpeed = 120; // time delay of print out
let iIndex = 0; // start printing array at this posision
let iArrLength = aText[0].length; // the length of the text array
const iScrollAt = 2; // start scrolling up at this many lines

let iTextPos = 0; // initialise text position
let sContents = ""; // initialise contents variable
let iRow; // initialise current row
