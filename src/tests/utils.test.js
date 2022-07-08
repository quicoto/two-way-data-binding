import { isHTMLString, setValueByPath } from "../utils";

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