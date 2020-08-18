

export var type = "perItem";

export var active = true;

export var description =
  "removes non-inheritable group’s presentational attributes";

import {
  inheritableAttrs,
  attrsGroups,
  presentationNonInheritableGroupAttrs as applyGroups,
} from "./_collections";

/**
 * Remove non-inheritable group's "presentation" attributes.
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
export var fn = function (item) {
  if (item.isElem("g")) {
    item.eachAttr(function (attr) {
      if (
        ~attrsGroups.presentation.indexOf(attr.name) &&
        !~inheritableAttrs.indexOf(attr.name) &&
        !~applyGroups.indexOf(attr.name)
      ) {
        item.removeAttr(attr.name);
      }
    });
  }
};
