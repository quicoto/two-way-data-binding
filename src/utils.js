/**
 * @param  {*} obj
 * @return  {boolean}
 */
export function isHTMLElement(obj) {
  try {
    // Using W3 DOM2 (works for FF, Opera and Chrome)
    return obj instanceof HTMLElement;
  } catch (e) {
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
  return /<[a-z]+[^>]*>/gm.test(string?.trim());
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

/**
 * @param {*} object
 * @return {object}
 */
export function extend(...args) {
  let options;
  let src;
  let copy;
  let copyIsArray;
  let clone;
  let i = 1;
  let target = args[0] || {};
  const { length } = args;

  function _extendBaseObject(name) {
    src = target[name];
    copy = options[name];

    // Prevent never-ending loop
    if (target === copy) {
      return;
    }

    copyIsArray = Array.isArray(copy);

    // Recurse if we're merging plain objects or arrays
    if (copy && (isObject(copy) || copyIsArray)) {
      if (copyIsArray) {
        clone = src && Array.isArray(src) ? src : [];
      } else {
        clone = src && isObject(src) ? src : {};
      }

      // Do not move original objects, clone them
      target[name] = extend(clone, copy);
    } else if (copy !== undefined) {
      target[name] = copy;
    }
  }

  // Handle case when target is a string or something (possible in deep copy)
  if (!isObject(target) && typeof target !== `function`) {
    target = {};
  }

  if (i === length) {
    target = this;
    i -= 1;
  }

  for (; i < length; i += 1) {
    // Only deal with non-null/undefined values
    options = args[i];

    if (typeof window !== `undefined` && options instanceof HTMLElement) {
      target = options;
    } else if (options != null) {
      Object.keys(options).forEach(_extendBaseObject);
    }
  }

  return target;
}
