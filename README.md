# Two way data binding

Minimal no-dependencies 1.2kb (756B gzipped) two way data binding in vanilla JS.

[![Version](https://img.shields.io/npm/v/two-way-data-binding.svg)](https://npmjs.org/package/two-way-data-binding)
[![Build Status](https://github.com/quicoto/two-way-data-binding/workflows/CI/badge.svg?branch=main)](https://github.com/quicoto/two-way-data-binding/actions)
[![CodeQL Analysis](https://github.com/quicoto/two-way-data-binding/workflows/CodeQL/badge.svg?branch=main)](https://github.com/quicoto/two-way-data-binding/actions)
[![semver: semantic-release](https://img.shields.io/badge/semver-semantic--release-blue.svg)](https://github.com/semantic-release/semantic-release)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Install

```bash
npm i two-way-data-binding
```

## How to use

It works with DOM elements such as:

- Layout: div, span, p, headings (anything with textContent or innerHTML)
- Form elements:
  - Input (including checkbox, radio)
  - Textarea
  - Select

### Basic usage

```html
<h1 data-bind="name">Default value</h1>
<input type="text" data-model="name"/>
```

```javascript
import TwoWayDataBinding from 'two-way-data-binding'

TwoWayDataBinding({
  dataModel: {
    name: 'My Awesome Site'
  },
})
```

### Several elements with the same bind

```html
<p data-bind="description">Default description</p>
<input type="text" data-bind="description" data-model="description"/>
```

```javascript
import TwoWayDataBinding from 'two-way-data-binding'

TwoWayDataBinding()
```

### Update model via JavaScript

You can use deep objects too:

```javascript
const proxy = TwoWayDataBinding({
  dataModel: {
    site: {
      name: 'My Awesome Site'
    }
  },
})

proxy.site.name = `New name`;
```

## Configuration

### `$context`

Optional. Defines the context of the data model. Defaults to `document`

### `attributeBind`

Optional. Defines the attribute to bind to in your HTML. Defaults to `data-bind`

### `attributeModel`

Optional. Defines the attribute to bind to in your HTML. Defaults to `data-model`

```javascript
$myInput.addEventListener('twowaydatabinding:change', () => {
  // This will be fired after the native change, after we update the state
});
```

### `dataModel`

Optional. Defines the data model. Defaults to `{}`

### `events`

Optional. Defines the events to bind to. Defaults to ```[`keyup`, `change`]```

### `pathDelimiter`

Optional. Defines the path delimiter in your `data-bind` attributes such as `header.site.name`. Defaults to `.`

## Custom events handling

In order to allow consumers to perform actions **after** TwoWayDataBinding performs model update, a custom event is fired with the name `twowaydatabinding:change|keyup|eventname`. By default is dispatched in `change` and `keyup` events, but it can be extended by setting more `events` in the array of the TwoWayDataBinding configuration, meaning a `twowaydatabinding:[eventname]` will be fired after the logic is executed, and the consumer application can subscribe to them to perform any needed logic after the library has done the operations.

### <a id="setcustomvalue"></a>`twowaydatabinding:setcustomvalue`
This event works the other way round, from the consumer application to TwoWayDataBinding, which is listening to that event and responds by setting in the data model the value passed for a given property.

The library can prevent setting the value to the model for certain custom-value properties (see [attributeCustomValue](#attributecustomvalue)), and for those cases, a custom event `twowaydatabinding:setcustomvalue` can be fired in order to set a value into the model. A `twowaydatabinding:change` event is fired again after performing this action.

To set the new value in the data model, dispatch the event in the correspondant element passing a `detail` object populated with `path` (property path of the property to change in the data model object) and `value` properties.

To trigger it from your application:

```javascript
input.dispatchEvent(new CustomEvent(`twowaydatabinding:setcustomvalue`, {
  bubbles: true,
  cancelable: true,
  detail: {
    path: input.getAttribute(config.attributeModel),
    value: dataValue
  }
}));

proxy.propName // 'newValue'
```

## Setting a custom value to a bound input instead of his value in the data model
### <a id="attributecustomvalue"></a>`attributeCustomValue`

Optional. Defines an array of attributes to prevent the model being updated with the input value when `change` or `keyup` by default. Defaults to `['data-value']`.

If an input has `data-model` and `data-bind` attributes at the same time, when this input value is changed, the model gets updated with that input `value` property. Nevertheless, this can be prevented by adding a custom attribute which will be the host of the actual value.

By default is `['data-value']` (but can be customised and extended), and when an input has one of these attributes, the model is not updated with the value of the input and it should be manually updated by the consumer's application logic by dispatching a custom event `twowaydatabinding:setcustomvalue`. See [Custom Events handling](#setcustomvalue)

## Browser support

The script does **not** include any polyfills.

| Browser | Version  |
|---------------|---|
| Google Chrome | >= 96  |
| Edge        | >= 92  |
| Firefox       | >= 91 |
| Safari        | >= 15.4  |
| Opera        | >= 76  |
| IE        | ❌  |

## How to develop

You might want to develop locally. Spawn a local server with:

```bash
npm run develop
```

You can change `/develop/index.html` and `/develop/index.js` to your liking.
