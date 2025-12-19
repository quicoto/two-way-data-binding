import {
  getValueByPath, isHTMLElement, isHTMLString, isObject, setValueByPath
} from "./utils.js";

/**
 * @param {object} config
 * @param {HTMLElement} [config.$context]
 * @param {string} [config.attributeBind]
 * @param {string} [config.attributeModel]
 * @param {string[]} [config.attributesCustomValue]
 * @param {string} [config.domRefPrefix]
 * @param {object} [config.dataModel]
 * @param {string[]} [config.events]
 * @param {string} [config.pathDelimiter]
 * @param {function(prop: any,value: any)} [config.setCustomValueCallback]
 * @return {any}
 */
export default (config = {}) => {
  const {
    $context = document,
    attributeBind = `data-bind`,
    attributeModel = `data-model`,
    attributesCustomValue = [`data-value`],
    domRefPrefix = `$`,
    events = [`change`, `keyup`],
    pathDelimiter = `.`
  } = config;
  const CUSTOM_EVENTS = {
    setCustomValue: `twowaydatabinding:setcustomvalue`
  };
  // On every event defined, generate the equivalent name with 'twowaydatabinding' prefix
  // in order to dispatch that event after the logic is processed
  events.forEach((event) => {
    CUSTOM_EVENTS[event] = `twowaydatabinding:${event}`;
  });
  const dataModel = { ...config.dataModel };
  let _proxy;

  // Convert attributesCustomValue array to Set for O(1) lookups
  const customValueAttrsSet = new Set(attributesCustomValue);

  // Memoize path splitting to avoid repeated split operations
  const pathCache = new Map();

  /**
   * @param {string} pathString
   * @return {string[]}
   */
  function splitPath(pathString) {
    let path = pathCache.get(pathString);
    if (!path) {
      path = pathString.split(pathDelimiter);
      pathCache.set(pathString, path);
    }
    // Return a copy to prevent mutations affecting cached array
    return path.slice();
  }

  /**
   * @param {HTMLElement} $target
   * @param {object} options
   * @param {string} [options.cancelable]
   * @param {string} [options.detail]
   * @param {string} options.name
   */
  function dispatchCustomEvent($target, options) {
    const {
      bubbles = true, cancelable = true, detail, name
    } = options;

    $target.dispatchEvent(new CustomEvent(name, { bubbles, cancelable, detail }));
  }

  /**
   * @param {HTMLFormElement} $element
   * @return {boolean}
   */
  function hasCustomValue($element) {
    const attrNames = $element.getAttributeNames();
    const len = attrNames.length;
    for (let i = 0; i < len; i += 1) {
      if (customValueAttrsSet.has(attrNames[i])) {
        return true;
      }
    }
    return false;
  }

  /**
   * @param {HTMLFormElement} $element
   * @return {string|undefined}
   */
  function getCustomPropertyName($element) {
    const attrNames = $element.getAttributeNames();
    const len = attrNames.length;
    for (let i = 0; i < len; i += 1) {
      if (customValueAttrsSet.has(attrNames[i])) {
        return attrNames[i];
      }
    }
    return undefined;
  }

  /**
   * @param {HTMLFormElement} $element
   * @return {boolean}
   */
  function isCheckboxOrRadio($element) {
    return $element.type === `checkbox` || $element.type === `radio`;
  }

  /**
   * @param {HTMLFormElement} $element
   * @return {boolean}
   */
  function isPartOfGroup($element) {
    if ($element.name) {
      const $elements = $context.querySelectorAll(`[name=${$element.name}]`);

      return $elements.length > 1;
    }

    return false;
  }

  /**
   * @param {*} $element
   * @return {string}
   */
  function propertyToGet($element) {
    let propName = ``;

    if (hasCustomValue($element)) {
      propName = getCustomPropertyName($element);
    } else if ($element.tagName === `INPUT`) {
      if (isCheckboxOrRadio($element) && !isPartOfGroup($element)) {
        propName = `checked`;
      } else {
        propName = `value`;
      }
    } else if ($element.tagName === `SELECT`) {
      propName = `selectedOptions`;
    } else {
      propName = isHTMLString($element.innerHTML) ? `innerHTML` : `textContent`;
    }

    return propName;
  }

  /**
   * Set at the same level of every 'data-bind="property.path"' the DOM Element
   * where the value in the model needs to be printed.
   *
   * dataModel defined on module initialisation:
   * { foo: { bar: 'bar' } }
   *
   * dataModel after appending DOM references:
   * { foo: { $bar: HTMLElement, bar: 'bar' } }
   */
  function setDOMRefsInDataModel() {
    const $refs = $context.querySelectorAll(`[${attributeBind}]`);
    const len = $refs.length;

    for (let i = 0; i < len; i += 1) {
      const $ref = $refs[i];
      const propPathString = $ref.getAttribute(attributeBind);
      const propPath = splitPath(propPathString);
      const lastPropIdx = propPath.length - 1;
      const lastprop = propPath[lastPropIdx];
      // Set the DOM Reference with the same name of the data-bind attribute with domRefPrefix ($)
      const DOMRefPath = propPath.slice();
      DOMRefPath[lastPropIdx] = `${domRefPrefix}${lastprop}`;

      // Concat the possible value to have an array of elements
      const $currentRef = getValueByPath(DOMRefPath, dataModel) || ``;

      setValueByPath([$ref, ...$currentRef], DOMRefPath, dataModel);

      if (typeof getValueByPath(propPath, dataModel) === `undefined`) {
        // Set the value that Element has in the static HTML in case is not
        // defined in the model
        const prop = propertyToGet($ref);
        let value;

        if (isPartOfGroup($ref)) {
          const refName = $ref.name;
          let checkedValue = ``;

          // Search for checked element in already processed refs
          for (let j = 0; j < len; j += 1) {
            const $el = $refs[j];
            if ($el.name === refName && $el.checked) {
              checkedValue = $el.value;
              break;
            }
          }

          value = checkedValue;
        } else if (prop === `selectedOptions`) {
          // In case of a select, set the default option or empty string
          const selectedOpts = $ref[prop];
          const optsLen = selectedOpts.length;
          const values = new Array(optsLen);
          for (let k = 0; k < optsLen; k += 1) {
            values[k] = selectedOpts[k].value;
          }
          value = values.join(``);
        } else {
          value = prop.indexOf(`data`) !== -1 ? $ref.getAttribute(prop) : $ref[prop];
        }

        setValueByPath(
          typeof value === `string` ? value.trim() : value,
          propPath,
          dataModel
        );
      }
    }
  }

  /**
   * @param {HTMLElement[]} $elements
   * @param {any} value
   */
  function updateDOM($elements, value) {
    if (typeof $elements === `undefined` || value === null) return;

    $elements.forEach(($element) => {
      if (hasCustomValue($element)) {
        const attr = propertyToGet($element);

        $element.setAttribute(attr, value);

        return;
      }

      if ($element.tagName === `INPUT`) {
        let checked = value !== `undefined` && value === ``;

        if (isCheckboxOrRadio($element)) {
          if (isPartOfGroup($element)) {
            checked = $element.value === value;
          } else {
            checked = value;

            // Make sure we're setting a boolean
            if (typeof checked !== `boolean`) {
              // Convert string to boolean
              checked = value.toLowerCase() === `true`;
            }
          }
          $element.checked = checked;
        } else {
          // Regular text inputs
          $element.value = value;
        }
      } else if ($element.tagName === `SELECT`) {
        // Check value is actually relevant and prevent the logic when it's a nodelist
        if (typeof value === `string`) {
          const options = $element.options;
          const optLen = options.length;
          for (let i = 0; i < optLen; i += 1) {
            const $option = options[i];
            if (value.indexOf($option.value) !== -1) {
              $option.selected = true;
            }
          }
        }
      } else {
        // Elements that are not inputs nor form elements
        $element[isHTMLString(value) ? `innerHTML` : `textContent`] = value;
      }
    });
  }

  /**
   * Considering a (already processed) dataModel:
   * { foo: { $bar: HTMLElement, bar: 'bar' } }
   *
   * Recursive function is executed, when an HTML is found, the DOM is updated
   * with the text belonging to the same key without '$'
   * @param  {object} data
   */
  function iterateDataModelAndUpdateDOM(data) {
    Object.keys(data).forEach((key) => {
      if (Array.isArray(data[key]) && data[key]?.every(($el) => isHTMLElement($el))) {
        updateDOM(data[key], data[key.replace(domRefPrefix, ``)]);
      } else if (typeof data[key] === `object` && data[key] !== null) {
        iterateDataModelAndUpdateDOM(data[key]);
      }
    });
  }

  /**
   * @param {string} eventName
   * @param {object} DOMEvent
   */
  function eventListener(eventName, DOMEvent) {
    const { target } = DOMEvent;

    if (target.hasAttribute(attributeModel)) {
      if (hasCustomValue(target)) return;

      let value;
      const path = splitPath(target.getAttribute(attributeModel));

      if (isCheckboxOrRadio(target) && !isPartOfGroup(target)) {
        value = target.checked;
      } else if (target.tagName === `SELECT`) {
        const selectedOpts = target.selectedOptions;
        const len = selectedOpts.length;
        const values = new Array(len);
        for (let i = 0; i < len; i += 1) {
          values[i] = selectedOpts[i].value;
        }
        value = values.toString();
      } else {
        value = target.value;
      }

      setValueByPath(value, path, _proxy);

      if (CUSTOM_EVENTS[eventName]) {
        dispatchCustomEvent(target, { name: CUSTOM_EVENTS[eventName] });
      }
    }
  }

  /**
   * @param {CustomEvent} DOMEvent
   */
  function onSetCustomValue(DOMEvent) {
    const { detail, target } = DOMEvent;

    if (target.hasAttribute(attributeModel) || target.hasAttribute(attributeBind)) {
      setValueByPath(detail.value, splitPath(detail.path), _proxy);
      dispatchCustomEvent(target, { name: CUSTOM_EVENTS.change });
    }
  }

  function addEventListeners() {
    events.forEach((eventName) => {
      $context.addEventListener(eventName, (DOMEvent) => {
        eventListener(eventName, DOMEvent);
      });
    });

    // Be prepared to react when any consumer dispatches twowaydatabinding:setcustomvalue
    $context.addEventListener(CUSTOM_EVENTS.setCustomValue, onSetCustomValue);
  }

  function init() {
    // Cache proxies to avoid creating new ones on every property access
    const proxyCache = new WeakMap();

    const proxyHandler = {
      get: (data, prop) => {
        if (typeof data[prop] === `object` && data[prop] !== null && !isHTMLElement(data[prop])) {
          let proxy = proxyCache.get(data[prop]);
          if (!proxy) {
            proxy = new Proxy(data[prop], proxyHandler);
            proxyCache.set(data[prop], proxy);
          }
          return proxy;
        }

        return data[prop];
      },
      set: (data, prop, value) => {
        // Only merge if both existing and new values are objects
        if (isObject(value) && isObject(data[prop])) {
          // Merge properties instead of creating new object when necessary
          Object.assign(data[prop], value);
        } else {
          data[prop] = value;
        }

        /**
         * At this point:
         * 'data' = { $bar: HTMLElement, bar: 'bar' }
         * 'prop' = 'bar'
         *
         * In 'data' the property named as 'prop' prefixed with '$'
         * contains the HTML reference where to print 'value'
         */

        updateDOM(data[`${domRefPrefix}${prop}`], value);

        return true;
      }
    };

    setDOMRefsInDataModel();
    iterateDataModelAndUpdateDOM(dataModel);
    addEventListeners();
    _proxy = new Proxy(dataModel, proxyHandler);
  }

  init();

  return _proxy;
};
