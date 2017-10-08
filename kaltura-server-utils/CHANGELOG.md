# Change Log

All notable changes to this project will be documented in this file.
See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.0.6"></a>
## [1.0.6](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-server-utils@1.0.4...@kaltura-ng/kaltura-server-utils@1.0.6) (2017-09-26)




<a name="1.0.5"></a>
## [1.0.5](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-server-utils@1.0.4...@kaltura-ng/kaltura-server-utils@1.0.5) (2017-09-17)




<a name="1.0.4"></a>
## [1.0.4](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-server-utils@1.0.3...@kaltura-ng/kaltura-server-utils@1.0.4) (2017-09-06)




<a name="1.0.3"></a>
## [1.0.3](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-server-utils@1.0.2...@kaltura-ng/kaltura-server-utils@1.0.3) (2017-09-03)




<a name="1.0.2"></a>
## [1.0.2](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-server-utils@1.0.1...@kaltura-ng/kaltura-server-utils@1.0.2) (2017-08-21)


### Bug Fixes

* resolve symlink issues for workspace development ([feee028](https://github.com/kaltura/kaltura-ng/commit/feee028))




<a name="1.0.1"></a>
## [1.0.1](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-server-utils@1.0.0...@kaltura-ng/kaltura-server-utils@1.0.1) (2017-07-26)




<a name="1.0.0"></a>
# 1.0.0 (2017-07-12)


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
