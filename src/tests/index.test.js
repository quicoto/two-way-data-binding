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

    const element = bindName(`firstName`);
    expect(element).toHaveTextContent(`Thor`);
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

    const element = bindName(`user.firstName`);
    expect(element).toHaveTextContent(`Thor`);
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

    const element = bindName(`user-firstName`);
    expect(element).toHaveTextContent(`Thor`);
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

    const element = bindName(`firstName`);
    expect(element).toHaveTextContent(`Thor`);
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

    const element = bindName(`firstName`);
    expect(element).toHaveTextContent(`Thor`);
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

    const element = bindName(`site.name`);
    expect(element).toHaveTextContent(`Thor`);
  });
});
