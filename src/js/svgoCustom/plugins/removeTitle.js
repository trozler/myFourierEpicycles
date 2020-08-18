

export var type = "perItem";

export var active = true;

export var description = "removes <title>";

/**
 * Remove <title>.
 *
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Igor Kalashnikov
 */
export var fn = function (item) {
  return !item.isElem("title");
};
