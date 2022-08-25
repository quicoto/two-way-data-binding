import {
  extend, getValueByPath, isHTMLElement, isHTMLString, isObject, setValueByPath
} from "./utils";

/**
 * @param {object} config
 * @param {HTMLElement} [config.$context]
 * @param {string} [config.attributeBind]
 * @param {string} [config.attributeModel]
 * @param {object} [config.dataModel]
 * @param {string[]} [config.events]
 * @param {string} [config.pathDelimiter]
 */
export default (config = {}) => {
  const {
    $context = document,
    attributeBind = `data-bind`,
    attributeModel = `data-model`,
    dataModel = {},
    domRefPrefix = `$`,
    events = [`keyup`, `change`],
    pathDelimiter = `.`
  } = config;
  let _proxy;

  /**
   * @param {HTMLElement} $element
   * @return {boolean}
   */
  function isCheckboxOrRadio($element) {
    return $element.type === `checkbox` || $element.type === `radio`;
  }

  /**
   * @param {HTMLElement} $element
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
   * @param {HTMLElement} $element
   * @return {string}
   */
  function propertyToGet($element) {
    let propName = ``;

    if ($element.tagName === `INPUT`) {
      if (isCheckboxOrRadio($element)) {
        propName = `checked`;
      } else {
        propName = `value`;
      }
    } else if ($element.tagName === `SELECT`) {
      propName = `value`;
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

    for (let i = 0, len = $refs.length; i < len; i += 1) {
      const $ref = $refs[i];
      const propPathString = $ref.getAttribute(attributeBind);
      const propPath = propPathString.split(pathDelimiter);
      const lastprop = [...propPath].pop();
      // Set the DOM Reference with the same name of the data-bind attribute with domRefPrefix ($)
      const DOMRefPath = propPathString
        .replace(new RegExp(`${lastprop}$`), `${domRefPrefix}${lastprop}`)
        .split(pathDelimiter);

      // Concat the possible value to have an array of elements
      const $currentRef = getValueByPath(DOMRefPath, dataModel) || ``;

      setValueByPath([$ref, ...$currentRef], DOMRefPath, dataModel);

      if (typeof getValueByPath([...propPath], dataModel) === `undefined`) {
        // Set the value that Element has in the static HTML in case is not
        // defined in the model
        setValueByPath($ref[propertyToGet($ref)], [...propPath], dataModel);
      }
    }
  }

  /**
   * @param {HTMLElement[]} $elements
   * @param {string} value
   */
  function updateDOM($elements, value) {
    if (typeof $elements === `undefined` || value === null) return;

    $elements.forEach(($element) => {
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
          $element.value = value;
        }
      } else if ($element.tagName === `SELECT`) {
        $element.value = value;
      } else {
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

  function addEventListeners() {
    events.forEach((eventName) => {
      $context.addEventListener(eventName, (DOMEvent) => {
        const { target } = DOMEvent;

        if (target.hasAttribute(attributeModel)) {
          let { value } = target;

          const path = target.getAttribute(attributeModel).split(pathDelimiter);

          if (target.tagName === `INPUT`) {
            if (isCheckboxOrRadio(target) && !isPartOfGroup(target)) {
              value = target.checked;
            }
          }

          setValueByPath(value, path, _proxy);
        }
      });
    });
  }

  function init() {
    const proxyHandler = {
      get: (data, prop) => {
        if (typeof data[prop] === `object` && data[prop] !== null && !isHTMLElement(data[prop])) {
          return new Proxy(data[prop], proxyHandler);
        }
        return data[prop];
      },
      set: (data, prop, value) => {
        if (isObject(value)) {
          data[prop] = extend(data[prop], value);
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
    iterateDataModelAndUpdateDOM(dataModel, updateDOM);
    addEventListeners();
    _proxy = new Proxy(dataModel, proxyHandler);
  }

  init();

  return _proxy;
};
