# [2.1.0](https://github.com/quicoto/two-way-data-binding/compare/v2.0.0...v2.1.0) (2023-03-01)


### Features

* set custom attribute and the value on setting value to proxy property ([3487e4b](https://github.com/quicoto/two-way-data-binding/commit/3487e4b91128ce4721e702934f7859c3c14b59b9))

# [2.0.0](https://github.com/quicoto/two-way-data-binding/compare/v1.8.1...v2.0.0) (2023-02-21)


### Build System

* customAttributes to prevent model being updated on every event ([14ba86a](https://github.com/quicoto/two-way-data-binding/commit/14ba86a97bfe86720dcaf59b6904fad6bf64599c))


### BREAKING CHANGES

* custom events names are no longer editable

they are fixed to twowaydatabinding:<eventname>. When using them, set a listener with twowaydatabinding:<eventname> as event name

## [1.8.1](https://github.com/quicoto/two-way-data-binding/compare/v1.8.0...v1.8.1) (2023-02-07)


### Bug Fixes

* use new CustomEvent instead of deprecated createEvent ([9394206](https://github.com/quicoto/two-way-data-binding/commit/9394206c8842f4bf5cc7a0351e2488021bb2f90e))

# [1.8.0](https://github.com/quicoto/two-way-data-binding/compare/v1.7.1...v1.8.0) (2023-01-25)


### Features

* drop Safari 14 support ([bc79ecc](https://github.com/quicoto/two-way-data-binding/commit/bc79ecc195092f0737772ac892b7fba30b3eb92a))

## [1.7.1](https://github.com/quicoto/two-way-data-binding/compare/v1.7.0...v1.7.1) (2022-09-13)


### Bug Fixes

* avoid adding dom references to provided dataModel ([3f7551b](https://github.com/quicoto/two-way-data-binding/commit/3f7551bffbf3b71ab1b545d72171a6c60341b4fe))

# [1.7.0](https://github.com/quicoto/two-way-data-binding/compare/v1.6.0...v1.7.0) (2022-09-08)


### Features

* dispatch custom event after set ([991f3b5](https://github.com/quicoto/two-way-data-binding/commit/991f3b558fd51792a65dbafbb982d5511bb8f527))

# [1.6.0](https://github.com/quicoto/two-way-data-binding/compare/v1.5.1...v1.6.0) (2022-08-25)


### Features

* support groups of elements ([3ec3e5d](https://github.com/quicoto/two-way-data-binding/commit/3ec3e5d15ee12754e653c92f0fa99c74d2373929))

## [1.5.1](https://github.com/quicoto/two-way-data-binding/compare/v1.5.0...v1.5.1) (2022-08-18)


### Bug Fixes

* adds a test to cover deep nesting with same key ([f10448c](https://github.com/quicoto/two-way-data-binding/commit/f10448cbfd57c07f191d69c047318d7ef9eb6c42))

# [1.5.0](https://github.com/quicoto/two-way-data-binding/compare/v1.4.1...v1.5.0) (2022-07-28)


### Features

* support form select ([f42553b](https://github.com/quicoto/two-way-data-binding/commit/f42553bebabea2337c9ebc4eedd87cfc9ea13e78)), closes [#23](https://github.com/quicoto/two-way-data-binding/issues/23)

## [1.4.1](https://github.com/quicoto/two-way-data-binding/compare/v1.4.0...v1.4.1) (2022-07-22)


### Bug Fixes

* Allow multiple elements with the same data-bind attribute name ([2d0c27c](https://github.com/quicoto/two-way-data-binding/commit/2d0c27c722dd392be487af1e16e426530aa09f99))

# [1.4.0](https://github.com/quicoto/two-way-data-binding/compare/v1.3.3...v1.4.0) (2022-07-15)


### Features

* enables input radio and checkboxes ([c3a6ebc](https://github.com/quicoto/two-way-data-binding/commit/c3a6ebcd78eb60def42cddd1f0b3fa5735d169a2))

## [1.3.3](https://github.com/quicoto/two-way-data-binding/compare/v1.3.2...v1.3.3) (2022-07-11)


### Bug Fixes

* amend how to determine if innerHTML or textContent needs to be applied ([8df0356](https://github.com/quicoto/two-way-data-binding/commit/8df035681c553eefd9265b570cae3aee6f3a322a))

## [1.3.2](https://github.com/quicoto/two-way-data-binding/compare/v1.3.1...v1.3.2) (2022-07-11)


### Bug Fixes

* change var -> const in for in loop ([bbcc33e](https://github.com/quicoto/two-way-data-binding/commit/bbcc33ec6d2fe9aac078d45b413dd64a6cbbd1b1))

## [1.3.1](https://github.com/quicoto/two-way-data-binding/compare/v1.3.0...v1.3.1) (2022-07-11)


### Bug Fixes

* replicate model based on DOM elements ([b323cc6](https://github.com/quicoto/two-way-data-binding/commit/b323cc6716f4c5bcf81548710da676b9eced3b0c))

# [1.3.0](https://github.com/quicoto/two-way-data-binding/compare/v1.2.0...v1.3.0) (2022-07-08)


### Features

* add two-way data binding ([4f62808](https://github.com/quicoto/two-way-data-binding/commit/4f62808343e9e2bfd87cc932affaa4c0fee17548))

# [1.2.0](https://github.com/quicoto/two-way-data-binding/compare/v1.1.1...v1.2.0) (2022-07-08)


### Bug Fixes

* update element even with empty value ([1fb99b7](https://github.com/quicoto/two-way-data-binding/commit/1fb99b7a0efcf2edcd47cd7a4061119adc2caae1))
* use the $context to scope event listeners ([f2d6943](https://github.com/quicoto/two-way-data-binding/commit/f2d694370ce0297e8fadc465637eeec6297f81d3))


### Features

* adds data-model support ([b531da5](https://github.com/quicoto/two-way-data-binding/commit/b531da570388a1a3756774da22519337e1d362fa))

## [1.1.1](https://github.com/quicoto/two-way-data-binding/compare/v1.1.0...v1.1.1) (2022-07-06)


### Bug Fixes

* defines document as default context ([14d3dc8](https://github.com/quicoto/two-way-data-binding/commit/14d3dc88fd0bea0853efb11f6ef4c77e573d3fbd))

# [1.1.0](https://github.com/quicoto/two-way-data-binding/compare/v1.0.0...v1.1.0) (2022-07-06)


### Features

* proxy-implementation ([e8ab1d7](https://github.com/quicoto/two-way-data-binding/commit/e8ab1d77db3cbccb64ee4d3b1e1aad0313a9380d))
* proxy-implementation ([9701b66](https://github.com/quicoto/two-way-data-binding/commit/9701b66924100c0b974ae17223fc649c62f963ee))

# 1.0.0 (2022-07-06)


### Features

* adds Jest ([50f7b18](https://github.com/quicoto/two-way-data-binding/commit/50f7b18087f09242bf97facaf1963498ef91a4bf))
