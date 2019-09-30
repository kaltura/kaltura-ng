import { configure } from '@storybook/angular';

import '!style-loader!css-loader!sass-loader!./scss-loader.scss';

// automatically import all files ending in *.stories.ts
configure(require.context('../src/stories', true, /\.stories\.ts$/), module);
