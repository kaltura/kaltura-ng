# Change Log

All notable changes to this project will be documented in this file.
See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="5.1.3"></a>
## [5.1.3](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-ui@5.1.2...@kaltura-ng/kaltura-ui@5.1.3) (2018-05-01)




<a name="5.1.2"></a>
## [5.1.2](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-ui@5.1.1...@kaltura-ng/kaltura-ui@5.1.2) (2018-04-30)




<a name="5.1.1"></a>
## [5.1.1](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-ui@5.1.0...@kaltura-ng/kaltura-ui@5.1.1) (2018-04-12)


### Bug Fixes

* fix tooltip support for HTML ([4ab5bb7](https://github.com/kaltura/kaltura-ng/commit/4ab5bb7))




<a name="5.1.0"></a>
# [5.1.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-ui@5.0.1...@kaltura-ng/kaltura-ui@5.1.0) (2018-04-02)


### Bug Fixes

* position the tooltip above the text KMCNG-1461 ([#96](https://github.com/kaltura/kaltura-ng/issues/96)) ([fd669fd](https://github.com/kaltura/kaltura-ng/commit/fd669fd))
* remove export that is causing errors during build with aot ([b69df94](https://github.com/kaltura/kaltura-ng/commit/b69df94))


### Features

* update theme for anchor html element to support disabled class ([0b57093](https://github.com/kaltura/kaltura-ng/commit/0b57093))




<a name="5.0.1"></a>
## [5.0.1](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-ui@5.0.0...@kaltura-ng/kaltura-ui@5.0.1) (2018-03-19)


### Bug Fixes

* fix area blocker z-index to cover sticky elements ([b92b1e6](https://github.com/kaltura/kaltura-ng/commit/b92b1e6))




<a name="5.0.0"></a>
# [5.0.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-ui@4.0.0...@kaltura-ng/kaltura-ui@5.0.0) (2018-03-04)


### Features

* add support for labels template in dynamic form item ([#74](https://github.com/kaltura/kaltura-ng/issues/74)) ([c2d8ba1](https://github.com/kaltura/kaltura-ng/commit/c2d8ba1))
* added longDateOnly (MMMM D, YYYY) format to DatePipe ([#85](https://github.com/kaltura/kaltura-ng/issues/85)) ([81b4bc2](https://github.com/kaltura/kaltura-ng/commit/81b4bc2))
* upgrade stack to angular@5 ([80736ff](https://github.com/kaltura/kaltura-ng/commit/80736ff))


### BREAKING CHANGES

* upgrading from v4 to v5 required multiple changes in build scripts and some code adjustments




<a name="4.0.0"></a>
# [4.0.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-ui@3.4.0...@kaltura-ng/kaltura-ui@4.0.0) (2018-02-05)


### Bug Fixes

* ux fixes ([#78](https://github.com/kaltura/kaltura-ng/issues/78)) ([71b93a0](https://github.com/kaltura/kaltura-ng/commit/71b93a0))


### Features

* add http validator ([#76](https://github.com/kaltura/kaltura-ng/issues/76)) ([acafd14](https://github.com/kaltura/kaltura-ng/commit/acafd14))
* allow html content in input helper in dynamic form ([9f583b3](https://github.com/kaltura/kaltura-ng/commit/9f583b3))
* dynamic form add number type control ([7d7b6d2](https://github.com/kaltura/kaltura-ng/commit/7d7b6d2))
* extend kDate pipe to support predefined formats and remove defa… ([#80](https://github.com/kaltura/kaltura-ng/issues/80)) ([b2f9f11](https://github.com/kaltura/kaltura-ng/commit/b2f9f11))
* extend tooltip component api, logger api and filters service api ([fb8c332](https://github.com/kaltura/kaltura-ng/commit/fb8c332))
* improve server polling logic and extend kaltura logger ([#73](https://github.com/kaltura/kaltura-ng/issues/73)) ([bc11630](https://github.com/kaltura/kaltura-ng/commit/bc11630))
* modify tooltip position when dragging the target component ([#49](https://github.com/kaltura/kaltura-ng/issues/49)) ([e518cb0](https://github.com/kaltura/kaltura-ng/commit/e518cb0))


### BREAKING CHANGES

* Server polling now requires an override of method '_canExecute'
* previously the list filter item and group filter item held the tooltip and label of the filtered item. Now the list filter item hold the id/value only.




<a name="3.4.0"></a>
# [3.4.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-ui@3.3.0...@kaltura-ng/kaltura-ui@3.4.0) (2018-01-14)


### Features

* add 'click' trigger support for input helper ([#64](https://github.com/kaltura/kaltura-ng/issues/64)) ([cb1c7e7](https://github.com/kaltura/kaltura-ng/commit/cb1c7e7))




<a name="3.3.0"></a>
# [3.3.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-ui@3.2.1...@kaltura-ng/kaltura-ui@3.3.0) (2018-01-09)


### Bug Fixes

* handle show loader only if needed ([68a7316](https://github.com/kaltura/kaltura-ng/commit/68a7316))
* typo in API variable name ([7e05044](https://github.com/kaltura/kaltura-ng/commit/7e05044))


### Features

* add switch control type to dynamic from control and support dynamic control validations  ([#52](https://github.com/kaltura/kaltura-ng/issues/52)) ([c124794](https://github.com/kaltura/kaltura-ng/commit/c124794))
* center popups on resize ([45a1e9d](https://github.com/kaltura/kaltura-ng/commit/45a1e9d))
* expose form new data mode ([a3ea9b6](https://github.com/kaltura/kaltura-ng/commit/a3ea9b6))
* input helper popover in dynamic form controls ([#36](https://github.com/kaltura/kaltura-ng/issues/36)) ([a900963](https://github.com/kaltura/kaltura-ng/commit/a900963))
* Support full screen mode for popup widget ([#51](https://github.com/kaltura/kaltura-ng/issues/51)) ([238c9fc](https://github.com/kaltura/kaltura-ng/commit/238c9fc))




<a name="3.2.1"></a>
## [3.2.1](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-ui@3.2.0...@kaltura-ng/kaltura-ui@3.2.1) (2017-12-19)


### Bug Fixes

* handle kModal class add / remove via the PopupWidgetLayout service instead from the component itself to ensure consistency ([e662326](https://github.com/kaltura/kaltura-ng/commit/e662326))
* prevent rare runtime error when accessing area blocker DOM elements ([74c65e2](https://github.com/kaltura/kaltura-ng/commit/74c65e2))




<a name="3.2.0"></a>
# [3.2.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-ui@3.1.0...@kaltura-ng/kaltura-ui@3.2.0) (2017-12-06)


### Bug Fixes

* fix loading spinner layout ([95d2f52](https://github.com/kaltura/kaltura-ng/commit/95d2f52))
* fix support for closeOnClickOutside on transparent modal overlays ([b5bd532](https://github.com/kaltura/kaltura-ng/commit/b5bd532))
* support preventPageScroll on Safari ([c08727e](https://github.com/kaltura/kaltura-ng/commit/c08727e))
* **content-entries:** problem changing entry owner in IE11 ([aacd179](https://github.com/kaltura/kaltura-ng/commit/aacd179))


### Features

* show tooltip over custom data fields in metadata sections ([#37](https://github.com/kaltura/kaltura-ng/issues/37)) ([0923eb3](https://github.com/kaltura/kaltura-ng/commit/0923eb3))
* support sticky elements with custom width ([7a9d6fb](https://github.com/kaltura/kaltura-ng/commit/7a9d6fb))




<a name="3.1.0"></a>
# [3.1.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-ui@3.0.1...@kaltura-ng/kaltura-ui@3.1.0) (2017-11-16)


### Bug Fixes

* add tooltip to icon ([fef5780](https://github.com/kaltura/kaltura-ng/commit/fef5780))
* fix icon style ([00a999d](https://github.com/kaltura/kaltura-ng/commit/00a999d))
* reset details bar on screen resize ([4b1e2ec](https://github.com/kaltura/kaltura-ng/commit/4b1e2ec))
* remove kModal class when closing the popup without timeout ([432c8fb](https://github.com/kaltura/kaltura-ng/commit/432c8fb))


### Features

* add `closeOnScroll` option to popup widget ([982ee4c](https://github.com/kaltura/kaltura-ng/commit/982ee4c))
* add edit mode modal to popup widget ([06cd48b](https://github.com/kaltura/kaltura-ng/commit/06cd48b))
* add ip and url validators ([1cef9a7](https://github.com/kaltura/kaltura-ng/commit/1cef9a7))
* add scroll to top container component ([#30](https://github.com/kaltura/kaltura-ng/issues/30)) ([f2fbb85](https://github.com/kaltura/kaltura-ng/commit/f2fbb85))
* add tag rxjs operator  ([fa9a9fb](https://github.com/kaltura/kaltura-ng/commit/fa9a9fb))
* expose a url validation ([#31](https://github.com/kaltura/kaltura-ng/issues/31)) ([67c5f6d](https://github.com/kaltura/kaltura-ng/commit/67c5f6d))
* support widgets form lifecycle when working on new data ([88a5d4f](https://github.com/kaltura/kaltura-ng/commit/88a5d4f))
* allow passing class names to area blocker component




<a name="3.0.1"></a>
## [3.0.1](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-ui@3.0.0...@kaltura-ng/kaltura-ui@3.0.1) (2017-10-31)




<a name="3.0.0"></a>
# [3.0.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-ui@2.0.0...@kaltura-ng/kaltura-ui@3.0.0) (2017-10-30)


### Bug Fixes

* remark logs ([952e6fe](https://github.com/kaltura/kaltura-ng/commit/952e6fe))
* resize data table sticky header upon window resize ([4b57b6a](https://github.com/kaltura/kaltura-ng/commit/4b57b6a))
* update layout when entering and exiting sticky mode as adding and removing the sticky class might cause a height change for the sticky elements ([f9f01cf](https://github.com/kaltura/kaltura-ng/commit/f9f01cf))


### Features

* add scroll to top button ([e469b1e](https://github.com/kaltura/kaltura-ng/commit/e469b1e))
* simplify api for widgets infrastructure (previously named form manager) ([dd09f1f](https://github.com/kaltura/kaltura-ng/commit/dd09f1f))


### BREAKING CHANGES

* - `Form Manager` name was changes to `Widgets Manager` 
- Changes in public API of `Widget` and `Widgets Manager`
- Better logging messages




<a name="2.0.0"></a>
# [2.0.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-ui@1.3.2...@kaltura-ng/kaltura-ui@2.0.0) (2017-10-10)


### Bug Fixes

* allow to show new lines in areablocker message ([123206c](https://github.com/kaltura/kaltura-ng/commit/123206c))


### Features

* add "slider" option to poupWidget to support slider mode ([66753da](https://github.com/kaltura/kaltura-ng/commit/66753da))
* add custom class support for area blocker message buttons ([2e00c0f](https://github.com/kaltura/kaltura-ng/commit/2e00c0f))
* extend upload management to support upload process workflow ([254d652](https://github.com/kaltura/kaltura-ng/commit/254d652))


### BREAKING CHANGES

* The public api of upload management and the ovp upload adapter were modified to support the new process.




<a name="1.3.2"></a>
## [1.3.2](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-ui@1.3.0...@kaltura-ng/kaltura-ui@1.3.2) (2017-09-26)


### Bug Fixes

* remove inline style for align left ([5153362](https://github.com/kaltura/kaltura-ng/commit/5153362))




<a name="1.3.1"></a>
## [1.3.1](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-ui@1.3.0...@kaltura-ng/kaltura-ui@1.3.1) (2017-09-17)


### Bug Fixes

* remove inline style for align left ([5153362](https://github.com/kaltura/kaltura-ng/commit/5153362))




<a name="1.3.0"></a>
# [1.3.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-ui@1.2.0...@kaltura-ng/kaltura-ui@1.3.0) (2017-09-06)


### Features

* allow custom title in area blocker message ([a5049c4](https://github.com/kaltura/kaltura-ng/commit/a5049c4))




<a name="1.2.0"></a>
# [1.2.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-ui@1.1.0...@kaltura-ng/kaltura-ui@1.2.0) (2017-09-03)


### Bug Fixes

* pass player size correctly ([2b478d9](https://github.com/kaltura/kaltura-ng/commit/2b478d9))


### Features

* player component supporting dynamic embed and API ([b0f1b96](https://github.com/kaltura/kaltura-ng/commit/b0f1b96))




<a name="1.1.0"></a>
# [1.1.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-ui@1.0.1...@kaltura-ng/kaltura-ui@1.1.0) (2017-08-21)


### Bug Fixes

* allow overflow from popup widget component. Preventing overflow logic should be content specific ([8f53ae7](https://github.com/kaltura/kaltura-ng/commit/8f53ae7))
* resolve symlink issues for workspace development ([feee028](https://github.com/kaltura/kaltura-ng/commit/feee028))


### Features

* add line-break pipe to convert Adobe Flex line breaks (\r) to HTML supported lined breaks (\r
) ([387c82a](https://github.com/kaltura/kaltura-ng/commit/387c82a))
* **upload-menu:** extend popup widget component ([3668d43](https://github.com/kaltura/kaltura-ng/commit/3668d43))
* support HTML rendering inside tooltips ([14e2fdf](https://github.com/kaltura/kaltura-ng/commit/14e2fdf))
* support HTML rendering inside tooltips by setting the escape parameter to false ([6a66df1](https://github.com/kaltura/kaltura-ng/commit/6a66df1))




<a name="1.0.1"></a>
## [1.0.1](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-ui@1.0.0...@kaltura-ng/kaltura-ui@1.0.1) (2017-07-26)


### Bug Fixes

* allow tooltip value to be number 0. previously ignored 0 as a valid value to show in tooltip ([23cb69c](https://github.com/kaltura/kaltura-ng/commit/23cb69c))




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
