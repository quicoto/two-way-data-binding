import {
  default as twoWayDataBinding
} from '../index';
import {
  render
} from './helpers/test-utils';

describe(`twoWayDataBinding`, () => {
  it(`text content is populated`, () => {
    const {
      container,
      bindName
    } = render(`
        <span mam-bind="firstName"></span>
      `);

    twoWayDataBinding({
      $context: container,
      attributeBind: `mam-bind`,
      dataModel: {
        firstName: `Thor`
      }
    });

    const button = bindName(`firstName`);
    expect(button).toHaveTextContent(`Thor`);
  });
});