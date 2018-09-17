# Change Log
<a name="7.0.2"></a>
## [7.0.2](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-common@7.0.1...7.0.2) (2018-09-17)

* update dependent libraries versions


<a name="7.0.1"></a>
## [7.0.1](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-common@7.0.0...7.0.1) (2018-08-15)


### Bug Fixes

* custom metadata xml parsing and serializing ([85f0a62](https://github.com/kaltura/kaltura-ng/commit/85f0a62))


<a name="7.0.0"></a>
# [7.0.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-common@6.0.2...7.0.0) (2018-07-11)

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



<a name="6.0.2"></a>
## [6.0.2](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-common@6.0.1...@kaltura-ng/kaltura-common@6.0.2) (2018-06-11)


### Bug Fixes

* enable server polls response for multirequest ([#111](https://github.com/kaltura/kaltura-ng/issues/111)) ([f8357cf](https://github.com/kaltura/kaltura-ng/commit/f8357cf))




<a name="6.0.1"></a>
## [6.0.1](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-common@6.0.0...@kaltura-ng/kaltura-common@6.0.1) (2018-05-31)

### Features
* remove kaltura-ng/kaltura-logger dependency from kaltura-ng/kaltura-common


<a name="6.0.0"></a>
# [6.0.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-common@5.2.0...@kaltura-ng/kaltura-common@6.0.0) (2018-05-30)


### Code Refactoring

* move localization from kaltura-common into mc-shared ([#112](https://github.com/kaltura/kaltura-ng/issues/112)) ([30f0e05](https://github.com/kaltura/kaltura-ng/commit/30f0e05))


### Features

* allow parsing xsd/xml without groking values SUP-14470 ([bffe754](https://github.com/kaltura/kaltura-ng/commit/bffe754))


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
* calling `XmlParser.toJson()` requires new argument.
Before:
```
XmlParser.toJson(xmlContent);
```

After:
```
XmlParser.toJson(xmlContent, true);
```




<a name="5.2.0"></a>
# [5.2.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-common@5.1.0...@kaltura-ng/kaltura-common@5.2.0) (2018-05-01)


### Features

* allow setting at runtime url for translation files ([f319d96](https://github.com/kaltura/kaltura-ng/commit/f319d96))




<a name="5.1.0"></a>
# [5.1.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-common@5.0.2...@kaltura-ng/kaltura-common@5.1.0) (2018-04-30)


### Features

* extended logger support ([#109](https://github.com/kaltura/kaltura-ng/issues/109)) ([3c51193](https://github.com/kaltura/kaltura-ng/commit/3c51193))




<a name="5.0.2"></a>
## [5.0.2](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-common@5.0.1...@kaltura-ng/kaltura-common@5.0.2) (2018-04-12)




<a name="5.0.1"></a>
## [5.0.1](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-common@5.0.0...@kaltura-ng/kaltura-common@5.0.1) (2018-04-02)




<a name="5.0.0"></a>
# [5.0.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-common@4.0.0...@kaltura-ng/kaltura-common@5.0.0) (2018-03-19)


* remove unused mapping between language code and label ([bdb9e61](https://github.com/kaltura/kaltura-ng/commit/bdb9e61))


### BREAKING CHANGES

* KalturaUtils no longer expose methods 'getLanguageByCode' and 'getCodeByLanguage'




<a name="4.0.0"></a>
# [4.0.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-common@3.0.0...@kaltura-ng/kaltura-common@4.0.0) (2018-03-04)


### Features

* upgrade stack to angular@5 ([80736ff](https://github.com/kaltura/kaltura-ng/commit/80736ff))


### BREAKING CHANGES

* upgrading from v4 to v5 required multiple changes in build scripts and some code adjustments




<a name="3.0.0"></a>
# [3.0.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-common@2.4.0...@kaltura-ng/kaltura-common@3.0.0) (2018-02-05)


### Bug Fixes

* escape values when converting object to xml ([3171425](https://github.com/kaltura/kaltura-ng/commit/3171425))


### Features

* add json to xml parser ([f649672](https://github.com/kaltura/kaltura-ng/commit/f649672))
* customize xml root element ([3380400](https://github.com/kaltura/kaltura-ng/commit/3380400))
* improve server polling logic and extend kaltura logger ([#73](https://github.com/kaltura/kaltura-ng/issues/73)) ([bc11630](https://github.com/kaltura/kaltura-ng/commit/bc11630))


### BREAKING CHANGES

* Server polling now requires an override of method '_canExecute'




<a name="2.4.0"></a>
# [2.4.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-common@2.3.0...@kaltura-ng/kaltura-common@2.4.0) (2017-12-19)


### Features

* add list filters infrastructure ([a209512](https://github.com/kaltura/kaltura-ng/commit/a209512))




<a name="2.3.0"></a>
# [2.3.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-common@2.2.0...@kaltura-ng/kaltura-common@2.3.0) (2017-12-06)


### Features

* add bulk move up/down support ([102abc4](https://github.com/kaltura/kaltura-ng/commit/102abc4))
* implement server polls feature




<a name="2.2.0"></a>
# [2.2.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-common@2.1.1...@kaltura-ng/kaltura-common@2.2.0) (2017-11-16)


### Features

* add tag rxjs operator  ([fa9a9fb](https://github.com/kaltura/kaltura-ng/commit/fa9a9fb))
* check if a file can be uploaded using chunk support ([#34](https://github.com/kaltura/kaltura-ng/issues/34)) ([621bcff](https://github.com/kaltura/kaltura-ng/commit/621bcff))
* extended upload management to support resume file upload ([8bc8eed](https://github.com/kaltura/kaltura-ng/commit/8bc8eed))




<a name="2.1.1"></a>
## [2.1.1](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-common@2.1.0...@kaltura-ng/kaltura-common@2.1.1) (2017-10-31)


### Bug Fixes

* fix translation issues when importing kaltura common module ([0ab8f06](https://github.com/kaltura/kaltura-ng/commit/0ab8f06))




<a name="2.1.0"></a>
# [2.1.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-common@2.0.0...@kaltura-ng/kaltura-common@2.1.0) (2017-10-30)


### Features

* resume file upload action ([9ef9d4a](https://github.com/kaltura/kaltura-ng/commit/9ef9d4a))




<a name="2.0.0"></a>
# [2.0.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-common@1.3.0...@kaltura-ng/kaltura-common@2.0.0) (2017-10-10)


### Features

* extend upload management to support upload process workflow ([254d652](https://github.com/kaltura/kaltura-ng/commit/254d652))


### BREAKING CHANGES

* The public api of upload management and the ovp upload adapter were modified to support the new process.




<a name="1.3.0"></a>
# [1.3.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-common@1.1.0...@kaltura-ng/kaltura-common@1.3.0) (2017-09-26)


### Features

* app localization now allow using hash to load files to bypass browser cache ([22146e2](https://github.com/kaltura/kaltura-ng/commit/22146e2))
* app localization now supports loading with custom language id ([e39ce83](https://github.com/kaltura/kaltura-ng/commit/e39ce83))




<a name="1.2.0"></a>
# [1.2.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-common@1.1.0...@kaltura-ng/kaltura-common@1.2.0) (2017-09-17)


### Features

* app localization now allow using hash to load files to bypass browser cache ([22146e2](https://github.com/kaltura/kaltura-ng/commit/22146e2))
* app localization now supports loading with custom language id ([e39ce83](https://github.com/kaltura/kaltura-ng/commit/e39ce83))




<a name="1.1.0"></a>
# [1.1.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-common@1.0.0...@kaltura-ng/kaltura-common@1.1.0) (2017-09-03)


### Features

* remove Ramda dependency from package ([ca48b66](https://github.com/kaltura/kaltura-ng/commit/ca48b66))




<a name="1.0.0"></a>
# 1.0.0 (2017-07-12)


### Bug Fixes

* identify repo packages with  custom publish folder to be used by kaltura-ng-env-workspace tool ([8148b50](https://github.com/kaltura/kaltura-ng/commit/8148b50))


### Features

* improve naming of upload management and dynamic metadata form ([265e929](https://github.com/kaltura/kaltura-ng/commit/265e929))
* remove dependency of packages on kaltura-typescript-client and move all services that actually depend on the client to new package named [@kaltura](https://github.com/kaltura)-ng/kaltura-server-utils ([d05f415](https://github.com/kaltura/kaltura-ng/commit/d05f415))


### BREAKING CHANGES

* - custom-metadata-form elements were renamed to dynamic-metadata-form
- kaltura-ovp-upload elements were renamed to kaltura-server-upload
* - app auth & bootstrap services moved to the kmc-ng sourcebase
- access control moved from kaltura-common to kaltura-server-utils
- custom metadata services moved from kaltura-common to kaltura-server-utils
- flavor services moved from kaltura-common to kaltura-server-utils
- upload-management ovp adapter moved from kaltura-common to kaltura-server-utils. the rest of the upload-management services were left in kaltura-common
