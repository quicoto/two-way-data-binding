import {
  ensureArray,
  getValueByPath,
  isHTMLString,
  setValueByPath
} from "../utils";

//
// isHTMLString
//
describe(`isHTMLString`, () => {
  test(`not HTML text`, () => {
    const string = `This is a regular text without HTML markup`;

    expect(isHTMLString(string)).toBe(false);
  });

  test(`HTML markup`, () => {
    const string = `<span>Description <b>contains</b> HTML markup</span>`;

    expect(isHTMLString(string)).toBe(true);
  });
});

//
// setValueByPath
//
describe(`setValueByPath`, () => {
  test(`path ['a']`, () => {
    const value = `value`;
    const object = {};

    setValueByPath(value, [`a`], object);
    expect(object.a).toEqual(value);
  });

  test(`path ['a', 'aa']`, () => {
    const value = `value`;
    const object = {};

    setValueByPath(value, [`a`, `aa`], object);
    expect(object.a.aa).toEqual(value);
  });

  test(`path ['a', 'aa', 'aaa']`, () => {
    const value = `value`;
    const object = {};

    setValueByPath(value, [`a`, `aa`, `aaa`], object);
    expect(object.a.aa.aaa).toEqual(value);
  });

  test(`two insertions ['a','aa'], ['a', 'b'] and ['b','bb']`, () => {
    const value1 = `value1`;
    const value2 = `value2`;
    const value3 = `value3`;
    const object = {};

    setValueByPath(value1, [`a`, `aa`], object);
    setValueByPath(value2, [`a`, `b`], object);
    setValueByPath(value3, [`b`, `bb`], object);
    expect(object.a.aa).toEqual(value1);
    expect(object.a.b).toEqual(value2);
    expect(object.b.bb).toEqual(value3);
  });
});

//
// getValueByPath
//
describe(`getValueByPath`, () => {
  test(`nested object`, () => {
    const object = {
      a: {
        aa: 1,
        ab: { aba: false },
        ac: [0, 1]
      },
      b: true
    };

    expect(getValueByPath([`b`], object)).toEqual(true);
    expect(getValueByPath([`a`, `aa`], object)).toEqual(1);
    expect(getValueByPath([`a`, `ab`, `aba`], object)).toEqual(false);
    expect(getValueByPath([`a`, `ac`, 1], object)).toEqual(1);
    expect(getValueByPath([`c`, `a`], object)).toBeUndefined();
  });

  test(`should be correct with a fallback value`, () => {
    expect(getValueByPath([`a`], {}, `fallback`)).toEqual(`fallback`);
  });
});

//
// ensureArray
//
describe(`ensureArray`, () => {
  describe(`when called with an array`, () => {
    test(`it should return the passed array`, () => {
      const dummyArray = [1, 2, 3];
      const returnedValue = ensureArray(dummyArray);

      expect(Array.isArray(returnedValue)).toBe(true);
      expect(returnedValue).toBe(dummyArray);
    });
  });

  describe(`when called with a value that is undefined`, () => {
    test(`it should return an empty array`, () => {
      const returnedValue = ensureArray(undefined);

      expect(Array.isArray(returnedValue)).toBe(true);
      expect(returnedValue.length).toBe(0);
    });
  });

  describe(`when called with a Nodelist`, () => {
    test(`it should convert the Nodelist to an array`, () => {
      const element1 = document.createElement(`div`);
      const element2 = document.createElement(`div`);

      document.body.appendChild(element1);
      document.body.appendChild(element2);
      const dummyNodelist = document.body.querySelectorAll(`div`);
      const returnedValue = ensureArray(dummyNodelist);

      expect(Array.isArray(returnedValue)).toBe(true);
      expect(dummyNodelist[1]).toBe(returnedValue[1]);
    });
  });

  describe(`when called with a value that that is not: array, undefined, or Nodelist`, () => {
    test(`it should return an array that contains the passed value`, () => {
      const dummyString = `string`;
      const dummyNumber = 1;
      const dummyBoolean = true;

      /**
       * @param {object} expectedArray
       * @return {boolean}
       */
      function isSingleValueArray(expectedArray) {
        return (Array.isArray(expectedArray) && expectedArray.length === 1);
      }

      /**
       * @param {*} wrappedValue
       * @param {*} value
       * @return {boolean}
       */
      function areValuesOfMatchingType(wrappedValue, value) {
        return (typeof wrappedValue[0] === typeof value);
      }

      /**
       * @param {*} dummy
       * @return {boolean}
       */
      function isValueWrappedInSingleArray(dummy) {
        const returnValue = ensureArray(dummy);

        return (isSingleValueArray(returnValue) && areValuesOfMatchingType(returnValue, dummy));
      }

      expect(isValueWrappedInSingleArray(dummyString)).toBe(true);
      expect(isValueWrappedInSingleArray(dummyNumber)).toBe(true);
      expect(isValueWrappedInSingleArray(dummyBoolean)).toBe(true);
    });
  });
});
