/**
 * @param  {*} obj
 * @return  {boolean}
 */
export function isHTMLElement(obj) {
  try {
    // Using W3 DOM2 (works for FF, Opera and Chrome)
    return obj instanceof HTMLElement;
  } catch {
    // Browsers not supporting W3 DOM2 don't have HTMLElement and
    // an exception is thrown and we end up here. Testing some
    // properties that all elements have (works on IE7)
    return (typeof obj === `object`)
      && (obj.nodeType === 1) && (typeof obj.style === `object`)
      && (typeof obj.ownerDocument === `object`);
  }
}

/**
 * @param  {string} string
 * @return  {boolean}
 */
export function isHTMLString(string) {
  // Early exit for non-strings, empty strings, or strings without '<'
  if (!string || typeof string !== `string`) return false;
  if (string.indexOf(`<`) === -1) return false;

  return /<[a-z]+[^>]*>/gm.test(string.trim());
}

/**
 * @param {*} value
 * @param {string[]} path
 * @param {object} object
 * @return {*}
 */
export function setValueByPath(value, path, object) {
  const prop = path.shift();

  // break recursion and a return a value if the property path
  // is only one level deep
  if (!path.length) {
    object[prop] = value;

    return object[prop];
  }

  // create a new node if it doesn't exist yet
  if (typeof object[prop] === `undefined`) {
    object[prop] = {};
  }

  setValueByPath(value, path, object[prop]);

  return object[prop];
}

/**
 * @param {*} possibleArray
 * @return {*[]}
 */
export function ensureArray(possibleArray) {
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
 * @param {string[]} path
 * @param {object|array} object
 * @param {*} [fallback]
 * @return {*}
 */
export function getValueByPath(path, object, fallback) {
  const reducer = (prev, curr) => {
    if (prev && typeof prev === `object`) {
      if (prev.constructor === Array) {
        return prev[+curr];
      }

      return prev[curr];
    }

    return undefined;
  };
  const value = ensureArray(path).reduce(reducer, object);

  return typeof value === `undefined` ? fallback : value;
}

/**
 * @param {*} object
 * @return {boolean}
 */
export function isObject(object) {
  return object && typeof object === `object`;
}
