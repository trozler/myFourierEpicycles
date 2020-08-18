

export var type = "perItem";

export var active = false;

export var description = "removes <style> element (disabled by default)";

/**
 * Remove <style>.
 *
 * http://www.w3.org/TR/SVG/styling.html#StyleElement
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Betsy Dupuis
 */
export var fn = function (item) {
  return !item.isElem("style");
};
