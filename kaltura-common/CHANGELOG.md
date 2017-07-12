# Change Log

All notable changes to this project will be documented in this file.
See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
