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
  console.log(`Proxy from demo: `, JSON.stringify(proxy));
}, 1000);