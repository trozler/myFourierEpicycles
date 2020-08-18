

export var type = "perItemReverse";

export var active = true;

export var description = "removes empty container elements";

import { elemsGroups } from "./_collections";
var container = elemsGroups.container;

/**
 * Remove empty containers.
 *
 * @see http://www.w3.org/TR/SVG/intro.html#TermContainerElement
 *
 * @example
 * <defs/>
 *
 * @example
 * <g><marker><a/></marker></g>
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
export var fn = function (item) {
  return !(
    item.isElem(container) &&
    !item.isElem("svg") &&
    item.isEmpty() &&
    (!item.isElem("pattern") || !item.hasAttrLocal("href"))
  );
};
