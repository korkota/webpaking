'use strict';

import foo from './foo';
import bar from './bar';
import Menu from './menu';

delay(() => {
  require.ensure([], () => {
    let moment = require('moment');
    let now = moment(new Date()).locale('ru').format('LLLL');

    alert(`${now}: home-${bar()}-${foo}`);
  })
}, 5000 /*ms*/);

const pandaMenu = new Menu({
  title: 'Panda menu',
  items: [{
    text: 'Eggs',
    href: '#eggs'
  }, {
    text: 'Meat',
    href: '#meat'
  }, {
    text: 'Bamboo',
    href: '#bamboo'
  }]
});

document.body.appendChild(pandaMenu.elem);
