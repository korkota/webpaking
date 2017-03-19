"use strict";

import bar from './bar';

delay(() => {
  require.ensure([], () => {
    let moment = require('moment');
    let now = moment(new Date()).locale('ru').format('LLLL');

    alert(`${now}: home- ${bar()}`);
  })
}, 5000 /*ms*/);
