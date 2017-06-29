
# Kaltura Angular Packages

A set of packages providing common infrastructure for angular based applications connected to the Kaltura platform.

## Packages
Kaltura-ng is a [monorepo](https://developer.atlassian.com/blog/2015/10/monorepos-in-git/) containing several packages:

| Package | Latest Version  |
|:--------|:-------|
| kaltura-client | ![npm (scoped)](https://img.shields.io/npm/v/@kaltura-ng/kaltura-client.svg?maxAge=86400) |
| kaltura-common | ![npm (scoped)](https://img.shields.io/npm/v/@kaltura-ng/kaltura-common.svg?maxAge=86400) |
| kaltura-ui | ![npm (scoped)](https://img.shields.io/npm/v/@kaltura-ng/kaltura-ui.svg?maxAge=86400) |
| kaltura-primeng-ui | ![npm (scoped)](https://img.shields.io/npm/v/@kaltura-ng/kaltura-primeng-ui.svg?maxAge=86400) |
**Notes**
- Those packages are being developed along side the [KMC-ng](https://github.com/kaltura/kmc-ng) application.
- The version number listed above represent the latest version deployed to npm for each package. 
  
## Technology stack and conventions
Kaltura Angular libraries use the following technologies and conventions:
* [TypeScript](http://www.typescriptlang.org/) language (superset of Javascript).
* [Yarn](https://yarnpkg.com/en/) as our dependency management.
* Stylesheets with [SASS](http://sass-lang.com/) (not required, it supports regular css too).
* Error reported with [TSLint](http://palantir.github.io/tslint/) and [Codelyzer](https://github.com/mgechev/codelyzer).
* [Lerna](https://github.com/lerna/lerna) - a tool that optimizes the workflow around managing multi-package repositories with git and npm.
* Best practices in file and application organization for [Angular 2]({https://angular.io/).

## Road map
- [ ] Components Dcoumentation
- [ ] Live demonstration
- [ ] Code documentation
- [ ] Unit-testing

## Quick start

### Prerequisites

- [x] Ensure you have [node.js installed](https://nodejs.org/en/download/current/), version 7.0.0 or above. 
- [x] Ensure you have [git installed](https://git-for-windows.github.io/) 
- [x] Ensure you have [yarn installed](https://yarnpkg.com/lang/en/docs/install/) (we use it for node package management) 

### Get the sources
Clone the repository and load project dependencies
```bash
# clone our repo
$ git clone https://github.com/kaltura/kaltura-ng.git 

# change directory to your app
$ cd kaltura-ng

# install the dependencies with npm
$ yarn
```


### Setup your repo for local development
As this monorepo holds independent packages that depends on each other, you will need to symlink between them to be able to develop locally.


You need to run the following command to link everything together
```
$ yarn run setup
```

this command will run 'lerna' behind the scenes to fetch node_modules for each package and, if needed, create a symlink to dependent packages in this repo.

> To allow this structure and manage complex (dev)op operations without too much hassle we are using '[lerna](https://github.com/lerna/lerna)' which optimizes the workflow around managing multi-package repositories.


# FAQ

#### When I update any package dependency using `yarn add|upgrade`, the symlink between dependent packages are being removed. Why does it happen and how to overcome it?
There is a known issue with `yarn` (github issue [#1213](https://github.com/yarnpkg/yarn/issues/1214)): once you run `yarn` it will overwrite linked modules. 

Until this issue is resolved by the `yarn` team, you can re-bootstrap everything together without re-fetching node_modules. For each package use the following command:
```bash
$ yarn run setup:lite
```

## Want to help?
Want to contribute some code?
- Read [CONTRIBUTING.md](CONTRIBUTING.md) to learn more about the contribution process.
- Read [DEVELOPER.md](DEVELOPER.md) for development instructions.

## License and Copyright Information
All code in this project is released under the [AGPLv3 license](http://www.gnu.org/licenses/agpl-3.0.html) unless a different license for a particular library is specified in the applicable library path.

Copyright © Kaltura Inc. All rights reserved.
