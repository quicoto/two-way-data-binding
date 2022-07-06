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
    events = [`keyup`, `change`],
    pathDelimiter = `.`
  } = config;
  let proxy;
  let $DOMRefs = {};
  let currentPropertyPath = [];

  /**
   * @param  {string} string
   * @return  {boolean}
   */
  function isHTML(string) {
    return /<\/?[a-z][\s\S]*>/i.test(string);
  }

  /**
   * @param {*} possibleArray
   * @return {*[]}
   */
  function ensureArray(possibleArray) {
    let array;

    if (typeof possibleArray === `undefined`) {
      return [];
    }
    if (possibleArray.constructor === Array) {
      return possibleArray;
    }
    switch (possibleArray.constructor) {
      case NodeList:
        array = Array.prototype.slice.call(possibleArray);
        break;
      default:
        array = [possibleArray];
        break;
    }

    return array;
  }

  /**
   * @param {PropertyPath} propertyPath
   * @param {object|array} object
   * @return {*}
   */
  function getValueByPropertyPath(propertyPath, object) {
    const reduceCallback = (prev, curr) => {
      if (prev && typeof prev === `object`) {
        if (prev.constructor === Array) {
          return prev[+curr];
        }

        return prev[curr];
      }

      return undefined;
    };
    const value = ensureArray(propertyPath).reduce(reduceCallback, object);

    return typeof value === `undefined` ? `` : value;
  }

  /**
   * $DOMRefs is a plain object Object<key.data.model.path,HTMLElement>
   */
  function setDOMRefs() {
    const $refs = $context.querySelectorAll(`[${attributeBind}]`);

    for (let i = 0, len = $refs.length; i < len; i++) {
      const $ref = $refs[i];
      const path = $ref.getAttribute(attributeBind);

      $DOMRefs[path] = $ref;
    }
  }

  /**
   * @param {HTMLElement} $element
   * @param {string} value
   */
  function updateDOM($element, value) {
    if (!$element || !value) return;

    if ($element.tagName === `INPUT`) {
      $element.value = value;
    } else {
      $element[isHTML(value) ? `innerHTML` : `textContent`] = value;
    }
  }

  /**
   * Iterate $DOMRefs to set to every element the value from the dataModel
   */
  function setModelData() {
    Object.keys($DOMRefs).forEach((key) => {
      const $ref = $DOMRefs[key];
      const value = getValueByPropertyPath(
        [...key.split(pathDelimiter)], // ['user', 'name']
        dataModel
      );

      updateDOM($ref, value);
    });
  }

  function addEventListeners() {
    events.forEach((eventName) => {
      document.addEventListener(eventName, (DOMEvent) => {
        const { target } = DOMEvent;

        const path = target.getAttribute(attributeModel);

        proxy[path] = target.value;

        // @TODO add event listeners to achieve two way data binding when writing in an input
        // eslint-disable-next-line no-console
        console.log(path);
      });
    });
  }

  function init() {
    const proxyHandler = {
      get: (data, prop) => {
        if (typeof data[prop] === `object` && data[prop] !== null) {
          currentPropertyPath.push(prop);
          return new Proxy(data[prop], proxyHandler);
        } else {
          return data[prop];
        }
      },
      set: (data, prop, value) => {
        data[prop] = value;
        currentPropertyPath.push(prop);
        const $element = $DOMRefs[currentPropertyPath.join(pathDelimiter)];
        updateDOM($element, value);
        currentPropertyPath = [];

        return true;
      }
    };

    setDOMRefs();
    setModelData();
    addEventListeners();
    proxy = new Proxy(dataModel, proxyHandler);
  }

  init();

  return proxy;
}
