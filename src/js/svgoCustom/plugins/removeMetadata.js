
export var type = "perItem";

export var active = true;

export var description = "removes <metadata>";

/**
 * Remove <metadata>.
 *
 * http://www.w3.org/TR/SVG/metadata.html
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
export var fn = function (item) {
  return !item.isElem("metadata");
};
