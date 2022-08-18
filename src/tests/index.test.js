import twoWayDataBinding from '../index';
import { render } from './helpers/test-utils';

describe(`twoWayDataBinding`, () => {
  it(`Uses a one level object as dataModel`, () => {
    const {
      container,
      bindName
    } = render(
      `<span data-bind="firstName"></span>`,
      `data-bind`
    );

    twoWayDataBinding({
      $context: container,
      dataModel: {
        firstName: `Thor`
      }
    });

    const $element = bindName(`firstName`);
    expect($element).toHaveTextContent(`Thor`);
  });

  it(`Uses a deep object as dataModel`, () => {
    const {
      container,
      bindName
    } = render(
      `<span data-bind="user.firstName"></span>`,
      `data-bind`
    );

    twoWayDataBinding({
      $context: container,
      dataModel: {
        user: {
          firstName: `Thor`
        }
      }
    });

    const $element = bindName(`user.firstName`);
    expect($element).toHaveTextContent(`Thor`);
  });

  it(`Uses a deep object with same key as dataModel`, () => {
    const {
      container,
      bindName
    } = render(
      `<span data-bind="user.firstName.user"></span>`,
      `data-bind`
    );

    twoWayDataBinding({
      $context: container,
      dataModel: {
        user: {
          firstName: {
            user: `Thor`
          }
        }
      }
    });

    const $element = bindName(`user.firstName.user`);
    expect($element).toHaveTextContent(`Thor`);
  });

  it(`Uses an empty object as dataModel`, () => {
    const {
      container,
      bindName
    } = render(
      `<span data-bind="user.firstName">No JS User First Name</span>`,
      `data-bind`
    );

    twoWayDataBinding({
      $context: container,
      dataModel: {}
    });

    const $element = bindName(`user.firstName`);
    expect($element).toHaveTextContent(`No JS User First Name`);
  });

  it(`Uses a custom pathDelimiter`, () => {
    const {
      container,
      bindName
    } = render(
      `<span data-bind="user-firstName"></span>`,
      `data-bind`
    );

    twoWayDataBinding({
      $context: container,
      dataModel: {
        user: {
          firstName: `Thor`
        }
      },
      pathDelimiter: `-`
    });

    const $element = bindName(`user-firstName`);
    expect($element).toHaveTextContent(`Thor`);
  });

  it(`Uses a custom bind attribute`, () => {
    const {
      container,
      bindName
    } = render(
      `<span mam-bind="firstName"></span>`,
      `mam-bind`
    );

    twoWayDataBinding({
      $context: container,
      attributeBind: `mam-bind`,
      dataModel: {
        firstName: `Thor`
      }
    });

    const $element = bindName(`firstName`);
    expect($element).toHaveTextContent(`Thor`);
  });

  it(`Updates the model after creation simple object`, () => {
    const {
      container,
      bindName
    } = render(
      `<span data-bind="firstName"></span>`,
      `data-bind`
    );

    const proxy = twoWayDataBinding({
      $context: container,
      dataModel: {
        firstName: `Ricard`
      }
    });

    proxy.firstName = `Thor`;

    const $element = bindName(`firstName`);
    expect($element).toHaveTextContent(`Thor`);
  });

  it(`Updates the model after creation deep object`, () => {
    const {
      container,
      bindName
    } = render(
      `<span data-bind="site.name"></span>`,
      `data-bind`
    );

    const proxy = twoWayDataBinding({
      $context: container,
      dataModel: {
        site: {
          name: `Ricard`
        }
      }
    });

    proxy.site.name = `Thor`;

    const $element = bindName(`site.name`);
    expect($element).toHaveTextContent(`Thor`);
  });

  it(`Updates the model with empty string`, () => {
    const {
      container,
      bindName
    } = render(
      `<span data-bind="name"></span>`,
      `data-bind`
    );

    const proxy = twoWayDataBinding({
      $context: container,
      dataModel: {
        name: `Thor`
      }
    });

    proxy.name = ``;

    const $element = bindName(`name`);
    expect($element).toHaveTextContent(``);
  });

  it(`Updates the simple model from an input`, () => {
    const {
      container,
      bindName
    } = render(
      `<span data-bind="name"></span>
      <input data-model="name" type="text" value="Roger" />`,
      `data-bind`
    );

    twoWayDataBinding({
      $context: container
    });

    const $span = bindName(`name`);
    const $input = bindName(`name`, `data-model`);
    const changeEvent = document.createEvent(`Event`);

    changeEvent.initEvent(`change`, true, true);
    $input.value = `Ricard`;
    $input.dispatchEvent(changeEvent);

    expect($input).toHaveValue(`Ricard`);
    expect($span).toHaveTextContent(`Ricard`);
  });

  it(`Updates the deep model from an input`, () => {
    const {
      container,
      bindName
    } = render(
      `<span data-bind="site.name"></span>
      <input data-model="site.name" type="text" value="Roger" />`,
      `data-bind`
    );

    twoWayDataBinding({
      $context: container
    });

    const element = bindName(`site.name`);
    const $input = bindName(`site.name`, `data-model`);
    const changeEvent = document.createEvent(`Event`);

    changeEvent.initEvent(`change`, true, true);
    $input.value = `Ricard`;
    $input.dispatchEvent(changeEvent);

    expect($input).toHaveValue(`Ricard`);
    expect(element).toHaveTextContent(`Ricard`);
  });

  it(`Uses a one level object as dataModel with HTML`, () => {
    const {
      container,
      bindName
    } = render(
      `<span data-bind="firstName"></span>`,
      `data-bind`
    );

    twoWayDataBinding({
      $context: container,
      dataModel: {
        firstName: `<span>Thor</span>`
      }
    });

    const $element = bindName(`firstName`);
    expect($element).toContainHTML(`<span>Thor</span>`);
  });

  it(`Input text with bind`, () => {
    const {
      container,
      bindName
    } = render(
      `<input type="text" value="thor" data-bind="name" />`,
      `data-bind`
    );

    twoWayDataBinding({
      $context: container,
      dataModel: {
        name: `Roger`
      }
    });

    const $input = bindName(`name`);
    expect($input).toHaveValue(`Roger`);
  });

  it(`Input text with model`, () => {
    const {
      container,
      bindName
    } = render(
      `<input type="text" value="thor" data-bind="name" data-model="name" />`,
      `data-bind`
    );

    const proxy = twoWayDataBinding({
      $context: container,
      dataModel: {
        name: `Roger`
      }
    });

    const changeEvent = document.createEvent(`Event`);
    const $input = bindName(`name`);

    $input.value = `Ricard`;

    changeEvent.initEvent(`change`, true, true);
    $input.dispatchEvent(changeEvent);

    expect(proxy.name).toEqual(`Ricard`);
  });

  it(`Checkbox with bind to false`, () => {
    const {
      container,
      bindName
    } = render(
      `<input type="checkbox" value="thor" data-bind="areYouThor" checked />`,
      `data-bind`
    );

    twoWayDataBinding({
      $context: container,
      dataModel: {
        areYouThor: false
      }
    });

    const $input = bindName(`areYouThor`);
    expect($input).not.toBeChecked();
  });

  it(`Checkbox with bind to true`, () => {
    const {
      container,
      bindName
    } = render(
      `<input type="checkbox" value="thor" data-bind="areYouThor" />`,
      `data-bind`
    );

    twoWayDataBinding({
      $context: container,
      dataModel: {
        areYouThor: true
      }
    });

    const $input = bindName(`areYouThor`);
    expect($input).toBeChecked();
  });

  it(`Checkbox checked manually to true`, () => {
    const {
      container,
      bindName
    } = render(
      `<input type="checkbox" value="thor" data-bind="areYouThor" data-model="areYouThor" />`,
      `data-bind`
    );

    const proxy = twoWayDataBinding({
      $context: container
    });

    const changeEvent = document.createEvent(`Event`);
    const $input = bindName(`areYouThor`);

    changeEvent.initEvent(`change`, true, true);
    $input.checked = true;
    $input.dispatchEvent(changeEvent);

    expect(proxy.areYouThor).toEqual(true);
  });

  it(`Checkbox checked manually to false`, () => {
    const {
      container,
      bindName
    } = render(
      `<input type="checkbox" value="thor" data-bind="areYouThor" data-model="areYouThor" checked />`,
      `data-bind`
    );

    const proxy = twoWayDataBinding({
      $context: container
    });

    const changeEvent = document.createEvent(`Event`);
    const $input = bindName(`areYouThor`);

    changeEvent.initEvent(`change`, true, true);
    $input.checked = false;
    $input.dispatchEvent(changeEvent);

    expect(proxy.areYouThor).toEqual(false);
  });

  it(`Radio with bind to false`, () => {
    const {
      container,
      bindName
    } = render(
      `<input type="radio" value="thor" data-bind="areYouThor" checked />`,
      `data-bind`
    );

    twoWayDataBinding({
      $context: container,
      dataModel: {
        areYouThor: false
      }
    });

    const $element = bindName(`areYouThor`);
    expect($element).not.toBeChecked();
  });

  it(`Radio with bind to true`, () => {
    const {
      container,
      bindName
    } = render(
      `<input type="radio" value="thor" data-bind="areYouThor" />`,
      `data-bind`
    );

    twoWayDataBinding({
      $context: container,
      dataModel: {
        areYouThor: true
      }
    });

    const $element = bindName(`areYouThor`);
    expect($element).toBeChecked();
  });

  it(`Textarea with bind`, () => {
    const {
      container,
      bindName
    } = render(
      `<textarea data-bind="myText"></textarea>`,
      `data-bind`
    );

    twoWayDataBinding({
      $context: container,
      dataModel: {
        myText: `This is a long text`
      }
    });

    const $element = bindName(`myText`);
    expect($element).toHaveTextContent(`This is a long text`);
  });

  it(`2 elements with same bind path`, () => {
    const {
      container,
      bindNames
    } = render(
      `<p data-bind="myDescription"></p>
       <p data-bind="myDescription"></p>`,
      `data-bind`
    );

    twoWayDataBinding({
      $context: container,
      dataModel: {
        myDescription: `Two elements with same description`
      }
    });

    const $elements = bindNames(`myDescription`);

    $elements.forEach(($element) => {
      expect($element).toHaveTextContent(`Two elements with same description`);
    });
  });

  it(`Textarea with model`, () => {
    const {
      container,
      bindName
    } = render(
      `<textarea data-bind="myText" data-model="myText">Default</textarea>`,
      `data-bind`
    );

    const proxy = twoWayDataBinding({
      $context: container,
      dataModel: {
        myText: `This is a long text`
      }
    });

    const $element = bindName(`myText`);
    const changeEvent = document.createEvent(`Event`);

    $element.textContent = `New content`;

    changeEvent.initEvent(`change`, true, true);
    $element.dispatchEvent(changeEvent);

    expect(proxy.myText).toEqual(`New content`);
  });

  it(`Select via JS (data-bind)`, () => {
    const {
      container,
      bindName
    } = render(
      `<select name="pets" id="pet-select" data-bind="pet">
        <option value="">--Please choose an option--</option>
        <option value="dog">Dog</option>
        <option value="cat">Cat</option>
      </select>`,
      `data-bind`
    );

    twoWayDataBinding({
      $context: container,
      dataModel: {
        pet: `cat`
      }
    });

    const $element = bindName(`pet`);

    expect($element.value).toEqual(`cat`);
    expect($element.selectedIndex).toEqual(2);
  });

  it(`Select via DOM (data-model)`, () => {
    const {
      container,
      bindName
    } = render(
      `<select name="pets" id="pet-select" data-model="pet" data-bind="pet">
        <option value="">--Please choose an option--</option>
        <option value="dog">Dog</option>
        <option value="cat">Cat</option>
      </select>`,
      `data-bind`
    );

    const proxy = twoWayDataBinding({
      $context: container,
      dataModel: {}
    });

    const $element = bindName(`pet`);
    const changeEvent = document.createEvent(`Event`);

    $element.value = `cat`;

    changeEvent.initEvent(`change`, true, true);
    $element.dispatchEvent(changeEvent);

    expect(proxy.pet).toEqual(`cat`);
  });
});
