import { getValueByPath, isHTMLElement, isHTMLString, setValueByPath } from "./utils";

/**
 * @param {object} config
 * @param {HTMLElement} config.$context
 * @param {string} [config.attributeBind]
 * @param {string} [config.attributeModel]
 * @param {object} [config.dataModel]
 * @param {string[]} [config.events]
 * @param {string} [config.pathDelimiter]
 */
export default function(config) {
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

  function propertyToGet($element) {
    let propName = ``;

    if ($element.tagName === `INPUT`) {
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

    for (let i = 0, len = $refs.length; i < len; i++) {
      const $ref = $refs[i];
      const propPathString = $ref.getAttribute(attributeBind);
      const propPath = propPathString.split(pathDelimiter);
      const lastprop = [...propPath].pop();
      // Set the DOM Reference with the same name of the data-bind attribute with domRefPrefix ($)
      const DOMRefPath = propPathString
        .replace(lastprop, `${domRefPrefix}${lastprop}`)
        .split(pathDelimiter);

      setValueByPath($ref, DOMRefPath, dataModel);

      if (!getValueByPath([...propPath], dataModel)) {
        // Set the value that Element has in the static HTML in case is not
        // defined in the model
        setValueByPath($ref[propertyToGet($ref)], [...propPath], dataModel);
      }
    }
  }

  /**
   * @param {HTMLElement} $element
   * @param {string} value
   */
  function updateDOM($element, value) {
    if (typeof $element === `undefined` || value === null) return;

    $element[isHTMLString(value) ? `innerHTML` : `textContent`] = value;
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
    for (const key in data) {
      if (isHTMLElement(data[key])) {
        updateDOM(data[key], data[key.replace(domRefPrefix, ``)]);
      } else if (typeof data[key] === `object` && data[key] !== null) {
        iterateDataModelAndUpdateDOM(data[key]);
      }
    }
  }

  function addEventListeners() {
    events.forEach((eventName) => {
      $context.addEventListener(eventName, (DOMEvent) => {
        const { target } = DOMEvent;

        if (target.hasAttribute(attributeModel)) {
          const path = target.getAttribute(attributeModel).split(pathDelimiter);

          setValueByPath(target.value, path, _proxy);
        }
      });
    });
  }

  function init() {
    const proxyHandler = {
      get: (data, prop) => {
        if (typeof data[prop] === `object` && data[prop] !== null && !isHTMLElement(data[prop])) {
          return new Proxy(data[prop], proxyHandler);
        } else {
          return data[prop];
        }
      },
      set: (data, prop, value) => {
        data[prop] = value;

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
}
