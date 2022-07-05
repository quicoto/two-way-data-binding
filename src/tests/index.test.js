import {
  default as twoWayDataBinding
} from '../index';
import {
  render
} from './helpers/test-utils';

describe(`twoWayDataBinding`, () => {
  it(`text content is populated`, () => {
    const {
      bindName
    } = render(`
        <span mam-bind="firstName"></span>
      `);

    const scope = {
      firstName: `Roger`
    };

    twoWayDataBinding(scope);

    const button = bindName(`firstName`);
    expect(button).toHaveTextContent(`Roger`);
  });
});