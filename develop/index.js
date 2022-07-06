import { default as TwoWayDataBinding } from '../src/index';

const dataModel = {
  name: `Thor`,
  site: {
    name: `my awesome site`
  }
};

const proxy = TwoWayDataBinding({
  dataModel,
});

setInterval(() => {
  // eslint-disable-next-line no-console
  console.log(`This is the proxy: `, JSON.stringify(proxy));
}, 1000);