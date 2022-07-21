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

### `dataModel`

Optional. Defines the data model. Defaults to `{}`

### `events`

Optional. Defines the events to bind to. Defaults to ```[`keyup`, `change`]```

### `pathDelimiter`

Optional. Defines the path delimiter in your `data-bind` attributes such as `header.site.name`. Defaults to `.`

## Browser support

The script does **not** include any polyfills.

| Browser | Version  |
|---------------|---|
| Google Chrome | >= 96  |
| Edge        | >= 92  |
| Firefox       | >= 91 |
| Safari        | >= 14  |
| Opera        | >= 76  |
| IE        | ❌  |

## How to develop

You might want to develop locally. Spawn a local server with:

```bash
npm run develop
```

You can change `/develop/index.html` and `/develop/index.js` to your liking.
