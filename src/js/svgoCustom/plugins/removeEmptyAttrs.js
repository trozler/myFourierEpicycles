

export var type = "perItem";

export var active = true;

export var description = "removes empty attributes";

/**
 * Remove attributes with empty values.
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
export var fn = function (item) {
  if (item.elem) {
    item.eachAttr(function (attr) {
      if (attr.value === "") {
        item.removeAttr(attr.name);
      }
    });
  }
};
