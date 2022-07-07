/**
 * @param  {*} obj
 * @return  {boolean}
 */
export function isHTMLElement(obj) {
  try {
    //Using W3 DOM2 (works for FF, Opera and Chrome)
    return obj instanceof HTMLElement;
  }
  catch(e){
    //Browsers not supporting W3 DOM2 don't have HTMLElement and
    //an exception is thrown and we end up here. Testing some
    //properties that all elements have (works on IE7)
    return (typeof obj===`object`) &&
      (obj.nodeType===1) && (typeof obj.style === `object`) &&
      (typeof obj.ownerDocument ===`object`);
  }
}

/**
 * @param  {string} string
 * @return  {boolean}
 */
export function isHTMLString(string) {
  return /<\/?[a-z][\s\S]*>/i.test(string);
}

/**
 * @param {*} value
 * @param {PropertyPath} path
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
