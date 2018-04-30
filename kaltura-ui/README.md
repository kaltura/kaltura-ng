# Kaltura Angular Modules

[![Gitter chat](https://badges.gitter.im/kaltura-ng/kaltura-ng.png)](https://gitter.im/kaltura-ng/kaltura-ng) [![npm version](https://badge.fury.io/js/%40kaltura-ng%2Fkaltura-ui.svg)](https://badge.fury.io/js/%40kaltura-ng%2Fkaltura-ui)

The sources for this package are in the main [kaltura-ng](https://github.com/kaltura/kaltura-ng) repo. Please file issues and pull requests against that repo.

License : AGPL-3.0

# Warning
`kTags` component from `Tags` module uses browser's native `scroll` function with `behavior: 'smooth'` param which are not fully supported by Safari and aren't supported by IE.

In case you need to support those browsers, you should include ['smooth-scroll' polyfill](https://github.com/iamdustan/smoothscroll) into your app. Otherwise, there will be no scroll effect, but immediate changing of the visible tags view position.