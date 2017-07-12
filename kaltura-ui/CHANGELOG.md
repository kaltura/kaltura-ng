# Change Log

All notable changes to this project will be documented in this file.
See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.0.0"></a>
# 1.0.0 (2017-07-12)


### Bug Fixes

* identify repo packages with  custom publish folder to be used by kaltura-ng-env-workspace tool ([8148b50](https://github.com/kaltura/kaltura-ng/commit/8148b50))
* popup-widget style ([e40d9e0](https://github.com/kaltura/kaltura-ng/commit/e40d9e0))
* remove dependency for katura-typescript-client in kaltura-ui and kaltura-primeng-ui packages ([c4ee93c](https://github.com/kaltura/kaltura-ng/commit/c4ee93c))
* update popup height on open and not on init to support height data binding ([7827bae](https://github.com/kaltura/kaltura-ng/commit/7827bae))


### Features

* add option to set the popup xlose button within the window itself ([785dd59](https://github.com/kaltura/kaltura-ng/commit/785dd59))
* add support for tooltip max width property + multiline tooltip ([f416a0e](https://github.com/kaltura/kaltura-ng/commit/f416a0e))
* remove dependency of packages on kaltura-typescript-client and move all services that actually depend on the client to new package named [@kaltura](https://github.com/kaltura)-ng/kaltura-server-utils ([d05f415](https://github.com/kaltura/kaltura-ng/commit/d05f415))
* replace loading spinner with designed spinner ([05f681e](https://github.com/kaltura/kaltura-ng/commit/05f681e))


### BREAKING CHANGES

* - app auth & bootstrap services moved to the kmc-ng sourcebase
- access control moved from kaltura-common to kaltura-server-utils
- custom metadata services moved from kaltura-common to kaltura-server-utils
- flavor services moved from kaltura-common to kaltura-server-utils
- upload-management ovp adapter moved from kaltura-common to kaltura-server-utils. the rest of the upload-management services were left in kaltura-common
