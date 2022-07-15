import TwoWayDataBinding from '../src/index';

const config = {
  attributeBind: `data-custom-bind`,
  attributeModel: `data-custom-model`,
  dataModel: {}
};

const state = TwoWayDataBinding(config);

document.addEventListener(`click`, (event) => {
  const { target } = event;

  if (target.id === `change-heading`) {
    state.site.general.heading = target.dataset.text;
  } else if (target.id === `change-description`) {
    state.site.general.description = target.dataset.text;
  } else if (target.id === `log-state`) {
    console.log(state.site);
  }
});

setInterval(() => {
  console.log(JSON.stringify(state));
}, 1000);
