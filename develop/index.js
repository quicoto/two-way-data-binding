import TwoWayDataBinding from '../src/index';

const config = {
  attributeBind: `data-custom-bind`,
  attributeModel: `data-custom-model`,
  dataModel: {
    food: `pasta`,
    pet: `cat`
  }
};

const printArea = document.querySelector(`#print-area`);
const state = TwoWayDataBinding(config);

document.addEventListener(`click`, (event) => {
  const { target } = event;

  if (target.id === `change-heading`) {
    state.site.general.heading = target.dataset.text;
  } else if (target.id === `change-description`) {
    state.site.general.description = target.dataset.text;
  } else if (target.id === `log-state`) {
    printArea.textContent = JSON.stringify(state, null, `\t`);
  }
});
document.addEventListener(`change`, (event) => {
  const { target } = event;

  if (target.id === `country`) {
    const listName = target.getAttribute(`list`);
    const $list = document.querySelector(`datalist#${listName}`);
    const dataValue = Array
      .from($list.options)
      .find(($opt) => $opt.innerText === target.value)
      .getAttribute(`data-value`);

    target.setAttribute(`data-value`, dataValue);
    target.dispatchEvent(new CustomEvent(`twowaydatabinding:setcustomvalue`, {
      bubbles: true,
      cancelable: true,
      detail: { path: target.getAttribute(config.attributeModel), value: dataValue }
    }));
  }
});

setInterval(() => {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(state));
}, 1000);
