

export var type = "perItem";

export var active = false;

export var description = "removes <script> elements (disabled by default)";

/**
 * Remove <script>.
 *
 * https://www.w3.org/TR/SVG/script.html
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Patrick Klingemann
 */
export var fn = function (item) {
  return !item.isElem("script");
};
