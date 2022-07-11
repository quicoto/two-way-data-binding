import {
  default as twoWayDataBinding
} from '../index';
import {
  render
} from './helpers/test-utils';

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
});
