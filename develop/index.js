import { default as TwoWayDataBinding } from '../src/index';

const dataModel = {
  site: {
    name: `my awesome site`
  }
};

TwoWayDataBinding({
  dataModel,
});