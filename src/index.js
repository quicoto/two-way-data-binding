import { isHTMLElement, isHTMLString, setValueByPath } from "./utils";

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
      let stringpath = $ref.getAttribute(attributeBind);
      const lastprop = stringpath.split(pathDelimiter).pop();
      const path = stringpath
        .replace(lastprop, `${domRefPrefix}${lastprop}`)
        .split(pathDelimiter);

      setValueByPath($ref, path, dataModel);
    }
  }

  /**
   * @param {HTMLElement} $element
   * @param {string} value
   */
  function updateDOM($element, value) {
    if (typeof $element === `undefined` || value === null) return;

    if ($element.tagName === `INPUT`) {
      $element.value = value;
    } else {
      $element[isHTMLString(value) ? `innerHTML` : `textContent`] = value;
    }
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
    for (var key in data) {
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
        if (typeof data[prop] === `object` && data[prop] !== null) {
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
