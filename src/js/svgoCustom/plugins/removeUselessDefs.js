

export var type = "perItem";

export var active = true;

export var description = "removes elements in <defs> without id";

import { elemsGroups } from "./_collections";
var nonRendering = elemsGroups.nonRendering;

/**
 * Removes content of defs and properties that aren't rendered directly without ids.
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Lev Solntsev
 */
export var fn = function (item) {
  if (item.isElem("defs")) {
    if (item.content) {
      item.content = getUsefulItems(item, []);
    }

    if (item.isEmpty()) return false;
  } else if (item.isElem(nonRendering) && !item.hasAttr("id")) {
    return false;
  }
};

function getUsefulItems(item, usefulItems) {
  item.content.forEach(function (child) {
    if (child.hasAttr("id") || child.isElem("style")) {
      usefulItems.push(child);
      child.parentNode = item;
    } else if (!child.isEmpty()) {
      child.content = getUsefulItems(child, usefulItems);
    }
  });

  return usefulItems;
}
