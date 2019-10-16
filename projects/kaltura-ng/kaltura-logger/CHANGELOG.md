# Change Log
<a name="3.1.0"></a>
# [3.1.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-logger@3.0.2...3.1.0) (2019-10-07)


### Features

* Upgrade to Angular 8 ([#151](https://github.com/kaltura/kaltura-ng/issues/151)) ([515b897](https://github.com/kaltura/kaltura-ng/commit/515b897))


<a name="3.0.2"></a>
## [3.0.2](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-logger@3.0.1...3.0.2) (2019-02-07)

* update dependent libraries versions


<a name="3.0.1"></a>
## [3.0.1](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-logger@3.0.0...3.0.1) (2018-09-17)

* update dependent libraries versions


<a name="3.0.0"></a>
# [3.0.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-logger@2.2.2...3.0.0) (2018-07-11)

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



<a name="2.2.2"></a>
## [2.2.2](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-logger@2.2.1...@kaltura-ng/kaltura-logger@2.2.2) (2018-06-11)




      <a name="2.2.1"></a>
## [2.2.1](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-logger@2.2.0...@kaltura-ng/kaltura-logger@2.2.1) (2018-05-31)

### Features
* import kaltura logger module requires providing root namespace value

### BREAKING CHANGES

before in `app.module.ts`:
```
@NgModule({
imports: <any>[
    KalturaLoggerModule.forRoot(),
]
})
```

after in `app.module.ts`:
```
@NgModule({
imports: <any>[
    KalturaLoggerModule.forRoot('kmc'),
]
})
```


<a name="2.2.0"></a>
# [2.2.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-logger@2.1.0...@kaltura-ng/kaltura-logger@2.2.0) (2018-04-30)


### Features

* extended logger support ([#109](https://github.com/kaltura/kaltura-ng/issues/109)) ([3c51193](https://github.com/kaltura/kaltura-ng/commit/3c51193))




<a name="2.1.0"></a>
# [2.1.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-logger@2.0.2...@kaltura-ng/kaltura-logger@2.1.0) (2018-04-12)


### Features

* simplify provider creation for KalturaLogger ([253b583](https://github.com/kaltura/kaltura-ng/commit/253b583))




<a name="2.0.2"></a>
## [2.0.2](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-logger@2.0.1...@kaltura-ng/kaltura-logger@2.0.2) (2018-04-02)




<a name="2.0.1"></a>
## [2.0.1](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-logger@2.0.0...@kaltura-ng/kaltura-logger@2.0.1) (2018-03-19)




<a name="2.0.0"></a>
# [2.0.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-logger@1.0.0...@kaltura-ng/kaltura-logger@2.0.0) (2018-03-04)


### Features

* upgrade stack to angular@5 ([80736ff](https://github.com/kaltura/kaltura-ng/commit/80736ff))


### BREAKING CHANGES

* upgrading from v4 to v5 required multiple changes in build scripts and some code adjustments




<a name="1.0.0"></a>
# [1.0.0](https://github.com/kaltura/kaltura-ng/compare/@kaltura-ng/kaltura-logger@0.1.0...@kaltura-ng/kaltura-logger@1.0.0) (2018-02-05)


### Features

* extend tooltip component api, logger api and filters service api ([fb8c332](https://github.com/kaltura/kaltura-ng/commit/fb8c332))
* improve server polling logic and extend kaltura logger ([#73](https://github.com/kaltura/kaltura-ng/issues/73)) ([bc11630](https://github.com/kaltura/kaltura-ng/commit/bc11630))


### BREAKING CHANGES

* Server polling now requires an override of method '_canExecute'
* previously the list filter item and group filter item held the tooltip and label of the filtered item. Now the list filter item hold the id/value only.




<a name="0.1.0"></a>
# 0.1.0 (2017-12-19)


### Features

* add list filters infrastructure ([a209512](https://github.com/kaltura/kaltura-ng/commit/a209512))
