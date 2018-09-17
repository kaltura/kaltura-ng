# Change Log
<a name="3.0.4"></a>
## [3.0.4](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-primeng-ui@3.0.3...3.0.4) (2018-09-17)


### Bug Fixes

* upgrade primeng to v6.1.2 and update our components accordingly ([746eeeb](https://github.com/kaltura/kaltura-ng/commit/746eeeb))


<a name="3.0.3"></a>
## [3.0.3](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-primeng-ui@3.0.2...3.0.3) (2018-08-15)

* update dependent libraries versions


<a name="3.0.2"></a>
## [3.0.2](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-primeng-ui@3.0.1...3.0.2) (2018-07-24)

* update dependent libraries versions


<a name="3.0.1"></a>
## [3.0.1](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-primeng-ui@3.0.0...3.0.1) (2018-07-19)

* update dependent libraries versions


<a name="3.0.0"></a>
# [3.0.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-primeng-ui@2.4.0...3.0.0) (2018-07-11)


### Features

* add filter to dynamic drop down control  KMCNG-1262 ([cf29d65](https://github.com/kaltura/kaltura-ng/commit/cf29d65))


### BREAKING CHANGES

* upgrade Angular stack from v5 to v6 which affected library public API

before
nested imports were supported
```
import { ExampleService } from '@kaltura-ng/mc-theme/sub/location/example-service'
```

after
all imports should be done against the library entry point
```
import { ExampleService } from '@kaltura-ng/mc-theme'
```


<a name="2.4.0"></a>
# [2.4.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-primeng-ui@2.3.1...@kaltura-ng/kaltura-primeng-ui@2.4.0) (2018-06-11)


### Features

* allow adding multiple tags using clipboard ([#105](https://github.com/kaltura/kaltura-ng/issues/105)) KMCNG-674 ([276a955](https://github.com/kaltura/kaltura-ng/commit/276a955))
* highlight selected text in auto-complete suggestions  ([#94](https://github.com/kaltura/kaltura-ng/issues/94)) KMCNG-706 ([63d059f](https://github.com/kaltura/kaltura-ng/commit/63d059f))




<a name="2.3.1"></a>
## [2.3.1](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-primeng-ui@2.3.0...@kaltura-ng/kaltura-primeng-ui@2.3.1) (2018-05-31)




<a name="2.3.0"></a>
# [2.3.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-primeng-ui@2.2.3...@kaltura-ng/kaltura-primeng-ui@2.3.0) (2018-05-30)


### Features

* add draggable table component ([#86](https://github.com/kaltura/kaltura-ng/issues/86)) ([f540323](https://github.com/kaltura/kaltura-ng/commit/f540323))




<a name="2.2.3"></a>
## [2.2.3](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-primeng-ui@2.2.2...@kaltura-ng/kaltura-primeng-ui@2.2.3) (2018-05-01)




<a name="2.2.2"></a>
## [2.2.2](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-primeng-ui@2.2.1...@kaltura-ng/kaltura-primeng-ui@2.2.2) (2018-04-30)




<a name="2.2.1"></a>
## [2.2.1](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-primeng-ui@2.2.0...@kaltura-ng/kaltura-primeng-ui@2.2.1) (2018-04-12)




<a name="2.2.0"></a>
# [2.2.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-primeng-ui@2.1.0...@kaltura-ng/kaltura-primeng-ui@2.2.0) (2018-04-02)


### Features

* add multi-select dropdown component ([#102](https://github.com/kaltura/kaltura-ng/issues/102)) ([cf1a158](https://github.com/kaltura/kaltura-ng/commit/cf1a158))
* use kaltura multi select component in dynamic form ([#103](https://github.com/kaltura/kaltura-ng/issues/103)) ([65a3218](https://github.com/kaltura/kaltura-ng/commit/65a3218))




<a name="2.1.0"></a>
# [2.1.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-primeng-ui@2.0.0...@kaltura-ng/kaltura-primeng-ui@2.1.0) (2018-03-19)


### Features

* add item in autocomplete by pressing comma ([4a4b14e](https://github.com/kaltura/kaltura-ng/commit/4a4b14e))
* support readonly in auto-complete multiple selection ([b05f55d](https://github.com/kaltura/kaltura-ng/commit/b05f55d))




<a name="2.0.0"></a>
# [2.0.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-primeng-ui@1.0.0...@kaltura-ng/kaltura-primeng-ui@2.0.0) (2018-03-04)


### Bug Fixes

* priming icons ([#84](https://github.com/kaltura/kaltura-ng/issues/84)) ([8d7096e](https://github.com/kaltura/kaltura-ng/commit/8d7096e))


### Features

* add time-spinner component ([b2b0bb0](https://github.com/kaltura/kaltura-ng/commit/b2b0bb0))
* support prime tiered menu with kMenuCloseOnScroll directive ([208f5dd](https://github.com/kaltura/kaltura-ng/commit/208f5dd))
* support PrimeNG Turbo table ([b614610](https://github.com/kaltura/kaltura-ng/commit/b614610))
* upgrade stack to angular@5 ([80736ff](https://github.com/kaltura/kaltura-ng/commit/80736ff))


### BREAKING CHANGES

* upgrading from v4 to v5 required multiple changes in build scripts and some code adjustments




<a name="1.0.0"></a>
# [1.0.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-primeng-ui@0.8.1...@kaltura-ng/kaltura-primeng-ui@1.0.0) (2018-02-05)


### Bug Fixes

* show dynamic dropdown component with empty value ([79cf3d3](https://github.com/kaltura/kaltura-ng/commit/79cf3d3))
* ux fixes ([#78](https://github.com/kaltura/kaltura-ng/issues/78)) ([71b93a0](https://github.com/kaltura/kaltura-ng/commit/71b93a0))


### Features

* dynamic form add number type control ([7d7b6d2](https://github.com/kaltura/kaltura-ng/commit/7d7b6d2))
* extend tooltip component api, logger api and filters service api ([fb8c332](https://github.com/kaltura/kaltura-ng/commit/fb8c332))
* improve server polling logic and extend kaltura logger ([#73](https://github.com/kaltura/kaltura-ng/issues/73)) ([bc11630](https://github.com/kaltura/kaltura-ng/commit/bc11630))
* item clicked on autocomplete tag ([#71](https://github.com/kaltura/kaltura-ng/issues/71)) ([46f8932](https://github.com/kaltura/kaltura-ng/commit/46f8932))
* modify tooltip position when dragging the target component ([#49](https://github.com/kaltura/kaltura-ng/issues/49)) ([e518cb0](https://github.com/kaltura/kaltura-ng/commit/e518cb0))


### BREAKING CHANGES

* Server polling now requires an override of method '_canExecute'
* previously the list filter item and group filter item held the tooltip and label of the filtered item. Now the list filter item hold the id/value only.




<a name="0.8.1"></a>
## [0.8.1](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-primeng-ui@0.8.0...@kaltura-ng/kaltura-primeng-ui@0.8.1) (2018-01-14)




<a name="0.8.0"></a>
# [0.8.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-primeng-ui@0.7.0...@kaltura-ng/kaltura-primeng-ui@0.8.0) (2018-01-09)


### Bug Fixes

* check form is valid on init ([c7cc5de](https://github.com/kaltura/kaltura-ng/commit/c7cc5de))


### Features

* add filters types, remove unused prime components and fix auto complete issue ([#62](https://github.com/kaltura/kaltura-ng/issues/62)) ([fda510f](https://github.com/kaltura/kaltura-ng/commit/fda510f))
* add switch control type to dynamic from control and support dynamic control validations  ([#52](https://github.com/kaltura/kaltura-ng/issues/52)) ([c124794](https://github.com/kaltura/kaltura-ng/commit/c124794))




<a name="0.7.0"></a>
# [0.7.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-primeng-ui@0.6.1...@kaltura-ng/kaltura-primeng-ui@0.7.0) (2017-12-19)


### Features

* add list filters infrastructure ([a209512](https://github.com/kaltura/kaltura-ng/commit/a209512))




<a name="0.6.1"></a>
## [0.6.1](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-primeng-ui@0.6.0...@kaltura-ng/kaltura-primeng-ui@0.6.1) (2017-12-06)


### Bug Fixes

* add lowercase mode for autocomplete ([e85b2c6](https://github.com/kaltura/kaltura-ng/commit/e85b2c6))
* **content-entries:** problem changing entry owner in IE11 ([aacd179](https://github.com/kaltura/kaltura-ng/commit/aacd179))
* do not allow duplications in the input ([b67c723](https://github.com/kaltura/kaltura-ng/commit/b67c723))




<a name="0.6.0"></a>
# [0.6.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-primeng-ui@0.5.2...@kaltura-ng/kaltura-primeng-ui@0.6.0) (2017-11-16)


### Bug Fixes

* detach input length check from search minLength definitions in auto-complete component ([abb89f7](https://github.com/kaltura/kaltura-ng/commit/abb89f7))
* KMCNG-846 - close menu on page scroll, remove scrollTarget property ([c8e66b4](https://github.com/kaltura/kaltura-ng/commit/c8e66b4))
* prevent runtime error and application crash when a data table do not have a scrollable header div (non scrollable tables) ([c4d0e2f](https://github.com/kaltura/kaltura-ng/commit/c4d0e2f))


### Features

* add auto focus api to auto complete component ([1551abd](https://github.com/kaltura/kaltura-ng/commit/1551abd))




<a name="0.5.2"></a>
## [0.5.2](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-primeng-ui@0.5.1...@kaltura-ng/kaltura-primeng-ui@0.5.2) (2017-10-31)




<a name="0.5.1"></a>
## [0.5.1](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-primeng-ui@0.5.0...@kaltura-ng/kaltura-primeng-ui@0.5.1) (2017-10-30)


### Bug Fixes

* remark logs ([4fc4338](https://github.com/kaltura/kaltura-ng/commit/4fc4338))
* resize data table sticky header upon window resize ([4b57b6a](https://github.com/kaltura/kaltura-ng/commit/4b57b6a))




<a name="0.5.0"></a>
# [0.5.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-primeng-ui@0.4.3...@kaltura-ng/kaltura-primeng-ui@0.5.0) (2017-10-10)


### Features

* allow disable of dynamic height of data table ([68066ed](https://github.com/kaltura/kaltura-ng/commit/68066ed))




<a name="0.4.3"></a>
## [0.4.3](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-primeng-ui@0.4.1...@kaltura-ng/kaltura-primeng-ui@0.4.3) (2017-09-26)


### Bug Fixes

* auto-complete now works when building to production ([16370cc](https://github.com/kaltura/kaltura-ng/commit/16370cc))




<a name="0.4.2"></a>
## [0.4.2](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-primeng-ui@0.4.1...@kaltura-ng/kaltura-primeng-ui@0.4.2) (2017-09-17)


### Bug Fixes

* auto-complete now works when building to production ([16370cc](https://github.com/kaltura/kaltura-ng/commit/16370cc))




<a name="0.4.1"></a>
## [0.4.1](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-primeng-ui@0.4.0...@kaltura-ng/kaltura-primeng-ui@0.4.1) (2017-09-06)




<a name="0.4.0"></a>
# [0.4.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-primeng-ui@0.3.1...@kaltura-ng/kaltura-primeng-ui@0.4.0) (2017-09-03)


### Bug Fixes

* revert the ability to disable the directive as it broke the table scroll ([0cf74e1](https://github.com/kaltura/kaltura-ng/commit/0cf74e1))


### Features

* add ability conditionally to switch directive ([5e35300](https://github.com/kaltura/kaltura-ng/commit/5e35300))




<a name="0.3.1"></a>
## [0.3.1](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-primeng-ui@0.3.0...@kaltura-ng/kaltura-primeng-ui@0.3.1) (2017-08-21)


### Bug Fixes

* resolve symlink issues for workspace development ([feee028](https://github.com/kaltura/kaltura-ng/commit/feee028))


### Performance Improvements

* upgrade PrimeNG version to 4.1.3 to gain datagrid performances enhancements. Update auto-complete component constructor signature to match the signature of the PrimeNG component in 4.1.3 ([1135de6](https://github.com/kaltura/kaltura-ng/commit/1135de6))




<a name="0.3.0"></a>
# [0.3.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-primeng-ui@0.2.1...@kaltura-ng/kaltura-primeng-ui@0.3.0) (2017-07-26)


### Features

* support auto-complete color and tooltip for manually added items ([9f6cbd4](https://github.com/kaltura/kaltura-ng/commit/9f6cbd4))
* support auto-complete color and tooltip for manually added items ([d722c7d](https://github.com/kaltura/kaltura-ng/commit/d722c7d))
* upgrade PrimeNG to v4.1.0 ([e3db1ee](https://github.com/kaltura/kaltura-ng/commit/e3db1ee))




<a name="0.2.1"></a>
## 0.2.1 (2017-07-12)


### Bug Fixes

* identify repo packages with  custom publish folder to be used by kaltura-ng-env-workspace tool ([8148b50](https://github.com/kaltura/kaltura-ng/commit/8148b50))
* remove dependency for katura-typescript-client in kaltura-ui and kaltura-primeng-ui packages ([c4ee93c](https://github.com/kaltura/kaltura-ng/commit/c4ee93c))
