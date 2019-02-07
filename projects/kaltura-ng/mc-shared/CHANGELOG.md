# Change Log
<a name="5.1.4"></a>
## [5.1.4](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/mc-shared@5.1.3...5.1.4) (2019-02-07)

* update dependent libraries versions


<a name="5.1.3"></a>
## [5.1.3](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/mc-shared@5.1.2...5.1.3) (2018-10-25)

* update dependent libraries versions


<a name="5.1.2"></a>
## [5.1.2](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/mc-shared@5.1.1...5.1.2) (2018-09-17)

* update dependent libraries versions


<a name="5.1.1"></a>
## [5.1.1](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/mc-shared@5.1.0...5.1.1) (2018-08-15)

* update dependent libraries versions


<a name="5.1.0"></a>
# [5.1.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/mc-shared@5.0.1...5.1.0) (2018-07-24)


### Features

* allow passing boolean to permission filters action ([#128](https://github.com/kaltura/kaltura-ng/issues/128)) ([44bdd5a](https://github.com/kaltura/kaltura-ng/commit/44bdd5a))


<a name="5.0.1"></a>
## [5.0.1](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/mc-shared@5.0.0...5.0.1) (2018-07-19)

* update dependent libraries versions


<a name="5.0.0"></a>
# [5.0.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/mc-shared@4.0.2...5.0.0) (2018-07-11)

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


<a name="4.0.2"></a>
## [4.0.2](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/mc-shared@4.0.1...@kaltura-ng/mc-shared@4.0.2) (2018-06-11)




<a name="4.0.1"></a>
## [4.0.1](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/mc-shared@4.0.0...@kaltura-ng/mc-shared@4.0.1) (2018-05-31)




<a name="4.0.0"></a>
# [4.0.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/mc-shared@3.2.1...@kaltura-ng/mc-shared@4.0.0) (2018-05-30)


### Code Refactoring

* move localization from kaltura-common into mc-shared ([#112](https://github.com/kaltura/kaltura-ng/issues/112)) ([30f0e05](https://github.com/kaltura/kaltura-ng/commit/30f0e05))


### BREAKING CHANGES

* import localization module,server and pipe was moved to mc-shared

before:
```
import { AppLocalization } from '@kaltura-ng/kaltura-common';
import {KalturaCommonModule} from '@kaltura-ng/kaltura-common';
```
after:
```
import { AppLocalization } from '@kaltura-ng/mc-shared/localization';
import {LocalizationModule} from '@kaltura-ng/mc-shared/localization';
```




<a name="3.2.1"></a>
## [3.2.1](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/mc-shared@3.2.0...@kaltura-ng/mc-shared@3.2.1) (2018-05-01)




<a name="3.2.0"></a>
# [3.2.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/mc-shared@3.1.1...@kaltura-ng/mc-shared@3.2.0) (2018-04-30)


### Features

* extended logger support ([#109](https://github.com/kaltura/kaltura-ng/issues/109)) ([3c51193](https://github.com/kaltura/kaltura-ng/commit/3c51193))




<a name="3.1.1"></a>
## [3.1.1](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/mc-shared@3.1.0...@kaltura-ng/mc-shared@3.1.1) (2018-04-12)




<a name="3.1.0"></a>
# [3.1.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/mc-shared@3.0.1...@kaltura-ng/mc-shared@3.1.0) (2018-04-02)


### Features

* add permissions service ([#100](https://github.com/kaltura/kaltura-ng/issues/100)) ([2c379be](https://github.com/kaltura/kaltura-ng/commit/2c379be))
* prevent direct loading of permissions set ([efe40de](https://github.com/kaltura/kaltura-ng/commit/efe40de))




<a name="3.0.1"></a>
## [3.0.1](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/mc-shared@3.0.0...@kaltura-ng/mc-shared@3.0.1) (2018-03-19)




<a name="3.0.0"></a>
# [3.0.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/mc-shared@2.0.0...@kaltura-ng/mc-shared@3.0.0) (2018-03-04)


### Bug Fixes

* clone filter updates object to allow data modification during prefilter ([3c30f1d](https://github.com/kaltura/kaltura-ng/commit/3c30f1d))
* wrap SVG images in DIVs to support class manipulation in IE11 ([07aa100](https://github.com/kaltura/kaltura-ng/commit/07aa100))


### Features

* add copy-to-clipboard component ([#79](https://github.com/kaltura/kaltura-ng/issues/79)) ([c446103](https://github.com/kaltura/kaltura-ng/commit/c446103))
* upgrade stack to angular@5 ([80736ff](https://github.com/kaltura/kaltura-ng/commit/80736ff))


### BREAKING CHANGES

* upgrading from v4 to v5 required multiple changes in build scripts and some code adjustments




<a name="2.0.0"></a>
# [2.0.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/mc-shared@1.2.0...@kaltura-ng/mc-shared@2.0.0) (2018-02-05)


### Bug Fixes

* ignore undefined object when provided as a filter changes ([7036f59](https://github.com/kaltura/kaltura-ng/commit/7036f59))


### Features

* add pre filters reset interceptor ([aecbe02](https://github.com/kaltura/kaltura-ng/commit/aecbe02))
* extend tooltip component api, logger api and filters service api ([fb8c332](https://github.com/kaltura/kaltura-ng/commit/fb8c332))
* improve server polling logic and extend kaltura logger ([#73](https://github.com/kaltura/kaltura-ng/issues/73)) ([bc11630](https://github.com/kaltura/kaltura-ng/commit/bc11630))


### BREAKING CHANGES

* Server polling now requires an override of method '_canExecute'
* previously the list filter item and group filter item held the tooltip and label of the filtered item. Now the list filter item hold the id/value only.




<a name="1.2.0"></a>
# [1.2.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/mc-shared@1.1.0...@kaltura-ng/mc-shared@1.2.0) (2018-01-09)


### Bug Fixes

* support filter value null ([8f9e145](https://github.com/kaltura/kaltura-ng/commit/8f9e145))


### Features

* add filter of type Boolean ([a7c6953](https://github.com/kaltura/kaltura-ng/commit/a7c6953))
* add filters types, remove unused prime components and fix auto complete issue ([#62](https://github.com/kaltura/kaltura-ng/issues/62)) ([fda510f](https://github.com/kaltura/kaltura-ng/commit/fda510f))




<a name="1.1.0"></a>
# 1.1.0 (2017-12-19)


### Features

* add list filters infrastructure ([a209512](https://github.com/kaltura/kaltura-ng/commit/a209512))
