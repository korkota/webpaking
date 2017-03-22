'use strict';

import foo from './foo';

let devBar = 'dev-bar-' + foo;
let prodBar = 'prod-bar-' + foo;

export default () => NODE_ENV === 'development' ? devBar : prodBar;
