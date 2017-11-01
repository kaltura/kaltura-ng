# Change Log

All notable changes to this project will be documented in this file.
See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
